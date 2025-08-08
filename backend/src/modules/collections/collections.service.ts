import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { HederaSDKHelper } from 'src/helpers/hedera-sdk-helper';
import { AccountId, PrivateKey } from '@hashgraph/sdk';
import * as moment from 'moment';
import { AppConfigService } from 'src/modules/app-config/app-config.service';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from '../../models/collection.model';
import { Asset } from '../../models/asset.model';
import { Company } from '../../models/company.model';
import { HederaService } from '../hedera/hedera.service';
import { SmartNodeService } from '../smartnode/smartnode.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection)
    private collectionModel: typeof Collection,
    @InjectModel(Asset)
    private assetModel: typeof Asset,
    private appConfigService: AppConfigService,
    private hederaService: HederaService,
    private smartNodeService: SmartNodeService,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const GEMIO_TOPIC_ID = this.appConfigService.getAll.hedera.gemioTopicId;
    if (!GEMIO_TOPIC_ID)
      throw new Error('GEMIO_TOPIC_ID is missing. Check .env file.');

    if (
      !this.appConfigService.getAll.hedera.accountId ||
      !this.appConfigService.getAll.hedera.privateKey
    )
      throw new Error(
        'HEDERA_ACCOUNT_ID and/or HEDERA_PRIVATE_KEY is missing. Check .env file.',
      );

    const GEMIO_ACCOUNT_ID = AccountId.fromString(
      this.appConfigService.getAll.hedera.accountId!,
    );
    const GEMIO_PRIVATE_KEY = PrivateKey.fromStringDer(
      this.appConfigService.getAll.hedera.privateKey!,
    );

    const metadata = {
      name: createCollectionDto.name,
      creator: 'Gemio',
      description: createCollectionDto.description,
      image:
        'ipfs://bafybeigdkmfndpvabb5lxjswvfsbrjmi2dmbtviwjdi3e6dphpva2p7pte',
      type: 'image/webp',
    };

    const metadataFile = new File([JSON.stringify(metadata)], 'metadata.json', {
      type: 'application/json',
    });

    const cid = await this.smartNodeService.uploadFilePinata(metadataFile);

    const client = new HederaSDKHelper();
    const newCollection = await client.newToken(
      createCollectionDto.name,
      createCollectionDto.symbol,
      true,
      0,
      0,
      'NFT criado pelo Gemio',
      GEMIO_ACCOUNT_ID,
      GEMIO_PRIVATE_KEY,
      GEMIO_PRIVATE_KEY,
      GEMIO_PRIVATE_KEY,
      null,
      GEMIO_PRIVATE_KEY,
      GEMIO_PRIVATE_KEY,
      false,
      undefined,
      Buffer.from(`ipfs://${cid}`),
    );

    if (!newCollection)
      throw new Error(
        'Erro ao cadastrar. Se o problema persistir, favor entrar em contato com o suporte.',
      );

    await this.collectionModel.create({
      col_hedera_token_id: newCollection,
      col_name: createCollectionDto.name,
      col_symbol: createCollectionDto.symbol,
      col_description: createCollectionDto.description,
      col_status: 'active',
    });

    await this.hederaService.submitNewCollection(newCollection);
  }

  async findAll() {
    return this.collectionModel.findAll();
  }

  async findOne(col_id: number) {
    return this.collectionModel.findOne({
      where: {
        col_id: col_id,
      },
    });
  }

  async getAssetsFromCollection(col_id: number) {
    return this.assetModel.findAll({
      include: [
        {
          model: Collection,
          attributes: [
            'col_id',
            'col_hedera_token_id',
            'col_name',
            'col_symbol',
            'col_status',
          ],
          where: {
            col_id: col_id,
          },
        },
        {
          model: Company,
          attributes: ['com_id', 'com_name', 'com_cnpj', 'com_type'],
        },
      ],
    });
  }
}
