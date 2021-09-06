import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

import CreateCharacter from "./components/CreateCharacter";
import UpdateAttributes from "./components/UpdateAttributes";
import Summon from "./components/Summon";

function convertBigNumber(number) {
  return BigNumber(number.toString())
    .dividedBy(1e18)
    .toString();
}

function toClassName(id) {
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
  await rarityContract.adventure(id);
}

async function levelUp(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  await rarityContract.level_up(id);
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
  await rarityGoldContract.claim(id);
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
  const [goldBalance, setGoldBalance] = useState("");
  const [claimableGold, setClaimableGold] = useState("");
  const [created, setCreated] = useState(false);
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
              <div style={{ display: "flex", justifyContent: "center",marginRight:"10px" }}>
                <label for="summoner">Enter Summoner ID to View Stats: </label>
                <input
                  id="summoner"
                  type="text"
                  name="text"
                  style={{ maxHeight: "20px" }}
                />
              </div>
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
                  const charCreated = await characterCreated(id, signer);
                  setCreated(charCreated);
                  const data = await readRarityData(id, signer);
                  const claimable = await getClaimableGold(id, signer);
                  const balance = await getGoldBalance(id, signer);
                  setGoldBalance(balance);
                  setClaimableGold(claimable);
                  setCharClass(data["class"]);
                  setLevel(data["level"]);
                  setXP(data["xp"]);
                  setXPRequired(data["xpRequired"]);
                }}
              >
                Submit{" "}
              </button>
            </div>
            <div>
              {id === 0 ? (
                <div/>
              ) : (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginTop:"10px"}}>
                  Summoner Stats
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p>Summoner ID: {id}</p>
                    <p>Class: {charClass}</p>
                    <p>Level: {level}</p>
                    <p>XP: {xp}</p>
                    <p>
                      Gold: {goldBalance} ({claimableGold} claimable){" "}
                      {claimableGold > 0 ? (
                        <button onClick={() => claimGold(id, signer)}>
                          Claim
                        </button>
                      ) : (
                        <div />
                      )}
                    </p>
                    <p>
                      XP required to level up (to level {parseInt(level) + 1}) :{" "}
                      {xpRequired}
                    </p>
                    <button onClick={() => embarkAdventure(id, signer)}>
                      Adventure
                    </button>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", marginTop: "20px",alignItems:"center" }}>
                    Attributes
                    {created ? (
                      <UpdateAttributes id={id} signer={signer} />
                    ) : (
                      <CreateCharacter id={id} signer={signer} />
                    )}
                  </div>
                </div>
              )}
              {parseInt(xpRequired) === 0 ? (
                <button onClick={() => levelUp(id, signer)}>Level Up</button>
              ) : (
                <div />
              )}
            </div>
          </div>
          <div style={{ height: "30px" }} />
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <p style={{marginBottom:"10px"}}>Summon</p>
            <Summon signer={signer} />
          </div>
        </div>
      </Body>
    </div>
  );
}

export default App;
