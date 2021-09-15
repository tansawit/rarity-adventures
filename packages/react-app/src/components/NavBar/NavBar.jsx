import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../index";
import useWeb3Modal from "../../hooks/useWeb3Modal";

const NavBar = () => {
  const { provider, loadWeb3Modal, logoutOfWeb3Modal } = useWeb3Modal();

  return (
    <div className="container">
      <nav className="navbar navbar-light bg-gray justify-content-between">
        <div className="container-fluid">
          <Link to="/">
            <div className="navbar-brand">
              <span className="navbar-brand text-uppercase mb-0 h1 fw-bold text-white-50">
                Rarity
              </span>
            </div>
          </Link>
          <Link to="/goddesstower">
            <div className="navbar-brand">
              <img
                className="img-thumbnail bg-transparent border-0"
                src={require("../../media/goddess.png")}
                alt="goddess"
                width="60"
                height="60"
              />
              <span className="navbar-brand text-uppercase mb-0 h1 fw-bold text-white-50">
                The Goddess Tower
              </span>
            </div>
          </Link>
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
