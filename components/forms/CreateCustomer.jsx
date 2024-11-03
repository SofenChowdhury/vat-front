import React, { useState, useEffect } from "react";
import Router from "next/router";

// bootstarp
import {
  Button,
  CircularProgress,
  useTheme,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../pages/theme";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

const CreateCustomer = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Variables for POST
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [shipping_address, setShippingAddress] = useState("");
  const [tin, setTin] = useState("");
  const [bin, setBin] = useState("");
  const [type, setType] = useState("");

  // Helper variables
  const [formErrors, setFormErrors] = useState("");
  const [loader, setLoader] = useState(false);

  const submit = (e) => {
    setLoader(true);
    const customerData = {
      name,
      email,
      phone,
      code,
      address,
      shipping_address,
      tin,
      bin,
      type,
    };
    const apiUrl = BASE_URL + "api/v1/customers/create";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(customerData);
    axios
      .post(apiUrl, customerData, config)
      .then((response) => {
        setLoader(false);
        if (response.data.status) {
          alert("Customer Created");
          Router.push({
            pathname: "/orders/createOrder",
          });
        } else {
          // setFormErrors(Object.values(response.data.errors));
          alert(response.data.message);
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
      pathname: "/customers/customerList",
    });
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Create Customer
          </Typography>
          <div className="mt-2">
            <h4 className="text-danger" style={{ fontWeight: 200 }}>
              {formErrors[0]}
            </h4>
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
              <div className="col-md-4 mt-4">
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
              <div className="col-md-4 mt-4">
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
              <div className="col-md-3 mt-4">
                <TextField
                  label="Code"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  onChange={(e) => setCode(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-3 mt-4">
                <TextField
                  label="TIN"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  onChange={(e) => setTin(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-3 mt-4">
                <TextField
                  label="BIN"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  onChange={(e) => setBin(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-3 mt-4">
                <TextField
                  onChange={(e) => setType(e.target.value)}
                  select
                  label="Type"
                  size="large"
                  fullWidth
                  className="shadow-input"
                >
                  <MenuItem value="Dealer">Dealer</MenuItem>
                  <MenuItem value="Corporate">Corporate</MenuItem>
                  <MenuItem value="Retail">Retail</MenuItem>
                </TextField>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-4">
                <TextField
                  label="Customer Address"
                  variant="outlined"
                  size="large"
                  fullWidth
                  multiline
                  rows={4}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-6 mt-4">
                <TextField
                  label="Shipping Address"
                  variant="outlined"
                  size="large"
                  fullWidth
                  multiline
                  rows={4}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                  }}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <Button
                  variant="contained"
                  color="success"
                  className="float-end"
                  onClick={submit}
                  size="large"
                >
                  Create
                </Button>
                <Button variant="contained" color="error" onClick={goBack} size="large">
                  Cancel
                </Button>
              </div>
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

export default connect(mapStateToProps)(CreateCustomer);
