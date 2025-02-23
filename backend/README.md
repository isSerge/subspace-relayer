# Relayer

Node.js app which subscribes to the blocks on the source chain and sends block data to the Subspace chain as an extrinsic.
Transactions are signed and sent by the Subspace chain account, which is derived from the seed.

Path to JSON configuration file can be specified at `.env`:
```
CHAIN_CONFIG_PATH=config.json
```

`CHAIN_CONFIG_PATH` needs to point to JSON file with the following structure:
<details>

```json
{
    "targetChainUrl": "ws://127.0.0.1:9944",
    "primaryChain": {
        "downloadedArchivePath": "/path/to/kusama-archive-2021-oct-23",
        "wsUrls": [
            "wss://kusama-rpc.polkadot.io",
            "wss://kusama.api.onfinality.io/public-ws",
            "wss://pub.elara.patract.io/kusama",
            "wss://kusama.geometry.io/websockets"
        ],
        "accountSeed": "//Alice//0",
        "feedId": 0
    },
    "parachains": [
        {
            "downloadedArchivePath": "/path/to/statemine-archive-2021-oct-23",
            "wsUrls": [
                "wss://statemine-rpc.polkadot.io",
                "wss://statemine.api.onfinality.io/public-ws"
            ],
            "paraId": 1000,
            "accountSeed": "//Alice//1000",
            "feedId": 1
        },
        {
            "wsUrls": [
                "wss://karura-rpc-0.aca-api.network",
                "wss://karura-rpc-1.aca-api.network",
                "wss://karura-rpc-2.aca-api.network/ws",
                "wss://karura-rpc-3.aca-api.network/ws",
                "wss://karura.polkawallet.io",
                "wss://karura.api.onfinality.io/public-ws",
                "wss://pub.elara.patract.io/karura"
            ],
            "paraId": 2000,
            "accountSeed": "//Alice//2000",
            "feedId": 2
        },
        {
            "wsUrls": [
                "wss://bifrost-rpc.liebi.com/ws",
                "wss://bifrost-parachain.api.onfinality.io/public-ws",
                "wss://pub.elara.patract.io/bifrost"
            ],
            "paraId": 2001,
            "accountSeed": "//Alice//2001",
            "feedId": 3
        },
        {
            "wsUrls": [
                "wss://khala-api.phala.network/ws",
                "wss://khala.api.onfinality.io/public-ws"
            ],
            "paraId": 2004,
            "accountSeed": "//Alice//2004",
            "feedId": 4
        },
        {
            "wsUrls": [
                "wss://rpc.shiden.astar.network",
                "wss://rpc.pinknode.io/shiden/explorer"
            ],
            "paraId": 2007,
            "accountSeed": "//Alice//2007",
            "feedId": 5
        },
        {
            "wsUrls": [
                "wss://wss.moonriver.moonbeam.network",
                "wss://moonriver.api.onfinality.io/public-ws",
                "wss://rpc.pinknode.io/moonriver/explorer",
                "wss://pub.elara.patract.io/moonriver"
            ],
            "paraId": 2023,
            "accountSeed": "//Alice//2023",
            "feedId": 6
        },
        {
            "wsUrls": [
                "wss://falafel.calamari.systems/",
                "wss://fritti.calamari.systems/",
                "wss://smoothie.calamari.systems/",
                "wss://calamari.api.onfinality.io/public-ws"
            ],
            "paraId": 2084,
            "accountSeed": "//Alice//2084",
            "feedId": 7
        },
        {
            "wsUrls": [
                "wss://spiritnet.kilt.io/",
                "wss://spiritnet.api.onfinality.io/public-ws"
            ],
            "paraId": 2086,
            "accountSeed": "//Alice//2086",
            "feedId": 8
        },
        {
            "wsUrls": [
                "wss://rpc-01.basilisk.hydradx.io",
                "wss://basilisk.api.onfinality.io/public-ws"
            ],
            "paraId": 2090,
            "accountSeed": "//Alice//2090",
            "feedId": 9
        },
        {
            "wsUrls": [
                "wss://fullnode.altair.centrifuge.io",
                "wss://altair.api.onfinality.io/public-ws"
            ],
            "paraId": 2088,
            "accountSeed": "//Alice//2088",
            "feedId": 10
        },
        {
            "wsUrls": [
                "wss://heiko-rpc.parallel.fi",
                "wss://parallel-heiko.api.onfinality.io/public-ws"
            ],
            "paraId": 2085,
            "accountSeed": "//Alice//2085",
            "feedId": 11
        },
        {
            "wsUrls": [
                "wss://api-kusama.interlay.io/parachain",
                "wss://kintsugi.api.onfinality.io/public-ws"
            ],
            "paraId": 2092,
            "accountSeed": "//Alice//2092",
            "feedId": 12
        },
        {
            "wsUrls": [
                "wss://pioneer.api.onfinality.io/public-ws",
                "wss://pioneer-1-rpc.bit.country"
            ],
            "paraId": 2096,
            "accountSeed": "//Alice//2096",
            "feedId": 13
        },
        {
            "wsUrls": [
                "wss://node.genshiro.io"
            ],
            "paraId": 2024,
            "accountSeed": "//Alice//2024",
            "feedId": 14
        },
        {
            "wsUrls": [
                "wss://us-ws-quartz.unique.network"
            ],
            "paraId": 2095,
            "accountSeed": "//Alice//2095",
            "feedId": 15
        },
        {
            "wsUrls": [
                "wss://picasso-rpc.composable.finance"
            ],
            "paraId": 2087,
            "accountSeed": "//Alice//2087",
            "feedId": 16
        }
    ]
}
```

