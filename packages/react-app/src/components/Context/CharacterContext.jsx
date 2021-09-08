import React, { createContext, useState, useMemo } from "react";
export const CharacterContext = createContext();

const CharacterContextProvider = ({ children }) => {
  const [heroes, setHeroes] = useState([]);
  const [tokenID, setTokenID] = useState([]);
  const contextValues = useMemo(
    () => ({
      heroes,
      setHeroes,
      tokenID,
      setTokenID,
    }),
    [heroes, tokenID]
  );
  return (
    <CharacterContext.Provider value={contextValues}>
      {children}
    </CharacterContext.Provider>
  );
};

export default CharacterContextProvider;
