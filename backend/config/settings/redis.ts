import { registerAs } from "@nestjs/config";
import { Config } from "cache-manager";
import { RedisClientOptions } from "redis";

/**
 * Configuration for Redis connection.
 * @module RedisConfig
 */
export default registerAs('redis', (): any => ({
    /**
     * The hostname or IP address of the Redis server.
     * @type {string}
     */
    socket: {
        host: process.env[`HSUITE_${process.env.NODE_ENV.toUpperCase()}_REDIS_URL`],
        port: Number(process.env[`HSUITE_${process.env.NODE_ENV.toUpperCase()}_REDIS_PORT`]),
    },

    /**
     * The authentication password for the Redis server.
     * @type {string}
     */
    password: process.env[`HSUITE_${process.env.NODE_ENV.toUpperCase()}_REDIS_PASSWORD`],

    /**
     * The username for the Redis server.
     * @type {string}
     */
    username: process.env[`HSUITE_${process.env.NODE_ENV.toUpperCase()}_REDIS_USERNAME`],

    /**
     * The database number for the Redis server.
     * @type {number}
     */
    database: Number(process.env[`HSUITE_${process.env.NODE_ENV.toUpperCase()}_REDIS_DATABASE`]),

    /**
     * The time-to-live (TTL) for cached items in Redis.
     * @type {number}
     */
    ttl: Number(process.env[`HSUITE_${process.env.NODE_ENV.toUpperCase()}_REDIS_TTL`])
}));