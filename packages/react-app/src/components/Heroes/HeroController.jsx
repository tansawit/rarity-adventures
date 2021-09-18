import React from "react";

const HeroController = ({
  updating,
  listAdventure,
  listGold,
  listLevel,
  handleApprove,
  handleAdventureAll,
  handleLevelUp,
  handleClaimGold,
  approval,
  handleGoCellar,
  listDungeon,
}) => {
  return (
    <div
      className="modal fade bg-transparent"
      tabIndex="-1"
      id="collapseController"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
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
            <div className="row">
              {/* adventure all div` */}
              <div className="adventure-all col-sm container justify-content-center border rounded mx-2">
                <div className="row">
                  {updating ? ( //loading button
                    <button
                      className="btn btn-secondary"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </button>
                  ) : listAdventure.available ? (
                    approval ? (
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
                      Adventure All
                    </button>
                  )}
                </div>
                <div className="row">
                  <img //adenture gif
                    className="img-thumbnail bg-transparent border-0"
                    src={require(`../../media/${
                      listAdventure.available ? "adventure" : "resting"
                    }.gif`)}
                    alt="adventure"
                  />
                </div>
              </div>
              {/*  level up all */}
              <div className="adventure-all col-sm container justify-content-center border rounded mx-2">
                <div className="row">
                  {updating ? ( //loading button
                    <button
                      className="btn btn-secondary"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </button>
                  ) : listLevel.available ? (
                    approval ? (
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={handleLevelUp}
                      >
                        Level Up All
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
                      title="Lvel Up All Summoners"
                    >
                      Level Up All
                    </button>
                  )}
                </div>
                <div className="row">
                  <img //adenture gif
                    className="img-thumbnail bg-transparent border-0"
                    src={require(`../../media/${
                      listLevel.available ? "levelup" : "notyet"
                    }.gif`)}
                    alt="adventure"
                  />
                </div>
              </div>
              {/* end level up all */}
              {/* end claim gold all */}
              <div className="adventure-all col-sm container justify-content-center border rounded mx-2">
                <div className="row">
                  {updating ? ( //loading button
                    <button
                      className="btn btn-secondary"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </button>
                  ) : listGold.available ? (
                    approval ? (
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={handleClaimGold}
                      >
                        Claim Gold All
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
                      title="Claim Gold All Summoners"
                    >
                      Claim Gold All
                    </button>
                  )}
                </div>
                <div className="row">
                  <img //adenture gif
                    className="img-thumbnail bg-transparent border-0"
                    src={require(`../../media/${
                      listGold.available ? "claimgold" : "nogold"
                    }.gif`)}
                    alt="claim-gold"
                  />
                </div>
              </div>
              {/* end claim gold all */}
              {/* go dungeon all */}
              <div className="adventure-all col-sm container justify-content-center border rounded mx-2">
                <div className="row">
                  {updating ? ( //loading button
                    <button
                      className="btn btn-secondary"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </button>
                  ) : listDungeon.available ? (
                    approval ? (
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={handleGoCellar}
                      >
                        Go Cellar All
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
                    <span
                      class="d-inline-block text-capitalize px-0"
                      tabindex="0"
                      data-bs-toggle="tooltip"
                      title="only added stats summoners can go to dungeon"
                    >
                      <button
                        className="btn btn-secondary d-grid col-12"
                        type="button"
                        disabled={true}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Go Cellar All Summoners"
                      >
                        Go Cellar All
                      </button>
                    </span>
                  )}
                </div>
                <div className="row">
                  <img //adenture gif
                    className="img-thumbnail bg-transparent border-0"
                    src={require(`../../media/${
                      listDungeon.available ? "godungeon" : "relaxing"
                    }.gif`)}
                    alt="go-dungeon"
                  />
                </div>
              </div>
              {/* end claim gold all */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroController;
