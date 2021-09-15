import React from "react";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#282c34" }} className="pb-4">
      <div className="border-top footer-section pt-2">
        <p className="text-center text-muted">
          Made with{" "}
          <span role="img" aria-label="heart">
            💙
          </span>
          by{" "}
          <a
            href="https://twitter.com/GoldHawkEye189"
            target="_blank"
            rel="noreferrer noopener"
          >
            Hawk
          </a>{" "}
          - Credit to{" "}
          <a
            href="https://twitter.com/AndreCronjeTech"
            target="_blank"
            rel="noreferrer noopener"
          >
            Andre Cronje
          </a>{" "}
          for the Idea &{" "}
          <a
            href="https://www.artstation.com/mrmccoyed"
            target="_blank"
            rel="noreferrer noopener"
          >
            Evan Todd-McCoy
          </a>{" "}
          for Gifs
        </p>
        <p className="text-center text-white-50">
          Tip me here{" "}
          <a
            href="https://ftmscan.com/address/0x8951555e012D4A0BfCf7eFd3F9908D97a55E7F91"
            target="_blank"
            rel="noreferrer noopener"
          >
            0x8951555e012D4A0BfCf7eFd3F9908D97a55E7F91
          </a>{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
