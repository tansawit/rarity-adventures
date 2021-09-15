import React, { useContext, useEffect, useState, useCallback } from "react";
import { CharacterContext } from "../Context/CharacterContext";
import { ContractContext } from "../Context/ContractContext.jsx";
import useRarity from "../../hooks/useRarity";
import { MULTIADVENTURE_CONTRACT } from "../utils/config";
import Hero from "./Hero";

const Heroes = () => {
  const { tokenID, setTokenID } = useContext(CharacterContext);
  const { contract } = useContext(ContractContext);
  const { approve, allowance, nextAdventure, multiAdventure } = useRarity();
  const [updating, setUpdating] = useState(false);
  const [multiAdv, setMultiAdv] = useState({
    approved: false,
    available: false,
    summoners: [],
    summonersIndexes: [],
  });

  const handleAdventureAll = async (e) => {
    e.preventDefault();
    setUpdating(true); //loading button
    const confirm = await multiAdventure(multiAdv.summoners);
    if (confirm) {
      const temp = [...tokenID];
      for (let i = 0; i < multiAdv.summonersIndexes.length; i++) {
        //we're converting tokenID into object and adding update field to push a re-render
        temp[multiAdv.summonersIndexes[i]] = {
          id: tokenID[multiAdv.summonersIndexes[i]].id,
          update: true,
        };
      }
      setTokenID(temp);
      setMultiAdv({ ...multiAdv, available: false });
    }
    setUpdating(false);
  };
  const handleApprove = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const confirm = await approve(MULTIADVENTURE_CONTRACT);
    if (confirm) {
      setMultiAdv({ ...multiAdv, approved: true });
    }
    setUpdating(false);
  };
  const filter = useCallback(async () => {
    if (!contract?.accounts) return;
    setUpdating(true);

    const allowed = await allowance(contract.accounts, MULTIADVENTURE_CONTRACT);
    const filtered = [];
    const indexes = [];
    for (let i = 0; i < tokenID.length; i++) {
      const nextAdv = await nextAdventure(tokenID[i].id);
      if (nextAdv !== "error") {
        const nextAdvTimestamp = parseInt(nextAdv.toString());
        // if (nextAdvTimestamp) {
        if (nextAdvTimestamp * 1000 < Date.now()) {
          filtered.push(tokenID[i].id || tokenID[i]);
          indexes.push(i);
        }
      }
      // }
    }
    setMultiAdv({
      approved: allowed,
      available: filtered.length > 0,
      summoners: [...filtered],
      summonersIndexes: [...indexes],
    });
    setUpdating(false);
  }, [tokenID, contract.accounts]);

  useEffect(() => {
    if (!contract?.accounts) return;
    filter();
    return () => {};
  }, [filter, contract.accounts, tokenID]);

  return (
    <div className="heroes-section container py-3">
      <div className="container-fluid d-flex justify-content-between">
        <p className="h1 text-uppercase fw-bold text-white">
          {" "}
          Heroes List{" "}
          <span className="h6 fw-italic text-white-50">({tokenID.length})</span>
        </p>
        {updating ? ( //loading button
          <button className="btn btn-secondary" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        ) : multiAdv.available ? (
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
