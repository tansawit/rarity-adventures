import React, { useState, useContext, useEffect } from "react";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";
import { ethers } from "ethers";

import { Body, Header } from "./components/index.jsx";
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
  readRarityData,
} from "./components/utils/Character";

import Summon from "./components/Summon";
import CreateCharacter from "./components/CreateCharacter.jsx";
import UpdateAttributes from "./components/UpdateAttributes.jsx";
import Heroes from "./components/Heroes/Heroes";
import NavBar from "./components/NavBar/NavBar";
import { CharacterContext } from "./components/Context/CharacterContext.jsx";

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [accounts, setAccounts] = useState("");
  const [id, setID] = useState(0);
  const [charClass, setCharClass] = useState("");
  const [level, setLevel] = useState("");
  const [xp, setXP] = useState("");
  const [xpRequired, setXPRequired] = useState("");
  const [goldBalance, setGoldBalance] = useState("");
  const [claimableGold, setClaimableGold] = useState("");
  const [created, setCreated] = useState(false);
  const [signer, setSigner] = useState("");
  const [tokenID, setTokenID] = useState([]);
  const { heroes, setHeroes } = useContext(CharacterContext);
  // const web3 = new Web3(Web3.givenProvider || "http://localhost:8546");
  // const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

  const callHeroesList = async (event) => {
    event.preventDefault();
    const rarityContract = new Contract(addresses.rarity, abis.rarity, signer);
    // const balance = await rarityContract.balanceOf(address);
    // const converted = ethers.BigNumber.from(balance.toString());
    // console.log("before", converted.toNumber());
  };

  const pullHeroesData = async (heroID) => {
    if (heroID.length) {
      const temp = [];
      for (let i = 0; i < heroID.length; i++) {
        const data = await readRarityData(heroID[i], signer);
        temp.push({ tokenID: heroID[i], ...data });
      }
      console.log("check temp", temp);
      setHeroes(temp);
    }
  };

  React.useEffect(() => {
    // initiate data signer then account address
    const initiateData = async () => {
      if (!loading && !error && data && data.transfers) {
        const defaultProvider = new Web3Provider(window.ethereum);
        const signerData = defaultProvider.getSigner();
        const address = await signerData.getAddress();
        setAccounts(address);
        setSigner(signerData);
      }
    };
    initiateData();
  }, [loading, error, data]);

  React.useEffect(() => {
    //fethcing all NFT of the address using etherscan API
    const fetchHeroes = async () => {
      try {
        const response = await fetch(
          `https://api.ftmscan.com/api?module=account&action=tokennfttx&contractaddress=${addresses.rarity}&address=${accounts}&page=1&offset=100&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_TOKEN}`
        );
        const data = await response.json();
        console.log("data", data);
        const temp = [];
        data.result.forEach((e) => {
          temp.push(e.tokenID);
        });
        //update tokenID for heroes
        pullHeroesData(temp);
        setTokenID(temp);
      } catch (error) {
        console.log("error", error);
      }
    };
    if (accounts && signer) {
      fetchHeroes();
    }
  }, [accounts, signer]);

  // useEffect(() => {
  //   if (tokenID.length) {
  //     const temp = [];
  //     tokenID.forEach(async (e) => {
  //       const data = await readRarityData(e, signer);
  //       console.log("data for", e);
  //       temp.push({ tokenID: e, ...data });
  //     });
  //     console.log("check temp", temp);
  //     setHeroes(temp);
  //   }
  // }, [tokenID]);
  return (
    <div>
      <Header>
        <NavBar></NavBar>
      </Header>
      <Body>
        <Heroes signer={signer}></Heroes>
        {/* <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="main"
        >
          {/* manage heroes */}
        {/* <div style={{ marginRight: "100px" }} className="heroes-section">
            <div>
              <div style={{ display: "flex", justifyContent: "left" }}>
                <label htmlFor="example">Enter Class ID to mint: </label>
                <input id="class" type="text" name="text" />
              </div>
              <div>
                <button
                  className="btn btn-info"
                  type="button"
                  onClick={callHeroesList}
                >
                  Check Heroes{" "}
                </button>
              </div>
              or
              {/* Remove the "hidden" prop and open the JavaScript console in the browser to see what this function does */}
        {/* <div style={{ display: "flex", justifyContent: "center" }}>
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
                    console.log("add data", data);
                    setGoldBalance(balance);
                    setClaimableGold(claimable);
                    setCharClass(data["class"]);
                    setLevel(data["level"]);
                    setXP(data["xp"]);
                    setXPRequired(data["xpRequired"]);
                  }}
                >
                  Check stat{" "}
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
                        ""
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
          <div className="tavern-section">
            Class ID Table
            <Summon signer={signer} />
          </div> */}
        {/* </div> */}
      </Body>
    </div>
  );
}

export default App;
