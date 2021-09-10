import BigNumber from "bignumber.js";
import { useContext } from "react";
import { ContractContext } from "../components/Context/ContractContext";
import toClassName from "../components/constants/classes";

const useRarity = () => {
  const { contract } = useContext(ContractContext);
  function convertBigNumber(number) {
    return BigNumber(number.toString()).dividedBy(1e18).toString();
  }
  async function embarkAdventure(id, signer) {
    const tx = await contract.rarityContract.adventure(id);
    const confirmed = await tx.wait();
    // console.log("check tx", confirmed);
    return confirmed;
  }
  const pullHeroesData = async (heroID, signer) => {
    let data = {};
    if (heroID) {
      data = await readRarityData(heroID, signer);
    }
    return data;
  };
  async function summon(id, signer) {
    const tx = await contract.rarityContract.summon(id);
    const confirmed = await tx.wait();
    const final = BigNumber(confirmed.events[0].args[2].toString()).toString();
    return final;
  }

  async function levelUp(id, signer) {
    const tx = await contract.rarityContract.level_up(id);
    const confirmed = await tx.wait();
    return confirmed;
  }

  async function characterCreated(id, signer) {
    const data = await contract.rarityContract.character_created(id);
    return data;
  }

  const checkXpRequired = async (currentLevel) => {
    const xpRequired = await contract.rarityContract.xp_required(
      parseInt(currentLevel)
    );
    return BigNumber(xpRequired.toString()).dividedBy(1e18).toString();
  };
  async function readRarityData(id) {
    const summoner = await contract.rarityContract.summoner(id);
    const xpRequired = await contract.rarityContract.xp_required(
      summoner[3].toNumber()
    );
    const data = {
      tokenID: id,
      class: toClassName(summoner[2].toNumber()),
      level: summoner[3].toString(),
      xp: convertBigNumber(summoner[0]),
      xpRequired: BigNumber(xpRequired.toString())
        .minus(BigNumber(summoner[0].toString()))
        .dividedBy(1e18)
        .toString(),
      nextAdventure: new Date(summoner[1] * 1000),
    };
    return data;
  }
  const approve = async (spender, signer) => {
    try {
      const tx = await contract.rarityContract?.setApprovalForAll(
        spender,
        true
      );
      const confirmed = await tx.wait();
      return confirmed;
    } catch (e) {
      console.log("approve error", e);
      return;
    }
  };

  const allowance = async (owner, spender, signer) => {
    try {
      return await contract.rarityContract?.isApprovedForAll(owner, spender);
    } catch (e) {
      return false;
    }
  };
  const nextAdventure = async (id, signer) => {
    try {
      // const nextAdvTime = await contract.rarityContract?.adventurers_log(id);
      // return BigNumber(nextAdvTime.toString());
      return await contract.rarityContract?.adventurers_log(id);
    } catch (e) {
      return "error";
    }
  };

  return {
    embarkAdventure,
    summon,
    levelUp,
    characterCreated,
    convertBigNumber,
    BigNumber,
    readRarityData,
    pullHeroesData,
    approve,
    allowance,
    nextAdventure,
    checkXpRequired,
  };
};
export default useRarity;
