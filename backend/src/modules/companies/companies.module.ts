import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from '../../models/company.model';
import { UsersModule } from 'src/modules/users/users.module';
import { AppConfigModule } from 'src/modules/app-config/app-config.module';
import { SmartNodeModule } from '../smartnode/smartnode.module';
import { HederaModule } from '../hedera/hedera.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Company]),
    UsersModule,
    AppConfigModule,
    SmartNodeModule,
    HederaModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
