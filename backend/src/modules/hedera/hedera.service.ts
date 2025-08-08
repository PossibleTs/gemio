import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import { HederaSDKHelper } from 'src/helpers/hedera-sdk-helper';

@Injectable()
export class HederaService implements OnModuleInit {
  private gemioTopicId: string;

  private companiesTopicId: string;
  private usersTopicId: string;
  private collectionsTopicId: string;

  constructor(private appConfigService: AppConfigService) {}

  async onModuleInit() {
    const client = new HederaSDKHelper();

    this.gemioTopicId = this.appConfigService.getAll.hedera.gemioTopicId;

    let messages = await client.getTopicMessages(this.gemioTopicId);
    messages = messages.map((el) => JSON.parse(el.message));

    this.companiesTopicId = messages.find(
      (el) => el.key === 'companiesTopicId',
    )?.value;

    if (!this.companiesTopicId) {
      this.companiesTopicId = await client.newTopic(
        this.appConfigService.getAll.hedera.privateKey,
        this.appConfigService.getAll.hedera.privateKey,
        'Empresas do GEMIO',
      );

      let message = JSON.stringify({
        key: 'companiesTopicId',
        value: this.companiesTopicId,
      });

      await client.submitMessage(this.gemioTopicId, message);
    }

    this.usersTopicId = messages.find((el) => el.key === 'usersTopicId')?.value;

    if (!this.usersTopicId) {
      this.usersTopicId = await client.newTopic(
        this.appConfigService.getAll.hedera.privateKey,
        this.appConfigService.getAll.hedera.privateKey,
        'Usuários do GEMIO',
      );

      let message = JSON.stringify({
        key: 'usersTopicId',
        value: this.usersTopicId,
      });

      await client.submitMessage(this.gemioTopicId, message);
    }

    this.collectionsTopicId = messages.find(
      (el) => el.key === 'collectionsTopicId',
    )?.value;

    if (!this.collectionsTopicId) {
      this.collectionsTopicId = await client.newTopic(
        this.appConfigService.getAll.hedera.privateKey,
        this.appConfigService.getAll.hedera.privateKey,
        'Coleções do GEMIO',
      );

      let message = JSON.stringify({
        key: 'collectionsTopicId',
        value: this.collectionsTopicId,
      });

      await client.submitMessage(this.gemioTopicId, message);
    }
  }

  async createCompanyTopic() {
    const client = new HederaSDKHelper();

    const companyInfoTopicId = await client.newTopic(
      this.appConfigService.getAll.hedera.privateKey,
      this.appConfigService.getAll.hedera.privateKey,
      'Detalhe da empresa',
    );

    await client.submitMessage(this.companiesTopicId, companyInfoTopicId);

    return companyInfoTopicId;
  }

  async createUserTopic() {
    const client = new HederaSDKHelper();

    const userInfoTopicId = await client.newTopic(
      this.appConfigService.getAll.hedera.privateKey,
      this.appConfigService.getAll.hedera.privateKey,
      'Detalhe do usuário',
    );

    await client.submitMessage(this.usersTopicId, userInfoTopicId);

    return userInfoTopicId;
  }

  async submitMessageTopic(topicId: string, data: string) {
    const client = new HederaSDKHelper();
    await client.submitMessage(topicId, data);
  }

  async submitNewCollection(data: string) {
    const client = new HederaSDKHelper();
    await client.submitMessage(this.collectionsTopicId, data);
  }
}
