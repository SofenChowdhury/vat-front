import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

// axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";
import moment from "moment";

// Icons
import Print from "@mui/icons-material/Print";

// PRINT
import { useReactToPrint } from "react-to-print";

// Excel
import { utils, writeFile } from "xlsx";

const Mushak_610 = ({ token, company }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper Variables
  const [loader, setLoader] = useState(true);
  const [purchases, setPurchases] = useState(null);
  const [sales, setSales] = useState(null);

  // Branch Variables
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(0);

  // Date Variable

  const currentDate = new Date();

  // Calculate the first day of the current month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  // Format the dates as "YYYY-MM-DD"
  const formattedStartDate = `${firstDayOfMonth.getFullYear()}-${(
    firstDayOfMonth.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-01`;
  const formattedEndDate = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

  const [start_date, setStartDate] = useState(formattedStartDate);
  const [end_date, setEndDate] = useState(formattedEndDate);
  const [isCustom, setIsCustom] = useState(false);
  const { RangePicker } = DatePicker;

  // Reference Variable
  const printRef = useRef();

  // PRINT
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

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

  // FETCH MUSHAK DETAILS
  useEffect(() => {
    setLoader(true);
    const apiMushak =
      BASE_URL +
      "api/v1/mushok/six-ten?branch_id=" +
      selectedBranch +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;

    console.log(apiMushak);

    axios
      .get(apiMushak, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        setPurchases(res.data.purchase);
        setSales(res.data.sales);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedBranch, start_date, end_date]);

  // Branch Change
  const handleBranchChange = (event, value) => {
    if (value) {
      setSelectedBranch(value.id);
    } else {
      setSelectedBranch("");
    }
  };

  //Date Handle
  const handleSearch = (e) => {
    if (e == 1) setIsCustom(true);
    else if (e == 2) {
      setIsCustom(false);
      let currentDate = new Date();
      let lastDate = getDateXDaysAgo(7, currentDate);
      setStartDate(moment(lastDate).format("YYYY-MM-DD"));
      setEndDate(moment(currentDate).format("YYYY-MM-DD"));
    } else if (e == 3) {
      setIsCustom(false);
      let currentDate = new Date();
      let lastDate = getDateXDaysAgo(30, currentDate);
      setStartDate(moment(lastDate).format("YYYY-MM-DD"));
      setEndDate(moment(currentDate).format("YYYY-MM-DD"));
    } else if (e == 4) {
      setIsCustom(false);
      let today = new Date();
      let FirstDay = new Date(
        moment(today).format("YYYY"),
        moment(today).format("MM") - 1,
        1
      );
      let LastDay = new Date();
      FirstDay = moment(FirstDay).format("YYYY-MM-DD");
      LastDay = moment(LastDay).format("YYYY-MM-DD");
      setStartDate(FirstDay);
      setEndDate(LastDay);
    } else if (e == 5) {
      setIsCustom(false);
      let today = new Date();
      let firstDay = new Date(
        moment(today).subtract(1, "months").startOf("month")
      );
      let lastDay = new Date(
        moment(today).subtract(1, "months").endOf("month")
      );

      firstDay = moment(firstDay).format("YYYY-MM-DD");
      lastDay = moment(lastDay).format("YYYY-MM-DD");
      setStartDate(firstDay);
      setEndDate(lastDay);
    } else {
      setStartDate("");
      setEndDate("");
      setIsCustom(false);
    }
  };
  function getDateXDaysAgo(numOfDays, date = new Date()) {
    const daysAgo = new Date(date.getTime());

    daysAgo.setDate(date.getDate() - numOfDays);

    return daysAgo;
  }
  function onChange(date, dateString) {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  }

  // DOWNLOAD EXCELS
  const downloadExcelSales = async () => {
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet([
      ["", "Registered / Enlisted Person's Name: ", `${company.name}`],
      ["", "Registered / Enlisted Person's BIN: ", `${company.company_bin}`],
      [], // Blank row
      [
        "Index",
        "Challan No.",
        "Date of Issue",
        "Value",
        "Name of Purchaser",
        "Purchaser's Address",
        "BIN/NID of Purchaser",
      ], // Header row
    ]);

    // Add purchases data
    const data = sales.map((purchase, index) => {
      return [
        index + 1, // Adjust for 1-based index
        purchase.sales_no,
        purchase.issue_date,
        purchase.total_amount,
        purchase.customer_name,
        purchase.customer_address,
        purchase.customer_bin,
      ];
    });

    utils.sheet_add_aoa(worksheet, data, { origin: -1 });

    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileName = "6.10_sales.xlsx";
    writeFile(workbook, fileName);
  };
  const downloadExcelPurchases = async () => {
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet([
      ["", "Registered / Enlisted Person's Name: ", `${company.name}`],
      ["", "Registered / Enlisted Person's BIN: ", `${company.company_bin}`],
      [], // Blank row
      [
        "Index",
        "Challan No.",
        "Date of Issue",
        "Value",
        "Name of Seller",
        "Seller's Address",
        "BIN/NID of Seller",
      ], // Header row
    ]);

    // Add purchases data
    const data = purchases.map((purchase, index) => {
      return [
        index + 1, // Adjust for 1-based index
        purchase.challan_no,
        purchase.issue_date,
        purchase.total_amount,
        purchase.vendor_name,
        purchase.vendor_address,
        purchase.vendor_bin,
      ];
    });

    utils.sheet_add_aoa(worksheet, data, { origin: -1 });

    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileName = "6.10_purchases.xlsx";
    writeFile(workbook, fileName);
  };

  return (
    <>
      <div className="row">
        <Typography
          variant="h2"
          className="mb-4"
          color={colors.greenAccent[300]}
        >
          Mushak 6.10
        </Typography>
      </div>

      <div className="row">
        <div className="col-md-3 mt-3">
          <h6 className="text-secondary ms-1">Branch</h6>
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
        <div className="col-md-6 mt-3">
          <div className="row">
            <h6 className="text-secondary ms-1">Timeline</h6>
          </div>
          <div className="row">
            <div className="col-md-4">
              <TextField
                onChange={(e) => handleSearch(+e.target.value)}
                select
                size="large"
                fullWidth
                className="shadow-input"
                defaultValue={0}
              >
                <MenuItem value={0}>Select Range</MenuItem>
                <MenuItem value={1}>Custom Range</MenuItem>
                <MenuItem value={2}>Last 7 Days</MenuItem>
                <MenuItem value={3}>Last 30 Days</MenuItem>
                <MenuItem value={4}>Current Month</MenuItem>
                <MenuItem value={5}>Last Month</MenuItem>
              </TextField>
            </div>
            {isCustom && (
              <div className="col-md-8">
                <RangePicker
                  onChange={onChange}
                  size="large"
                  style={{ width: "100%", height: "58px" }}
                  className="shadow-input"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {loader ? (
        <CircularProgress className="mt-5" />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12 mt-4">
              <Button
                variant="contained"
                size="large"
                className="float-end me-3"
                onClick={handlePrint}
                color="secondary"
              >
                <Print />
                Print
              </Button>
              <Button
                variant="contained"
                size="large"
                className="float-end me-3"
                onClick={downloadExcelSales}
                color="secondary"
              >
                Download Sales
              </Button>
              <Button
                variant="contained"
                size="large"
                className="float-end me-3"
                onClick={downloadExcelPurchases}
                color="secondary"
              >
                Download Purchases
              </Button>
            </div>
          </div>

          <div ref={printRef} className="p-3 mt-5">
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>Government of the People's Republic of Bangladesh</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>National Board of Revenue</b>
              </div>
            </div>
            <div className="row justify-content-end">
              <div className="col-sm-2">
                <b>MUHSAK 6.10</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>Information regarding Purchase / Sale for 2 lac and more</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>delivered / received in a Single Challan (Mushak 6.3)</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>[As per Sub-rule 1 of Rule 42]</b>
              </div>
            </div>
            <div className="row justify-content-md-center mt-1">
              <div className="col-md-auto">
                <b>
                  For the Period of {moment(start_date)?.format("DD MMM YY")} to{" "}
                  {moment(end_date)?.format("DD MMM YY")}
                </b>
              </div>
            </div>
            <div className="row justify-content-between mt-3">
              <div className="col-4">
                <b>Registered / Enlisted Person's Name: </b>
                {company.name}
              </div>
              <div className="col-4">
                <b>BIN: </b>
                {company.company_bin}
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <b>Part ka - Purchase Account Information</b>
              </div>
            </div>

            {/* TABLE - 1 */}
            <div className="mt-3">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th className="text-center align-middle">SL</th>
                    <th className="text-center align-middle">Challan No</th>
                    <th className="text-center align-middle">Date of Issue</th>
                    <th className="text-center align-middle">Value</th>
                    <th className="text-center align-middle">Name of Seller</th>
                    <th className="text-center align-middle">
                      Seller's Address
                    </th>
                    <th className="text-center align-middle">
                      BIN/NID of Seller
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center align-middle">1</th>
                    <th className="text-center align-middle">2</th>
                    <th className="text-center align-middle">3</th>
                    <th className="text-center align-middle">4</th>
                    <th className="text-center align-middle">5</th>
                    <th className="text-center align-middle">6</th>
                    <th className="text-center align-middle">7</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases?.map((purchase, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{purchase.challan_no}</td>
                      <td>{purchase.issue_date}</td>
                      <td>{purchase.total_amount}</td>
                      <td>{purchase.vendor_name}</td>
                      <td>{purchase.vendor_address}</td>
                      <td>{purchase.vendor_bin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <b>Part kha - Sales Account Information</b>
              </div>
            </div>

            {/* TABLE - 2  */}
            <div className="mt-3">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th className="text-center align-middle">SL</th>
                    <th className="text-center align-middle">Challan No</th>
                    <th className="text-center align-middle">Date of Issue</th>
                    <th className="text-center align-middle">Value</th>
                    <th className="text-center align-middle">
                      Name of Purchaser
                    </th>
                    <th className="text-center align-middle">
                      Purchaser's Address
                    </th>
                    <th className="text-center align-middle">
                      BIN/NID of Purchaser
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center align-middle">1</th>
                    <th className="text-center align-middle">2</th>
                    <th className="text-center align-middle">3</th>
                    <th className="text-center align-middle">4</th>
                    <th className="text-center align-middle">5</th>
                    <th className="text-center align-middle">6</th>
                    <th className="text-center align-middle">7</th>
                  </tr>
                </thead>
                <tbody>
                  {sales?.map((sale, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{sale.sales_no}</td>
                      <td>{sale.issue_date}</td>
                      <td>{sale.total_amount}</td>
                      <td>{sale.customer_name}</td>
                      <td>{sale.customer_address}</td>
                      <td>{sale.customer_bin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="row mt-4 mb-4">
              <div className="col-12">
                <b>Signature of Authorised Person:</b>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <b>Name:</b>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <b>Date:</b>
              </div>
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
    company: state.auth.company,
  };
};

export default connect(mapStateToProps)(Mushak_610);
