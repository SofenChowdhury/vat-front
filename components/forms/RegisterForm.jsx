import React, { useState, useEffect } from "react";
import Router from "next/router";

//theme
import { TextField, MenuItem, Button } from "@mui/material";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

const RegisterForm = ({ token }) => {
  // Variables for POST
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company_id, setCompanyId] = useState(null);
  const [branch_id, setBranchId] = useState(null);
  const [admin_roles, setSelectedRole] = useState([]);

  // Helper Variables
  const [roles, setRoles] = useState([]);
  const [role_id, setRoleId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);

  // FETCH BRANCHES
  useEffect(() => {
    const apiBranches = BASE_URL + "api/v1/branches?company_id=" + company_id;

    if (company_id) {
      axios
        .get(apiBranches, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status) {
            setBranches(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [company_id]);

  // Fetch Roles
  useEffect(() => {
    const apiRoles = BASE_URL + "api/v1/roles";
    axios
      .get(apiRoles, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setRoles(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const rolesAdd = (e) => {
    setRoleId(e.target.value);
    setSelectedRole([]);
    setSelectedRole((admin_roles) => [...admin_roles, Number(e.target.value)]);
  };

  // Fetch Company
  useEffect(() => {
    const apiCompanies = BASE_URL + "api/v1/companies";
    axios
      .get(apiCompanies, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setCompanies(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function register(e) {
    e.preventDefault();
    const apiUrl = BASE_URL + "api/v1/admin/store";
    const regData = {
      email,
      password,
      name,
      phone,
      admin_roles,
      company_id,
      branch_id,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiUrl, regData, config).then((response) => {
      console.log(response.data);
      if (response.data.status) {
        Router.push({
          pathname: "/users/userList",
        });
      } else {
        console.log(response.data);
      }
    });
  }

  return (
    <div>
      <form>
        <div className="row">
          <div className="col-md-6 mt-4">
            <TextField
              label="Name"
              variant="outlined"
              size="large"
              type="text"
              fullWidth
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
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-input"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mt-4">
            <TextField
              label="Password"
              variant="outlined"
              size="large"
              type="password"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-input"
            />
          </div>
          <div className="col-md-6 mt-4">
            <TextField
              label="Phone"
              variant="outlined"
              size="large"
              type="text"
              fullWidth
              onChange={(e) => setPhone(e.target.value)}
              className="shadow-input"
            />
          </div>
        </div>
        <div className="row">
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
              {roles?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
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
              {companies?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name} ({option.company_bin})
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
        {branches.length != 0 && (
          <div className="row">
            <div className="col-md-6 mt-4">
              <TextField
                onChange={(e) => {
                  setBranchId(+e.target.value);
                }}
                select
                label="Branch"
                size="large"
                fullWidth
                value={branch_id || ""}
                className="shadow-input"
              >
                {branches?.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-md-12">
            <Button
              onClick={register}
              variant="contained"
              className="float-end mt-4"
              size="large"
            >
              Create User
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(RegisterForm);
