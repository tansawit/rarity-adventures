import React, { useContext, useEffect, useState, useCallback } from "react";
import { CharacterContext } from "../Context/CharacterContext";
import { ContractContext } from "../Context/ContractContext.jsx";
import useRarity from "../../hooks/useRarity";
import useGold from "../../hooks/useGold";
import { RARITYWORKER_CONTRACT } from "../utils/config";
import Hero from "./Hero";
import HeroController from "./HeroController";

const Heroes = () => {
  const { tokenID, setTokenID } = useContext(CharacterContext);
  const { contract } = useContext(ContractContext);
  const {
    approve,
    allowance,
    multiAdventure,
    multiLevelUp,
    multiClaimGold,
    pullHeroesData,
  } = useRarity();
  const { getClaimableGold } = useGold();
  const [updatingAdv, setUpdatingAdv] = useState(false);
  const [updatingGold, setUpdatingGold] = useState(false);
  const [updatingLevel, setUpdatingLevel] = useState(false);
  const [approval, setApproval] = useState(false);
  const [listAdventure, setListAdventure] = useState({
    available: false,
    summoners: [],
    summonersIndexes: [],
  });
  const [listLevel, setListLevel] = useState({
    available: false,
    summoners: [],
    summonersIndexes: [],
  });
  const [listGold, setListGold] = useState({
    available: false,
    summoners: [],
    summonersIndexes: [],
  });
  const [listDungeon, setListDungeon] = useState({
    approved: false,
    available: false,
    summoners: [],
    summonersIndexes: [],
  });
  const [task, setTask] = useState(0);

  const handleAdventureAll = async (e) => {
    e.preventDefault();
    setUpdatingAdv(true); //loading button
    const confirm = await multiAdventure(listAdventure.summoners);
    if (confirm) {
      const temp = [...tokenID];
      for (let i = 0; i < listAdventure.summonersIndexes.length; i++) {
        //we're converting tokenID into object and adding update field to force a re-render
        temp[listAdventure.summonersIndexes[i]] = {
          id: tokenID[listAdventure.summonersIndexes[i]].id,
          updateAdv: true,
        };
      }
      setTokenID(temp);
      setListAdventure({
        available: false,
        summoners: [],
        summonersIndexes: [],
      });
    }
    setUpdatingAdv(false);
  };
  const handleLevelUp = async (e) => {
    e.preventDefault();
    setUpdatingLevel(true); //loading button
    const confirm = await multiLevelUp(listLevel.summoners);
    if (confirm) {
      console.log("confirm", confirm);
      const temp = [...tokenID];
      console.log("temp before", temp);
      for (let i = 0; i < listLevel.summonersIndexes.length; i++) {
        //we're converting tokenID into object and adding update field to force a re-render
        temp[listLevel.summonersIndexes[i]] = {
          id: tokenID[listLevel.summonersIndexes[i]].id,
          updateLevel: true,
        };
      }
      console.log("temp after", temp);
      setTokenID(temp);
      setListLevel({ available: false, summoners: [], summonersIndexes: [] });
    }
    setUpdatingLevel(false);
  };
  const handleClaimGold = async (e) => {
    e.preventDefault();
    setUpdatingGold(true); //loading button
    const confirm = await multiClaimGold(listGold.summoners);
    if (confirm) {
      const temp = [...tokenID];
      for (let i = 0; i < listGold.summonersIndexes.length; i++) {
        //we're converting tokenID into object and adding update field to force a re-render
        temp[listGold.summonersIndexes[i]] = {
          id: tokenID[listGold.summonersIndexes[i]].id,
          updateGold: true,
        };
      }
      setTokenID(temp);
      setListGold({ available: false, summoners: [], summonersIndexes: [] });
    }
    setUpdatingGold(false);
  };
  const handleApprove = async (e) => {
    e.preventDefault();
    setUpdatingAdv(true);
    const confirm = await approve(RARITYWORKER_CONTRACT);
    if (confirm) {
      setApproval(true);
    }
    setUpdatingAdv(false);
  };

  const filterAll = useCallback(async () => {
    if (!contract?.accounts) return;
    setUpdatingAdv(true);
    const allowed = await allowance(contract.accounts, RARITYWORKER_CONTRACT);
    const filteredAdv = [];
    const filteredLevelUp = [];
    const filteredClaimGold = [];
    const indexesAdv = [];
    const indexesLevelUp = [];
    const indexesClaimGold = [];
    for (let i = 0; i < tokenID.length; i++) {
      try {
        const summonerData = await pullHeroesData(tokenID[i].id || tokenID);
        const goldData = await getClaimableGold(tokenID[i].id || tokenID);
        if (summonerData) {
          // build adventrure list
          const nextAdvTimestamp = summonerData.nextAdventure;
          if (nextAdvTimestamp.getTime() < new Date().getTime()) {
            filteredAdv.push(tokenID[i].id || tokenID[i]);
            indexesAdv.push(i);
          }
          //build level up list
          const xpRequired = parseInt(summonerData.xpRequired);
          if (xpRequired === 0) {
            filteredLevelUp.push(tokenID[i].id || tokenID[i]);
            indexesLevelUp.push(i);
          }
          //build claimable gold list
          const claimableGold = parseFloat(goldData);
          if (claimableGold) {
            filteredClaimGold.push(tokenID[i].id || tokenID[i]);
            indexesClaimGold.push(i);
          }
        }
      } catch (e) {}
    }
    setListAdventure({
      available: filteredAdv.length > 0,
      summoners: [...filteredAdv],
      summonersIndexes: [...indexesAdv],
    });
    setListGold({
      available: filteredClaimGold.length > 0,
      summoners: [...filteredClaimGold],
      summonersIndexes: [...indexesClaimGold],
    });
    setListLevel({
      available: filteredLevelUp.length > 0,
      summoners: [...filteredLevelUp],
      summonersIndexes: [...indexesLevelUp],
    });
    setApproval(allowed);
    setUpdatingAdv(false);
  }, [tokenID, contract]);

  useEffect(() => {
    //trigger filter func
    if (!contract?.accounts) return;
    filterAll();
    return () => {};
  }, [filterAll, contract, tokenID]);

  useEffect(() => {
    let count = 0;
    if (listAdventure.available) {
      count += 1;
    }
    if (listGold.available) {
      count += 1;
    }
    if (listLevel.available) {
      count += 1;
    }
    if (listDungeon.available) {
      count += 1;
    }
    setTask(count); //updating all needed tasks
    return () => {};
  }, [listAdventure, listGold, listLevel, listDungeon, tokenID]);
  return (
    <div className="heroes-section container py-3">
      <div className="container-fluid d-flex justify-content-between">
        <p className="h1 text-uppercase fw-bold text-white">
          {" "}
          Heroes List{" "}
          <span className="h6 fw-italic text-white-50">({tokenID.length})</span>
        </p>
        {/* hero controller div */}
        <button
          type="button"
          className="btn btn-outline-warning btn-lg position-relative"
          data-bs-toggle="modal"
          data-bs-target="#collapseController"
          aria-expanded="false"
          aria-controls="collapseController"
        >
          <i className="bi bi-controller"></i>
          {task ? (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {task}
              <span className="visually-hidden">needed attention</span>
            </span>
          ) : (
            ""
          )}
        </button>
        <HeroController
          updatingAdv={updatingAdv}
          updatingGold={updatingGold}
          updatingLevel={updatingLevel}
          listAdventure={listAdventure}
          listGold={listGold}
          listLevel={listLevel}
          handleApprove={handleApprove}
          handleAdventureAll={handleAdventureAll}
          handleClaimGold={handleClaimGold}
          handleLevelUp={handleLevelUp}
          approval={approval}
        ></HeroController>
      </div>
      {/* Hero Card section */}
      <div className="row">
        {tokenID.length &&
          tokenID.map((element, index) => {
            return (
              <div className="col-sm-4 my-3" key={index}>
                <Hero tokenID={element}></Hero>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Heroes;
