import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { AppConfigModule } from 'src/modules/app-config/app-config.module';
import { CompaniesModule } from 'src/modules/companies/companies.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from 'src/models/collection.model';
import { Asset } from 'src/models/asset.model';
import { Company } from 'src/models/company.model';
import { HederaModule } from '../hedera/hedera.module';
import { SmartNodeModule } from '../smartnode/smartnode.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Collection, Asset, Company]),
    AppConfigModule,
    CompaniesModule,
    HederaModule,
    SmartNodeModule,
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
