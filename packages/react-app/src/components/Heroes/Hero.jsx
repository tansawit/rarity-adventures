import React, { useState, useEffect, useContext } from "react";
import { pullHeroesData } from "../utils/Character";
import { Link } from "react-router-dom";

// import { CharacterContext } from "../Context/CharacterContext";
// import { ContractContext } from "../Context/ContractContext";

const Hero = ({ tokenID, embarkAdventure, signer, animation }) => {
  const [element, setElement] = useState();
  // const { heroes, setHeroes } = useContext(CharacterContext);
  const handleAdventure = async () => {
    // need to use tokenID.id || tokenID in case we use adv all and push for a re-render
    const response = await embarkAdventure(tokenID.id || tokenID, signer);
    if (response.confirmations) {
      //got confirmed
      const today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      setElement({ ...element, nextAdventure: tomorrow });
    }
  };
  useEffect(() => {
    const getData = async () => {
      const response = await pullHeroesData(tokenID.id || tokenID, signer);
      setElement(response);
    };
    if (tokenID && signer) {
      getData();
    }
  }, [tokenID, signer]);
  return (
    <div className="row">
      <div className="col-sm-3">
        <Link
          className="link-primary"
          to={`/herocave/${tokenID.id || tokenID}`}
        >
          {element?.class ? (
            <img //gif version if in hero cave
              className="img-thumbnail"
              src={require(`../../media/${
                animation ? "recruit" : "heroes"
              }-icon/${element.class?.toLowerCase()}.${
                animation ? "gif" : "png"
              }`)}
              alt={element.class}
            />
          ) : (
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </Link>
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
              {element.tokenID} | XP: {element.xp} ({element.xpRequired}{" "}
              remaining )
            </p>
            <p className="text-white-50">Gold to be claimed</p>
            <button
              className="link-light btn btn-link"
              disabled={
                element.nextAdventure?.getTime() >= new Date().getTime() ||
                tokenID.id ||
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
  );
};

export default Hero;
