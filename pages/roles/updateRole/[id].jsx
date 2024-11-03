import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import {
  Typography,
  useTheme,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// Icon imports
import PersonIcon from "@mui/icons-material/Person";
import Diversity3Icon from "@mui/icons-material/Diversity3";

const UpdateRole = ({ token, query }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // DATA FOR POST
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const id = +query.id;

  // HELPER VARIABLES
  const [allPermissions, setAllPermissions] = useState([]);
  const [loader, setLoader] = useState(true);
  const [errors, setErrors] = useState("");

  // FETCH ROLE DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/roles/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setName(res.data.data.name);
          setDescription(res.data.data.description);
          setPermissions(res.data.data.permissions);
        } else {
          setErrors(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // FETCH ALL PERMISSIONS
  useEffect(() => {
    const apiPermissions = BASE_URL + "api/v1/permissions";
    axios
      .get(apiPermissions, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          res.data.data.map((permission) => {
            permission.selected = false;
            permissions.map((perm) => {
              if (permission.id == perm.id) {
                permission.selected = true;
              }
            });
          });
          setAllPermissions(res.data.data);
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [permissions]);

  // HANDLE PERMISSIONS
  const handlePermissions = (e, id) => {
    const newState = allPermissions.map((perm) => {
      if (perm.id === id) {
        return { ...perm, selected: e.target.checked };
      }
      return perm;
    });
    setAllPermissions(newState);
  };

  // UPDATE ROLE
  const update = () => {
    setLoader(true);
    const selectedPermissions = allPermissions
      .filter((permission) => permission.selected)
      .map((permission) => permission.id);

    const updatedValues = {
      name,
      description,
      permissions: selectedPermissions,
      id,
    };
    const apiUpdate = BASE_URL + "api/v1/roles/update";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiUpdate, updatedValues, config).then((response) => {
      if (response.data.status) {
        alert("Information Updated!");
        Router.push({
          pathname: "/roles/roleList",
        });
      } else {
        setErrors(Object.values(response.data.errors));
      }
    });
  };

  // console.log(allPermissions);

  return (
    <>
      {errors.length ? (
        <>
          <h1 className="text-danger mt-2 mb-3" style={{ fontWeight: 200 }}>
            {errors}
          </h1>
        </>
      ) : loader ? (
        <CircularProgress />
      ) : (
        <>
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Update Role Details
          </Typography>

          <div className="row">
            <div className="col-md-4 mt-4">
              <TextField
                label="Name"
                variant="outlined"
                size="large"
                type="email"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mt-4">
              <TextField
                label="Description"
                variant="outlined"
                size="large"
                type="email"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>

          <div className="row mt-5 ms-1">
            <div className="col-md-12">
              <Typography variant="h4" color={colors.greenAccent[300]}>
                Permissions
              </Typography>
            </div>
          </div>

          {(() => {
            let pr = [];

            for (let i = 0; i < allPermissions.length; i += 3) {
              pr.push(
                <div key={i}>
                  <div className="row mt-1 ms-1">
                    <div className="col-md-4">
                      {allPermissions[i] && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={allPermissions[i]?.selected}
                              onChange={(e) =>
                                handlePermissions(e, allPermissions[i].id)
                              }
                            />
                          }
                          label={allPermissions[i]?.name}
                        />
                      )}
                    </div>
                    <div className="col-md-4">
                      {allPermissions[i + 1] && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={allPermissions[i + 1]?.selected}
                              onChange={(e) =>
                                handlePermissions(e, allPermissions[i + 1].id)
                              }
                            />
                          }
                          label={allPermissions[i + 1]?.name}
                        />
                      )}
                    </div>
                    <div className="col-md-4">
                      {allPermissions[i + 2] && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={allPermissions[i + 2]?.selected}
                              onChange={(e) =>
                                handlePermissions(e, allPermissions[i + 2].id)
                              }
                            />
                          }
                          label={allPermissions[i + 2]?.name}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return pr;
          })()}

          <button onClick={update} className="btn btn-success mb-3 mt-3">
            Update Role
          </button>
        </>
      )}
    </>
  );
};

UpdateRole.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UpdateRole);
