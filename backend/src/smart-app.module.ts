import { DynamicModule, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { AuthModule } from '@hsuite/auth';
import { IAuth } from '@hsuite/auth-types';
import { IIPFS, IpfsModule } from '@hsuite/ipfs';
import { SmartConfigModule } from '@hsuite/smart-config';
import { SmartLedgersModule } from '@hsuite/smart-ledgers';

import authentication from '../config/modules/authentication';
import client from '../config/modules/client';
import smartConfig from '../config/modules/smart-config';
import mongoDb from '../config/settings/mongo-db';
import redis from '../config/settings/redis';
import { SmartNodeSdkModule } from '@hsuite/smartnode-sdk';
import { IClient } from '@hsuite/client-types';
import { ISmartNetwork } from '@hsuite/smart-network-types';
import { Config } from 'cache-manager';
import { ClientModule, ClientService } from '@hsuite/client';
import ipfs from '../config/modules/ipfs';

import { SequelizeModule } from '@nestjs/sequelize';

import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AuthModule as ApiAuthModule } from './modules/auth/auth.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { AppConfigService } from './modules/app-config/app-config.service';
import { AssetsModule } from './modules/assets/assets.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';

import { HederaModule } from './modules/hedera/hedera.module';

/**
 * @class SmartAppModule
 * @description Core module for the Smart Application that orchestrates all application components
 *
 * This module serves as the central hub for the entire Smart Application, integrating all core and optional
 * modules required for the application to function. It handles:
 *
 * - Configuration management through ConfigModule
 * - Database connectivity via MongooseModule
 * - Caching strategies with Redis
 * - Authentication and authorization
 * - Rate limiting and security features
 * - IPFS integration for decentralized storage
 * - Event handling and scheduling
 * - Static file serving
 * - Smart Node SDK integration
 * - Subscription services (when enabled)
 *
 * The module uses a dynamic registration pattern to conditionally load modules based on
 * configuration settings, allowing for flexible deployment scenarios.
 *
 * @example
 * // Bootstrap the application with the SmartAppModule
 * const app = await NestFactory.create(SmartAppModule.register());
 */
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => appConfig.getAll.database,
    }),
    UsersModule,
    CompaniesModule,
    ApiAuthModule,
    CollectionsModule,
    AssetsModule,
    HederaModule,

    /**
     * Global configuration module that loads all application settings
     * from environment variables and configuration files
     */
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      load: [authentication, client, mongoDb, redis, smartConfig, ipfs],
    }),
    /**
     * Redis-based caching system for improved performance
     * Configured asynchronously based on application settings
     */
    CacheModule.registerAsync<RedisClientOptions & Config>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.getOrThrow<
          RedisClientOptions & Config
        >('redis');
        return {
          store: await redisStore(redisConfig as any),
        };
      },
    }),
    /**
     * MongoDB connection for persistent data storage
     * Configured asynchronously based on application settings
     */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<{ url: string }>('mongoDb').url,
      }),
    }),
    /**
     * Event emitter for application-wide event handling
     * Enables publish/subscribe patterns throughout the application
     */
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: true,
      removeListener: true,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class SmartAppModule {
  /**
   * @method register
   * @description Dynamically registers all required and optional modules based on configuration
   *
   * This static factory method creates a dynamic module configuration that:
   * 1. Includes all core Smart Node modules (IPFS, Throttler, SmartConfig, SmartNodeSDK)
   * 2. Conditionally loads authentication modules if enabled in configuration
   * 3. Conditionally loads subscription services if enabled in configuration
   *
   * This approach allows for flexible deployment configurations where certain
   * features can be enabled or disabled without code changes.
   *
   * @returns {DynamicModule} A dynamically configured SmartAppModule with all necessary imports
   */
  static register(): DynamicModule {
    return {
      module: SmartAppModule,
      imports: [
        // Smart Node - Core Modules
        /**
         * IPFS Module for decentralized storage capabilities
         * Provides file storage and retrieval through IPFS protocol
         */
        IpfsModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            ...configService.getOrThrow<IIPFS.IOptions>('ipfs'),
          }),
        }),
        /**
         * Smart Config Module for network and application configuration
         * Manages application settings and network connectivity parameters
         */
        SmartConfigModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              ...configService.getOrThrow<ISmartNetwork.INetwork.IConfig.IOptions>(
                'smartConfig',
              ),
            };
          },
        }),
        /**
         * Smart Ledgers Module for managing blockchain ledger operations
         * Provides unified interface for interacting with multiple blockchain networks
         */
        SmartLedgersModule.forRootAsync({
          isGlobal: true,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            ledgers:
              configService.getOrThrow<IClient.IOptions>('client').ledgers,
          }),
        }),
        /**
         * Smart Node SDK Module for interacting with the Hedera network
         * Provides core functionality for blockchain interactions
         */
        SmartNodeSdkModule.forRootAsync({
          imports: [ConfigModule, SmartConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            client: configService.getOrThrow<IClient.IOptions>('client'),
          }),
        }),
        /**
         * Conditional Authentication Module configuration
         * Only loaded if authentication is enabled in application settings
         */
        ...(authentication().enabled
          ? [
              AuthModule.forRootAsync({
                imports: [ConfigModule, ClientModule],
                inject: [ConfigService, ClientService],
                useFactory: async (configService: ConfigService) => ({
                  ...configService.getOrThrow<IAuth.IConfiguration.IAuthentication>(
                    'authentication',
                  ),
                }),
                config: {
                  passport: authentication().commonOptions.passport,
                  module: 'web3',
                  options: {
                    confirmation_required:
                      authentication().web2Options.confirmation_required,
                    admin_only: authentication().web2Options.admin_only,
                    enable_2fa:
                      authentication().web2Options.twilioOptions.enabled,
                  },
                },
              }),
            ]
          : []),
      ],
      providers: [],
    };
  }
}
