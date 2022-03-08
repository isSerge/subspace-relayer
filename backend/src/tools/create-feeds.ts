// Small utility that will read relayer configuration and creates feeds for all accounts
import logger from "../logger";
import * as dotenv from "dotenv";
import { ApiPromise, WsProvider } from "@polkadot/api";

import Config, { PrimaryChainConfig } from "../config";
import { getAccount } from "../account";
import { createFeed } from "./common";

dotenv.config();

if (!process.env.CHAIN_CONFIG_PATH) {
  throw new Error(`"CHAIN_CONFIG_PATH" environment variable is required, set it to path to JSON file with configuration of chain(s)`);
}

const config = new Config(process.env.CHAIN_CONFIG_PATH);

(async () => {
  logger.info(`Connecting to ${config.targetChainUrl}...`);
  const provider = new WsProvider(config.targetChainUrl);
  const api = await ApiPromise.create({
    provider,
  });

  for (const chainConfig of [config.primaryChain, ...config.parachains]) {
    const account = getAccount(chainConfig.accountSeed);
    logger.info(`Creating feed for account ${account.address}...`);

    const isRelay = chainConfig.feedId === 0 || chainConfig.feedId === 17; // Kusama feeId: 0, Polkadot feedId: 17
    
    let header;
    
    // fetch header to initialise bridge from
    if (isRelay) {
      const blockNumber = (chainConfig as PrimaryChainConfig).headerToSyncFrom;
      const hash = await api.rpc.chain.getBlockHash(blockNumber);
      header = await api.rpc.chain.getHeader(hash);
    } 
    
    const feedId = await createFeed(api, account, header);

    if (feedId !== chainConfig.feedId) {
      logger.error(`!!! Expected feedId ${chainConfig.feedId}, but created feedId ${feedId}!`);
    }
  }

  api.disconnect();
})();
