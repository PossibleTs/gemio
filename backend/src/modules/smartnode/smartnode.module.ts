import { Module } from '@nestjs/common';
import { SmartNodeService } from './smartnode.service';
import { AppConfigModule } from 'src/modules/app-config/app-config.module';

@Module({
  imports: [AppConfigModule],
  providers: [SmartNodeService],
  exports: [SmartNodeService],
})
export class SmartNodeModule {}
