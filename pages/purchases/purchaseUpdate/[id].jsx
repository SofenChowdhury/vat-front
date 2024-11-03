import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// bootstrap
import Form from "react-bootstrap/Form";

// Theme imports
import { tokens } from "../../theme";
import { Typography, useTheme, Button, CircularProgress } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";



const PurchaseUpdate = ({ query, token }) => {

  const [purchaseDetails, setPurchaseDetails] = useState({});
  const [loader, setLoader] = useState(true);
  const id = +query.id;

  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/purchases/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setPurchaseDetails(res.data.data)
          
        } else {
          setFormErrors(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(purchaseDetails);

  return <div>{query.id}</div>;
};

PurchaseUpdate.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(PurchaseUpdate);
