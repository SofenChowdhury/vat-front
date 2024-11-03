//react
import React, { useState, useEffect } from "react";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//date
import { DatePicker } from "antd";
import moment from "moment";

const TransferReport = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Post Variables
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [branch_id, setBranchId] = useState("");

  // Helper Variables
  const [transfers, setTransfers] = useState([]);
  const [type, setType] = useState("year");
  const [showEmpty, setShowEmpty] = useState(false);
  const [loader, setLoader] = useState(false);
  const [branches, setBranches] = useState([]);

  // Date Variables
  const { RangePicker } = DatePicker;

  // FETCH BRANCHES
  useEffect(() => {
    const apiBranches = BASE_URL + "api/v1/branches";
    axios
      .get(apiBranches, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setBranches(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Date function
  const onChangeYear = (date, dateString) => {
    if (date) {
      setStartDate(`${dateString}-01-01`);
      setEndDate(`${dateString}-12-31`);
    }
  };
  const onChangeMonth = (date, dateString) => {
    const firstDayOfMonth = moment(date).startOf("month");
    const lastDayOfMonth = moment(date).endOf("month");

    setStartDate(firstDayOfMonth.format("YYYY-MM-DD"));
    setEndDate(lastDayOfMonth.format("YYYY-MM-DD"));
  };
  const onChangeDate = (date, dateString) => {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  };

  // Fetch Orders
  const generateTransfers = () => {
    // setLoader(true);
    // const apiPurchaseDownload =
    //   BASE_URL +
    //   "api/v1/purchases-download?purchase_no=" +
    //   purchase_no +
    //   "&challan_no=" +
    //   challan_no +
    //   "&start_date=" +
    //   start_date +
    //   "&end_date=" +
    //   end_date +
    //   "&vendor_id=" +
    //   vendor_id;
    // const config = {
    //   headers: { Authorization: `Bearer ${token}` },
    // };
    // axios
    //   .get(apiPurchaseDownload, config)
    //   .then((response) => {
    //     console.log(response.data);
    //     if (response.data.status) {
    //       setPurchases(response.data.data);
    //       setShowEmpty(true);
    //       setLoader(false);
    //     } else {
    //       console.log(response.data);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  // Clear Search
  const clearSearch = () => {
    setStartDate("");
    setEndDate("");
    setType("year");
    setBranchId("");
  };

  // Branch handle
  const handleBranchChange = (event, value) => {
    if (value) {
      setBranchId(value.id);
    } else {
      setBranchId(null);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Transfer Report (VAT 6.5)
          </Typography>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mt-4">
          <TextField
            label="Type"
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
            <MenuItem value={"year"}>Year</MenuItem>
            <MenuItem value={"month"}>Month</MenuItem>
            <MenuItem value={"date"}>Date Range</MenuItem>
          </TextField>
        </div>
        <div className="col-md-3 mt-4">
          {type == "year" && (
            <DatePicker
              picker="year"
              onChange={onChangeYear}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
              defaultValue={""}
            />
          )}
          {type == "month" && (
            <DatePicker
              picker="month"
              onChange={onChangeMonth}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
            />
          )}
          {type == "date" && (
            <RangePicker
              onChange={onChangeDate}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
            />
          )}
        </div>
        <div className="col-md-3 mt-4">
          <Autocomplete
            options={branches}
            getOptionLabel={(option) => option.name}
            onChange={handleBranchChange}
            renderInput={(params) => (
              <TextField {...params} label="Branch" className="shadow-input" />
            )}
            size="large"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mt-4">
          <Button
            variant="contained"
            color="error"
            onClick={clearSearch}
            size="large"
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={generateTransfers}
            className="ms-2"
            size="large"
          >
            Search
          </Button>
        </div>
      </div>

      {loader ? (
        <CircularProgress className="mt-5" />
      ) : (
        <>
          {showEmpty && transfers.length == 0 && (
            <div className="row">
              <div className="col-md-12 mt-5">
                <Typography variant="h4" className="mb-4" color="red">
                  No Report Found!
                </Typography>
              </div>
            </div>
          )}

          {transfers.length > 0 && (
            <>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <Button variant="contained" color="secondary" size="large">
                    Generate Report
                  </Button>
                </div>
              </div>
            </>
          )}
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

export default connect(mapStateToProps)(TransferReport);
