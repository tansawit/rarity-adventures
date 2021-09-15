import React from "react";
import Summon from "./Summon";

const Tavern = ({ signer }) => {
  return (
    <div className="tavern-section container py-3 border-top">
      <div className="row bg-gray py-4">
        <div className="container-fluid d-flex justify-content-between">
          {/* <p className="h1 text-uppercase fw-bold text-white">The tavern</p> */}
          <button
            className="btn btn-outline-light btn-lg border-warning"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#collapseTavern"
            aria-expanded="false"
            aria-controls="collapseTavern"
            style={{ position: "fixed", top: "50%", right: "7%" }}
          >
            <i className="bi bi-shop-window"></i>
          </button>
        </div>
        {/* tavern modal */}
        <div
          className="modal fade bg-transparent"
          tabIndex="-1"
          id="collapseTavern"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div
              className="modal-content"
              style={{ backgroundColor: "#282c34" }}
            >
              <div className="modal-header">
                <div className="container">
                  <div className="row">
                    <h5 className="modal-title text-white-50 text-center">
                      RECRUIT A HERO
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white "
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="row py-3">
                    <p className="text-center">
                      From a dark corner, you sit with your mug of ale and peer
                      across the room. Talent is lacking in this room tonight,
                      but you have to start somewhere...
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <Summon signer={signer}></Summon>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Summon signer={signer} /> */}
    </div>
  );
};

export default Tavern;
