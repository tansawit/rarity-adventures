import React, { useState, useEffect } from "react";
import { pullHeroesData } from "../utils/Character";

const Hero = ({ tokenID, embarkAdventure, signer }) => {
  const [element, setElement] = useState();
  const handleAdventure = async () => {
    const response = await embarkAdventure(tokenID, signer);
    if (response.confirmations) {
      //got confirmed
      console.log("adventure", response);
      const today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      console.log("date", tomorrow);
      setElement({ ...element, nextAdventure: tomorrow });
    }
  };
  useEffect(() => {
    const getData = async () => {
      const response = await pullHeroesData(tokenID, signer);
      setElement(response);
    };
    getData();
  }, []);
  return (
    <div className="col-sm-4 my-3">
      <div className="row">
        <div className="col-sm-3">
          {element ? (
            <img
              className="img-thumbnail"
              src={require(`../../media/heroes-icon/${element.class?.toLowerCase()}.png`)}
              alt={element.class}
            />
          ) : (
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
        <div className="col-sm-9">
          {element ? (
            <div className="hero-container">
              <p>
                <span className="fw-bolder">{element.class} </span>
                <span className="fw-italic text-white-50">
                  Level {element.level}
                </span>
              </p>
              <p className="fw-bold text-white-50">
                {tokenID} | XP: {element.xp} ({element.xpRequired} remaining )
              </p>
              <p className="text-white-50">Gold to be claimed</p>
              <button
                className="link-light btn btn-link"
                disabled={
                  element.nextAdventure?.getTime() >= new Date().getTime() ||
                  tokenID === null
                }
                onClick={(e) => {
                  e.preventDefault();
                  handleAdventure();
                }}
              >
                {element.nextAdventure?.getTime() >= new Date().getTime() ? (
                  <p>
                    Next adventure in{" "}
                    {Math.floor(
                      Math.abs(
                        element.nextAdventure?.getTime() - new Date().getTime()
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
          ) : (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                role="progressbar"
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: "100%" }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
