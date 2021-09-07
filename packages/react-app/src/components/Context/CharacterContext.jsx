import React, { createContext, useState, useMemo } from "react";
export const CharacterContext = createContext();

const CharacterContextProvider = ({ children }) => {
  const [heroes, setHeroes] = useState([]);

  const contextValues = useMemo(
    () => ({
      heroes,
      setHeroes,
    }),
    [heroes]
  );
  return (
    <CharacterContext.Provider value={contextValues}>
      {children}
    </CharacterContext.Provider>
  );
};

export default CharacterContextProvider;
