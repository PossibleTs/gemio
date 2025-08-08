import {
  AccountBalanceQuery,
  AccountCreateTransaction,
  AccountId,
  AccountInfo,
  AccountInfoQuery,
  Client,
  ContractId,
  DelegateContractId,
  Hbar,
  HbarUnit,
  PrivateKey,
  Status,
  TokenAssociateTransaction,
  TokenCreateTransaction,
  TokenId,
  TokenMintTransaction,
  TokenType,
  TopicCreateTransaction,
  TopicId,
  TopicMessageSubmitTransaction,
  Transaction,
  TransactionId,
  TransactionReceipt,
  TransactionReceiptQuery,
  TransactionRecord,
  TransactionRecordQuery,
  TransferTransaction,
  TokenUnfreezeTransaction,
  TokenFreezeTransaction,
  TokenWipeTransaction,
} from '@hashgraph/sdk';
import { Environment } from './hedera-environment';
import { HederaResponseCode } from './hedera-response-code.type';
import axios, { AxiosResponse } from 'axios';

export const MAX_FEE = 5;
export const INITIAL_BALANCE = 5;

/**
 * Contains methods to simplify work with hashgraph sdk
 */
export class HederaSDKHelper {
  /**
   * Client
   * @private
   */
  private readonly client: Client;
  /**
   * Rest API max limit
   */
  public static readonly REST_API_MAX_LIMIT: number = 100;
  /**
   * Callback
   * @private
   */
  private static fn: Function | null = null;

  /**
   * Network Name
   * @private
   */
  private readonly network: string;

  constructor(
    operatorId?: string | AccountId | null,
    operatorKey?: string | PrivateKey | null,
  ) {
    this.client = Environment.createClient();
    if (operatorId && operatorKey) {
      this.client.setOperator(operatorId, operatorKey);
    } else if (!operatorId && !operatorKey) {
      // Defaults to Gemio's operator id and key
      const env = process.env.NODE_ENV;
      if (!env) throw new Error('NODE_ENV is required');

      const prefix = env.toUpperCase();

      const operatorIdGemio = process.env[`HEDERA_${prefix}_ACCOUNT_ID`];
      const operatorKeyGemio = process.env[`HEDERA_${prefix}_PRIVATE_KEY`];

      if (!operatorIdGemio || !operatorKeyGemio) {
        throw new Error(
          `HEDERA_${prefix}_ACCOUNT_ID and HEDERA_${prefix}_PRIVATE_KEY is required`,
        );
      }

      this.client.setOperator(operatorIdGemio, operatorKeyGemio);
    } else {
      throw new Error('Invalid operatorId or operatorKey');
    }
  }

  /**
   * Pars random key
   * @param key
   * @param notNull
   */
  parsPrivateKey(
    key: string | PrivateKey,
    notNull = true,
    keyName: string = 'Private Key',
  ): PrivateKey {
    if (key) {
      try {
        if (typeof key === 'string') {
          return PrivateKey.fromString(key);
        } else {
          return key;
        }
      } catch (error) {
        throw new Error(`Invalid ${keyName}`);
      }
    } else if (notNull) {
      throw new Error(`${keyName} is not set`);
    } else {
      throw new Error(`null`);
    }
  }

  /**
   * Get balance account (AccountBalanceQuery)
   *
   * @param {string | AccountId} accountId - Account Id
   *
   * @returns {string} - balance
   */
  public async balance(accountId: string | AccountId): Promise<string> {
    const client = this.client;
    const query = new AccountBalanceQuery().setAccountId(accountId);
    const accountBalance = await query.execute(client);
    return accountBalance.hbars.toString();
  }

  /**
   * Get associate tokens and balance (AccountInfoQuery)
   *
   * @param {string | AccountId} accountId - Account Id
   *
   * @returns {any} - associate tokens and balance
   */
  public async accountInfo(
    accountId: string | AccountId,
  ): Promise<AccountInfo> {
    const client = this.client;
    const info = await new AccountInfoQuery()
      .setAccountId(accountId)
      .execute(client);
    return info;
  }

