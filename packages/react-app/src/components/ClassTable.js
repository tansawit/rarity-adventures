import React from "react";

export default () => {
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
  const tableRows = classes.map(row=>{
    return <tr><td>{row.id}</td><td>{row.name}</td></tr>
  })
  return (
    <table>
      <tr>
        <th>ID</th>
        <th>Class</th>
      </tr>
      {tableRows}
    </table>
  );
};
