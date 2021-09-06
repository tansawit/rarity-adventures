import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

import ClassTable from "./components/ClassTable";

function convertBigNumber(number) {
  return BigNumber(number.toString())
    .dividedBy(1e18)
    .toString();
}

function toClassName(id) {
  if (id == 1) {
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

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [id, setID] = useState(0);
  const [charClass, setCharClass] = useState("");
  const [level, setLevel] = useState("");
  const [xp, setXP] = useState("");
  const [xpRequired, setXPRequired] = useState("");
  const [signer, setSigner] = useState({});

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      const defaultProvider = new Web3Provider(window.ethereum);
      const signer = defaultProvider.getSigner();
      setSigner(signer);
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </Header>
      <Body>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ marginRight: "100px" }}>
            <div style={{ display: "flex", justifyContent: "left" }}>
              <label for="example">Enter Class ID to mint: </label>
              <input id="class" type="text" name="text" />
            </div>
            <div>
              <button
                value="Send"
                style={{
                  width: "60px",
                  height: "20px",
                  color: "black",
                }}
                onClick={async () => {
                  const id = document.getElementById("class").value;
                  await summon(id, signer);
                }}
              >
                Submit{" "}
              </button>
            </div>
            or
            {/* Remove the "hidden" prop and open the JavaScript console in the browser to see what this function does */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <label for="summoner">Enter Summoner ID to see stats: </label>
              <input id="summoner" type="text" name="text" />
            </div>
            <div>
              <button
                value="Send"
                style={{
                  width: "60px",
                  height: "20px",
                  color: "black",
                }}
                onClick={async () => {
                  const id = document.getElementById("summoner").value;
                  setID(id);
                  const data = await readRarityData(id, signer);
                  setCharClass(data["class"]);
                  setLevel(data["level"]);
                  setXP(data["xp"]);
                  setXPRequired(data["xpRequired"]);
                }}
              >
                Submit{" "}
              </button>
            </div>
            {id == 0 ? (
              <p>please enter summoner ID first</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p>Summoner ID: {id}</p>
                <p>Class: {charClass}</p>
                <p>Level: {level}</p>
                <p>XP: {xp}</p>
                <p>
                  XP required to level up (to level {parseInt(level) + 1}) :{" "}
                  {xpRequired}
                </p>
                <button onClick={() => embarkAdventure(id, signer)}>
                  Adventure
                </button>
              </div>
            )}
            {parseInt(xpRequired) == 0 ? (
              <button onClick={() => levelUp(id, signer)}>Level Up</button>
            ) : (
              <div />
            )}
          </div>
          <div>
            Class ID Table
            <ClassTable />
          </div>
        </div>
      </Body>
    </div>
  );
}

export default App;
