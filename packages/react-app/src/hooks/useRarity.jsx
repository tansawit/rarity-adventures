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
    let data = {
      tokenID: null,
      class: null,
      level: null,
      xp: null,
      xpRequired: null,
      error: null,
    };
    const retryToCompletion = async ({ wait, retries }) => {
      console.log("heroID & retries", heroID, retries);
      let result;
      try {
        result = await new Promise((resolve, reject) => {
          setTimeout(async () => {
            try {
              if (heroID) {
                const response = await readRarityData(heroID, signer);
                // console.log("response in settimeout", response);
                resolve(response);
              }
            } catch (e) {
              // if (e.message.toString() === "-32603" && retries) {
              console.log("error message", e.message);
              reject(e.message);
              //   return retryToCompletion(wait, --retries);
              // }
            }
          }, wait);
        });
        // console.log("result from settimeout", result);
        return result;
      } catch (e) {
        console.log("error message ", e);
        if (e.toString() === "-32603" && retries) {
          console.log("repull hero ", heroID, e, retries);
          return retryToCompletion({ wait: wait, retries: --retries });
        }
      }
    };
    //end retry to completion func
    try {
      // try first pull data with luck. if fail=> call retryToCompletion
      const response = await readRarityData(heroID, signer);
      data = response;
    } catch (e) {
      console.log("pulling summoners data error", e);
      data = await retryToCompletion({ wait: 3500, retries: 100 }); //wait = 5s & rerties = 5 times
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
    let data = {
      tokenID: null,
      class: null,
      level: null,
      xp: null,
      xpRequired: null,
      error: null,
    };
    try {
      const summoner = await contract.rarityContract.summoner(id);
      const xpRequired = await contract.rarityContract.xp_required(
        summoner[3].toNumber()
      );
      data = {
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
    } catch (e) {
      throw new Error(e.code);
      // e.code:-32603
    }
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
