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
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Autocomplete,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const UserDetails = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // DATA FOR POST
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);
  const [company_id, setCompanyId] = useState(0);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [branch_id, setBranchId] = useState(null);
  const id = +query.id;

  // HELPER VARIABLES
  const [allRoles, setAllRoles] = useState([]);
  const [role_id, setRoleId] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [errors, setErrors] = useState("");
  const [loader, setLoader] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState({
    id: 0,
    name: "No Branch",
  });

  // FETCH ALL PERMISSIONS
  useEffect(() => {
    const apiPermissions = BASE_URL + "api/v1/permissions";
    axios
      .get(apiPermissions, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          res.data.data.map((permission) => {
            permission.selected = false;
          });

          res.data.data.map((permission) => {
            permissions.map((perm) => {
              if (perm == permission.id) {
                permission.selected = true;
              }
            });
          });

          setAllPermissions(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [permissions]);

  useEffect(() => {
    // FETCH USER DETAILS
    const apiUrl = BASE_URL + "api/v1/admins/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          console.log(res.data);
          setLoader(false);
          setName(res.data.data.name);
          setEmail(res.data.data.email);
          setPhone(res.data.data.phone);
          setCompanyId(res.data.data.company_id);
          setStatus(+res.data.data.status);
          setBranchId(+res.data.data.branch_id);
          if (res.data.data.branch != null) {
            setSelectedBranch(res.data.data.branch);
          }
          setRoles([]);
          setPermissions([]);

          res.data.data.roles?.map((role) => {
            setRoles((roles) => [...roles, role.id]);
            setRoleId(+role.id);
          });
          res.data.data.permissions?.map((permission) =>
            setPermissions((permissions) => [...permissions, permission.id])
          );
        } else {
          setErrors(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // FETCH ALL ROLES
    const apiRoles = BASE_URL + "api/v1/roles";
    axios
      .get(apiRoles, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setAllRoles(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // FETCH ALL COMPANIES
    const apiCompanies = BASE_URL + "api/v1/companies";
    axios
      .get(apiCompanies, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setAllCompanies(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const foundCompany = allCompanies.find(
      (company) => company.id === company_id
    );

    if (foundCompany) {
      setBranches(foundCompany.branches);
    }
  }, [company_id, allCompanies]);

  // SELECTED ROLES
  const rolesAdd = (e) => {
    setRoleId(+e.target.value);
    setRoles([]);
    setRoles((roles) => [...roles, +e.target.value]);
  };

  const handleBranch = (event, value) => {
    if (value) {
      setBranchId(value.id);
      setSelectedBranch(value);
    } else {
      setBranchId(null);
    }
  };

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

  // POST UPDATE DATA
  const update = () => {
    let temp = [];

    allPermissions.map((pm) => {
      if (pm.selected) {
        temp.push(pm.id);
      }
    });

    const updatedValues = {
      email,
      name,
      phone,
      roles,
      permissions: temp,
      id,
      status,
      company_id,
      branch_id,
    };
    const apiUpdate = BASE_URL + "api/v1/admins/update";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(updatedValues);
    axios.post(apiUpdate, updatedValues, config).then((response) => {
      if (response.data.status) {
        alert("Information Updated!");
        Router.push({
          pathname: "/users/userList",
        });
      } else {
        setErrors(Object.values(response.data.errors));
      }
    });
  };

  console.log(selectedBranch);

  return (
    <>
      {loader ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <>
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Update Details
          </Typography>

          <div className="row">
            <div className="col-md-6 mt-4">
              <TextField
                label="Name"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-6 mt-4">
              <TextField
                label="Email"
                variant="outlined"
                size="large"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-4">
              <TextField
                label="Phone"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-6 mt-4">
              <TextField
                onChange={(e) => {
                  setCompanyId(+e.target.value);
                }}
                select
                label="Company"
                size="large"
                fullWidth
                value={company_id || ""}
                className="shadow-input"
              >
                {allCompanies?.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {option.slug}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-4">
              <TextField
                onChange={(e) => setStatus(+e.target.value)}
                select
                label="Status"
                size="large"
                fullWidth
                value={status == 0 ? 0 : 1}
                className="shadow-input"
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </TextField>
            </div>
            <div className="col-md-6 mt-4">
              <TextField
                onChange={rolesAdd}
                select
                label="Role"
                size="large"
                fullWidth
                value={role_id || ""}
                className="shadow-input"
              >
                {allRoles?.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mt-4">
              <Autocomplete
                value={selectedBranch || ""}
                options={branches}
                getOptionLabel={(option) => option.name}
                onChange={handleBranch}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch"
                    className="shadow-input"
                  />
                )}
                size="large"
              />
            </div>
          </div>

          <div className="row mt-5">
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
                  <div className="row mt-1">
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
            Update User
          </button>
        </>
      )}
    </>
  );
};

UserDetails.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UserDetails);