  /**
   * Associate tokens with account (TokenAssociateTransaction)
   *
   * @param {string | TokenId} tokenId - Token Id
   * @param {string} id - Account Id
   * @param {string} key - Account Private Id
   *
   * @returns {boolean} - Status
   */
  public async associate(
    tokenId: string | TokenId,
    id: string,
    key: string,
  ): Promise<boolean> {
    const client = this.client;

    const accountId = AccountId.fromString(id);
    const accountKey = this.parsPrivateKey(key);
    const transaction = new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([tokenId])
      .setMaxTransactionFee(MAX_FEE)
      .freezeWith(client);
    const signTx = await transaction.sign(accountKey);
    const receipt = await this.executeAndReceipt(client, signTx);
    const transactionStatus = receipt.status;

    return transactionStatus === Status.Success;
  }

  /**
   * Minting a non-fungible token creates an NFT with
   * its unique metadata for the class of NFTs defined by the token ID (TokenMintTransaction)
   *
   * @param {string | TokenId} tokenId - Token Id
   * @param {string | PrivateKey} supplyKey - Token Supply key
   * @param {Uint8Array[]} data - token data
   * @param {string} [transactionMemo] - Memo field
   *
   * @returns {number[]} - serials
   */
  public async mintNFT(
    tokenId: string | TokenId,
    supplyKey: string | PrivateKey,
    data: Uint8Array[],
    transactionMemo?: string,
    additionalSignature?: PrivateKey,
  ): Promise<number[] | null> {
    const client = this.client;

    const _supplyKey = this.parsPrivateKey(supplyKey, true, 'Supply Key');
    const transaction = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata(data)
      .setTransactionMemo(transactionMemo || '')
      .setMaxTransactionFee(MAX_FEE)
      .freezeWith(client);
    let signTx = await transaction.sign(_supplyKey);
    if (additionalSignature) {
      signTx = await signTx.sign(additionalSignature);
    }
    const receipt = await this.executeAndReceipt(client, signTx);
    const transactionStatus = receipt.status;

    if (transactionStatus === Status.Success) {
      return receipt.serials.map((e) => e.toNumber());
    } else {
      return null;
    }
  }

  /**
   * Transfer non-fungible token from some accounts to other accounts (TransferTransaction)
   *
   * @param {string | TokenId} tokenId - Token Id
   * @param {string | AccountId} targetId - Target Account Id
   * @param {string | AccountId} scoreId - Treasury Account Id
   * @param {string | PrivateKey} scoreKey - Token Score key
   * @param {number[]} serials - serials
   * @param {string} [transactionMemo] - Memo field
   *
   * @returns {boolean} - Status
   */
  public async transferNFT(
    tokenId: string | TokenId,
    targetId: string | AccountId,
    scoreId: string | AccountId,
    scoreKey: string | PrivateKey,
    serials: number[],
    transactionMemo?: string,
    additionalSignature?: PrivateKey,
  ): Promise<boolean> {
    const client = this.client;

    const _scoreKey = this.parsPrivateKey(scoreKey);
    let transaction = new TransferTransaction()
      .setTransactionMemo(transactionMemo || '')
      .setMaxTransactionFee(MAX_FEE);

    for (const serial of serials) {
      transaction = transaction.addNftTransfer(
        tokenId,
        serial,
        scoreId,
        targetId,
      );
    }

    transaction = transaction.freezeWith(client);
    let signTx = await transaction.sign(_scoreKey);
    if (additionalSignature) {
      signTx = await signTx.sign(additionalSignature);
    }
    const receipt = await this.executeAndReceipt(client, signTx);
    const transactionStatus = receipt.status;

    return transactionStatus === Status.Success;
  }

  /**
   * Create new Account (AccountCreateTransaction)
   *
   * @param {number} initialBalance - Initial Balance
   *
   * @returns {any} - Account Id and Account Private Key
   */
  public async newAccount(
    privateKey: string,
    initialBalance?: number,
  ): Promise<{
    /**
     * Account ID
     */
    accountId: AccountId | null;
  }> {
    const client = this.client;

    const publicKey = PrivateKey.fromStringDer(privateKey).publicKey;
    const transaction = new AccountCreateTransaction()
      .setKeyWithoutAlias(publicKey)
      .setMaxTransactionFee(MAX_FEE)
      .setInitialBalance(new Hbar(initialBalance || INITIAL_BALANCE));
    const receipt = await this.executeAndReceipt(client, transaction);
    const newAccountId = receipt.accountId;

    return {
      accountId: newAccountId,
    };
  }

