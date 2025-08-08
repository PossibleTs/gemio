import { Client } from '@hashgraph/sdk';

/**
 * Environment class
 */
export class Environment {
  /**
   * Network
   * @private
   */
  private static _network: string = '';

  public static readonly HEDERA_MAINNET_API: string =
    'https://mainnet-public.mirrornode.hedera.com/api/v1';
  public static readonly HEDERA_MAINNET_TOPIC_API: string =
    Environment.HEDERA_MAINNET_API + '/topics/';

  public static readonly HEDERA_TESTNET_API: string =
    'https://testnet.mirrornode.hedera.com/api/v1';
  public static readonly HEDERA_TESTNET_TOPIC_API: string =
    Environment.HEDERA_TESTNET_API + '/topics/';

  public static readonly HEDERA_PREVIEW_API: string =
    'https://preview.mirrornode.hedera.com/api/v1';
  public static readonly HEDERA_PREVIEW_TOPIC_API: string =
    Environment.HEDERA_PREVIEW_API + '/topics/';

  private static _topicsApi: string;

  /**
   * Set network
   * @param network
   * @param mirrornode
   */
  public static setNetwork(network: string, mirrornode?: string) {
    switch (network) {
      case 'mainnet':
        Environment._network = 'mainnet';
        Environment._topicsApi = Environment.HEDERA_MAINNET_TOPIC_API;
        break;
      case 'testnet':
        Environment._network = 'testnet';
        Environment._topicsApi = Environment.HEDERA_TESTNET_TOPIC_API;
        break;
      case 'previewnet':
        Environment._network = 'previewnet';
        Environment._topicsApi = Environment.HEDERA_PREVIEW_TOPIC_API;
        break;
      default:
        throw new Error(`Unknown network: ${network}`);
    }
  }

  /**
   * Create client
   */
  public static createClient(): Client {
    const env = process.env.NODE_ENV;
    if (!env) throw new Error('NODE_ENV is required');

    const prefix = env.toUpperCase();

    const NETWORK = process.env[`HEDERA_${prefix}_NETWORK`];
    if (!NETWORK) throw new Error(`HEDERA_${prefix}_NETWORK is required`);

    Environment.setNetwork(NETWORK);

    let client: Client;

    switch (Environment._network) {
      case 'mainnet':
        client = Client.forMainnet();
        break;
      case 'testnet':
        client = Client.forTestnet();
        break;
      case 'previewnet':
        client = Client.forPreviewnet();
        break;
      default:
        throw new Error(`Unknown network: ${Environment._network}`);
    }

    return client;
  }

  public static get HEDERA_TOPIC_API(): string {
    return Environment._topicsApi;
  }
}
