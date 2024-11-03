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
import MapIcon from "@mui/icons-material/Map";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import NumbersOutlined from "@mui/icons-material/NumbersOutlined";
import Diversity3Icon from "@mui/icons-material/Diversity3";

const UpdateCustomer = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [shipping_address, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tin, setTin] = useState("");
  const [bin, setBin] = useState("");
  const [type, setType] = useState("");
  const [company_id, setCompanyId] = useState(0);
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

  // FETCH CUSTOMER DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/customers/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setLoader(false);
        if (res.data.status == true) {
          setCode(res.data.data.code);
          setName(res.data.data.name);
          setAddress(res.data.data.address);
          setShippingAddress(res.data.data.shipping_address);
          setPhone(res.data.data.phone);
          setEmail(res.data.data.email);
          setTin(res.data.data.tin);
          setBin(res.data.data.bin);
          setType(res.data.data.type);
          setCompanyId(res.data.data.company_id);
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // FETCH COMPANIES
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

  const onSubmit = (e) => {
    setLoader(true);
    const apiCustomer = BASE_URL + "api/v1/customers/update";
    const customerData = {
      name,
      code,
      address,
      shipping_address,
      phone,
      email,
      bin,
      tin,
      company_id,
      type,
      id,
    };
    console.log(customerData);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiCustomer, customerData, config).then((response) => {
      if (response.data.status) {
        Router.push({
          pathname: "/customers/customerList",
        });
      } else {
        console.log(response.data);
        setFormErrors(Object.values(response.data.errors));
      }
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
            Update Details of Customer
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
              <div className="col-md-4 mt-4">
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
              <div className="col-md-4 mt-4">
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
            </div>
            <div className="row">
              <div className="col-md-4 mt-4">
                <TextField
                  label="Code"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-4">
                <TextField
                  label="TIN"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-4">
                <TextField
                  label="BIN"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={bin}
                  onChange={(e) => setBin(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-4">
                <TextField
                  label="Address"
                  variant="outlined"
                  size="large"
                  fullWidth
                  multiline
                  rows={4}
                  value={address}
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
                  value={shipping_address}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                  }}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-4">
                <TextField
                  onChange={(e) => setCompanyId(+e.target.value)}
                  select
                  label="Company"
                  size="large"
                  fullWidth
                  value={company_id}
                  className="shadow-input"
                >
                  {companies?.map((option, index) => (
                    <MenuItem key={index} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="col-md-6 mt-4">
                <TextField
                  onChange={(e) => setType(e.target.value)}
                  select
                  label="Type"
                  size="large"
                  fullWidth
                  value={type}
                  className="shadow-input"
                >
                  <MenuItem value="Dealer">Dealer</MenuItem>
                  <MenuItem value="Corporate">Corporate</MenuItem>
                  <MenuItem value="Retail">Retail</MenuItem>
                </TextField>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <Button
                  variant="contained"
                  size="large"
                  color="success"
                  className="float-end"
                  onClick={onSubmit}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  color="error"
                  onClick={goBack}
                >
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

UpdateCustomer.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UpdateCustomer);
