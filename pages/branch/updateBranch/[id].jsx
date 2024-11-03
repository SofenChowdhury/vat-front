import React, { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
//redux imports
import { connect } from "react-redux";

//theme
import { tokens } from "../../theme";
import { TextField, Button, Typography, useTheme } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const updateBranch = ({ token, query }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setBranchName] = useState("");
  const [code, setBranchCode] = useState("");
  const [contact_address, setContactAddress] = useState("");
  const [order_prefix, setOrderPrefix] = useState("");
  const [contact_person, setContactPerson] = useState("");
  const [contact_email, setPersonEmail] = useState("");
  const [contact_mobile, setContactPhone] = useState("");
  const [formErrors, setFormErrors] = useState("");
  const [loader, setLoader] = useState(true);
  const id = query.id;

  //fetching branch details
  // Fetch Company Details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/branches/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setBranchName(res.data.data.name);
          setBranchCode(res.data.data.code);
          setOrderPrefix(res.data.data.order_prefix);
          setContactPerson(res.data.data.person);
          setPersonEmail(res.data.data.email);
          setContactPhone(res.data.data.phone);
          setContactAddress(res.data.data.address);
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();
    const apiBranch = BASE_URL + "api/v1/branches/update";
    const branch = {
      name,
      code,
      contact_address,
      order_prefix,
      contact_person,
      contact_email,
      contact_mobile,
      formErrors,
      id,
    };

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(branch);
    axios.post(apiBranch, branch, config).then((response) => {
      console.log(response.data);
      if (response.data.status) {
        alert("Branch Updated!");
        Router.push({
          pathname: "/branch/branchList",
        });
      } else {
        setFormErrors(Object.values(response.data.errors));
      }
    });
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/branch/branchList",
    });
  };

  return (
    <div className="mt-2">
      <div className="row">
        <div className="col-10">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Update Branch
          </Typography>
        </div>
        <div className="col-2 mt-1">
          <Link href="/branch/branchList" className="anchor">
            <Button variant="outlined" size="large"> Branch List</Button>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mt-4">
          <TextField
            label="Branch Name"
            variant="outlined"
            size="large"
            type="text"
            value={name}
            fullWidth
            onChange={(e) => setBranchName(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-4 mt-4">
          <TextField
            label="Branch Code"
            variant="outlined"
            size="large"
            type="email"
            value={code}
            fullWidth
            onChange={(e) => setBranchCode(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-4 mt-4">
          <TextField
            label="Order Prefix"
            variant="outlined"
            size="large"
            type="text"
            value={order_prefix}
            fullWidth
            onChange={(e) => setOrderPrefix(e.target.value)}
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
            value={contact_person}
            fullWidth
            onChange={(e) => setContactPerson(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-4 mt-4">
          <TextField
            label="Contact Email"
            variant="outlined"
            size="large"
            type="text"
            value={contact_email}
            fullWidth
            onChange={(e) => setPersonEmail(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-4 mt-4">
          <TextField
            label="Contact Phone"
            variant="outlined"
            size="large"
            type="text"
            value={contact_mobile}
            fullWidth
            onChange={(e) => setContactPhone(e.target.value)}
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
            value={contact_address}
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
          >
            Update
          </Button>
          <Button variant="contained" color="error" onClick={goBack} size="large">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
updateBranch.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(updateBranch);
