import React, { useEffect, useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import {
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";
import { CheckBox } from "@mui/icons-material";

const UpdateSales = ({ salesId, token }) => {
  //post variables
  const [customer_name, setCustomerName] = useState(null);
  const [sales_no, setSalesNo] = useState(null);
  const [shipping_address, setShippingAddress] = useState(null);
  const [ref_no, setRefNo] = useState(null);
  const [vehicle_no, setVehicleNo] = useState(null);
  const [is_exported, setIs_exported] = useState(null);
  const [note, setNote] = useState(null);

  //helper variables
  const [orderDetails, setOrderDetails] = useState(null);
  const [loader, setLoader] = useState(true);

  //fetch details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/sales/" + salesId;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          console.log(res.data);
          setLoader(false);
          setOrderDetails(res.data.data);
          setCustomerName(res.data.data.customer_name);
          setSalesNo(res.data.data.sales_no);
          setShippingAddress(res.data.data.shipping_address);
          setRefNo(res.data.data.reference_no);
          setVehicleNo(res.data.data.vehicle_no);
          setIs_exported(res.data.data.is_exported);
          setNote(res.data.data.note);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //update
  const update = () => {
    const apiUrl = BASE_URL + "api/v1/sales/update";
    const saleData = {
      sales_id: salesId,
      customer_name,
      sales_no,
      shipping_address,
      ref_no,
      vehicle_no,
      note,
      printed: 0,
      is_exported: is_exported ? 1 : 0,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(saleData);
    axios
      .post(apiUrl, saleData, config)
      .then((response) => {
        if (response.data.status) {
          console.log(response.data);
          setLoader(true);
          alert("Sales Item edited!");
          window.location.reload();
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
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
              <h4>Update Sales</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-3">
              <b>Sales No:</b> {orderDetails.sales_no}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Customer Name"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={customer_name || ""}
                onChange={(e) => setCustomerName(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Sales No."
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={sales_no || ""}
                onChange={(e) => setSalesNo(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Shipping Address"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={shipping_address || ""}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Reference No"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={ref_no || ""}
                onChange={(e) => setRefNo(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Vehicle No"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={vehicle_no || ""}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Note"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>

          <div className="row">
            <FormControlLabel
              checked={is_exported}
              control={<Checkbox />}
              label={is_exported ? "Exported" : "Not Exported"}
              onChange={(e) => {
                setIs_exported(e.target.checked);
              }}
            />
          </div>

          <div className="row">
            <div className="col-md-12 mt-4">
              <Button variant="contained" color="success" onClick={update} size="large">
                Update
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

export default connect(mapStateToProps)(UpdateSales);
