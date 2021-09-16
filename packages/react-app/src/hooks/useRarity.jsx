import BigNumber from "bignumber.js";
import { useContext } from "react";
import { ContractContext } from "../components/Context/ContractContext";
import toClassName from "../components/constants/classes";

const useRarity = () => {
  const { contract } = useContext(ContractContext);
  function convertBigNumber(number) {
    return BigNumber(number.toString()).dividedBy(1e18).toString();
  }
  async function embarkAdventure(id) {
    const tx = await contract.rarityContract.adventure(id);
    const confirmed = await tx.wait();
    // console.log("check tx", confirmed);
    return confirmed;
  }
  const waitFunc = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };
  const pullHeroesData = async (heroID) => {
    let data = {
      tokenID: null,
      class: null,
      level: null,
      xp: null,
      xpRequired: null,
      error: null,
    };
    const retryToCompletion = async ({ wait, retries }) => {
      // console.log("heroID & retries left", heroID, retries);
      const onError = (err) => {
        retries = retries - 1;
        if (!retries) {
          throw err;
        }
        return waitFunc(wait).then(() =>
          retryToCompletion({ wait: wait, retries: retries })
        );
      };
      try {
        const response = await readRarityData(heroID);
        // console.log("result ", response);
        return response;
      } catch (e) {
        // if (!response || typeof response === "string") {
        // console.log("request fail and try again", e, "heroID", heroID);
        return onError(e);
        // }
      }
    };
    try {
      // try first pull data with luck. if fail=> call retryToCompletion
      const response = await readRarityData(heroID);
      data = response;
    } catch (e) {
      // console.log("pulling summoners data error", e);
      data = await retryToCompletion({ wait: 3500, retries: 10 }); //wait = 3.5s & rerties = 10 times
    }
    return data;
  };
  async function summon(id) {
    const tx = await contract.rarityContract.summon(id);
    const confirmed = await tx.wait();
    const final = BigNumber(confirmed.events[0].args[2].toString()).toString();
    return final;
  }

  async function levelUp(id) {
    const tx = await contract.rarityContract.level_up(id);
    const confirmed = await tx.wait();
    return confirmed;
  }

  async function characterCreated(id) {
    const data = await contract.rarityContract.character_created(id);
    return data;
  }

  const checkXpRequired = async (currentLevel) => {
    const retryToCompletion = async ({ wait, retries }) => {
      const onError = (err) => {
        retries = retries - 1;
        if (!retries) {
          throw err;
        }
        return waitFunc(wait).then(() =>
          retryToCompletion({ wait: wait, retries: retries })
        );
      };
      try {
        const response = await contract.rarityContract.xp_required(
          parseInt(currentLevel)
        );
        return response;
      } catch (e) {
        return onError(e);
      }
    };
    try {
      const xpRequired = await contract.rarityContract.xp_required(
        parseInt(currentLevel)
      );
      return BigNumber(xpRequired.toString()).dividedBy(1e18).toString();
    } catch (e) {
      const response = await retryToCompletion({ wait: 3500, retries: 10 }); //wait = 3.5s & rerties = 10 times
      return BigNumber(response.toString()).dividedBy(1e18).toString();
    }
  };
  async function readRarityData(id) {
    let data = {
      tokenID: null,
      class: null,
      level: null,
      xp: null,
      xpRequired: null,
      error: null,
      nextAdventure: null,
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

  const approve = async (spender) => {
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

  const allowance = async (owner, spender) => {
    const retryToCompletion = async ({ wait, retries }) => {
      const onError = (err) => {
        retries = retries - 1;
        if (!retries) {
          throw err;
        }
        return waitFunc(wait).then(() =>
          retryToCompletion({ wait: wait, retries: retries })
        );
      };
      try {
        const response = await contract.rarityContract?.isApprovedForAll(
          owner,
          spender
        );
        return response;
      } catch (e) {
        return onError(e);
      }
    };
    try {
      const checkApproval = await contract.rarityContract?.isApprovedForAll(
        owner,
        spender
      );
      return checkApproval;
    } catch (e) {
      //if failed at first try, call retry func
      const response = await retryToCompletion({ wait: 3500, retries: 5 });
      return response;
    }
  };
  const nextAdventure = async (id) => {
    try {
      // const nextAdvTime = await contract.rarityContract?.adventurers_log(id);
      // return BigNumber(nextAdvTime.toString());
      return await contract.rarityContract?.adventurers_log(id);
    } catch (e) {
      return "adventure error";
    }
  };
  const multiAdventure = async (idArray) => {
    try {
      // const nextAdvTime = await contract.rarityContract?.adventurers_log(id);
      // return BigNumber(nextAdvTime.toString());
      const txhash = await contract.rarityWorkerContract.adventure(idArray);
      // wait for tx to be confirmed
      const confirm = await txhash.wait();
      return confirm;
    } catch (e) {
      return "multi adv error";
    }
  };
  const multiLevelUp = async (idArray) => {
    try {
      // const nextAdvTime = await contract.rarityContract?.adventurers_log(id);
      // return BigNumber(nextAdvTime.toString());
      const txhash = await contract.rarityWorkerContract.level_up(idArray);
      // wait for tx to be confirmed
      const confirm = await txhash.wait();
      return confirm;
    } catch (e) {
      return "multi level up error";
    }
  };
  const multiClaimGold = async (idArray) => {
    try {
      // const nextAdvTime = await contract.rarityContract?.adventurers_log(id);
      // return BigNumber(nextAdvTime.toString());
      const txhash = await contract.rarityWorkerContract.claim_gold(idArray);
      // wait for tx to be confirmed
      const confirm = await txhash.wait();
      return confirm;
    } catch (e) {
      return "multi claim gold error";
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
    multiAdventure,
    multiLevelUp,
    multiClaimGold,
  };
};
export default useRarity;
