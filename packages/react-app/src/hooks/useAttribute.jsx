import { useContext, useCallback } from "react";
import { ContractContext } from "../components/Context/ContractContext";
import { calcAPCost } from "../components/constants";

const useAttribute = () => {
  const { contract } = useContext(ContractContext);

  const waitFunc = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };
  const getAbilityScores = useCallback(
    async (id) => {
      let data = {
        //default value is 8
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
      };
      if (contract.contractAttributes) {
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
            const response = await contract.contractAttributes?.ability_scores(
              id
            );
            return response;
          } catch (e) {
            return onError(e);
          }
        };
        try {
          const attr = await contract.contractAttributes?.ability_scores(id);
          data = {
            strength: attr.strength === 0 ? 8 : attr.strength,
            dexterity: attr.dexterity === 0 ? 8 : attr.dexterity,
            constitution: attr.constitution === 0 ? 8 : attr.constitution,
            intelligence: attr.intelligence === 0 ? 8 : attr.intelligence,
            wisdom: attr.wisdom === 0 ? 8 : attr.wisdom,
            charisma: attr.charisma === 0 ? 8 : attr.charisma,
          };
        } catch (e) {
          const response = await retryToCompletion({ wait: 3500, retries: 5 });
          data = response;
        }
      }
      return data;
    },
    [contract.contractAttributes]
  );

  const calcAP = useCallback(
    async (id, lvl) => {
      try {
        const base = 32;
        const lvlAP = parseInt(
          (
            await contract.contractAttributes?.abilities_by_level(lvl)
          ).toString(),
          16
        );
        const lvlAPNum = parseInt(lvlAP.toString());
        const totalAP = base - lvlAPNum;
        const scores = await contract.contractAttributes?.ability_scores(id);
        let spent = 0;
        spent += calcAPCost(scores.strength === 0 ? 8 : scores.strength);
        spent += calcAPCost(scores.dexterity === 0 ? 8 : scores.dexterity);
        spent += calcAPCost(
          scores.constitution === 0 ? 8 : scores.constitution
        );
        spent += calcAPCost(
          scores.intelligence === 0 ? 8 : scores.intelligence
        );
        spent += calcAPCost(scores.wisdom === 0 ? 8 : scores.wisdom);
        spent += calcAPCost(scores.charisma === 0 ? 8 : scores.charisma);
        return totalAP - spent;
      } catch (e) {
        return 0;
      }
    },
    [contract.contractAttributes]
  );

  const pointBuy = useCallback(
    async (id, str, dex, con, int, wis, cha) => {
      try {
        await contract.contractAttributes?.point_buy(
          id,
          str,
          dex,
          con,
          int,
          wis,
          cha
        );
        return;
      } catch (e) {
        return;
      }
    },
    [contract.contractAttributes]
  );

  const characterCreated = useCallback(
    async (id) => {
      try {
        return await contract.contractAttributes?.character_created(id);
      } catch (e) {
        return false;
      }
    },
    [contract.contractAttributes]
  );
  return { getAbilityScores, calcAP, pointBuy, characterCreated };
};

export default useAttribute;
