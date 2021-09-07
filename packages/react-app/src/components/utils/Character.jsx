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
}

async function summon(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  const tx = await rarityContract.summon(id);
}

async function levelUp(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  const tx = await rarityContract.level_up(id);
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
    class: toClassName(summoner[2].toNumber()),
    level: summoner[3].toString(),
    xp: convertBigNumber(summoner[0]),
    xpRequired: BigNumber(xpRequired.toString())
      .minus(BigNumber(summoner[0].toString()))
      .dividedBy(1e18)
      .toString(),
  };
  return data;
}
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
};
