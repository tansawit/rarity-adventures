import BigNumber from "bignumber.js";
import { useContext } from "react";
import { ContractContext } from "../components/Context/ContractContext";
import { addresses, abis } from "@project/contracts";

const useAttribute = () => {
  const { contract } = useContext(ContractContext);

  const getAbilityScores = async (id, signer) => {
    const data = await contract.contractAttributes.ability_scores(id);
    console.log(data);
  };
  return getAbilityScores;
};

export default useAttribute;
