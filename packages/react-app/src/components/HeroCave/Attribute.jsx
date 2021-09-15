import React, { useState, useEffect, useCallback, useContext } from "react";
import useAttribute from "../../hooks/useAttribute";
import { calcAPCost } from "../constants";

// import { ContractContext } from "../Context/ContractContext";

const Attribute = ({ heroID }) => {
  const [stats, setStats] = useState({
    strength: -8,
    dexterity: -8,
    constitution: -8,
    intelligence: -8,
    wisdom: -8,
    charisma: -8,
  });
  const [tempStats, setTempStats] = useState({
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8,
  });
  const [availableAP, setAvailableAP] = useState(0);
  const [tempAP, setTempAP] = useState(0);
  const [update, setUpdate] = useState(false);
  const { getAbilityScores, calcAP, pointBuy } = useAttribute();

  const calcTempAP = (stat, add) => {
    //cos usestate work as asyn, we need this temp stats to work on AP cal
    let temp;
    if (add) {
      temp = { ...tempStats, [stat]: tempStats[stat] + 1 };
    } else {
      temp = { ...tempStats, [stat]: tempStats[stat] - 1 };
    }
    // const temp = { ...tempStats };
    let ap = availableAP;
    ap -= calcAPCost(temp["strength"]);
    ap -= calcAPCost(temp["dexterity"]);
    ap -= calcAPCost(temp["constitution"]);
    ap -= calcAPCost(temp["intelligence"]);
    ap -= calcAPCost(temp["wisdom"]);
    ap -= calcAPCost(temp["charisma"]);
    setTempAP(ap);
  };
  const calcTempAPWithState = (stat) => {
    const temp = { ...tempStats, [stat]: tempStats[stat] + 1 };
    let ap = availableAP;
    ap -= calcAPCost(temp["strength"]);
    ap -= calcAPCost(temp["dexterity"]);
    ap -= calcAPCost(temp["constitution"]);
    ap -= calcAPCost(temp["intelligence"]);
    ap -= calcAPCost(temp["wisdom"]);
    ap -= calcAPCost(temp["charisma"]);
    return ap;
  };
  const handlePlus = (stat) => {
    if (calcTempAPWithState(stat) >= 0) {
      setTempStats((prevState) => ({
        ...prevState,
        [stat]: tempStats[stat] + 1, //CANT USE ++ HERE, IT'S MUTUAL
      }));
      calcTempAP(stat, true);
    }
  };
  const handleMinus = (stat) => {
    if (stats[stat] <= tempStats[stat] - 1) {
      setTempStats((prevState) => ({
        ...prevState,
        [stat]: prevState[stat] - 1,
      }));
      calcTempAP(stat, false);
    }
  };
  const handleReset = (e) => {
    e.preventDefault();
    setTempAP(32);
    setTempStats(stats);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdate(true);
    if (tempAP === 0) {
      const response = await pointBuy(
        heroID,
        tempStats["strength"],
        tempStats["dexterity"],
        tempStats["constitution"],
        tempStats["intelligence"],
        tempStats["wisdom"],
        tempStats["charisma"]
      );
      if (response) {
        setStats(tempStats); //update current stats as temp stats
        setAvailableAP(0); //set AP = 0
      }
    }
    setUpdate(false);
  };

  const fetchScores = useCallback(async () => {
    try {
      const scores = await getAbilityScores(heroID);
      const AP = await calcAP(heroID, 2);
      setStats(scores);
      setTempStats(scores);
      setAvailableAP(AP);
      setTempAP(AP);
    } catch (e) {}
  }, [getAbilityScores, calcAP, heroID]);

  useEffect(() => {
    if (heroID) {
      fetchScores(heroID);
    }
    return () => {};
  }, [heroID, fetchScores]);

  return (
    <div className="row attribute-section pt-5">
      <div className="col-sm-8">
        <p className="text-white-50">
          Each character has six ability scores that represent his character's
          most basic attributes. They are his raw talent and prowess. While a
          character rarely rolls a check using just an ability score, these
          scores, and the modifiers they create, affect nearly every aspect of a
          character's skills and abilities.
        </p>
      </div>
      <div className="col-sm-4 border rounded">
        <div className="outer px-3 py-3">
          <div className="row py-3">
            <h1 className="fw-bold text-center text-uppercase">Attributes</h1>
          </div>
          <div className="row bg-primary bg-gradient rounded">
            <p className="col-sm fw-bold">Available Points</p>
            <p className="col-sm text-end">{tempAP}</p>
          </div>
          <div className="pt-3">
            {Object.keys(stats).map((e, index) => {
              return (
                <div className="row" key={index}>
                  <p className="col-sm-6 fw-bold text-capitalize">{e}</p>
                  <div className="col-sm-3 row">
                    <button
                      className="btn btn-outline-danger col-sm btn-sm border-0"
                      onClick={(event) => {
                        event.preventDefault();
                        handleMinus(e);
                      }}
                      disabled={tempStats[e] === stats[e] ? true : false}
                    >
                      <i className="bi bi-dash-circle fs-5"></i>
                    </button>
                    <button
                      className="btn btn-outline-success col-sm btn-sm border-0"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePlus(e);
                      }}
                      disabled={tempAP === 0 ? true : false}
                    >
                      <i className="bi bi-plus-circle fs-5"></i>
                    </button>
                  </div>
                  <p className="col-sm-3 text-end">{tempStats[e]}</p>
                </div>
              );
            })}
          </div>
          <div className="row attribute-note border-top border-light pt-2">
            {availableAP !== 0 ? (
              <div className="container btn-container d-flex justify-content-evenly">
                {update ? (
                  <button className="btn btn-secondary" type="button" disabled>
                    <span
                      className="spinner-border"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Loading...</span>
                  </button>
                ) : (
                  <button className="btn-primary btn-lg" onClick={handleReset}>
                    Reset
                  </button>
                )}
                {update ? (
                  <button className="btn btn-secondary" type="button" disabled>
                    <span
                      className="spinner-border"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Loading...</span>
                  </button>
                ) : (
                  <button className="btn-primary btn-lg" onClick={handleUpdate}>
                    Update
                  </button>
                )}
              </div>
            ) : (
              ""
            )}
            <p className="fw-italic text-white-50 pt-2 text-center">
              {tempAP === 0
                ? "A hero receives only 1 additional point every 4 levels so be careful with your build."
                : "You need to spend all 32 starting points to begin the raiding tower part"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attribute;
