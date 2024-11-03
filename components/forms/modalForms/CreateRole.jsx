import React, { useState, useEffect } from "react";
import Router from "next/router";

//theme imports
import { tokens } from "../../../pages/theme";
import { Typography, useTheme } from "@mui/material";
import { Multiselect } from "multiselect-react-dropdown";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// Icons Import
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";

const CreateRole = ({ token }) => {
  // Theme Variables
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Variables for POST
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);

  // Helper Variables
  const [formErrors, setFormErrors] = useState("");
  const [allPermissions, setAllPermissions] = useState([]);

  // Loading Permissions
  useEffect(() => {
    const apiPermissions = BASE_URL + "api/v1/permissions";
    axios
      .get(apiPermissions, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setAllPermissions(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Functions for creating permissions array
  const permissionsAdd = (list, item) => {
    setPermissions((permissions) => [...permissions, item.id]);
  };
  const permissionsRemove = (list, item) => {
    setPermissions(permissions.filter((i) => i !== item.id));
  };

  // POST to server
  async function create(e) {
    e.preventDefault();
    const apiUrl = BASE_URL + "api/v1/roles/create";
    const roleData = { name, description, permissions };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiUrl, roleData, config).then((response) => {
      console.log(response.data);
      if (response.data.status) {
        alert("Role Succesfully Created");
        Router.push({
          pathname: "/",
        });
      } else {
        setFormErrors(Object.values(response.data.errors));
      }
    });
  }

  return (
    <div className="mt-2">
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Create Role Form
      </Typography>
      <h4 className="text-danger" style={{ fontWeight: 200 }}>
        {formErrors[0]}
      </h4>
      <form>
        {/* Role Name */}
        <div className="input-group mb-3 mt-2">
          <span className="input-group-text" id="basic-addon1">
            <WorkspacePremiumIcon />
          </span>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Role Name"
          />
        </div>

        {/* Role Details */}
        <div className="input-group mb-3 mt-2">
          <span className="input-group-text" id="basic-addon1">
            <DisplaySettingsIcon />
          </span>
          <input
            type="text"
            className="form-control"
            id="description"
            required
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Role Details"
          />
        </div>

        {/* Multiselect Menu */}
        <div className="input-group mb-3 mt-2">
          <span className="input-group-text">
            <Diversity3Icon />
          </span>
          <span className="form-control">
            <Multiselect
              placeholder="Select Permissions ▼"
              cursor="pointer"
              displayValue="name"
              onRemove={permissionsRemove}
              onSelect={permissionsAdd}
              options={allPermissions}
              showCheckbox
            />
          </span>
        </div>

        <button onClick={create} className="btn btn-success mb-3">
          Create Role
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateRole);
