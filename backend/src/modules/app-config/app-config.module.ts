import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // makes ConfigService globally available
      envFilePath: ['.env'], // load environment variables
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
