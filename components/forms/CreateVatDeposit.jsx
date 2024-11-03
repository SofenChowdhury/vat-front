import React, { useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import { TextField, Button, MenuItem } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//date
import { DatePicker } from "antd";
import moment from "moment";

const CreateVatDeposit = ({ token }) => {
  // VARIABLES FOR POST
  const [type, setType] = useState(null);
  const [challan_no, setChallanNo] = useState(null);
  const [bank, setBank] = useState(null);
  const [branch, setBranch] = useState(null);
  const [account_code, setAccountCode] = useState(null);
  const [amount, setAmount] = useState(null);
  const [payment_date, setPaymentDate] = useState(null);
  const [ledger_month, setLedgerMonth] = useState(null);
  const [note, setNote] = useState(null);

  // Month Selector
  function onChangeMonth(date, dateString) {
    setLedgerMonth("");
    let FirstDay = new Date(
      moment(dateString).format("YYYY"),
      moment(dateString).format("MM") - 1,
      1
    );
    FirstDay = moment(FirstDay).format("YYYY-MM-DD");
    setLedgerMonth(FirstDay);
  }

  // Date function
  function onChangePayment(date, dateString) {
    setPaymentDate(dateString);
  }

  const submit = () => {
    const paymentData = {
      type,
      challan_no,
      bank,
      branch,
      account_code,
      amount,
      payment_date,
      ledger_month,
      note,
    };
    const apiPayment = BASE_URL + "api/v1/vat-payments/payment";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(apiPayment, paymentData, config)
      .then((response) => {
        if (response.data.status) {
          alert("Payment Made");
          Router.push({
            pathname: "/mushak/subForms/vatDeposit/vatDepositList",
          });
          console.log(response.data);
        } else {
          setFormErrors(Object.values(response.data.errors));
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6 mt-4">
          <TextField
            label="Treasury Challan No"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            className="shadow-input"
            onChange={(e) => {
              setChallanNo(e.target.value);
            }}
          />
        </div>
        <div className="col-md-6 mt-4">
          <DatePicker
            // onChange={onChangeMonth}
            placeholder="Select Date of Deposit"
            size="large"
            style={{ width: "100%", height: "58px" }}
            className="shadow-input"
            onChange={onChangePayment}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-4">
          <TextField
            label="Bank"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            className="shadow-input"
            onChange={(e) => {
              setBank(e.target.value);
            }}
          />
        </div>
        <div className="col-md-6 mt-4">
          <TextField
            label="Branch"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            className="shadow-input"
            onChange={(e) => {
              setBranch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-4">
          <TextField
            label="Account Code"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            className="shadow-input"
            onChange={(e) => {
              setAccountCode(e.target.value);
            }}
          />
        </div>
        <div className="col-md-6 mt-4">
          <TextField
            label="Amount"
            variant="outlined"
            size="large"
            type="number"
            fullWidth
            className="shadow-input"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-4">
          <TextField
            label="Deposit Type"
            variant="outlined"
            select
            size="large"
            type="text"
            fullWidth
            value={type || ""}
            className="shadow-input"
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <MenuItem value={58}>VAT Deposit</MenuItem>
            <MenuItem value={59}>SD Deposit</MenuItem>
            <MenuItem value={60}>Excise Duty</MenuItem>
            <MenuItem value={61}>Development Surcharge</MenuItem>
            <MenuItem value={62}>ICT Development Surcharge</MenuItem>
            <MenuItem value={63}>Health Care Surcharge</MenuItem>
            <MenuItem value={64}>Environmental Protection Surcharge</MenuItem>
          </TextField>
        </div>
        <div className="col-md-6 mt-4">
          <DatePicker
            onChange={onChangeMonth}
            placeholder="Select Month"
            size="large"
            picker="month"
            style={{ width: "100%", height: "58px" }}
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
            multiline
            rows={4}
            fullWidth
            className="shadow-input"
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%" }}
            onClick={submit}
            size="large"
          >
            Deposit VAT
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

export default connect(mapStateToProps)(CreateVatDeposit);
