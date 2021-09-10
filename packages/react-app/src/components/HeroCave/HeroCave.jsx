import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRouter } from "../../hooks/useRouter";
import Hero from "../Heroes/Hero";
import Attribute from "./Attribute";
import useRarity from "../../hooks/useRarity";

const HeroCave = ({ signer }) => {
  const router = useRouter();
  const { embarkAdventure } = useRarity();
  const [heroID, setHeroID] = useState(router.query.tokenID);
  return (
    <div className="container py-3">
      <p className="h1 text-uppercase fw-bold text-white py-3"> Hero Cave</p>
      <div className="row">
        <div className="col-sm-6 container">
          <Hero
            tokenID={heroID}
            embarkAdventure={embarkAdventure}
            signer={signer}
            animation={true}
          ></Hero>
        </div>
        <div className="col-sm-6 container">
          <Attribute></Attribute>
        </div>
      </div>
    </div>
  );
};

export default HeroCave;
