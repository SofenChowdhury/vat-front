import React, { useEffect, useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import { CircularProgress, TextField, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

//date
import { DatePicker, TimePicker } from "antd";
import moment from "moment";

const UpdatePurchaseReturn = ({ returnId, token }) => {
  //post variables
  const [return_no, setReturnNo] = useState(null);
  const [challan_no, setChallanNo] = useState(null);
  const [challan_date, setChallanDate] = useState(null);
  const [issue_date, setIssueDate] = useState(null);
  const [issue_time, setIssueTime] = useState(null);
  const [return_reason, setReturnReason] = useState(null);

  //helper variables
  const [returnDetails, setReturnDetails] = useState(null);
  const [loader, setLoader] = useState(true);

  //fetch details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/purchases/return/" + returnId;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          console.log(res.data);
          setReturnNo(res.data.data.return_no);
          setChallanNo(res.data.data.challan_no);
          setChallanDate(res.data.data.challan_date);
          setReturnReason(res.data.data.return_reason);
          setIssueDate(res.data.data.created_at);
          setIssueTime(res.data.data.created_at);
          setReturnDetails(res.data.data);
          setLoader(false);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Date function
  const onChangeIssueDate = (date, dateString) => {
    setIssueDate(dateString);
  };
  const onChangeIssueTime = (time) => {
    setIssueTime(time);
  };

  //update
  const update = () => {
    const apiUrl = BASE_URL + "api/v1/purchases/return-update";
    const returnData = {
      return_id: returnId,
      return_no,
      challan_no,
      challan_date,
      issue_date: `${moment(issue_date).format("YYYY-MM-DD")} ${moment(
        issue_time
      ).format("HH:mm:ss")}`,
      return_reason,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(returnData);
    axios
      .post(apiUrl, returnData, config)
      .then((response) => {
        if (response.data.status) {
          console.log(response.data);
          setLoader(true);
          alert("Purchase Return Edited!");
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
              <h4>Update Purchase Return</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-3">
              <b>Return No:</b> {returnDetails?.return_no}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Return No"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={return_no || ""}
                onChange={(e) => setReturnNo(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>

          {challan_no && (
            <div className="row">
              <div className="col-md-12 mt-4">
                <TextField
                  label="Challan No"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={challan_no || ""}
                  onChange={(e) => setChallanNo(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>
          )}

          {challan_date && (
            <div className="row">
              <div className="col-md-12 mt-4">
                <TextField
                  label="Challan No"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={challan_date || ""}
                  onChange={(e) => setChallanDate(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mt-4">
              <DatePicker
                placeholder="Issue Date"
                size="large"
                style={{ width: "100%", height: "58px" }}
                value={moment(issue_date)}
                className="shadow-input"
                onChange={onChangeIssueDate}
              />
            </div>
            <div className="col-md-6 mt-4">
              <TimePicker
                placeholder="Issue Time"
                size="large"
                style={{ width: "100%", height: "58px" }}
                value={moment(issue_time)}
                className="shadow-input"
                onChange={onChangeIssueTime}
                format="HH:mm"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Return Reason"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={return_reason || ""}
                onChange={(e) => setReturnReason(e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mt-4">
              <Button
                variant="contained"
                color="success"
                onClick={update}
                size="large"
              >
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

export default connect(mapStateToProps)(UpdatePurchaseReturn);
