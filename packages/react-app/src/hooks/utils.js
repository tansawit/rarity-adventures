import BigNumber from "bignumber.js"
import { Contract } from "@ethersproject/contracts"
import { addresses, abis } from "@project/contracts"

export function convertBigNumber(number) {
  return BigNumber(number.toString()).dividedBy(1e18).toString()
}

export function toClassName(id) {
  if (id === 1) {
    return "Barbarian"
  } else if (id === 2) {
    return "Bard"
  } else if (id === 3) {
    return "Cleric"
  } else if (id === 4) {
    return "Druid"
  } else if (id === 5) {
    return "Fighter"
  } else if (id === 6) {
    return "Monk"
  } else if (id === 7) {
    return "Paladin"
  } else if (id === 8) {
    return "Ranger"
  } else if (id === 9) {
    return "Rogue"
  } else if (id === 10) {
    return "Sorcerer"
  } else if (id === 11) {
    return "Wizard"
  }
}

export async function readRarityData(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer)
  const summoner = await rarityContract.summoner(id)
  const xpRequired = await rarityContract.xp_required(summoner[3].toNumber())
  const data = {
    class: toClassName(summoner[2].toNumber()),
    level: summoner[3].toString(),
    xp: convertBigNumber(summoner[0]),
    xpRequired: BigNumber(xpRequired.toString()).minus(BigNumber(summoner[0].toString())).dividedBy(1e18).toString(),
  }
  return data
}

export async function embarkAdventure(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer)
  return await rarityContract.adventure(id)
}

export async function summon(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer)
  return await rarityContract.summon(id)
}

export async function levelUp(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer)
  return await rarityContract.level_up(id)
}

export async function getGoldBalance(id, signer) {
  const rarityGoldContract = new Contract(addresses.rarityGold, abis.rarityGold, signer)
  const goldBalance = await rarityGoldContract.balanceOf(id)
  return convertBigNumber(goldBalance)
}

export async function getClaimableGold(id, signer) {
  const rarityGoldContract = new Contract(addresses.rarityGold, abis.rarityGold, signer)
  const claimableAmount = await rarityGoldContract.claimable(id)
  return convertBigNumber(claimableAmount)
}

export async function claimGold(id, signer) {
  const rarityGoldContract = new Contract(addresses.rarityGold, abis.rarityGold, signer)
  return await rarityGoldContract.claim(id)
}

export async function characterCreated(id, signer) {
  const rarityAttributesContract = new Contract(addresses.rarityAttributes, abis.rarityAttributes, signer)
  const data = await rarityAttributesContract.character_created(id)
  return data
}

export async function getAbilityScores(id, signer) {
  const rarityAttributesContract = new Contract(addresses.rarityAttributes, abis.rarityAttributes, signer)
  const data = await rarityAttributesContract.ability_scores(id)
}
