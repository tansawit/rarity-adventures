import React from "react";

import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "@project/contracts";

async function newSummon(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  await rarityContract.summon(id);
}

export default ({ signer }) => {
  const classes = [
    { id: 1, name: "Barbarian" },
    { id: 2, name: "Bard" },
    { id: 3, name: "Cleric" },
    { id: 4, name: "Druid" },
    { id: 5, name: "Fighter" },
    { id: 6, name: "Monk" },
    { id: 7, name: "Paladin" },
    { id: 8, name: "Ranger" },
    { id: 9, name: "Rogue" },
    { id: 10, name: "Sorcerer" },
    { id: 11, name: "Wizard" },
  ];

  const tableRows = classes.map((classDetail, index) => {
    return (
      <button
        key={index}
        style={{ marginLeft: "5px", marginRight: "5px" }}
        onClick={() => newSummon(classDetail.id, signer)}
      >
        {classDetail.name}
      </button>
    );
  });
  return <div>{tableRows}</div>;
};
