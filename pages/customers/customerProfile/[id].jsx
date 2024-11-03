import React, { useState, useEffect } from "react";

//theme
import { tokens } from "../../theme";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";

const CustomerProfile = ({ token, query }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper Variables
  const [customerDetails, setCustomerDetails] = useState(null);
  const [value, setValue] = useState("one");
  const [loader, setLoader] = useState(true);
  const id = query.id;

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
          setCustomerDetails(res.data.data);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <Typography
            variant="h2"
            className="mb-5"
            color={colors.greenAccent[300]}
          >
            Customer Profile
          </Typography>
          <Typography
            variant="h4"
            className="ms-2"
            color={colors.greenAccent[300]}
          >
            {customerDetails?.name}
          </Typography>
          <Typography
            variant="h5"
            className="mt-3 ms-2"
            color={colors.greenAccent[300]}
          >
            <LocationOnIcon />
            {customerDetails?.address}
          </Typography>

          <Box sx={{ width: "100%" }} className="mt-4">
            <Tabs value={value} onChange={handleChange}>
              <Tab value="one" label="About" />
              <Tab value="two" label="Orders" />
            </Tabs>
          </Box>
          {value === "one" && (
            <>
              <h6 className="text-secondary mt-4">Contact Information</h6>
              <div className="row">
                <div className="col-md-1 mt-4">
                  <b>Phone:</b>
                </div>
                <div className="col-md-5 mt-4">{customerDetails?.phone}</div>
              </div>
              <div className="row">
                <div className="col-md-1 mt-4">
                  <b>Email:</b>
                </div>
                <div className="col-md-5 mt-4">{customerDetails?.email}</div>
              </div>
              <div className="row">
                <div className="col-md-1 mt-4">
                  <b>Shipping Address:</b>
                </div>
                <div className="col-md-5 mt-4">
                  {customerDetails?.shipping_address}
                </div>
              </div>
              <h6 className="text-secondary mt-5">Basic Information</h6>
              <div className="row">
                <div className="col-md-1 mt-4">
                  <b>NID:</b>
                </div>
                <div className="col-md-6 mt-4">{customerDetails?.nid}</div>
              </div>
              <div className="row">
                <div className="col-md-1 mt-4">
                  <b>BIN:</b>
                </div>
                <div className="col-md-6 mt-4">{customerDetails?.bin}</div>
              </div>
              <div className="row">
                <div className="col-md-1 mt-4">
                  <b>TIN:</b>
                </div>
                <div className="col-md-6 mt-4">{customerDetails?.tin}</div>
              </div>
              <div className="row">
                <div className="col-md-1 mt-4">
                  <b>Type:</b>
                </div>
                <div className="col-md-6 mt-4">{customerDetails?.type}</div>
              </div>
            </>
          )}
          {value === "two" && (
            <>
              <div className="table-responsive mt-4 p-2">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr className="table-success">
                      <th scope="col">Challan Number</th>
                      <th scope="col">Reference</th>
                      <th scope="col">Order Date & Time</th>
                      <th scope="col">Challan Date</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Customer Phone</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                      <th scope="col">Return (Credit Note)</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

CustomerProfile.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CustomerProfile);
