import React, { useContext, useCallback } from "react";
import { ContractContext } from "../components/Context/ContractContext";

const useCellar = () => {
  const { contract } = useContext(ContractContext);
  const waitFunc = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };
  const scoutCellar = useCallback(
    async (id) => {
      let data = {
        materialReward: 0,
        nextDungeonTime: null,
      };
      if (contract.cellarContract) {
        const retryToCompletion = async ({ wait, retries }) => {
          const onError = (err) => {
            retries = retries - 1;
            if (!retries) {
              throw err;
            }
            return waitFunc(wait).then(() =>
              retryToCompletion({ wait: wait, retries: retries })
            );
          };
          try {
            const nextDungeonTime =
              await contract.cellarContract?.adventurers_log(id);
            const materialReward = await contract.cellarContract?.scout(id);
            const response = {
              materialReward: materialReward,
              nextDungeonTime: nextDungeonTime,
            };
            return response;
          } catch (e) {
            console.log("error", e);
            // return onError(e);
          }
        };
        try {
          const nextDungeonTime =
            await contract.cellarContract?.adventurers_log(id);
          const materialReward = await contract.cellarContract?.scout(id);
          data = {
            materialReward: materialReward,
            nextDungeonTime: nextDungeonTime,
          };
        } catch (e) {
          const response = await retryToCompletion({
            wait: 3500,
            retries: 5,
          });
          data = response;
        }
      }
      return data;
    },
    [contract.cellarContract]
  );
  const singleCellar = async (summonerID) => {
    try {
      const tx = await contract.cellarContract?.adventure(summonerID);
      const confirmed = await tx.wait();
      return confirmed;
    } catch (e) {}
  };
  const adventureCellar = async (summonerArray) => {
    try {
      const tx = await contract.rarityWorkerContract?.cellar(summonerArray);
      const confirmed = await tx.wait();
      return confirmed;
    } catch (e) {}
  };
  return { scoutCellar, adventureCellar, singleCellar };
};

export default useCellar;
