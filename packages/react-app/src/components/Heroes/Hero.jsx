import React, { useState, useEffect, useContext } from "react";
import useRarity from "../../hooks/useRarity";
import useGold from "../../hooks/useGold";
import { Link } from "react-router-dom";

// import { CharacterContext } from "../Context/CharacterContext";
// import { ContractContext } from "../Context/ContractContext";

const Hero = ({ tokenID, signer, animation }) => {
  const [element, setElement] = useState({
    tokenID: null,
    class: null,
    level: null,
    xp: null,
    xpRequired: null,
    nextAdventure: null,
  });
  const [gold, setGold] = useState({ goldBalance: null, goldClaimable: null });
  //all functions related to rarity address
  const { embarkAdventure, pullHeroesData, levelUp, checkXpRequired } =
    useRarity();
  //all functions related to gold address
  const { getClaimableGold, getGoldBalance, claimGold } = useGold();

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
  const handleLevelUp = async (e) => {
    e.preventDefault();
    try {
      const response = await levelUp(element.tokenID, signer);
      const newXpRequired = await checkXpRequired(parseInt(element.level) + 1);
      if (response) {
        setElement((prevState) => ({
          ...prevState,
          level: parseInt(prevState.level) + 1,
          xp: 0,
          xpRequired: newXpRequired,
        }));
      }
      const goldClaimable = await getClaimableGold(tokenID.id || tokenID);
      setGold((prevState) => ({
        ...prevState,
        goldClaimable: parseFloat(goldClaimable),
      }));
    } catch (e) {
      console.log("level up error", e);
    }
  };
  const handleClaim = async (e) => {
    e.preventDefault();
    const response = await claimGold(tokenID.id || tokenID);
    if (response) {
      const goldBalance = await getGoldBalance(tokenID.id || tokenID);
      setGold((prevState) => ({
        ...prevState,
        goldBalance: goldBalance,
        goldClaimable: 0,
      }));
    }
  };

  useEffect(() => {
    const fetHeroData = async () => {
      try {
        const heroData = await pullHeroesData(tokenID.id || tokenID, signer);
        setElement(heroData);
      } catch (e) {
        // console.log("fetch hero data error", e);
      }
    };
    const fetchGold = async () => {
      try {
        const goldBalance = await getGoldBalance(tokenID.id || tokenID);
        const goldClaimable = await getClaimableGold(tokenID.id || tokenID);
        setGold((prevState) => ({
          ...prevState,
          goldBalance: parseFloat(goldBalance),
          goldClaimable: parseFloat(goldClaimable),
        }));
      } catch (e) {
        // console.log("fetch gold data error", e);
      }
    };
    if (tokenID && signer) {
      fetHeroData();
      fetchGold();
    }
    return () => {};
  }, [tokenID, signer]);

  return (
    <div className="row">
      <div className="col-sm-3">
        <Link className="link-primary" to={`/herocave/${element?.tokenID}`}>
          {element?.class ? (
            <img //gif version if in hero cave
              className="img-thumbnail bg-transparent"
              src={require(`../../media/${
                animation ? "recruit" : "heroes"
              }-icon/${element?.class?.toLowerCase()}.${
                animation ? "gif" : "png"
              }`)}
              alt={element.class}
            />
          ) : (
            //avatar if in main page
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </Link>
      </div>
      <div className="col-sm-9">
        {element?.tokenID ? (
          <div className="hero-container">
            <p>
              <span className="fw-bolder">{element.class} </span>
              <span className="fw-italic text-white-50">
                Level {element.level}
              </span>
            </p>
            <p className="fw-bold text-white-50">
              {element.tokenID} | XP: {element.xp}{" "}
              {element.xpRequired === "0" ? (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleLevelUp}
                  type="button"
                >
                  Level Up
                </button>
              ) : (
                `(${element.xpRequired} remaining)`
              )}
            </p>
            <div className="gold-section row">
              <p className="text-white-50 col-sm-8">
                Gold Balance: {gold.goldBalance}
              </p>
              {gold.goldClaimable ? (
                <button
                  className="btn btn-light col-sm-4 btn-sm"
                  onClick={handleClaim}
                  type="button"
                >
                  Claim Gold
                </button>
              ) : (
                ""
              )}
            </div>
            <button
              className="link-light btn btn-link"
              disabled={
                element.nextAdventure?.getTime() >= new Date().getTime()
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
