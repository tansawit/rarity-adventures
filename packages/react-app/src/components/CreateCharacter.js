import React, { useState, useEffect } from "react";

import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "@project/contracts";

async function buyPoints(id, str, dex, con, int, wis, char,signer) {
  const rarityAttributesContract = new Contract(
    addresses.rarityAttributes,
    abis.rarityAttributes,
    signer
  );
  const tx = await rarityAttributesContract.point_buy(
    id,
      str,
      dex,
      con,
      int,
      wis,
      char
  );
}

export default ({ id, signer}) => {
  const [str, setStr] = useState(0);
  const [dex, setDex] = useState(0);
  const [con, setCon] = useState(0);
  const [int, setInt] = useState(0);
  const [wis, setWis] = useState(0);
  const [char, setChar] = useState(0);
  const [total, setTotal] = useState(0);
  function handleAttributeChange(newValue, setAttribute) {
    if (newValue.length != 0) {
      setAttribute(newValue);
    } else {
      setAttribute(0);
    }
  }

  useEffect(() => {
    function calc(score) {
        if (score <= 14) {
          return Math.max(score - 8,0);
        } else {
          return (score - 8) ** 2 / 6;
        }
      }
    const sum =
      calc(str) +
      calc(dex) +
      calc(con) +
      calc(int) +
      calc(wis) +
      calc(char);
    console.log(sum);
    setTotal(sum);
  }, [str, dex, con, int, wis, char]);
  return (
    <div>
      <table>
        <tr>
          <th>Attribute</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Strength</td>
          <td>
            <input
              id="str"
              type="text"
              name="text"
              onChange={() => {
                const value = document.getElementById("str").value;
                handleAttributeChange(value, setStr);
                console.log(str);
              }}
            />
          </td>
        </tr>
        <tr>
          <td>Dexterity</td>
          <td>
            <td>
              <input
                id="dex"
                type="text"
                name="text"
                onChange={() => {
                  const value = document.getElementById("dex").value;
                  handleAttributeChange(value, setDex);
                }}
              />
            </td>
          </td>
        </tr>
        <tr>
          <td>Constitution</td>
          <td>
            <input
              id="con"
              type="text"
              name="text"
              onChange={() => {
                const value = document.getElementById("con").value;
                handleAttributeChange(value, setCon);
              }}
            />
          </td>
        </tr>
        <tr>
          <td>Intelligence</td>
          <td>
            <input
              id="int"
              type="text"
              name="text"
              onChange={() => {
                const value = document.getElementById("int").value;
                handleAttributeChange(value, setInt);
              }}
            />
          </td>
        </tr>
        <tr>
          <td>Wisdom</td>
          <td>
            <input
              id="wis"
              type="text"
              name="text"
              onChange={() => {
                const value = document.getElementById("wis").value;
                handleAttributeChange(value, setWis);
              }}
            />
          </td>
        </tr>
        <tr>
          <td>Charisma</td>
          <td>
            <input
              id="char"
              type="text"
              name="text"
              onChange={() => {
                const value = document.getElementById("char").value;
                handleAttributeChange(value, setChar);
              }}
            />
          </td>
        </tr>
      </table>
      <p>{32 - total}/32 points available</p>
      {total == 32 ? (
        <button onClick={() => buyPoints(id, str, dex, con, int, wis, char,signer)}>
          Set Attributes
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};
