import React, { useState } from "react"

import { Web3Provider } from "@ethersproject/providers"

import { Body, Button, Header } from "./components"
import useWeb3Modal from "./hooks/useWeb3Modal"

import {
  readRarityData,
  embarkAdventure,
  levelUp,
  characterCreated,
  getClaimableGold,
  getGoldBalance,
  claimGold,
} from "./hooks/utils"

import CreateCharacter from "./components/CreateCharacter"
import UpdateAttributes from "./components/UpdateAttributes"
import Summon from "./components/Summon"

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal()
        } else {
          logoutOfWeb3Modal()
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  )
}

function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal()
  const [id, setID] = useState(0)
  const [xpRequired, setXPRequired] = useState("")
  const [goldBalance, setGoldBalance] = useState("")
  const [claimableGold, setClaimableGold] = useState("")
  const [created, setCreated] = useState(false)
  const [signer, setSigner] = useState({})
  const [data, setData] = useState(null)

  React.useEffect(() => {
    const defaultProvider = new Web3Provider(window.ethereum)
    const signer = defaultProvider.getSigner()
    setSigner(signer)
  }, [data])

  return (
    <div style={{ padding: "0 15px", backgroundColor: "#282c34" }}>
      <Header>
        <div>
          <img src="images/logo.png" />
        </div>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body style={{ padding: "60px 0" }}>
        <Summon signer={signer} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginRight: "10px" }}>
                <h5>Enter Summoner ID to View Stats: </h5>
                <input
                  id="summoner"
                  type="text"
                  name="text"
                  style={{ color: "#000" }}
                  onChange={(event) => {
                    const newVal = event.target.value
                    setID(newVal)
                  }}
                />
              </div>
              <Button
                disabled={(id === "") | (id === "0")}
                onClick={async () => {
                  const charCreated = await characterCreated(id, signer)
                  const data = await readRarityData(id, signer)
                  const claimable = await getClaimableGold(id, signer)
                  const balance = await getGoldBalance(id, signer)
                  setCreated(charCreated)
                  setGoldBalance(balance)
                  setClaimableGold(claimable)
                  setXPRequired(data["xpRequired"])
                  setData(data)
                }}
              >
                Submit
              </Button>
            </div>
            <div>
              {data && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
                  <h5 style={{ marginBottom: "20px" }}>Summoner Stats</h5>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p>Summoner ID: {id}</p>
                    <p>Class: {data.class}</p>
                    <p>Level: {data.level}</p>
                    <p>XP: {data.xp}</p>
                    <p>
                      Gold: {goldBalance} ({claimableGold} claimable){" "}
                      {claimableGold > 0 ? <button onClick={() => claimGold(id, signer)}>Claim</button> : <div />}
                    </p>
                    <p>
                      XP required to level up (to level {parseInt(data.level) + 1}) : {xpRequired}
                    </p>
                    <Button style={{ marginTop: "20px" }} onClick={() => embarkAdventure(id, signer)}>
                      Adventure
                    </Button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", marginTop: "20px", alignItems: "center" }}>
                    <h5 style={{ marginBottom: "20px" }}>Attributes</h5>
                    {created ? (
                      <UpdateAttributes id={id} signer={signer} />
                    ) : (
                      <CreateCharacter id={id} signer={signer} />
                    )}
                  </div>
                </div>
              )}
              {parseInt(xpRequired) === 0 ? <Button onClick={() => levelUp(id, signer)}>Level Up</Button> : <div />}
            </div>
          </div>
        </div>
      </Body>
    </div>
  )
}

export default App
