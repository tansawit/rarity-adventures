import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import {
  WEB3_FANTOM_INSTANCE,
  RARITY_ABI,
  RARITY_ADDRESS,
  RARITY_ABI_ATTRIBUTES,
  RARITY_ADDRESS_ATTRIBUTES,
  FANTOM_NETWORK,
  FANTOM_ID,
  RARITY_ABI_NAMES,
  RARITY_ADDRESS_NAMES,
} from "./config";

export const setupContracts = async ({ onError, onRefresh }) => {
  // await window.ethereum.send("eth_requestAccounts");
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
      RARITY_ADDRESS_ATTRIBUTES,
      RARITY_ABI_ATTRIBUTES,
      signer
    );
    const namesContract = new Contract(
      RARITY_ADDRESS_NAMES,
      RARITY_ABI_NAMES,
      signer
    );
    return {
      accounts: accounts,
      contract: rarityContract,
      contract_attributes: attributesContract,
      contract_names: namesContract,
      signer: signer,
    };
  }
};
