import React, { useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import { TextField, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

const CreateCompany = ({ token }) => {
  const [name, setCompanyName] = useState("");
  const [contact_email, setContactEmail] = useState("");
  const [contact_address, setContactAddress] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [contact_person, setContactPerson] = useState("");
  const [company_tin, setCompanyTin] = useState("");
  const [company_bin, setCompanyBin] = useState("");
  const [formErrors, setFormErrors] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const company = {
      name,
      contact_address,
      contact_number,
      contact_person,
      contact_email,
      company_bin,
      company_tin,
    };
    const apiCompany = BASE_URL + "api/v1/companies/create";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(company);
    axios.post(apiCompany, company, config).then((response) => {
      if (response.data.status) {
        alert("Company Information Created!");
        Router.push({
          pathname: "/",
        });
      } else {
        setFormErrors(Object.values(response.data.errors));
      }
    });
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/companies/companyList",
    });
  };

  return (
    <div className="mt-2">
      <div className="row">
        <div className="col-md-4 mt-4">
          <TextField
            label="Company Name"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setCompanyName(e.target.value)}
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
            onChange={(e) => setContactEmail(e.target.value)}
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
            label="TIN"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setCompanyTin(e.target.value)}
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
            onChange={(e) => setCompanyBin(e.target.value)}
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
      <div className="row mt-4">
        <div className="col-md-12">
          <Button
            variant="contained"
            color="success"
            className="float-end"
            onClick={onSubmit}
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
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateCompany);
