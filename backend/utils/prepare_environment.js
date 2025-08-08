const {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  AccountId,
  TopicCreateTransaction,
} = require('@hashgraph/sdk');
try {
  require('dotenv').config();

  const env = process.env.NODE_ENV;
  if (!env) throw new Error('NODE_ENV is required');

  const prefix = env.toUpperCase();

  const hederaNetwork = process.env[`HEDERA_${prefix}_NETWORK`];
  const operatorId = process.env[`HEDERA_${prefix}_ACCOUNT_ID`];
  const operatorKey = process.env[`HEDERA_${prefix}_PRIVATE_KEY`];

  if (!operatorId || !operatorKey) {
    throw new Error(
      `Environment variables HEDERA_${prefix}_ACCOUNT_ID and HEDERA_${prefix}_PRIVATE_KEY must be present`,
    );
  }

  const accountId = AccountId.fromString(operatorId);
  const privateKey = PrivateKey.fromStringDer(operatorKey);

  function getClient(hederaNetwork) {
    if (hederaNetwork === 'localnode') {
      const node = {};
      node[`${process.env[`HEDERA_${prefix}_NODE_ADDRESS`]}:50211`] =
        new AccountId(3);
      return Client.forNetwork(node).setMirrorNetwork(
        `${process.env[`HEDERA_${prefix}_NODE_ADDRESS`]}:5600`,
      );
    } else if (hederaNetwork === 'testnet') {
      return Client.forTestnet();
    } else if (hederaNetwork === 'mainnet') {
      return Client.forMainnet();
    } else {
      throw new Error('Invalid HEDERA_NETWORK');
    }
  }

  const client = getClient(hederaNetwork);
  client.setOperator(accountId, privateKey);

  async function createToken(name, symbol) {
    let tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setTokenType(TokenType.NonFungibleUnique)
      .setSupplyType(TokenSupplyType.Infinite)
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(accountId)
      .setAdminKey(privateKey)
      .setFreezeKey(privateKey)
      .setWipeKey(privateKey)
      .setSupplyKey(privateKey)
      .setPauseKey(privateKey)
      .setFeeScheduleKey(privateKey)
      .freezeWith(client);

    let tokenCreateSign = await tokenCreateTx.sign(privateKey);
    let tokenCreateSubmit = await tokenCreateSign.execute(client);
    let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
    let tokenId = tokenCreateRx.tokenId;

    return tokenId;
  }

  async function main() {
    const tokenId_permission1 = await createToken('Gemio - Creator', 'CREATOR');

    const tokenId_permission2 = await createToken('Gemio - Owner', 'OWNER');

    const tokenId_permission3 = await createToken(
      'Gemio - Maintainer',
      'MAINTAINER',
    );

    const topicCreateTx = await new TopicCreateTransaction()
      .setTopicMemo('Gemio')
      .setAdminKey(privateKey)
      .setSubmitKey(privateKey)
      .freezeWith(client);

    const topicCreateSign = await topicCreateTx.sign(privateKey);
    const topicCreateSubmit = await topicCreateSign.execute(client);
    const topicCreateRx = await topicCreateSubmit.getReceipt(client);
    const topicId = topicCreateRx.topicId;

    console.log(`Update .env file with the values below:`);
    console.log(`\nHEDERA_${prefix}_CREATOR_TOKEN_ID='${tokenId_permission1}'`);
    console.log(`HEDERA_${prefix}_OWNER_TOKEN_ID='${tokenId_permission2}'`);
    console.log(
      `HEDERA_${prefix}_MAINTAINER_TOKEN_ID='${tokenId_permission3}'`,
    );
    console.log(`HEDERA_${prefix}_GEMIO_TOPIC_ID='${topicId.toString()}'`);

    client.close();
  }

  main();
} catch (e) {
  console.error(e);
}
