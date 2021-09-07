import React, { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../Context/CharacterContext";
const Heroes = ({ signer }) => {
  const { heroes } = useContext(CharacterContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (heroes.length) {
      setData(heroes);
    }
  }, [heroes]);
  return (
    <div className="heroes-section container my-3">
      <p className="h1 text-uppercase fw-bold text-white"> Heroes List</p>
      <div className="row">
        {console.log("check hero", data.length)}
        {data.length === 26 &&
          data.map((element, index) => {
            return (
              <div className="col-sm-4 my-2" key={index}>
                <p>Summoner ID: {element.tokenID}</p>
                <p>Class: {element.class}</p>
                <p>Level: {element.level}</p>
                <p>XP: {element.xp}</p>
                <p>Gold to be claimed</p>
                <p>
                  XP required to level up (to level{" "}
                  {parseInt(element.level) + 1}) : {element.xpRequired}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Heroes;
