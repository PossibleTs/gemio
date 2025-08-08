import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from '../../models/asset.model';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CollectionsService } from 'src/modules/collections/collections.service';
import { HederaSDKHelper } from 'src/helpers/hedera-sdk-helper';
import { AppConfigService } from 'src/modules/app-config/app-config.service';
import { Company } from 'src/models/company.model';
import { AccountId, PrivateKey } from '@hashgraph/sdk';
import { SmartNodeService } from 'src/modules/smartnode/smartnode.service';
import * as assetTopicValidator from './validators/asset.topic.validator.json';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { MaintenancePermission } from 'src/models/maintenance-permission.model';
import { AssetMessage } from 'src/models/asset-message';
import * as moment from 'moment';
import { PostMessageDto } from './dto/post-message.dto';
import { Collection } from 'src/models/collection.model';

const { Validator, defaultSchemaVersion } = require('@hashgraph/nft-utilities');

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset)
    private assetModel: typeof Asset,
    @InjectModel(Company)
    private companyModel: typeof Company,
    @InjectModel(MaintenancePermission)
    private maintenancePermissionModel: typeof MaintenancePermission,
    @InjectModel(AssetMessage)
    private assetMessageModel: typeof AssetMessage,
    private sequelize: Sequelize,
    private collectionsService: CollectionsService,
    private appConfigService: AppConfigService,
    private smartNodeService: SmartNodeService,
  ) {}

  async createRequest(
    createAssetDto: CreateAssetDto,
    usr_com_id: number,
    transaction?: Transaction,
  ) {
    const collection = await this.collectionsService.findOne(
      createAssetDto.ass_col_id,
    );

    if (!collection) {
      throw new BadRequestException(`A coleção selecionada não foi encontrada`);
    }

    const newAsset = {
      ...createAssetDto,
      ass_com_id: usr_com_id,
      ass_status: 'pending',
    };

    await this.assetModel.create(newAsset, {
      transaction: transaction,
    });
  }

  async findAllRequests(authUserInfo: any) {
    if (authUserInfo.usr_permission === 'admin') {
      return await this.assetModel.findAll({
        include: [
          {
            model: Company,
            attributes: [
              'com_id',
              'com_name',
              'com_cnpj',
              'com_hedera_account_id',
            ],
          },
          {
            model: Collection,
            attributes: [
              'col_id',
              'col_hedera_token_id',
              'col_name',
              'col_symbol',
            ],
          },
        ],
      });
    }

    if (authUserInfo.com_type === 'owner') {
      return await this.assetModel.findAll({
        include: [
          {
            model: Collection,
            attributes: [
              'col_id',
              'col_hedera_token_id',
              'col_name',
              'col_symbol',
            ],
          },
        ],
        where: {
          ass_com_id: authUserInfo.usr_com_id,
        },
      });
    }

    if (authUserInfo.com_type === 'maintainer') {
      const permissions = await this.maintenancePermissionModel.findAll({
        where: {
          map_com_id: authUserInfo.usr_com_id,
          map_end_date: null,
        },
      });

      return this.assetModel.findAll({
        include: [
          {
            model: Company,
            attributes: [
              'com_id',
              'com_name',
              'com_cnpj',
              'com_hedera_account_id',
            ],
          },
          {
            model: Collection,
            attributes: [
              'col_id',
              'col_hedera_token_id',
              'col_name',
              'col_symbol',
            ],
          },
        ],
        where: {
          ass_id: {
            [Op.in]: permissions.map((permission) => permission.map_ass_id),
          },
        },
      });
    }

    return [];
  }

  findOneRequest(id: number, authUserInfo: any) {
    let where = {
      ass_id: id,
    };

    if (authUserInfo.usr_permission === 'company') {
      where['ass_com_id'] = authUserInfo.usr_com_id;
    }

    return this.assetModel.findOne({
      include: [
        {
          model: Company,
          attributes: [
            'com_id',
            'com_name',
            'com_cnpj',
            'com_hedera_account_id',
          ],
        },
        {
          model: Collection,
          attributes: [
            'col_id',
            'col_hedera_token_id',
            'col_name',
            'col_symbol',
          ],
        },
      ],
      where: where,
    });
  }

  async approveRequest(id: number) {
    const client = new HederaSDKHelper();

    const asset = await this.assetModel.findOne({
      include: [
        {
          model: Collection,
          attributes: ['col_id', 'col_hedera_token_id'],
        },
      ],
      where: {
        ass_id: id,
      },
    });

    if (!asset) {
      throw new BadRequestException('Asset não encontrado');
    }

    if (asset.ass_status === 'accepted') {
      throw new BadRequestException('O asset já está aprovado');
    }

    const company = await this.companyModel.scope('full').findOne({
      where: {
        com_id: asset.ass_com_id,
      },
    });
    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    const GEMIO_PRIVATE_KEY = PrivateKey.fromStringDer(
      this.appConfigService.getAll.hedera.privateKey!,
    );

    const tokenGateId = await client.newToken(
      'Token Gate',
      'TOKEN',
      true,
      0,
      0,
      'Token gate criado pelo Gemio',
      AccountId.fromString(company.com_hedera_account_id),
      GEMIO_PRIVATE_KEY,
      GEMIO_PRIVATE_KEY,
      GEMIO_PRIVATE_KEY,
      null,
      GEMIO_PRIVATE_KEY,
      GEMIO_PRIVATE_KEY,
      true,
      PrivateKey.fromString(company.com_hedera_private_key),
    );

    await this.assetModel.update(
      {
        ass_topic_token_gate_id: tokenGateId,
      },
      {
        where: { ass_id: id },
      },
    );

    assetTopicValidator.tokenGates.nonFungibles.tokens[0].tokenId = tokenGateId;

    const consensusTimestamp =
      await this.smartNodeService.createTopicValidator(assetTopicValidator);

    const topicId = await this.smartNodeService.createTopic(consensusTimestamp);

    await this.assetModel.update(
      {
        ass_topic_id: topicId,
      },
      {
        where: {
          ass_id: id,
        },
      },
    );

    const metadata = {
      name: 'Equipamento',
      creator: 'Nome do creator',
      description: 'NFT criado pelo Gemio',
      image:
        'ipfs://bafybeigdkmfndpvabb5lxjswvfsbrjmi2dmbtviwjdi3e6dphpva2p7pte',
      type: 'image/webp',
      properties: {
        asset: {
          name: asset.ass_name,
          machine_type: asset.ass_machine_type,
          serial_number: asset.ass_serial_number,
          manufacturer: asset.ass_manufacturer,
          model: asset.ass_model,
          manufacture_year: asset.ass_manufacture_year,
        },
        timestamp: new Date().toISOString(),
        topicId: topicId,
        tokenGateId: tokenGateId,
      },
    };

    const validator = new Validator();
    const issues = validator.validate(metadata, defaultSchemaVersion);

    if (issues.errors.length > 0 || issues.warnings.length)
      throw new BadRequestException('Metadata possui erros');

    const metadataFile = new File([JSON.stringify(metadata)], 'metadata.json', {
      type: 'application/json',
    });

    const cid = await this.smartNodeService.uploadFilePinata(metadataFile);

    const accountInfo = await client.accountInfo(company.com_hedera_account_id);

    if (accountInfo.maxAutomaticTokenAssociations.isPositive()) {
      // Token auto association is not allowed
      try {
        await client.associate(
          asset.col_collection.col_hedera_token_id,
          company.com_hedera_account_id,
          company.com_hedera_private_key,
        );
      } catch (err) {
        if (err?.status?._code !== 194) {
          console.error(err);
          throw new Error('Erro ao associar o token');
        }
      }
    }

    const mintNfts = await client.mintNFT(
      asset.col_collection.col_hedera_token_id,
      this.appConfigService.getAll.hedera.privateKey,
      [Buffer.from(`ipfs://${cid}`)],
    );

    await client.transferNFT(
      asset.col_collection.col_hedera_token_id,
      company.com_hedera_account_id,
      this.appConfigService.getAll.hedera.accountId,
      this.appConfigService.getAll.hedera.privateKey,
      mintNfts!,
    );

    await this.assetModel.update(
      {
        ass_nft_serial: mintNfts[0],
        ass_metadata_cid: cid,
        ass_status: 'accepted',
      },
      {
        where: {
          ass_id: id,
        },
      },
    );

    return;
  }

  async createPermission(
    ass_id: number,
    createPermissionDto: CreatePermissionDto,
    authUserInfo: any,
  ) {
    const asset = await this.assetModel.findOne({
      include: [
        {
          model: Company,
          attributes: [
            'com_id',
            'com_name',
            'com_hedera_account_id',
            'com_hedera_private_key',
          ],
        },
      ],
      where: {
        ass_id: ass_id,
      },
    });

    if (!asset) throw new BadRequestException('Equipamento não encontrado');

    if (asset.ass_com_id !== authUserInfo.usr_com_id)
      throw new BadRequestException('O equipamento pertence a outra empresa');

    const maintainer = await this.companyModel.scope('full').findOne({
      where: {
        com_id: createPermissionDto.map_com_id,
      },
    });

    if (!maintainer) throw new BadRequestException('Empresa não encontrada');

    if (maintainer.com_type !== 'maintainer')
      throw new BadRequestException(
        'A permissão só pode ser adicionada para empresas do tipo maintainer',
      );

    const permissionExists = await this.maintenancePermissionModel.findOne({
      where: {
        map_com_id: createPermissionDto.map_com_id,
        map_ass_id: ass_id,
        map_end_date: null,
      },
    });

    if (permissionExists)
      throw new BadRequestException(
        'A empresa já possui permissão ativa para esse equipamento',
      );

    const transaction = await this.sequelize.transaction();

    try {
      const newPermission = {
        map_com_id: createPermissionDto.map_com_id,
        map_ass_id: ass_id,
        map_start_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      };

      const newPermissionInserted =
        await this.maintenancePermissionModel.create(newPermission, {
          transaction: transaction,
        });

      const client = new HederaSDKHelper();

      const accountInfo = await client.accountInfo(
        maintainer.com_hedera_account_id,
      );

      if (accountInfo.maxAutomaticTokenAssociations.isPositive()) {
        // Token auto association is not allowed
        try {
          await client.associate(
            asset.ass_topic_token_gate_id,
            maintainer.com_hedera_account_id,
            maintainer.com_hedera_private_key,
          );
        } catch (err) {
          if (err?.status?._code !== 194) {
            console.error(err);
            throw new Error('Erro ao associar o token');
          }
        }
      }

      const mintNfts = await client.mintNFT(
        asset.ass_topic_token_gate_id,
        this.appConfigService.getAll.hedera.privateKey,
        [
          Buffer.from(
            `ipfs://bafkreia7nrvq5fd7udersxxvk3xqfmdzb55bugjhbpp7lhrbgj52f2ptay`,
          ),
        ],
        undefined,
        PrivateKey.fromString(asset.com_company.com_hedera_private_key),
      );

      await client.unfreezeToken(
        maintainer.com_hedera_account_id,
        asset.ass_topic_token_gate_id,
        PrivateKey.fromString(this.appConfigService.getAll.hedera.privateKey),
      );

      await client.transferNFT(
        asset.ass_topic_token_gate_id,
        maintainer.com_hedera_account_id,
        asset.com_company.com_hedera_account_id,
        this.appConfigService.getAll.hedera.privateKey,
        mintNfts!,
        undefined,
        PrivateKey.fromString(asset.com_company.com_hedera_private_key),
      );

      await client.freezeToken(
        maintainer.com_hedera_account_id,
        asset.ass_topic_token_gate_id,
        PrivateKey.fromString(this.appConfigService.getAll.hedera.privateKey),
      );

      await this.maintenancePermissionModel.update(
        {
          map_tokengate_serial: mintNfts[0],
        },
        {
          where: {
            map_id: newPermissionInserted.map_id,
          },
          transaction: transaction,
        },
      );

      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw new BadRequestException('Erro ao criar permissão');
    }
  }

  async findAllPermissions(ass_id: number, authUserInfo: any) {
    const asset = await this.assetModel.findOne({
      where: {
        ass_id: ass_id,
      },
    });

    if (!asset) throw new BadRequestException('Equipamento não encontrado');

    if (asset.ass_com_id !== authUserInfo.usr_com_id)
      throw new BadRequestException('O equipamento pertence a outra empresa');

    return this.maintenancePermissionModel.findAll({
      include: [
        {
          model: Company,
          attributes: [
            'com_id',
            'com_name',
            'com_cnpj',
            'com_hedera_account_id',
          ],
        },
        {
          model: Asset,
          attributes: ['ass_topic_token_gate_id'],
        },
      ],
      where: {
        map_ass_id: ass_id,
      },
    });
  }

  async deletePermission(ass_id: number, map_id: number, authUserInfo: any) {
    const asset = await this.assetModel.findOne({
      where: {
        ass_id: ass_id,
      },
    });

    const permission = await this.maintenancePermissionModel.findOne({
      include: [
        {
          model: Asset,
          attributes: ['ass_id', 'ass_topic_token_gate_id'],
        },
        {
          model: Company,
          attributes: [
            'com_id',
            'com_hedera_account_id',
            'com_hedera_private_key',
          ],
        },
      ],
      where: {
        map_id: map_id,
      },
    });

    if (!asset) throw new BadRequestException('Equipamento não encontrado');

    if (!permission) throw new BadRequestException('Permissão não encontrada');

    if (asset.ass_com_id !== authUserInfo.usr_com_id)
      throw new BadRequestException('O equipamento pertence a outra empresa');

    if (ass_id !== permission.map_ass_id)
      throw new BadRequestException('A permissão pertence a outro equipamento');

    const client = new HederaSDKHelper();

    await client.unfreezeToken(
      permission.com_company.com_hedera_account_id,
      permission.ass_asset.ass_topic_token_gate_id,
      PrivateKey.fromString(this.appConfigService.getAll.hedera.privateKey),
    );

    await client.wipeNFT(
      permission.com_company.com_hedera_account_id,
      permission.ass_asset.ass_topic_token_gate_id,
      [permission.map_tokengate_serial],
      PrivateKey.fromString(this.appConfigService.getAll.hedera.privateKey),
    );

    await this.maintenancePermissionModel.update(
      {
        map_end_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        where: {
          map_id: map_id,
        },
      },
    );
  }

  async postMessage(
    ass_id: number,
    postMessageDto: PostMessageDto,
    authUserInfo: any,
  ) {
    const transaction = await this.sequelize.transaction();

    const permission = await this.maintenancePermissionModel.findOne({
      where: {
        map_ass_id: ass_id,
        map_com_id: authUserInfo.usr_com_id,
        map_end_date: null,
      },
    });
    if (!permission)
      throw new BadRequestException(
        'A empresa não possui permissão ativa para esse equipamento',
      );

    const maintainer = await this.companyModel.scope('full').findOne({
      where: {
        com_id: authUserInfo.usr_com_id,
      },
    });
    if (!maintainer) throw new BadRequestException('Empresa não encontrada');

    const asset = await this.assetModel.findOne({
      where: {
        ass_id: ass_id,
      },
    });
    if (!asset) throw new BadRequestException('Equipamento não encontrado');

    const hederaMessage = JSON.stringify({
      message: postMessageDto.ame_message,
    });

    let transactionId;
    try {
      transactionId = await this.smartNodeService.submitMessage(
        asset.ass_topic_id,
        maintainer.com_hedera_account_id,
        hederaMessage,
        maintainer.com_hedera_private_key,
      );
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Erro ao salvar mensagem');
    }

    const messagePayload = {
      ame_ass_id: ass_id,
      ame_created_by_com_id: authUserInfo.usr_com_id,
      ame_message: postMessageDto.ame_message,
      ame_transaction_id: transactionId,
      ame_created_at: moment().toISOString(),
      ame_updated_at: moment().toISOString(),
    };

    const messageInserted = await this.assetMessageModel.create(
      messagePayload,
      {
        transaction: transaction,
      },
    );

    await transaction.commit();
  }

  async getMessages(ass_id: number, authUserInfo: any) {
    if (authUserInfo.com_type === 'maintainer') {
      const permission = await this.maintenancePermissionModel.findOne({
        where: {
          map_ass_id: ass_id,
          map_com_id: authUserInfo.usr_com_id,
          map_end_date: null,
        },
      });

      if (!permission)
        throw new BadRequestException(
          'A empresa não possui permissão ativa para esse equipamento',
        );
    }

    if (authUserInfo.com_type === 'owner') {
      const asset = await this.assetModel.findOne({
        where: {
          ass_id: ass_id,
        },
      });

      if (!asset) throw new BadRequestException('Equipamento não encontrado');

      if (asset.ass_com_id !== authUserInfo.usr_com_id)
        throw new BadRequestException('Equipamento pertence a outra empresa');
    }

    const where = {
      ame_ass_id: ass_id,
      ame_created_by_com_id:
        authUserInfo.com_type === 'maintainer'
          ? authUserInfo.usr_com_id
          : undefined,
    };

    if (!where.ame_created_by_com_id) delete where.ame_created_by_com_id;

    return this.assetMessageModel.findAll({
      include:
        authUserInfo.com_type === 'owner'
          ? [
              {
                model: Company,
                attributes: [
                  'com_id',
                  'com_name',
                  'com_cnpj',
                  'com_hedera_account_id',
                ],
              },
            ]
          : [],
      where: where,
    });
  }
}
