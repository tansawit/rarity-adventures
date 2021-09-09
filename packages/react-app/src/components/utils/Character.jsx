import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "@project/contracts";
import BigNumber from "bignumber.js";

const toClassName = (id) => {
  if (id === 1) {
    return "Barbarian";
  } else if (id === 2) {
    return "Bard";
  } else if (id === 3) {
    return "Cleric";
  } else if (id === 4) {
    return "Druid";
  } else if (id === 5) {
    return "Fighter";
  } else if (id === 6) {
    return "Monk";
  } else if (id === 7) {
    return "Paladin";
  } else if (id === 8) {
    return "Ranger";
  } else if (id === 9) {
    return "Rogue";
  } else if (id === 10) {
    return "Sorcerer";
  } else if (id === 11) {
    return "Wizard";
  }
};
function convertBigNumber(number) {
  return BigNumber(number.toString()).dividedBy(1e18).toString();
}
async function embarkAdventure(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  const tx = await rarityContract.adventure(id);
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
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  const tx = await rarityContract.summon(id);
  const confirmed = await tx.wait();
  const final = BigNumber(confirmed.events[0].args[2].toString()).toString();
  return final;
}

async function levelUp(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  const tx = await rarityContract.level_up(id);
  return tx;
}

async function getGoldBalance(id, signer) {
  const rarityGoldContract = new Contract(
    addresses.rarityGold,
    abis.rarityGold,
    signer
  );
  const goldBalance = await rarityGoldContract.balanceOf(id);
  return convertBigNumber(goldBalance);
}

async function getClaimableGold(id, signer) {
  const rarityGoldContract = new Contract(
    addresses.rarityGold,
    abis.rarityGold,
    signer
  );
  const claimableAmount = await rarityGoldContract.claimable(id);
  return convertBigNumber(claimableAmount);
}

async function claimGold(id, signer) {
  const rarityGoldContract = new Contract(
    addresses.rarityGold,
    abis.rarityGold,
    signer
  );
  const tx = await rarityGoldContract.claim(id);
}

async function characterCreated(id, signer) {
  const rarityAttributesContract = new Contract(
    addresses.rarityAttributes,
    abis.rarityAttributes,
    signer
  );
  const data = await rarityAttributesContract.character_created(id);
  return data;
}

async function getAbilityScores(id, signer) {
  const rarityAttributesContract = new Contract(
    addresses.rarityAttributes,
    abis.rarityAttributes,
    signer
  );
  const data = await rarityAttributesContract.ability_scores(id);
  console.log(data);
}
async function readRarityData(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  const summoner = await rarityContract.summoner(id);
  const xpRequired = await rarityContract.xp_required(summoner[3].toNumber());
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
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  try {
    return await rarityContract?.setApprovalForAll(spender, true);
  } catch (e) {
    return;
  }
};

const allowance = async (owner, spender, signer) => {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  try {
    return await rarityContract?.isApprovedForAll(owner, spender);
  } catch (e) {
    return false;
  }
};
const nextAdventure = async (id, signer) => {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  try {
    return await rarityContract?.adventurers_log(id);
  } catch (e) {
    return "0";
  }
};
export {
  toClassName,
  embarkAdventure,
  summon,
  levelUp,
  getGoldBalance,
  getClaimableGold,
  claimGold,
  characterCreated,
  getAbilityScores,
  convertBigNumber,
  BigNumber,
  readRarityData,
  pullHeroesData,
  approve,
  allowance,
  nextAdventure,
};
