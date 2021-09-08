import React, { createContext, useState, useMemo } from "react";
export const ContractContext = createContext();

const ContractContextProvider = ({ children }) => {
  const [contract, setContract] = useState({
    accounts: [],
    contract: null,
    contract_attributes: null,
    contract_names: null,
  });
  const contextValues = useMemo(
    () => ({
      contract,
      setContract,
    }),
    [contract]
  );
  return (
    <ContractContext.Provider value={contextValues}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
