import React, { useContext, useEffect, useState, useCallback } from "react";
import { CharacterContext } from "../Context/CharacterContext";
import { ContractContext } from "../Context/ContractContext.jsx";
import { approve, allowance, nextAdventure } from "../utils/Character";
import { MULTIADVENTURE_CONTRACT } from "../utils/config";
import Hero from "./Hero";

const Heroes = ({ embarkAdventure, signer }) => {
  const { tokenID, setTokenID } = useContext(CharacterContext);
  const { contract } = useContext(ContractContext);
  const [multiAdv, setMultiAdv] = useState({
    approved: false,
    available: false,
    summoners: [],
    summonersIndexes: [],
  });

  const handleAdventureAll = async (e) => {
    e.preventDefault();
    const txhash = await contract.contract_multiAdventure.adventureTime(
      multiAdv.summoners
    );
    // wait for tx to be confirmed
    const confirm = await txhash.wait();
    // start updating tokenID to re-render all tokenID  in the list
    //so we could update the nextAdventure status
    if (confirm) {
      const temp = [...tokenID];
      for (let i = 0; i < multiAdv.summonersIndexes.length; i++) {
        temp[multiAdv.summonersIndexes[i]] = { id: temp[i], update: true };
      }
      setTokenID(temp);
    }
    return confirm;
  };
  const handleApprove = async (e) => {
    e.preventDefault();
    const txhash = await approve(MULTIADVENTURE_CONTRACT, signer);
    // wait for tx to be confirmed
    const confirm = await txhash.wait();
    // update approval status
    if (confirm) {
      setMultiAdv({ ...multiAdv, approved: true });
    }
  };
  const filter = useCallback(async () => {
    if (!contract?.accounts) return;
    const allowed = await allowance(
      contract.accounts,
      MULTIADVENTURE_CONTRACT,
      signer
    );
    const filtered = [];
    const indexes = [];
    for (let i = 0; i < tokenID.length; i++) {
      const nextAdv = await nextAdventure(tokenID[i], signer);
      const nextAdvTimestamp = parseInt(nextAdv.toString());
      if (nextAdvTimestamp * 1000 < Date.now()) {
        filtered.push(tokenID[i]);
        indexes.push(i);
      }
    }
    setMultiAdv({
      approved: allowed,
      available: filtered.length > 0,
      summoners: [...filtered],
      summonersIndexes: [...indexes],
    });
  }, [tokenID, contract?.accounts]);

  useEffect(() => {
    if (!contract?.accounts) return;
    filter();
  }, [filter, contract?.accounts]);

  return (
    <div className="heroes-section container py-3">
      <div className="container-fluid d-flex justify-content-between">
        <p className="h1 text-uppercase fw-bold text-white"> Heroes List</p>
        {multiAdv.available ? (
          multiAdv.approved ? (
            <button
              className="btn btn-success"
              type="button"
              onClick={handleAdventureAll}
            >
              Adventure All
            </button>
          ) : (
            <button
              className="btn btn-warning"
              type="button"
              onClick={handleApprove}
            >
              Approve
            </button>
          )
        ) : (
          <button className="btn btn-secondary" type="button" disabled={true}>
            No summoner available
          </button>
        )}
      </div>
      <div className="row">
        {tokenID.length &&
          tokenID.map((element, index) => {
            return (
              <Hero
                tokenID={element}
                key={index}
                embarkAdventure={embarkAdventure}
                signer={signer}
              ></Hero>
            );
          })}
      </div>
    </div>
  );
};

export default Heroes;
