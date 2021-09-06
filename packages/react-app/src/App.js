import React, { useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";

import { Body, Header } from "./components/index.jsx";
import useWeb3Modal from "./hooks/useWeb3Modal";
import GET_TRANSFERS from "./graphql/subgraph";

import { addresses, abis } from "@project/contracts";
import {
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
} from "./components/utils/Character";

import Summon from "./components/Summon";
import CreateCharacter from "./components/CreateCharacter.jsx";
import UpdateAttributes from "./components/UpdateAttributes.jsx";

import NavBar from "./components/NavBar/NavBar";

async function readRarityData(id, signer) {
  const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
  console.log(rarityContract);
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
      const signerData = defaultProvider.getSigner();
      console.log("check", signerData);
      setSigner(signerData);
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <NavBar
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        ></NavBar>
      </Header>
      <Body>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ marginRight: "100px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "left" }}>
                <label htmlFor="example">Enter Class ID to mint: </label>
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
                <label htmlFor="summoner">
                  Enter Summoner ID to see stats:{" "}
                </label>
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
              {id == 0 ? (
                <p>please enter summoner ID first</p>
              ) : (
                <div>
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
                  <div style={{ marginTop: "20px" }}>
                    {created ? (
                      <UpdateAttributes id={id} signer={signer} />
                    ) : (
                      <CreateCharacter id={id} signer={signer} />
                    )}
                  </div>
                </div>
              )}
              {parseInt(xpRequired) == 0 ? (
                <button onClick={() => levelUp(id, signer)}>Level Up</button>
              ) : (
                <div />
              )}
            </div>
          </div>
          <div>
            Class ID Table
            <Summon />
          </div>
        </div>
      </Body>
    </div>
  );
}

export default App;
