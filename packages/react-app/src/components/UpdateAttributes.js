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
  useEffect(async () => {
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
  }, []);
  return (
    <div>
      <table>
        <tr>
          <th>Attribute</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Strength</td>
          <td>{str}</td>
        </tr>
        <tr>
          <td>Dexterity</td>
          <td>{dex}</td>
        </tr>
        <tr>
          <td>Constitution</td>
          <td>{con}</td>
        </tr>
        <tr>
          <td>Intelligence</td>
          <td>{int}</td>
        </tr>
        <tr>
          <td>Wisdom</td>
          <td>{wis}</td>
        </tr>
        <tr>
          <td>Charisma</td>
          <td>{char}</td>
        </tr>
      </table>
    </div>
  );
};
