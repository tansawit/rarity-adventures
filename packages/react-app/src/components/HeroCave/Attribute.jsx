import React, { useState } from "react";

const Attribute = () => {
  const [stats, setStats] = useState({
    str: null,
    dex: null,
    con: null,
    int: null,
    wis: null,
    cha: null,
  });
  return <div className="row attribute-section"></div>;
};

export default Attribute;