Where:
* `targetChainUrl` - WebSocket JSON-RPC endpoint URL of the target (Subspace) chain where transactions with blocks will be sent
* `downloadedArchivePath` - optional path to downloaded archive of blocks for a particular chain as RocksDB database (can be created with `tools/download-substrate-blocks` script)
* `httpUrl` - HTTP JSON-RPC endpoint URL of a Substrate-based chain
* `wsUrl` - WebSocket JSON-RPC endpoint URL of the main Substrate-based chain (in most cases relay chain like Kusama or Polkadot, but can be used with any other chain too)
* `paraId` - ID of a parachain or parathread under above relay chain
* `accountSeed` - seed for the account that will be used on target chain for submitting transactions with blocks for particular chain (all such accounts can be funded with `tools/fund-accounts` script)
* `feedId` - ID of the feed already created on Subspace chain into which archived blocks will go (`tools/create-feeds` script can be used to create feeds for accounts in the config file)

</details>

## Scripts
- `npm start` - run application
- `npm run lint` - check codebase with Eslint
- `npm run build` - build project

## Creating chain history archive

In order to create chain archive, it is required to download source chain blocks from locally running archive node. Once you have archive node running, you need to set values for `SOURCE_CHAIN_RPC` and
`TARGET_DIR` env variables and run `tools/download-substrate-blocks` script, for example:
```
SOURCE_CHAIN_RPC="ws://localhost:9944" TARGET_DIR="path/to/archive" node dist/tools/download-substrate-blocks.js
```

This will download chain history from the source chain to archive (RocksDB). Path to downloaded archive can then be added to `downloadedArchivePath` at `config.json`.

## Docker

Instructions to build and run with docker:

<details>

### Build

If you decide to build image yourself:
```
docker build -t subspacelabs/subspace-relayer:latest .
```

### Run account funding

Replace `DIR_WITH_CONFIG` with directory where `config.json` is located.

```bash
docker run --rm -it \
    -e CHAIN_CONFIG_PATH="/config.json" \
    -e FUNDS_ACCOUNT_SEED="//Alice" \
    --volume /DIR_WITH_CONFIG/config.json:/config.json:ro \
    --network host \
    subspacelabs/subspace-relayer \
    fund-accounts
```

### Run feed creation

Replace `DIR_WITH_CONFIG` with directory where `config.json` is located.

```bash
docker run --rm -it \
    -e CHAIN_CONFIG_PATH="/config.json" \
    --volume /DIR_WITH_CONFIG/config.json:/config.json:ro \
    --network host \
    subspacelabs/subspace-relayer \
    create-feeds
```

### Run relayer

Replace `DIR_WITH_CONFIG` with directory where `config.json` is located (we mount directory such that config can be
re-read on restart by relayer if updated).

```bash
docker run --rm -it --init \
    -e CHAIN_CONFIG_PATH="/config/config.json" \
    --volume /DIR_WITH_CONFIG:/config:ro \
    --network host \
    --name subspace-relayer \
    subspacelabs/subspace-relayer
```

</details>
