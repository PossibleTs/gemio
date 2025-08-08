import { Module } from '@nestjs/common';
import { HederaService } from './hedera.service';
import { AppConfigModule } from 'src/modules/app-config/app-config.module';

@Module({
  imports: [AppConfigModule],
  providers: [HederaService],
  exports: [HederaService],
})
export class HederaModule {}
