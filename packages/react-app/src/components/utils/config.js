const RARITY_ADDRESS_NAMES = "0x4c40ce3fb33a6781c903bc830804de4195cc966f";

const WEB3_LOCAL_INSTANCE = "http://localhost:7545";
const WEB3_FANTOM_INSTANCE = "wss://wsapi.fantom.network";

const FANTOM_ID = 250;

const FANTOM_NETWORK = {
  method: "wallet_addEthereumChain",
  params: [
    {
      chainId: `0x${FANTOM_ID.toString(16)}`,
      chainName: "Fantom Opera",
      nativeCurrency: {
        name: "FTM",
        symbol: "ftm",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.ftm.tools"],
      blockExplorerUrls: [`https://ftmscan.com`],
    },
  ],
};

const RARITY_ADDRESS = "0xce761d788df608bd21bdd59d6f4b54b2e27f25bb";
const GOLD_CONTRACTS = "0x2069B76Afe6b734Fb65D1d099E7ec64ee9CC76B2";
const ATTRIBUTES_CONTRACT = "0xb5f5af1087a8da62a23b08c00c6ec9af21f397a1";
const RARITYWORKER_CONTRACT = "0xC0c31CaB5c99450D24ed940F1C7a2b7870152476";
const DUNGEONS = {
  cellar: {
    name: "The Cellar",
    contract: "0x2A0F1cB17680161cF255348dDFDeE94ea8Ca196A",
  },
};
export {
  RARITY_ADDRESS,
  ATTRIBUTES_CONTRACT,
  RARITY_ADDRESS_NAMES,
  WEB3_FANTOM_INSTANCE,
  WEB3_LOCAL_INSTANCE,
  FANTOM_NETWORK,
  FANTOM_ID,
  RARITYWORKER_CONTRACT,
  GOLD_CONTRACTS,
  DUNGEONS,
};
