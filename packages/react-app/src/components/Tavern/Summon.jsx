/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "@project/contracts";
import { summon } from "../utils/Character";
import { CharacterContext } from "../Context/CharacterContext";

export default ({ signer }) => {
  const { setTokenID } = useContext(CharacterContext);
  const classes = [
    { id: 1, name: "Barbarian" },
    { id: 2, name: "Bard" },
    { id: 3, name: "Cleric" },
    { id: 4, name: "Druid" },
    { id: 5, name: "Fighter" },
    { id: 6, name: "Monk" },
    { id: 7, name: "Paladin" },
    { id: 8, name: "Ranger" },
    { id: 9, name: "Rogue" },
    { id: 10, name: "Sorcerer" },
    { id: 11, name: "Wizard" },
  ];
  const handleSummon = async (classID) => {
    const newHeroID = await summon(classID, signer);
    setTokenID((prevState) => [...prevState, newHeroID]);
  };
  return (
    <div className="recruit-modal container mx-auto">
      <div className="row">
        {classes.map((e, index) => {
          return (
            <div
              key={index}
              className="col-sm-3 my-3 position-relative"
              onClick={() => handleSummon(e.id)}
            >
              <img
                className="img-thumbnail"
                src={require(`../../media/recruit-icon/${e.name.toLowerCase()}.gif`)}
                // src={require(`../../media/recruit-icon/barbarian.gif`)}
                alt={e.name}
              />
              <p className="text-center">
                <a href="#" className="stretched-link text-center">
                  {e.name}
                </a>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
