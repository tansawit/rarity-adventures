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
import Heroes from "./components/Heroes/Heroes";
import Tavern from "./components/Tavern/Tavern";
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
  const { heroes, setHeroes, tokenID, setTokenID } =
    useContext(CharacterContext);
  // const web3 = new Web3(Web3.givenProvider || "http://localhost:8546");
  // const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

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

  return (
    <div>
      <Header>
        <NavBar></NavBar>
      </Header>
      <Body>
        <Heroes signer={signer} embarkAdventure={embarkAdventure}></Heroes>
        <Tavern signer={signer}></Tavern>
      </Body>
      <footer style={{ backgroundColor: "#282c34" }} className="pb-4">
        <div className="border-top footer-section pt-2">
          <p className="text-center text-muted">
            Made with{" "}
            <span role="img" aria-label="heart">
              💙
            </span>
            by{" "}
            <a
              href="https://twitter.com/HawkNguyen189"
              target="_blank"
              rel="noreferrer noopener"
            >
              Hawk
            </a>{" "}
            - Credit to{" "}
            <a
              href="https://twitter.com/AndreCronjeTech"
              target="_blank"
              rel="noreferrer noopener"
            >
              Andre Cronje
            </a>{" "}
            for the Idea &{" "}
            <a
              href="https://www.artstation.com/mrmccoyed"
              target="_blank"
              rel="noreferrer noopener"
            >
              Evan Todd-McCoy
            </a>{" "}
            for Gifs
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
