import React from "react";

const HeroController = ({
  updatingAdv,
  updatingGold,
  updatingLevel,
  listAdventure,
  listGold,
  listLevel,
  handleApprove,
  handleAdventureAll,
}) => {
  return (
    <div
      className="modal fade bg-transparent"
      tabIndex="-1"
      id="collapseController"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered ">
        <div className="modal-content" style={{ backgroundColor: "#282c34" }}>
          <div className="modal-header">
            <div className="container">
              <div className="row">
                <h5 className="modal-title text-white-50 text-center">
                  Hero Controller
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
                  All summoners are under your service, grand master.
                </p>
              </div>
            </div>
          </div>
          <div className="modal-body">
            {updatingAdv ? ( //loading button
              <button className="btn btn-secondary" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
            ) : listAdventure.available ? (
              listAdventure.approved ? (
                <button
                  className="btn btn-success"
                  type="button"
                  onClick={handleAdventureAll}
                >
                  Adventure All
                </button>
              ) : (
                <button
                  className="btn btn-warning"
                  type="button"
                  onClick={handleApprove}
                >
                  Approve
                </button>
              )
            ) : (
              <button
                className="btn btn-secondary"
                type="button"
                disabled={true}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Adventure All Summoners"
              >
                No summoner available
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroController;
