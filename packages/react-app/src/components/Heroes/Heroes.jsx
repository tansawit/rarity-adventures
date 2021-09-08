import React, { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../Context/CharacterContext";
import Hero from "./Hero";

const Heroes = ({ embarkAdventure, signer }) => {
  const { tokenID } = useContext(CharacterContext);
  //   const [data, setData] = useState([]);
  //   useEffect(() => {
  //     if (heroes.length) {
  //       setData(heroes);
  //     }
  //   }, [heroes]);
  return (
    <div className="heroes-section container py-3">
      <p className="h1 text-uppercase fw-bold text-white"> Heroes List</p>
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
