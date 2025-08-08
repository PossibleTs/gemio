import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from '../../models/company.model';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Sequelize } from 'sequelize-typescript';
import { AccountId, PrivateKey } from '@hashgraph/sdk';
import * as moment from 'moment';
import { UsersService } from 'src/modules/users/users.service';
import { HederaSDKHelper } from 'src/helpers/hedera-sdk-helper';
import { AppConfigService } from 'src/modules/app-config/app-config.service';
import { SmartNodeService } from '../smartnode/smartnode.service';
import { HederaService } from '../hedera/hedera.service';
import { encryptText } from '../../helpers/crypto-helper';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company)
    private companyModel: typeof Company,
    private sequelize: Sequelize,
    private appConfigService: AppConfigService,
    private usersService: UsersService,
    private smartNodeService: SmartNodeService,
    private hederaService: HederaService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const findCompany = await this.companyModel.findOne({
      where: {
        com_cnpj: createCompanyDto.com_cnpj,
      },
    });
    if (findCompany) throw new ConflictException('CNPJ já cadastrado');

    const findUser = await this.usersService.findOneWhere({
      usr_email: createCompanyDto.usr_email,
    });
    if (findUser) throw new ConflictException('E-mail já cadastrado');

    const transaction = await this.sequelize.transaction();

    try {
      if (createCompanyDto.com_create_wallet === true) {
        const client = new HederaSDKHelper();
        const newAccount = await client.newAccount(
          createCompanyDto.com_hedera_private_key,
        );

        if (!newAccount.accountId)
          throw new Error('Não foi possível criar a conta na Hedera');

        createCompanyDto.com_hedera_account_id = (
          newAccount.accountId as AccountId
        ).toString();
      } else {
        try {
          const client = new HederaSDKHelper(
            createCompanyDto.com_hedera_account_id,
            createCompanyDto.com_hedera_private_key,
          );
          await client.balance(createCompanyDto.com_hedera_account_id);
        } catch (err) {
          console.error(err);
          throw new BadRequestException(
            `O id da conta Hedera e/ou chave privada são inválidos.`,
          );
        }
      }

      const topicCompanyId = await this.hederaService.createCompanyTopic();

      const companyData = {
        com_name: createCompanyDto.com_name,
        com_cnpj: createCompanyDto.com_cnpj,
        com_type: createCompanyDto.com_type,
        com_create_wallet: createCompanyDto.com_create_wallet,
        com_hedera_account_id: createCompanyDto.com_hedera_account_id,
        com_hedera_mnemonic_phrase: createCompanyDto.com_hedera_mnemonic_phrase,
        com_hedera_private_key: createCompanyDto.com_hedera_private_key,
        com_hedera_history_id: topicCompanyId,
      };

      const company = await this.companyModel.create(companyData, {
        transaction: transaction,
      });

      const topicUserId = await this.hederaService.createUserTopic();

      const userData = {
        usr_name: createCompanyDto.usr_name,
        usr_com_id: company.com_id,
        usr_email: createCompanyDto.usr_email,
        usr_permission: 'company',
        usr_password: createCompanyDto.usr_password,
        usr_hedera_history_id: topicUserId,
      };
      const user = await this.usersService.create(userData, transaction);

      const hederaCompanyData = {
        com_id: company.com_id,
        com_name: company.com_name,
        com_cnpj: company.com_cnpj,
        com_type: company.com_type,
        com_hedera_account_id: company.com_hedera_account_id,
        com_approval_status: company.com_approval_status,
        com_is_active: company.com_is_active,
        com_hedera_history_id: company.com_hedera_history_id,
        com_created_at: company.com_created_at,
        com_updated_at: company.com_updated_at,
      };
      await this.hederaService.submitMessageTopic(
        topicCompanyId,
        JSON.stringify(hederaCompanyData),
      );

      const hederaUserData = {
        usr_id: user.usr_id,
        usr_com_id: user.usr_com_id,
        usr_name: await encryptText(user.usr_name),
        usr_email: await encryptText(user.usr_email),
        usr_permission: user.usr_permission,
        usr_is_active: user.usr_is_active,
        usr_created_at: user.usr_created_at,
        usr_updated_at: user.usr_updated_at,
      };
      await this.hederaService.submitMessageTopic(
        topicUserId,
        JSON.stringify(hederaUserData),
      );

      await transaction.commit();

      return {
        com_hedera_account_id: createCompanyDto.com_hedera_account_id,
      };
    } catch (err) {
      console.error(err);

      await transaction.rollback();

      if (err?.response?.message) {
        throw new BadRequestException(err?.response?.message);
      } else {
        throw new BadRequestException('Não foi possível cadastrar a empresa');
      }
    }
  }

  findAll() {
    return this.companyModel.findAll();
  }

  findOne(id: number) {
    return this.companyModel.findOne({
      where: {
        com_id: id,
      },
    });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = {
      com_name: updateCompanyDto.com_name,
      com_cnpj: updateCompanyDto.com_cnpj,
      com_type: updateCompanyDto.com_type,
      com_hedera_account_id: updateCompanyDto.com_hedera_account_id,
      com_hedera_mnemonic_phrase: updateCompanyDto.com_hedera_mnemonic_phrase,
      com_hedera_private_key: updateCompanyDto.com_hedera_private_key,
    };

    this.companyModel.update(company, {
      where: {
        com_id: id,
      },
    });
  }

  remove(id: number) {
    this.companyModel.update(
      {
        com_is_active: false,
      },
      {
        where: {
          com_id: id,
        },
      },
    );
  }

  async checkCNPJ(cnpj: string) {
    const company = await this.companyModel.findOne({
      where: {
        com_cnpj: cnpj,
      },
    });

    return !!company;
  }

  async approve(com_id: number) {
    const company = await this.companyModel.scope('full').findOne({
      where: {
        com_id: com_id,
      },
    });

    if (!company) throw new NotFoundException('A empresa informada não existe');

    if (company.com_approval_status === 'approved')
      throw new ConflictException('A empresa já está aprovada');

    const TOKEN_IDS = {
      creator: this.appConfigService.getAll.hedera.creatorTokenId,
      owner: this.appConfigService.getAll.hedera.ownerTokenId,
      maintainer: this.appConfigService.getAll.hedera.maintainerTokenId,
    };

    const ADMIN_ACCOUNT_ID = this.appConfigService.getAll.hedera.accountId;
    const ADMIN_PRIVATE_KEY = this.appConfigService.getAll.hedera.privateKey;

    if (
      !TOKEN_IDS.creator ||
      !TOKEN_IDS.owner ||
      !TOKEN_IDS.owner ||
      !ADMIN_ACCOUNT_ID ||
      !ADMIN_PRIVATE_KEY
    )
      throw new Error('Variable(s) not set');

    const GEMIO_PRIVATE_KEY = PrivateKey.fromStringDer(ADMIN_PRIVATE_KEY);
    const client = new HederaSDKHelper();

    const accountInfo = await client.accountInfo(company.com_hedera_account_id);

    if (accountInfo.maxAutomaticTokenAssociations.isPositive()) {
      // Token auto association is not allowed
      try {
        await client.associate(
          TOKEN_IDS[company.com_type],
          company.com_hedera_account_id,
          company.com_hedera_private_key,
        );
      } catch (err) {
        if (err?.status?._code !== 194) {
          throw new Error('Erro ao associar o token');
        }
      }
    }

    const newTopic = await client.newTopic(
      GEMIO_PRIVATE_KEY,
      GEMIO_PRIVATE_KEY,
    );

    if (!newTopic) throw new Error('Não foi possível criar um novo tópico');

    const TOKEN_IMAGES = {
      creator:
        'ipfs://bafybeifxn2k6xk54kdsjuunbhj2v4xob2auscauahhyhazw3avppddoeu4',
      owner:
        'ipfs://bafybeia2k7bkudd3qx6qrri5pgocsc5cxhziehvjllstis3q5zdo5c6xaq',
      maintainer:
        'ipfs://bafybeie35ptuuixjmsuehnf4lgdj7m4jolayggaktmdlkk77kup2vjetr4',
    };

    const metadata = {
      name: TOKEN_IDS[company.com_type].toUpperCase(),
      creator: 'Gemio',
      description: 'Controle de acesso no Gemio',
      image: TOKEN_IMAGES[company.com_type],
      type: 'image/webp',
    };

    const metadataFile = new File([JSON.stringify(metadata)], 'metadata.json', {
      type: 'application/json',
    });

    const cid = await this.smartNodeService.uploadFilePinata(metadataFile);

    const mintNfts = await client.mintNFT(
      TOKEN_IDS[company.com_type],
      GEMIO_PRIVATE_KEY,
      [Buffer.from(`ipfs://${cid}`)],
    );

    if (!mintNfts) throw new Error('Erro em mintNFT');

    await client.transferNFT(
      TOKEN_IDS[company.com_type],
      company.com_hedera_account_id,
      ADMIN_ACCOUNT_ID,
      GEMIO_PRIVATE_KEY,
      mintNfts,
    );

    const now = moment();

    await client.submitMessage(
      newTopic,
      JSON.stringify({
        createdAt: now.toISOString(),
        expiresAt: now.add(30, 'day').toISOString(),
        amountUsers: 5,
        amountCollections: 10,
        status: 'active',
      }),
      GEMIO_PRIVATE_KEY,
    );

    await this.companyModel.update(
      {
        com_approval_status: 'approved',
      },
      {
        where: {
          com_id: com_id,
        },
      },
    );
  }
}
