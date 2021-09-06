import React, { useState, useEffect } from "react";

import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "@project/contracts";

async function getAbilityScores(
  id,
  setStr,
  setDex,
  setCon,
  setInt,
  setWis,
  setChar,
  signer
) {
  const rarityAttributesContract = new Contract(
    addresses.rarityAttributes,
    abis.rarityAttributes,
    signer
  );
  const ability = await rarityAttributesContract.ability_scores(id);
  setStr(ability["strength"]);
  setDex(ability["dexterity"]);
  setCon(ability["constitution"]);
  setInt(ability["intelligence"]);
  setWis(ability["wisdom"]);
  setChar(ability["charisma"]);
}

export default ({ id, signer }) => {
  const [str, setStr] = useState(0);
  const [dex, setDex] = useState(0);
  const [con, setCon] = useState(0);
  const [int, setInt] = useState(0);
  const [wis, setWis] = useState(0);
  const [char, setChar] = useState(0);
  useEffect(() => {
    getAbilityScores(
      id,
      setStr,
      setDex,
      setCon,
      setInt,
      setWis,
      setChar,
      signer
    );
  }, [id,signer]);
  const attributes = [
    { name: "Strength", value: str },
    { name: "Dexterity", value: dex },
    { name: "Constitution", value: con },
    { name: "Intelligence", value: int },
    { name: "Wisdom", value: wis },
    { name: "Charisma", value: char },
  ];
  const attributeRows = attributes.map((attribute) => {
    return (
      <tr>
        <td>{attribute.name}</td>
        <td>{attribute.value}</td>
      </tr>
    );
  });
  return (
    <div>
      <table>
        <tr>
          <th>Attribute</th>
          <th>Value</th>
        </tr>
        {attributeRows}
      </table>
    </div>
  );
};
