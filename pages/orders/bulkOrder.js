//react
import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button, Tabs, Tab, Box } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

const BulkOrder = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // POST VARIABLES
  const [csvfile, setCsvFile] = useState(null);

  // HELPER VARIABLES
  const [value, setValue] = useState("one");

  // HANDLE TABS
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // EXCEL UPLOAD
  const handleOnChange = (e) => {
    if (e.target.files) setCsvFile(e.target.files[0]);
  };

  // TEMPLATE DOWNLOAD
  const downloadTemplate = () => {
    const data = [
      {
        sl: "",
        "Company ID": "",
        "Stock Branch": "",
        "part no": "",
        "part name": "",
        QTY: "",
        "Unit Price ( Excluding VAT)": "",
        "Total Value": "",
        "VAT Rate": "",
        "VAT amount": "",
        "Vendor ID": "",
        "Challan No": "",
        Type: "",
      },
    ];
    const fileName = "purchase_template";
    const exportType = "csv";
    ExportExcel(data, fileName, exportType);
  };

  const submit = () => {
    if (csvfile == null) {
      alert("Please Select a File to Upload!");
    } else {
      let formData = new FormData();
      formData.append("csvfile", csvfile);

      let apiSales = "";
      if (value == "one") {
        apiSales = BASE_URL + "api/v1/sales/bulkUpload";
      } else {
        apiSales = BASE_URL + "api/v1/sales/branchBulkUpload";
      }

      axios
        .post(apiSales, formData, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status) {
            console.log(res.data);
            alert("Sales Uploaded");
            Router.push({
              pathname: "/orders/OrderList",
            });
          } else {
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
            Bulk Sales Upload
          </Typography>
        </div>
        <div className="col-md-6">
          {/* <Button
            className="float-end"
            variant="outlined"
            onClick={downloadTemplate}
          >
            Download Template
          </Button> */}
        </div>
      </div>
      <Box sx={{ width: "100%" }} className="mt-4">
        <Tabs value={value} onChange={handleChange}>
          <Tab value="one" label="Regular Sales" />
          <Tab value="two" label="Outlet Sales" />
        </Tabs>
      </Box>

      <div className="row">
        <div className="col-md-12 ms-3">
          {value == "one" ? (
            <h6 className="text-secondary mt-5">Upload CSV (Regular Sales):</h6>
          ) : (
            <h6 className="text-secondary mt-5">Upload CSV (Outlet Sales):</h6>
          )}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-12 ms-3">
          <input type="file" onChange={handleOnChange} accept=".csv" />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-2 ms-3">
          <Button
            style={{ width: "100%" }}
            size="large"
            color={value == "one" ? "secondary" : "info"}
            variant="contained"
            onClick={submit}
          >
            submit
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

export default connect(mapStateToProps)(BulkOrder);
