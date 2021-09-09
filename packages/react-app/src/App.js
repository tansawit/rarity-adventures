import React, { useState, useContext, useEffect } from "react";
// import { Web3Provider } from "@ethersproject/providers";
// import { ethers } from "ethers";
// import { Contract } from "@ethersproject/contracts";
import { Body, Header } from "./components/index.jsx";
import { addresses, abis } from "@project/contracts";
import { embarkAdventure } from "./components/utils/Character";
import Heroes from "./components/Heroes/Heroes";
import Tavern from "./components/Tavern/Tavern";
import NavBar from "./components/NavBar/NavBar";
import { CharacterContext } from "./components/Context/CharacterContext.jsx";
import { ContractContext } from "./components/Context/ContractContext.jsx";
import { setupContracts } from "./components/utils/setupContracts";

function App() {
  const [refresh, setRefresh] = useState(false);
  const { heroes, setHeroes, tokenID, setTokenID } =
    useContext(CharacterContext);
  const { contract, setContract } = useContext(ContractContext);

  const initiateRarityData = async () => {
    try {
      if (window.ethereum) {
        const contracts = await setupContracts({
          onError: () => alert("Please, switch to Fantom network"),
          onRefresh: () => setRefresh(!refresh),
        });
        console.log("contract", contracts);
        setContract(contracts);
      } else {
        alert.error(
          "Please, try to use Metamask or some client to connect your wallet"
        );
      }
    } catch (ex) {
      console.log({ isError: true, stack: ex });
    }
  };
  React.useEffect(() => {
    // initiate data signer then account address
    const initiateData = async () => {
      // if (!loading && !error && data && data.transfers) {
      initiateRarityData();
      // }
    };
    initiateData();
  }, [refresh]);
  // }, [loading, error, data]);

  React.useEffect(() => {
    //fethcing all NFT of the address using etherscan API
    const fetchHeroes = async () => {
      try {
        const response = await fetch(
          `https://api.ftmscan.com/api?module=account&action=tokennfttx&contractaddress=${addresses.rarity}&address=${contract?.accounts}&page=1&offset=100&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_TOKEN}`
        );
        const data = await response.json();
        console.log("data", data);
        const temp = [];
        data.result.forEach((e) => {
          temp.push(e.tokenID);
        });
        //update tokenID for heroes
        setTokenID(temp);
      } catch (error) {
        console.log("error", error);
      }
    };
    if (contract?.accounts && contract?.signer) {
      fetchHeroes();
    }
  }, [contract?.accounts, contract?.signer]);

  return (
    <div>
      <Header>
        <NavBar></NavBar>
      </Header>
      <Body>
        <Heroes
          signer={contract?.signer}
          embarkAdventure={embarkAdventure}
        ></Heroes>
        <Tavern signer={contract?.signer}></Tavern>
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
          <p className="text-center text-white-50">
            Tip me here
            <span className="link-primary">
              {" "}
              0xf438A14edD1757411D4a4c9f45b4D1CBdE73EAba
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
