//react
import React, { useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button, CircularProgress } from "@mui/material";

// Icon import
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";

const VatSettings_4_3 = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [serial, setSerial] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [head, setHead] = useState("");
  const [status, setStatus] = useState(1);

  const [id, setId] = useState(0);
  const [particulars, setParticulars] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [loader, setLoader] = useState(false);

  //FETCH PARTICULARS
  useEffect(() => {
    const apiParticular = BASE_URL + "api/v1/value-additions";

    axios
      .get(apiParticular, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setParticulars(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //CREATE SETTING
  const submit = () => {
    if (serial == 0) {
      alert("Please enter a Serial!");
    } else if (head == "") {
      alert("Please enter a Header!");
    } else if (percentage == 0) {
      alert("Please enter a Percentage!");
    } else {
      const particularsData = {
        serial,
        head,
        percentage,
        status,
      };
      const apiParticulars = BASE_URL + "api/v1/value-additions/create";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(apiParticulars, particularsData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Particulars Settings Added");
            Router.reload(window.location.pathname);
            console.log(response.data);
          } else {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //UPDATE SETTING
  const update = () => {
    if (serial == 0) {
      alert("Please enter a Serial!");
    } else if (head == "") {
      alert("Please enter a Header!");
    } else if (percentage == 0) {
      alert("Please enter a Percentage!");
    } else {
      const particularsData = {
        serial,
        head,
        percentage,
        status,
        id,
      };
      const apiParticulars = BASE_URL + "api/v1/value-additions/update";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log(particularsData, apiParticulars);
      axios
        .post(apiParticulars, particularsData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Particulars Settings Updated");
            console.log(response.data);
            Router.reload(window.location.pathname);
          } else {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const updateSetting = (e, id) => {
    setUpdating(true);
    setLoader(true);
    const apiUrl = BASE_URL + "api/v1/value-additions/" + id;

    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setHead(res.data.data.head);
          setPercentage(+res.data.data.percentage);
          setStatus(res.data.data.status);
          setSerial(res.data.data.serial);
          setId(res.data.data.id);
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //DELETE SETTING
  const deleteSetting = (e, id, head) => {
    let confirm = window.confirm(`Delete ${head} ?`);
    if (confirm) {
      const particularData = { id };
      const apiDelete = BASE_URL + "api/v1/value-additions/delete";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.post(apiDelete, particularData, config).then((response) => {
        if (response.data.status) {
          alert(`Deleted Settings for ${head}`);
          Router.reload(window.location.pathname);
        } else {
          console.log(response.data);
        }
      });
    }
  };

  const cancel = () => {
    setStatus(1);
    setHead("");
    setSerial(0);
    setPercentage(0);
    setUpdating(false);
  };

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        VAT Settings 4.3
      </Typography>
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="row">
            <Typography
              variant="h4"
              className="mt-2 mb-2"
              color={colors.primary[300]}
            >
              Value Addition Particulars List
              <hr />
            </Typography>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-stripped">
              <thead>
                <tr className="table-success">
                  <th>Sl No#</th>
                  <th>Header Name</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {particulars.map((particular, index) => (
                  <>
                    <tr>
                      <td>{particular.serial}</td>
                      <td>{particular.head}</td>
                      <td>{particular.percentage} %</td>
                      {particular.status ? <td>Active</td> : <td>Inactive</td>}
                      <td>
                        <button
                          className="btn btn-light btn-sm me-1"
                          onClick={(e) => {
                            updateSetting(e, particular.id);
                          }}
                        >
                          <EditIcon cursor="pointer" />
                        </button>
                        <button
                          className="btn btn-light btn-sm text-danger"
                          onClick={(e) => {
                            deleteSetting(e, particular.id, particular.head);
                          }}
                        >
                          <DeleteIcon cursor="pointer" />
                        </button>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          {loader ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <>
              <div className="row">
                {updating ? (
                  <Typography
                    variant="h4"
                    className="mt-2 mb-2"
                    color={colors.primary[300]}
                  >
                    Update Value Addition Particular
                    <hr />
                  </Typography>
                ) : (
                  <Typography
                    variant="h4"
                    className="mt-2 mb-2"
                    color={colors.primary[300]}
                  >
                    New Value Addition Particular
                    <hr />
                  </Typography>
                )}
                <div className="row">
                  <div className="col-md-4">
                    <Typography
                      variant="h5"
                      className="mb-2"
                      color={colors.primary[300]}
                    >
                      Serial No#
                    </Typography>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Serial"
                      value={serial}
                      onChange={(e) => {
                        setSerial(+e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <Typography
                      variant="h5"
                      className="mb-2"
                      color={colors.primary[300]}
                    >
                      Header Name
                    </Typography>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Header"
                      value={head}
                      onChange={(e) => {
                        setHead(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-4">
                    <div className="row">
                      <Typography
                        variant="h5"
                        className="mb-2"
                        color={colors.primary[300]}
                      >
                        Percentage
                      </Typography>
                    </div>
                    <div className="row">
                      <div className="col-md-10">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="%"
                          value={percentage}
                          onChange={(e) => {
                            setPercentage(+e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-md-2 mt-1" style={{ fontSize: "22px" }}>%</div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <Typography
                      variant="h5"
                      className="mb-2"
                      color={colors.primary[300]}
                    >
                      Status
                    </Typography>
                    <select
                      className="form-control"
                      onChange={(e) => {
                        setStatus(+e.target.value);
                      }}
                      value={status}
                    >
                      <option value={0}>Inactive</option>
                      <option value={1}>Active</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  {updating ? (
                    <>
                      <Button
                        onClick={update}
                        className="float-end mt-2 me-4"
                        variant="contained"
                        color="success"
                        size="large"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={cancel}
                        className="float-end me-3 mt-2"
                        variant="contained"
                        color="error"
                        size="large"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={submit}
                      className="float-end mt-2 me-4"
                      variant="contained"
                      color="success"
                      size="large"
                    >
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(VatSettings_4_3);