  /**
   * Create new Topic (TopicCreateTransaction)
   * @param {PrivateKey | string} [adminKey] - Topic Admin Key
   * @param {PrivateKey | string} [submitKey] - Topic Submit Key
   * @param {string} [topicMemo] - Topic Memo
   * @returns {string} - Topic Id
   */
  public async newTopic(
    adminKey?: PrivateKey | string,
    submitKey?: PrivateKey | string,
    topicMemo?: string,
  ): Promise<string | null> {
    const client = this.client;

    let transaction: any = new TopicCreateTransaction().setMaxTransactionFee(
      MAX_FEE,
    );

    if (topicMemo) {
      transaction = transaction.setTopicMemo(topicMemo.substring(0, 100));
    }

    if (submitKey) {
      const accountKey = this.parsPrivateKey(submitKey, true, 'Submit Key');
      transaction = transaction.setSubmitKey(accountKey);
    }

    if (adminKey) {
      const accountKey = this.parsPrivateKey(adminKey, true, 'Admin Key');
      transaction = transaction.setAdminKey(accountKey);
    }

    transaction = transaction.freezeWith(client);

    if (adminKey) {
      const accountKey = this.parsPrivateKey(adminKey, true, 'Admin Key');
      transaction = await transaction.sign(accountKey);
    }

    const receipt = await this.executeAndReceipt(client, transaction);
    const topicId = receipt.topicId;

    return topicId ? topicId.toString() : null;
  }

  /**
   * Submit message to the topic (TopicMessageSubmitTransaction)
   *
   * @param topicId Topic identifier
   * @param message Message to publish
   *
   * @param privateKey
   * @param transactionMemo
   * @param signOptions
   * @returns Message timestamp
   */
  public async submitMessage(
    topicId: string | TopicId,
    message: string,
    privateKey?: string | PrivateKey,
    transactionMemo?: string,
  ): Promise<string> {
    const client = this.client;

    const maxChunks = process.env.HEDERA_MAX_CHUNKS
      ? parseInt(process.env.HEDERA_MAX_CHUNKS, 10)
      : 20;
    let messageTransaction: Transaction = new TopicMessageSubmitTransaction({
      topicId,
      message,
      maxChunks,
    }).setMaxTransactionFee(MAX_FEE);

    if (transactionMemo) {
      messageTransaction = messageTransaction.setTransactionMemo(
        transactionMemo.substring(0, 100),
      );
    }

    if (privateKey) {
      messageTransaction = messageTransaction.freezeWith(client);
      messageTransaction = await messageTransaction.sign(
        this.parsPrivateKey(privateKey),
      );
    }

    const rec = await this.executeAndRecord(client, messageTransaction);
    const seconds = rec.consensusTimestamp.seconds.toString();
    const nanos = rec.consensusTimestamp.nanos.toString();

    return seconds + '.' + ('000000000' + nanos).slice(-9);
  }

