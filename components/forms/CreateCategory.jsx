import React, { useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import { TextField, Button, MenuItem } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

const CreateCategory = ({ token }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");

  const onSubmit = () => {
    const category = {
      name,
      status,
    };
    const apiCategory = BASE_URL + "api/v1/categories/create";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(category);
    axios.post(apiCategory, category, config).then((response) => {
      if (response.data.status) {
        alert("Category Created!");
        Router.push({
          pathname: "/categories/categoryList",
        });
      } else {
        console.log(response.data);
      }
    });
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/categories/categoryList",
    });
  };

  return (
    <div className="mt-2">
      <div className="row">
        <div className="col-md-4 mt-4">
          <TextField
            label="Category Name"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setName(e.target.value)}
            className="shadow-input"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mt-4">
          <TextField
            onChange={(e) => setStatus(e.target.value)}
            select
            label="Type"
            size="large"
            fullWidth
            className="shadow-input"
            defaultValue={status}
          >
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Inactive</MenuItem>
          </TextField>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <Button
            variant="contained"
            color="success"
            className="float-end"
            onClick={onSubmit}
            size="large"
          >
            Create
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={goBack}
            className="float-end me-3"
            size="large"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateCategory);
