import React from "react";
import { Button } from "../index";
import useWeb3Modal from "../../hooks/useWeb3Modal";

const NavBar = () => {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <div className="container">
      <nav className="navbar navbar-light bg-gray justify-between">
        <div className="container-fluid">
          <span className="navbar-brand text-uppercase mb-0 h1 fw-bold text-white-50">
            Rarity
          </span>
          <Button
            className="btn btn-primary"
            onClick={() => {
              if (!provider) {
                loadWeb3Modal();
              } else {
                logoutOfWeb3Modal();
              }
            }}
          >
            {!provider ? "Connect Wallet" : "Disconnect Wallet"}
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
