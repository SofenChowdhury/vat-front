import React, { useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme
import { TextField, Button } from "@mui/material";

// Date
import { DatePicker } from "antd";
import moment from "moment";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const MushakSubmit = ({ data, token }) => {
  const [remarks, setRemarks] = useState(null);
  const [opening_balance, setOpeningBalance] = useState(null);
  const [closing_balance, setClosingBalamce] = useState(data.closing_balance);
  const [return_submitted_at, setReturnSubmittedDate] = useState("");

  function onChangeDate(date, dateString) {
    setReturnSubmittedDate(dateString);
  }

  const onSubmit = (e) => {
    const mushakData = {
      total_sales_amount: data.total_sales_amount,
      total_sales_vat: data.total_sales_vat,
      total_purchase_amount: data.total_purchase_amount,
      total_purchase_vat: data.total_purchase_vat,
      total_purchase_rebatable_vat: data.total_purchase_rebatable_vat,
      total_increasing_amount: data.total_increasing_amount,
      total_decreasing_amount: data.total_decreasing_amount,
      deposited_vat: data.deposited_vat,
      deposited_vat: data.deposited_vat,
      opening_balance: data.opening_balance
        ? data.opening_balance
        : opening_balance,
      closing_balance: closing_balance,
      ledger_month: data.ledger_month,
      return_submitted_at,
      remarks,
    };
    const apiMushak = BASE_URL + "api/v1/mushok/return-submit";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(mushakData);
    axios.post(apiMushak, mushakData, config).then((response) => {
      if (response.data.status) {
        console.log(response.data);
        alert("Mushak Submitted!");
        Router.push({
          pathname: "/mushak/mushak_91",
        });
      } else {
        console.log(response.data);
      }
    });
  };

  console.log(data);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h4>Submit Mushak</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-1">
          <b>Sales Amount:</b> TK.{" "}
          {Intl.NumberFormat().format(data.total_sales_amount)}
        </div>
        <div className="col-md-6 mt-1">
          <b>Sales VAT:</b> TK.{" "}
          {Intl.NumberFormat().format(data.total_sales_vat)}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-1">
          <b>Purchase Amount:</b> TK.{" "}
          {Intl.NumberFormat().format(data.total_purchase_amount)}
        </div>
        <div className="col-md-6 mt-1">
          <b>Purchase VAT:</b> TK.{" "}
          {Intl.NumberFormat().format(data.total_purchase_vat)}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-1">
          <b>Purchase Rebatable VAT:</b> TK.{" "}
          {Intl.NumberFormat().format(data.total_purchase_rebatable_vat)}
        </div>
        <div className="col-md-6 mt-1">
          <b>Deposited VAT:</b> TK.{" "}
          {Intl.NumberFormat().format(data.deposited_vat)}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-1">
          <b>Opening Balance: </b>
          {data.opening_balance
            ? `TK. ${Intl.NumberFormat().format(data.opening_balance)}`
            : "N/A"}
        </div>
        {/* <div className="col-md-6 mt-1">
          <b>Closing Balance:</b> TK.{" "}
          {Intl.NumberFormat().format(data.closing_balance)}
        </div> */}
        <div className="col-md-6 mt-1">
          <b>Ledger Month:</b> {moment(data.ledger_month).format("MMMM")}
        </div>
      </div>
      <hr />
      {(data.opening_balance == null || data.opening_balance == 0) && (
        <div className="row">
          <div className="col-md-6 mt-4">
            <TextField
              label="Opening Balance"
              variant="outlined"
              size="large"
              type="number"
              fullWidth
              value={opening_balance == null ? "" : opening_balance}
              onChange={(e) => setOpeningBalance(+e.target.value)}
              className="shadow-input"
            />
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-6 mt-4">
          <TextField
            label="Closing Balance"
            variant="outlined"
            size="large"
            type="number"
            fullWidth
            value={closing_balance == null ? "" : closing_balance}
            onChange={(e) => setClosingBalamce(+e.target.value)}
            className="shadow-input"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-4">
          <DatePicker
            placeholder="Return Submition Date"
            size="large"
            style={{ width: "100%", height: "58px" }}
            className="shadow-input"
            onChange={onChangeDate}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-4">
          <TextField
            label="Remarks"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            value={remarks == null ? "" : remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="shadow-input"
          />
        </div>
      </div>
      <div className="row5">
        <div className="col-md-12 mt-5">
          <Button variant="contained" color="secondary" onClick={onSubmit} size="large">
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(MushakSubmit);
