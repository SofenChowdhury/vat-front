import React, { useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import { Button, TextField } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

const CreateVendor = ({ token }) => {
  const [name, setVendorName] = useState("");
  const [vendor_code, setVendorCode] = useState("");
  const [contact_address, setContactAddress] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [contact_person, setContactPerson] = useState("");
  const [contact_email, setContactEmail] = useState("");
  const [vendor_tin, setVendorTin] = useState("");
  const [vendor_bin, setVendorBin] = useState("");
  const [formErrors, setFormErrors] = useState("");

  const onSubmit = (e) => {
    const apiUrl = BASE_URL + "api/v1/vendors/create";
    const vendorData = {
      name,
      vendor_code,
      contact_address,
      contact_number,
      contact_person,
      contact_email,
      vendor_bin,
      vendor_tin,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(vendorData);
    axios.post(apiUrl, vendorData, config).then((response) => {
      console.log(response.data);
      if (response.data.status) {
        Router.push({
          pathname: "/vendors/vendorList",
        });
      } else {
        setFormErrors(Object.values(response.data.errors));
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
    <div className="mt-2">
      <div className="row">
        <div className="col-md-6 mt-4">
          <TextField
            label="Vendor Name"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
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
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateVendor);
