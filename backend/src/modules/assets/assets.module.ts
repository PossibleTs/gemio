import { forwardRef, Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { AppConfigModule } from 'src/modules/app-config/app-config.module';
import { Asset } from '../../models/asset.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CompaniesModule } from 'src/modules/companies/companies.module';
import { CollectionsModule } from 'src/modules/collections/collections.module';
import { Company } from 'src/models/company.model';
import { SmartNodeModule } from 'src/modules/smartnode/smartnode.module';
import { MaintenancePermission } from '../../models/maintenance-permission.model';
import { AssetMessage } from '../../models/asset-message';
import { Collection } from '../../models/collection.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Asset,
      Company,
      MaintenancePermission,
      AssetMessage,
      Collection,
    ]),
    AppConfigModule,
    AuthModule,
    CompaniesModule,
    CollectionsModule,
    forwardRef(() => SmartNodeModule),
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
