import React, { useState, useEffect } from "react";

import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "@project/contracts";

async function buyPoints(id, str, dex, con, int, wis, char, signer) {
  const rarityAttributesContract = new Contract(
    addresses.rarityAttributes,
    abis.rarityAttributes,
    signer
  );
  await rarityAttributesContract.point_buy(id, str, dex, con, int, wis, char);
}

export default ({ id, signer }) => {
  const [str, setStr] = useState(0);
  const [dex, setDex] = useState(0);
  const [con, setCon] = useState(0);
  const [int, setInt] = useState(0);
  const [wis, setWis] = useState(0);
  const [char, setChar] = useState(0);
  const [total, setTotal] = useState(0);
  function handleAttributeChange(newValue, setAttribute) {
    if (newValue.length !== 0) {
      setAttribute(newValue);
    } else {
      setAttribute(0);
    }
  }

  useEffect(() => {
    function calc(score) {
      if (score <= 14) {
        return Math.max(score - 8, 0);
      } else {
        return Math.floor((score - 8) ** 2 / 6);
      }
    }
    const sum =
      calc(str) + calc(dex) + calc(con) + calc(int) + calc(wis) + calc(char);
    setTotal(sum);
  }, [str, dex, con, int, wis, char]);
  const attributes = [
    { name: "Strength", id: "str", setter: setStr },
    { name: "Dexterity", id: "dex", setter: setDex },
    { name: "Constitution", id: "con", setter: setCon },
    { name: "Intelligence", id: "int", setter: setInt },
    { name: "Wisdom", id: "wis", setter: setWis },
    { name: "Charisma", id: "char", setter: setChar },
  ];
  const attributeRows = attributes.map((attribute) => {
    return (
      <tr>
        <td>{attribute.name}</td>
        <td>
          <input
            id={attribute.id}
            type="text"
            onChange={() => {
              const value = document.getElementById(attribute.id).value;
              handleAttributeChange(value, attribute.setter);
            }}
          />
        </td>
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
      <p>{32 - total}/32 points available</p>
      {total === 32 ? (
        <button
          onClick={() => buyPoints(id, str, dex, con, int, wis, char, signer)}
        >
          Set Attributes
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};
