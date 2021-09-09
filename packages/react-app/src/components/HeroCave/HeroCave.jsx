import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRouter } from "../../hooks/useRouter";
import Hero from "../Heroes/Hero";

const HeroCave = ({ embarkAdventure, signer }) => {
  //   const router = useRouter();
  const [heroID, setHeroID] = useState(485854);
  return (
    <div>
      <Hero
        tokenID={heroID}
        embarkAdventure={embarkAdventure}
        signer={signer}
      ></Hero>
    </div>
  );
};

export default HeroCave;
