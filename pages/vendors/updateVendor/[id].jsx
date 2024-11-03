import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import {
  Button,
  Typography,
  useTheme,
  TextField,
  CircularProgress,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const UpdateVendor = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setVendorName] = useState("");
  const [vendor_code, setVendorCode] = useState("");
  const [contact_address, setContactAddress] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [contact_person, setContactPerson] = useState("");
  const [contact_email, setContactEmail] = useState("");
  const [vendor_tin, setVendorTin] = useState("");
  const [vendor_bin, setVendorBin] = useState("");
  const id = +query.id;

  const [loader, setLoader] = useState(true);

  // FETCH VENDOR DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/vendors/" + id;
    console.log(apiUrl);
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setVendorCode(res.data.data.vendor_code);
          setVendorName(res.data.data.name);
          setContactAddress(res.data.data.contact_address);
          setContactPerson(res.data.data.contact_person);
          setContactEmail(res.data.data.contact_email);
          setContactNumber(res.data.data.contact_number);
          setVendorTin(res.data.data.vendor_tin);
          setVendorBin(res.data.data.vendor_bin);

          console.log(res.data.data);
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = (e) => {
    const apiVendor = BASE_URL + "api/v1/vendors/update";
    const vendorData = {
      name,
      vendor_code,
      contact_address,
      contact_number,
      contact_person,
      contact_email,
      vendor_bin,
      vendor_tin,
      id,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiVendor, vendorData, config).then((response) => {
      if (response.data.status) {
        alert("Vendor Updated");
        Router.push({
          pathname: "/vendors/vendorList",
        });
      } else {
        console.log(response.data);
      }
    });
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/vendors/vendorList",
    });
  };

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
            Update Details of Vendor {id}
          </Typography>
          <div className="mt-2">
            <div className="row">
              <div className="col-md-6 mt-4">
                <TextField
                  label="Vendor Name"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-6 mt-4">
                <TextField
                  label="Vendor Code"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={vendor_code}
                  onChange={(e) => setVendorCode(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mt-4">
                <TextField
                  label="Contact Person"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={contact_person}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-4">
                <TextField
                  label="Contact Number"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={contact_number}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-4">
                <TextField
                  label="Contact Email"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={contact_email}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mt-4">
                <TextField
                  label="Address"
                  variant="outlined"
                  size="large"
                  fullWidth
                  multiline
                  rows={4}
                  value={contact_address}
                  onChange={(e) => {
                    setContactAddress(e.target.value);
                  }}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-4">
                <TextField
                  label="Vendor BIN"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={vendor_bin}
                  onChange={(e) => setVendorBin(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-6 mt-4">
                <TextField
                  label="Vendor TIN"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={vendor_tin}
                  onChange={(e) => setVendorTin(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <Button onClick={goBack} variant="contained" color="error" size="large">
                  Cancel
                </Button>
                <Button
                  onClick={onSubmit}
                  variant="contained"
                  color="success"
                  className="float-end"
                  size="large"
                >
                  Create Vendor
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

UpdateVendor.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UpdateVendor);
