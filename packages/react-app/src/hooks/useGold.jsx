import BigNumber from "bignumber.js";
import { useContext } from "react";
import { ContractContext } from "../components/Context/ContractContext";

const useGold = () => {
  const { contract } = useContext(ContractContext);
  const getClaimableGold = async (tokenID) => {
    const claimableAmount = await contract.goldContract.claimable(tokenID);
    return BigNumber(claimableAmount.toString()).dividedBy(1e18).toString();
  };
  const getGoldBalance = async (tokenID) => {
    const goldBalance = await contract.goldContract.balanceOf(tokenID);
    return BigNumber(goldBalance.toString()).dividedBy(1e18).toString();
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
