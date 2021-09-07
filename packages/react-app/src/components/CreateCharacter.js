import React, { useState, useEffect } from "react"

import { Contract } from "@ethersproject/contracts"
import { addresses, abis } from "@project/contracts"

import { Button } from "./index"

async function buyPoints(id, str, dex, con, int, wis, char, signer) {
  const rarityAttributesContract = new Contract(addresses.rarityAttributes, abis.rarityAttributes, signer)
  await rarityAttributesContract.point_buy(id, str, dex, con, int, wis, char)
}

export default ({ id, signer }) => {
  const [str, setStr] = useState(0)
  const [dex, setDex] = useState(0)
  const [con, setCon] = useState(0)
  const [int, setInt] = useState(0)
  const [wis, setWis] = useState(0)
  const [char, setChar] = useState(0)
  const [total, setTotal] = useState(0)
  function handleAttributeChange(newValue, setAttribute) {
    if (newValue !== 0) {
      setAttribute(newValue)
    } else {
      setAttribute(0)
    }
  }

  useEffect(() => {
    function calc(score) {
      // if (score <= 14) {
      //   return Math.max(score - 8, 0)
      // } else {
      //   return Math.floor((score - 8) ** 2 / 6)
      // }
      return score
    }
    const sum = calc(str) + calc(dex) + calc(con) + calc(int) + calc(wis) + calc(char)
    setTotal(sum)
  }, [str, dex, con, int, wis, char])
  const attributes = [
    { name: "Strength", id: "str", setter: setStr },
    { name: "Dexterity", id: "dex", setter: setDex },
    { name: "Constitution", id: "con", setter: setCon },
    { name: "Intelligence", id: "int", setter: setInt },
    { name: "Wisdom", id: "wis", setter: setWis },
    { name: "Charisma", id: "char", setter: setChar },
  ]
  const attributeRows = attributes.map((attribute) => {
    return (
      <div key={attribute.id} style={{ display: "flex", marginBottom: "10px" }}>
        <div style={{ flex: "0 0 50%" }}>{attribute.name}</div>
        <div style={{ flex: "0 0 50%" }}>
          <input
            style={{ color: "#000" }}
            id={attribute.id}
            type="number"
            onChange={(event) => {
              const newVal = event.target.value
              handleAttributeChange(Number(newVal), attribute.setter)
            }}
          />
        </div>
      </div>
    )
  })
  return (
    <div>
      <div style={{ display: "flex", marginBottom: "15px" }}>
        <div style={{ flex: "0 0 50%" }}>Attribute</div>
        <div style={{ flex: "0 0 50%" }}> Value</div>
      </div>
      {attributeRows}
      <p>{32 - total}/32 points available</p>
      {total == 32 && (
        <Button style={{ marginTop: "20px" }} onClick={() => buyPoints(id, str, dex, con, int, wis, char, signer)}>
          Set Attributes
        </Button>
      )}
    </div>
  )
}
