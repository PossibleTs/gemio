import { Injectable, OnModuleInit } from '@nestjs/common';
import { SmartNodeSdkService } from '@hsuite/smartnode-sdk';
import { Transaction, PrivateKey, Client } from '@hashgraph/sdk';

import { IHashgraph } from '@hsuite/hashgraph-types';
import { ChainType, ILedger, SmartLedgersService } from '@hsuite/smart-ledgers';
import { SmartConfigService } from '@hsuite/smart-config';
import { PinataSDK } from 'pinata';
import { AppConfigService } from 'src/modules/app-config/app-config.service';

@Injectable()
export class SmartNodeService implements OnModuleInit {
  private client: Client;
  private operator: IHashgraph.IOperator;
  private ledger: ILedger;

  constructor(
    private readonly smartConfigService: SmartConfigService,
    private smartNodeSdkService: SmartNodeSdkService,
    private readonly smartLedgersService: SmartLedgersService,
    private appConfigService: AppConfigService,
  ) {
    this.operator = this.smartConfigService.getOperator();
  }

  async onModuleInit() {
    this.ledger = this.smartLedgersService
      .getAdapter(ChainType.HASHGRAPH)
      .getLedger();
    this.client = await this.ledger.getClient();
  }

  async createTopicValidator(validator): Promise<string> {
    const validatorConsensusTimestamp =
      await this.smartNodeSdkService.sdk.smartNode.validators.addConsensusValidator(
        validator as any,
      );

    console.log(
      '⏰ [SmartNodeService] Validator consensus timestamp:',
      validatorConsensusTimestamp,
    );

    return validatorConsensusTimestamp;
  }

  async createTokenValidator(validator): Promise<string> {
    const validatorConsensusTimestamp =
      await this.smartNodeSdkService.sdk.smartNode.validators.addTokenValidator(
        validator as any,
      );
    console.log(
      '⏰ [SmartNodeService] Validator consensus timestamp:',
      validatorConsensusTimestamp,
    );

    return validatorConsensusTimestamp;
  }

  async createTopic(validatorConsensusTimestamp: string): Promise<string> {
    const createTopicTxBytes =
      await this.smartNodeSdkService.sdk.hashgraph.hcs.createTopic({
        validatorConsensusTimestamp: validatorConsensusTimestamp,
      });

    const createTopicTx = Transaction.fromBytes(
      new Uint8Array(Buffer.from(createTopicTxBytes)),
    );

    const signedTx = await createTopicTx.sign(
      PrivateKey.fromString(this.operator.privateKey),
    );

    const txResponse = await signedTx.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);

    return receipt.topicId.toString();
  }

  async createToken(
    params: Omit<
      IHashgraph.ILedger.IHTS.ICreate,
      'validatorConsensusTimestamp'
    >,
    validatorConsensusTimestamp: string,
    privateKeySign?: string,
  ): Promise<string> {
    // Generate transaction bytes using the Smart Node SDK
    const createTokenTxBytes =
      await this.smartNodeSdkService.sdk.hashgraph.hts.createToken({
        ...params,
        validatorConsensusTimestamp,
      } as any);

    // Convert bytes to transaction object
    const createTokenTx = Transaction.fromBytes(
      new Uint8Array(Buffer.from(createTokenTxBytes)),
    );

    // Sign the transaction with operator key
    const signedTx = await createTokenTx.sign(
      PrivateKey.fromString(privateKeySign || this.operator.privateKey),
    );

    // Execute the transaction and get receipt
    const txResponse = await signedTx.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);

    // Return the new token ID
    return receipt.tokenId.toString();
  }

  async uploadFilePinata(file: File): Promise<string> {
    const pinata = new PinataSDK({
      pinataJwt: this.appConfigService.getAll.ipfs.pinataJWT,
      pinataGateway: this.appConfigService.getAll.ipfs.pinataGateway,
    });
    const upload = await pinata.upload.public.file(file, {
      groupId: this.appConfigService.getAll.ipfs.pinataGroupId,
    });
    return upload.cid;
  }

  async submitMessage(
    topicId: string,
    accountId: string,
    message: string,
    privateKey: string,
  ): Promise<string> {
    try {
      let bytes = new Uint8Array(Buffer.from(message));
      const signature = PrivateKey.fromString(privateKey).sign(bytes);

      const submitMsgTxBytes =
        await this.smartNodeSdkService.sdk.hashgraph.hcs.submitMessage(
          topicId,
          {
            message,
            signature,
            sender: {
              id: accountId,
            },
            payer: 'smart_app',
          } as any,
        );

      // Convert bytes to transaction object
      const submitMsgTx = Transaction.fromBytes(
        new Uint8Array(Buffer.from(submitMsgTxBytes)),
      );

      // Execute the transaction and get receipt
      const txResponse = await submitMsgTx.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      const submitTxId = txResponse.transactionId.toString();

      return submitTxId;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
