import BigNumber from "bignumber.js";
import { useContext } from "react";
import { ContractContext } from "../components/Context/ContractContext";

const useGold = () => {
  const { contract } = useContext(ContractContext);
  const waitFunc = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };
  const getClaimableGold = async (tokenID) => {
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
        const claimableAmount = await contract.goldContract.claimable(tokenID);
        return BigNumber(claimableAmount.toString()).dividedBy(1e18).toString();
      } catch (e) {
        return onError(e);
      }
    };
    try {
      const claimableAmount = await contract.goldContract.claimable(tokenID);
      return BigNumber(claimableAmount.toString()).dividedBy(1e18).toString();
    } catch (e) {
      const response = await retryToCompletion({ wait: 3500, retries: 5 });
      return response;
    }
  };
  const getGoldBalance = async (tokenID) => {
    try {
      const goldBalance = await contract.goldContract.balanceOf(tokenID);
      return BigNumber(goldBalance.toString()).dividedBy(1e18).toString();
    } catch (e) {
      // console.log("fetch gold balance err", e, tokenID);
    }
  };

  const claimGold = async (tokenID) => {
    const tx = await contract.goldContract.claim(tokenID);
    //wait for the tx hash to get confirmed
    const confirmed = await tx.wait();
    return confirmed;
  };
  return { getClaimableGold, getGoldBalance, claimGold };
};

export default useGold;
