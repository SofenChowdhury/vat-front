import React, { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// bootstarp
import Form from "react-bootstrap/Form";

// Theme imports
import { tokens } from "../../theme";
import {
  CircularProgress,
  Typography,
  useTheme,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// Icon imports
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const UpdateUnit = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");

  const id = +query.id;

  const [formErrors, setFormErrors] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loader, setLoader] = useState(true);

  // STATIC
  const types = [
    {
      name: "Dealer",
    },
    {
      name: "Corporate",
    },
    {
      name: "Retail",
    },
  ];

  // FETCH UNIT DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/units/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setLoader(false);
        if (res.data.status == true) {
          setName(res.data.data.name);
          setRemarks(res.data.data.remarks);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = (e) => {
    setLoader(true);
    const apiUnit = BASE_URL + "api/v1/units/update";
    const unitData = {
      name,
      remarks,
      id,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiUnit, unitData, config).then((response) => {
      if (response.data.status) {
        Router.push({
          pathname: "/uom/unitList",
        });
      } else {
        console.log(response.data);
      }
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
            Update Unit
          </Typography>
          <div className="mt-2">
            <h4 className="text-danger" style={{ fontWeight: 200 }}>
              {formErrors}
            </h4>
            <div className="row">
              <div className="col-md-4 mt-4">
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
            </div>
            <div className="row">
              <div className="col-md-4 mt-4">
                <TextField
                  label="Remarks"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <Button variant="contained" color="success" onClick={onSubmit} size="large">
                  Update
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

UpdateUnit.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UpdateUnit);
