import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRouter } from "../../hooks/useRouter";
import Hero from "../Heroes/Hero";

const HeroCave = ({ embarkAdventure, signer }) => {
  //   const router = useRouter();
  const [heroID, setHeroID] = useState(485854);
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6 container">
          <div className="row">
            <Hero
              tokenID={heroID}
              embarkAdventure={embarkAdventure}
              signer={signer}
              animation={true}
            ></Hero>
          </div>
        </div>
        <div className="col-sm-6 container">
          <div className="row">
            <Hero
              tokenID={heroID}
              embarkAdventure={embarkAdventure}
              signer={signer}
            ></Hero>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCave;
