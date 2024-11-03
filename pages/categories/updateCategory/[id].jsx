import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import { TextField, Button, MenuItem } from "@mui/material";
import { tokens } from "../../theme";
import { Typography, useTheme } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const UpdateCategory = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const id = query.id;

  //Fetch Category Details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/categories/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setName(res.data.data.name);
          setStatus(res.data.data.status);
        } else {
          setFormErrors(res.data.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const onSubmit = () => {
    const category = {
      name,
      status,
      id,
    };
    const apiCategory = BASE_URL + "api/v1/categories/update";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(category);
    axios.post(apiCategory, category, config).then((response) => {
      if (response.data.status) {
        alert("Category Updated!");
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
      <Typography variant="h2" className="mb-3" color={colors.greenAccent[300]}>
        Update Category
      </Typography>
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
            value={name}
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
            value={status}
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
            Update
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

UpdateCategory.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UpdateCategory);
