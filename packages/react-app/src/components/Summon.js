import React from "react"
import styled from "styled-components"
import { classes } from "../constants/classes.js"
import { summon } from "../hooks/utils"

const ClassContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  max-width: 1300px;
  justify-content: center;
  border: 5px solid #fff;
  padding: 20px;
  margin: 40px auto;
`

const ClassBox = styled.div`
  padding: 10px;
  margin: 15px;
  cursor: pointer;
  transition: 0.3s;
  text-align: center;
  &:hover,
  &:active,
  &:focus {
    opacity: 0.8;
  }
`

export default ({ signer }) => {
  return (
    <>
      <img src="images/GrandWizard.png" style={{ maxWidth: "250px", margin: "0 auto", display: "block" }} />
      <h2 style={{ textTransform: "uppercase", textAlign: "center" }}>Mint your class</h2>
      <ClassContainer>
        {classes.map(({ id, name }) => {
          return (
            <ClassBox
              key={id}
              onClick={async () => {
                await summon(id, signer)
              }}
            >
              <img src={`/images/${name}.png`} style={{ width: "100%", maxWidth: "150px" }} />
              <h5 style={{ color: "#fff" }}>{name}</h5>
            </ClassBox>
          )
        })}
      </ClassContainer>
    </>
  )
}
