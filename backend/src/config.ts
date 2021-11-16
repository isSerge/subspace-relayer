import * as fs from "fs";
import { z } from "zod";
import { ChainId } from "./types";

const AnyChainConfig = z.object({
  downloadedArchivePath: z.string().optional(),
  httpUrl: z.string(),
  accountSeed: z.string(),
  feedId: z.number().refine((number) => {
    return number >= 0;
  }),
  // prefix is required to avoid collisions with same paraid on different relay chains
  prefix: z.string(),
});

export type AnyChainConfig = z.infer<typeof AnyChainConfig>;

const PrimaryChainConfig = AnyChainConfig.extend({
  wsUrl: z.string(),
});

export type PrimaryChainConfig = z.infer<typeof PrimaryChainConfig>;

const ParachainConfig = AnyChainConfig.extend({
  paraId: z.number().refine((number): number is ChainId => {
    return number > 0;
  }),
});

export type ParachainConfig = z.infer<typeof ParachainConfig>;

const ChainFile = z.object({
  targetChainUrl: z.string(),
  primaryChains: z.array(PrimaryChainConfig),
  parachains: z.array(ParachainConfig),
});

export class Config {
  public readonly targetChainUrl: string;
  public readonly primaryChains: PrimaryChainConfig[];
  public readonly parachains: ParachainConfig[];

  public constructor(configPath: string) {
    const config = ChainFile.parse(JSON.parse(fs.readFileSync(configPath, 'utf-8')));

    this.targetChainUrl = config.targetChainUrl;
    this.primaryChains = config.primaryChains;
    this.parachains = config.parachains;
  }
}

export default Config;
