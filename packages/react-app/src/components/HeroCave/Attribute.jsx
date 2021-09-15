import React, { useState, useEffect, useCallback, useContext } from "react";
import useAttribute from "../../hooks/useAttribute";
// import { ContractContext } from "../Context/ContractContext";

const Attribute = ({ heroID }) => {
  const [stats, setStats] = useState({
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8,
  });
  const [tempStats, setTempStats] = useState({
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  });
  const [availableAP, setAvailableAP] = useState(0);

  const { getAbilityScores, calcAP, pointBuy } = useAttribute();
  const handlePlus = (stat) => {
    setTempStats((prevState) => ({
      ...prevState,
      [stat]: ++prevState[stat],
    }));
  };
  const handleMinus = (stat) => {
    setTempStats((prevState) => ({
      ...prevState,
      [stat]: --prevState[stat],
    }));
  };

  const fetchScores = useCallback(async () => {
    try {
      const scores = await getAbilityScores(heroID);
      const AP = await calcAP(heroID, 2);
      setStats(scores);
      setAvailableAP(AP);
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
      <div className="col-sm-8">foo bar</div>
      <div className="col-sm-4 border rounded">
        <div className="outer px-3 py-3">
          <div className="row py-3">
            <h1 className="fw-bold text-center text-uppercase">Attributes</h1>
          </div>
          <div className="row bg-primary bg-gradient rounded">
            <p className="col-sm fw-bold">Available Points</p>
            <p className="col-sm text-end">{availableAP}</p>
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
                      disabled={tempStats[e] === 0 ? true : false}
                    >
                      <i className="bi bi-dash-circle fs-5"></i>
                    </button>
                    <button
                      className="btn btn-outline-success col-sm btn-sm border-0"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePlus(e);
                      }}
                    >
                      <i className="bi bi-plus-circle fs-5"></i>
                    </button>
                  </div>
                  <p className="col-sm-3 text-end">{stats[e] + tempStats[e]}</p>
                </div>
              );
            })}
          </div>
          <div className="row attribute-note border-top border-light">
            <p className="fw-italic text-white-50 pt-2 text-center">
              {availableAP === 0
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
