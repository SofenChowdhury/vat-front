import React, { useState, useEffect } from "react";
import Router from "next/router";

// bootstarp
import { Button, CircularProgress, TextField } from "@mui/material";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//theme imports
import { tokens } from "../../pages/theme";
import { Typography, useTheme } from "@mui/material";

//icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const CreateUnit = ({ token }) => {
  // Variables for POST
  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");

  // THEME VARIABLES
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper variables
  const [loader, setLoader] = useState(false);

  const submit = (e) => {
    setLoader(true);
    const unitData = {
      name,
      remarks,
    };
    const apiUrl = BASE_URL + "api/v1/units/create";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(apiUrl, unitData, config)
      .then((response) => {
        if (response.data.status) {
          alert("Unit Created");
          Router.push({
            pathname: "/uom/unitList",
          });
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/uom/unitList",
    });
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <Button variant="contained" onClick={goBack} size="large">
                <ArrowLeftIcon /> Unit List
              </Button>
            </div>
          </div>
          <Typography
            variant="h2"
            className="mt-4"
            color={colors.greenAccent[300]}
          >
            Create Unit
          </Typography>

          <div className="row">
            <div className="col-md-4 mt-4">
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
          </div>
          <div className="row">
            <div className="col-md-4 mt-4">
              <TextField
                label="Remarks"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => setRemarks(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <Button variant="contained" color="success" onClick={submit} size="large">
                Create
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateUnit);