  /**
   * Execute and receipt
   * @param client
   * @param transaction
   * @param type
   * @param metadata
   * @private
   */
  private async executeAndReceipt(
    client: Client,
    transaction: Transaction,
  ): Promise<TransactionReceipt> {
    if (!client.operatorAccountId) throw new Error('operatorAccountId is null');

    try {
      const account = client.operatorAccountId.toString();
      let receipt;
      try {
        const result = await transaction.execute(client);
        receipt = await result.getReceipt(client);
      } catch (error) {
        const errorMessage = typeof error === 'string' ? error : error?.message;
        if (
          !errorMessage ||
          errorMessage.indexOf(HederaResponseCode.DUPLICATE_TRANSACTION) === -1
        ) {
          throw error;
        }

        if (!transaction.transactionId)
          throw new Error('transaction.transactionId is null');

        receipt = await this.receiptQuery(client, transaction.transactionId);
      }

      HederaSDKHelper.transactionResponse(account);
      return receipt;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receipt query
   * @param client Client
   * @param transacationId Transaction identifier
   * @returns Transaction result
   */
  private async receiptQuery(
    client: Client,
    transactionId: string | TransactionId,
    count = 0,
  ): Promise<TransactionReceipt> {
    try {
      let receiptQuery = new TransactionReceiptQuery()
        .setMaxQueryPayment(new Hbar(MAX_FEE))
        .setTransactionId(transactionId);
      const transactionCost = await receiptQuery.getCost(client);
      const newCost = transactionCost.toTinybars().multiply(2);
      receiptQuery = receiptQuery.setQueryPayment(Hbar.fromTinybars(newCost));
      return await receiptQuery.execute(client);
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message;
      if (
        count < 10 &&
        errorMessage &&
        errorMessage.indexOf(HederaResponseCode.DUPLICATE_TRANSACTION) > -1
      ) {
        return await this.receiptQuery(client, transactionId, count++);
      }
      throw error;
    }
  }

  /**
   * Execute and record
   * @param client
   * @param transaction
   * @param type
   * @param metadata
   * @private
   */
  private async executeAndRecord(
    client: Client,
    transaction: Transaction,
  ): Promise<TransactionRecord> {
    try {
      if (!client.operatorAccountId)
        throw new Error('client.operatorAccountId is null');

      const account = client.operatorAccountId.toString();
      let record;
      try {
        const result = await transaction.execute(client);
        record = await result.getRecord(client);
      } catch (error) {
        const errorMessage = typeof error === 'string' ? error : error?.message;
        if (
          !errorMessage ||
          errorMessage.indexOf(HederaResponseCode.DUPLICATE_TRANSACTION) === -1
        ) {
          throw error;
        }
        if (!transaction.transactionId)
          throw new Error('transaction.transactionId is null');

        record = await this.recordQuery(client, transaction.transactionId);
      }
      HederaSDKHelper.transactionResponse(account);
      return record;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Record query
   * @param client Client
   * @param transacationId Transaction identifier
   * @returns Transaction result
   */
  private async recordQuery(
    client: Client,
    transactionId: string | TransactionId,
    count = 0,
  ): Promise<TransactionRecord> {
    try {
      let recordQuery = new TransactionRecordQuery()
        .setMaxQueryPayment(new Hbar(MAX_FEE))
        .setTransactionId(transactionId);
      const transactionCost = await recordQuery.getCost(client);
      const newCost = transactionCost.toTinybars().multiply(2);
      recordQuery = recordQuery.setQueryPayment(Hbar.fromTinybars(newCost));
      return await recordQuery.execute(client);
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message;
      if (
        count < 10 &&
        errorMessage &&
        errorMessage.indexOf(HederaResponseCode.DUPLICATE_TRANSACTION) > -1
      ) {
        return await this.recordQuery(client, transactionId, count++);
      }
      throw error;
    }
  }

  /**
   * Transaction response
   * @param account
   * @private
   */
  private static transactionResponse(account: string) {
    if (HederaSDKHelper.fn) {
      try {
        const result = HederaSDKHelper.fn(account);
        if (typeof result.then === 'function') {
          result.then(null, (error) => {
            console.error(error);
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * Crate client
   * @param operatorId
   * @param operatorKey
   */
  public static client(
    operatorId?: string | AccountId,
    operatorKey?: string | PrivateKey,
  ) {
    const client = Environment.createClient();
    if (operatorId && operatorKey) {
      client.setOperator(operatorId, operatorKey);
    }
    return client;
  }

  /**
   * Get balance account (AccountBalanceQuery)
   *
   * @param {string | AccountId} accountId - Account Id
   *
   * @returns {string} - balance
   */
  public static async balance(
    client: Client,
    accountId: string | AccountId,
  ): Promise<number> {
    const query = new AccountBalanceQuery().setAccountId(accountId);
    const accountBalance = await query.execute(client);
    if (accountBalance && accountBalance.hbars) {
      return accountBalance.hbars.to(HbarUnit.Hbar).toNumber();
    }
    return NaN;
  }

  /**
   * Destroy client
   */
  public destroy() {
    this.client.close();
  }

  /**
   * Create new token (TokenCreateTransaction)
   *
   * @param {string} name - Token name
   * @param {string} symbol - Token symbol
   * @param {boolean} nft - Fungible or NonFungible Token
   * @param {number} decimals - Decimals
   * @param {number} initialSupply - Initial Supply
   * @param {string} tokenMemo - Memo field
   * @param {AccountId} treasuryId - treasury account
   * @param {PrivateKey} treasuryKey - treasury account
   * @param {PrivateKey} [supplyKey] - set supply key
   * @param {PrivateKey} [adminKey] - set admin key
   * @param {PrivateKey} [kycKey] - set kyc key
   * @param {PrivateKey} [freezeKey] - set freeze key
   * @param {PrivateKey} [wipeKey] - set wipe key
   *
   * @param userId
   * @returns {string} - Token id
   */
  public async newToken(
    name: string,
    symbol: string,
    nft: boolean,
    decimals: number,
    initialSupply: number,
    tokenMemo: string,
    treasuryId: AccountId,
    treasuryKey: PrivateKey,
    supplyKey: PrivateKey,
    adminKey: PrivateKey | null,
    kycKey: PrivateKey | null,
    freezeKey: PrivateKey | null,
    wipeKey: PrivateKey | ContractId | DelegateContractId | null,
    freezeDefault: boolean,
    additionalSignature?: PrivateKey,
    metadata?: Uint8Array,
  ): Promise<string | null> {
    const client = this.client;
    let transaction = new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setTreasuryAccountId(treasuryId)
      .setDecimals(decimals)
      .setInitialSupply(initialSupply)
      .setTokenMemo(tokenMemo)
      .setMaxTransactionFee(MAX_FEE)
      .setMetadata(metadata)
      .setFreezeDefault(freezeDefault);

    if (adminKey) {
      transaction = transaction.setAdminKey(adminKey);
    }
    if (kycKey) {
      transaction = transaction.setKycKey(kycKey);
    }
    if (freezeKey) {
      transaction = transaction.setFreezeKey(freezeKey);
    }
    if (wipeKey) {
      transaction = transaction.setWipeKey(wipeKey);
    }
    if (supplyKey) {
      transaction = transaction.setSupplyKey(supplyKey);
    }
    if (nft) {
      transaction = transaction.setTokenType(TokenType.NonFungibleUnique);
    }
    transaction = transaction.freezeWith(client);

    let signTx: Transaction = transaction;
    if (adminKey) {
      signTx = await signTx.sign(adminKey);
    }
    if (treasuryKey) {
      signTx = await signTx.sign(treasuryKey);
    }
    if (additionalSignature) {
      signTx = await signTx.sign(additionalSignature);
    }

    const receipt = await this.executeAndReceipt(client, signTx);
    const tokenId = receipt.tokenId;

    return tokenId?.toString() || null;
  }

  public async freezeToken(
    accountId: AccountId | string,
    tokenId: TokenId | string,
    freezeKey: PrivateKey,
  ): Promise<void> {
    const client = this.client;

    const transaction = await new TokenFreezeTransaction()
      .setAccountId(accountId)
      .setTokenId(tokenId)
      .freezeWith(client);
    const signTx = await transaction.sign(freezeKey);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;
  }

  public async unfreezeToken(
    accountId: AccountId | string,
    tokenId: TokenId | string,
    freezeKey: PrivateKey,
    additionalSignature?: PrivateKey,
  ): Promise<void> {
    const client = this.client;

    const transaction = await new TokenUnfreezeTransaction()
      .setAccountId(accountId)
      .setTokenId(tokenId)
      .freezeWith(client);

    let signTx = await transaction.sign(freezeKey);

    if (additionalSignature) {
      signTx = await transaction.sign(additionalSignature);
    }

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;
  }

  public async wipeNFT(
    accountId: AccountId | string,
    tokenId: TokenId | string,
    serials: number[],
    wipeKey: PrivateKey,
  ) {
    const client = this.client;

    const transaction = await new TokenWipeTransaction()
      .setAccountId(accountId)
      .setTokenId(tokenId)
      .setSerials(serials)
      .freezeWith(client);

    //Sign with the wipe private key of the token
    const signTx = await transaction.sign(wipeKey);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;
  }

  public async getTopicMessages(topicId: string) {
    let goNext = true;

    let url = `${Environment.HEDERA_TOPIC_API}${topicId}/messages`;

    const result = [];

    const p = {
      params: { limit: HederaSDKHelper.REST_API_MAX_LIMIT },
      responseType: 'json',
    };

    while (goNext) {
      const res = await axios.get(url, p as any);
      delete p.params;

      if (!res || !res.data || !res.data.messages) {
        throw new Error(`Invalid topicId '${topicId}'`);
      }

      const messages = res.data.messages;
      if (messages.length === 0) {
        return result;
      }

      for (const m of messages) {
        const buffer = Buffer.from(m.message, 'base64').toString();
        result.push({
          id: m.consensus_timestamp,
          payer_account_id: m.payer_account_id,
          sequence_number: m.sequence_number,
          topicId: m.topic_id,
          message: buffer,
        });
      }
      if (res.data.links?.next) {
        url = `${res.request.protocol}//${res.request.host}${res.data.links?.next}`;
      } else {
        goNext = false;
      }
    }

    return result;
  }
}
