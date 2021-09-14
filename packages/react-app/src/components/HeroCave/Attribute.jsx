import React, { useState } from "react";

const Attribute = ({ heroID }) => {
  const [stats, setStats] = useState({
    str: null,
    dex: null,
    con: null,
    int: null,
    wis: null,
    cha: null,
  });
  return (
    <div className="row attribute-section pt-5">
      <div className="col-sm-8">foo bar</div>
      <div className="col-sm-4 border rounded">
        <div className="outer px-3">
          <div className="row py-3">
            <h1 className="fw-bold text-center text-uppercase">Attributes</h1>
          </div>
          <div className="row bg-info rounded">
            <p className="col-sm fw-bold">Available Points</p>
            <p className="col-sm">0</p>
          </div>
          <div className="row">
            <p className="col-sm fw-bold">Strength</p>
            <p className="col-sm">Strength</p>
          </div>
          <div className="row">
            <p className="col-sm fw-bold">Dexterity</p>
            <p className="col-sm">Dexterity</p>
          </div>
          <div className="row">
            <p className="col-sm fw-bold">Consitution</p>
            <p className="col-sm">Consitution</p>
          </div>
          <div className="row">
            <p className="col-sm fw-bold">Intelligence</p>
            <p className="col-sm">Intelligence</p>
          </div>
          <div className="row">
            <p className="col-sm fw-bold">Wisdom</p>
            <p className="col-sm">Wisdom</p>
          </div>
          <div className="row">
            <p className="col-sm fw-bold">Charisma</p>
            <p className="col-sm">Charisma</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attribute;
