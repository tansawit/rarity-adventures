import React, { useContext, useEffect, useState } from "react";
import { CharacterContext } from "../Context/CharacterContext";

const Heroes = ({ embarkAdventure, signer }) => {
  const { heroes } = useContext(CharacterContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (heroes.length) {
      setData(heroes);
    }
  }, [heroes]);
  const handleAdventure = async (tokenID) => {
    const response = await embarkAdventure(tokenID, signer);
    console.log(response);
  };
  return (
    <div className="heroes-section container py-3">
      <p className="h1 text-uppercase fw-bold text-white"> Heroes List</p>
      <div className="row">
        {data.length &&
          data.map((element, index) => {
            return (
              <div className="col-sm-4 my-3" key={index}>
                <div className="row">
                  <div className="col-sm-3">
                    <img
                      className="img-thumbnail"
                      src={require(`../../media/heroes-icon/${element.class?.toLowerCase()}.png`)}
                      alt={element.class}
                    />
                  </div>
                  <div className="col-sm-9">
                    <p>
                      <span className="fw-bolder">{element.class} </span>
                      <span className="fw-italic text-white-50">
                        Level {element.level}
                      </span>
                    </p>
                    <p className="fw-bold text-white-50">
                      {element.tokenID} | XP: {element.xp} ({element.xpRequired}{" "}
                      remaining )
                    </p>
                    <p className="text-white-50">Gold to be claimed</p>
                    <button
                      className="link-light btn btn-link"
                      disabled={
                        element.nextAdventure?.getTime() >=
                          new Date().getTime() || element.tokenID === null
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        handleAdventure(element.tokenID);
                      }}
                    >
                      {element.nextAdventure?.getTime() >=
                      new Date().getTime() ? (
                        <p>
                          Next adventure in{" "}
                          {Math.floor(
                            Math.abs(
                              element.nextAdventure?.getTime() -
                                new Date().getTime()
                            ) /
                              1000 /
                              3600
                          ) % 24}{" "}
                          hours
                        </p>
                      ) : (
                        "Go to Adventure"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Heroes;
