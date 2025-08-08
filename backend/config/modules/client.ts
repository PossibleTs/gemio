import { registerAs } from "@nestjs/config";
import { ChainType, LedgerNetwork } from "@hsuite/smart-ledgers";
import { IClient } from "@hsuite/client-types";

/**
 * Client configuration module.
 * @module ClientConfig
 */

/**
 * Registers and exports the client configuration.
 * @function
 * @returns {IClient.IOptions} The client configuration object.
 */
export default registerAs('client', (): IClient.IOptions => ({
    /**
     * Indicates whether the client is enabled.
     * @type {boolean}
     */
    enabled: true,

    /**
     * The base URL for the Smart Registry API.
     * @type {string}
     */
    baseUrl: process.env[`HSUITE_${process.env.NODE_ENV.toUpperCase()}_BASE_URL`],

    /**
     * The ledger configurations for the client.
     * @type {Record<ChainType, ILedgerConfig>}
     * @description Specifies the network environments and authentication 
     * credentials for connecting to multiple distributed ledger networks.
     */
    ledgers: {
        [ChainType.HASHGRAPH]: {
            network: LedgerNetwork.HEDERA_TESTNET,
            credentials: {
                accountId: process.env[`HEDERA_${process.env.NODE_ENV.toUpperCase()}_ACCOUNT_ID`],
                privateKey: process.env[`HEDERA_${process.env.NODE_ENV.toUpperCase()}_PRIVATE_KEY`],
                publicKey: process.env[`HEDERA_${process.env.NODE_ENV.toUpperCase()}_PUBLIC_KEY`]
            },
            options: {
                maxRetries: 3,
                timeout: 30000
            }
        },
        [ChainType.RIPPLE]: {
            network: null,
            credentials: null,
            options: null    
        }
    }    
}));