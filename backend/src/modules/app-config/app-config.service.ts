import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get getAll() {
    const env = this.configService.get('NODE_ENV');
    const prefix = env.toUpperCase();

    return {
      database: {
        dialect: this.configService.get(`DB_${prefix}_DIALECT`),
        host: this.configService.get(`DB_${prefix}_HOST`),
        port: parseInt(this.configService.get(`DB_${prefix}_PORT`)!),
        username: this.configService.get(`DB_${prefix}_USER`),
        password: this.configService.get(`DB_${prefix}_PASSWORD`),
        database: this.configService.get(`DB_${prefix}_NAME`),
        autoLoadModels: true,
        synchronize: false,
      },
      hedera: {
        network: this.configService.get(`HEDERA_${prefix}_NETWORK`),
        nodeAddress: this.configService.get(`HEDERA_${prefix}_NODE_ADDRESS`),
        nodeProtocol: this.configService.get(`HEDERA_${prefix}_NODE_PROTOCOL`),
        accountId: this.configService.get(`HEDERA_${prefix}_ACCOUNT_ID`),
        privateKey: this.configService.get(`HEDERA_${prefix}_PRIVATE_KEY`),
        creatorTokenId: this.configService.get(
          `HEDERA_${prefix}_CREATOR_TOKEN_ID`,
        ),
        ownerTokenId: this.configService.get(`HEDERA_${prefix}_OWNER_TOKEN_ID`),
        maintainerTokenId: this.configService.get(
          `HEDERA_${prefix}_MAINTAINER_TOKEN_ID`,
        ),
        gemioTopicId: this.configService.get(`HEDERA_${prefix}_GEMIO_TOPIC_ID`),
      },
      ipfs: {
        pinataGateway: this.configService.get(`PINATA_${prefix}_GATEWAY`),
        pinataGroupId: this.configService.get(`PINATA_${prefix}_GROUP_ID`),
        pinataJWT: this.configService.get(`PINATA_${prefix}_JWT`),
      },
    };
  }
}
