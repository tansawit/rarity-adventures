import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import {
  FANTOM_NETWORK,
  FANTOM_ID,
  RARITY_ADDRESS,
  ATTRIBUTES_CONTRACT,
  RARITY_ADDRESS_NAMES,
  MULTIADVENTURE_CONTRACT,
  GOLD_CONTRACTS,
  DUNGEONS,
} from "./config";

import RARITY_ABI from "../constants/abis/rarity.json";
import GOLD_ABI from "../constants/abis/gold.json";
import ATTRIBUTES_ABI from "../constants/abis/attributes.json";
import MULTIADVENTURE_ABI from "../constants/abis/multiadventure.json";
import DUNGEON_ABI from "../constants/abis/dungeon.json";

export const setupContracts = async ({ onError, onRefresh }) => {
  const defaultProvider = new Web3Provider(window.ethereum);
  const signer = await defaultProvider.getSigner();
  const webId = await signer.getChainId();
  if (webId !== FANTOM_ID) {
    onError("Please, switch networks to use Fantom");
    await window.ethereum.request(FANTOM_NETWORK);
    onRefresh(true);
  } else {
    const accounts = await signer.getAddress();
    const rarityContract = new Contract(RARITY_ADDRESS, RARITY_ABI, signer);
    const attributesContract = new Contract(
      ATTRIBUTES_CONTRACT,
      ATTRIBUTES_ABI,
      signer
    );
    // const namesContract = new Contract(
    //   RARITY_ADDRESS_NAMES,
    //   RARITY_ABI_NAMES,
    //   signer
    // );
    const multiAdventureContract = new Contract(
      MULTIADVENTURE_CONTRACT,
      MULTIADVENTURE_ABI,
      signer
    );
    const goldContract = new Contract(GOLD_CONTRACTS, GOLD_ABI, signer);

    return {
      accounts: accounts,
      rarityContract: rarityContract,
      contract_attributes: attributesContract,
      // contract_names: namesContract,
      contract_multiAdventure: multiAdventureContract,
      signer: signer,
      goldContract: goldContract,
    };
  }
};
