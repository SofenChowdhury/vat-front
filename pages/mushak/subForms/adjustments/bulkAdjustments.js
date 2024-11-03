//react
import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../../../theme";
import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../../base";

// Date
import { DatePicker } from "antd";

// Excel
import ExportExcel from "../../../../components/services/ExportExcel";

const BulkAdjustments = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // POST VARIABLES
  const [csvfile, setCsvFile] = useState("");

  

  // EXCEL UPLOAD
  const handleOnChange = (e) => {
    if (e.target.files) setCsvFile(e.target.files[0]);
  };

  // TEMPLATE DOWNLOAD
  const downloadTemplate = () => {
    const data = [
      {
        "Vendor ID": "",
        "Certificate No.": "",
        Type: "",
        Bank: "",
        Branch: "",
        Date: "",
        Note: "",
        "SL No.": "",
        Value: "",
        "VDS Amount": "",
        "Invoice No.": "",
        "Invoice Date": "",
        "Issue Date": "",
        "A/C Code": "",
      },
    ];
    const fileName = "adjjustment_template";
    const exportType = "csv";
    ExportExcel(data, fileName, exportType);
  };


  // SUBMIT DATA
  const submit = () => {
    let formData = new FormData();
    formData.append("csvfile", csvfile);

    const apiAdjustments = BASE_URL + "api/v1/vat-adjustment/upload";

    axios
      .post(apiAdjustments, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status) {
          console.log(res.data);
          alert("Adjustments Uploaded");
          Router.push({
            pathname: "/mushak/subForms/adjustments/adjustmentList",
          });
        } else {
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
        <div className="col-md-6">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Bulk Adjustments Upload
          </Typography>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
        <Button
            variant="outlined"
            onClick={downloadTemplate}
            size="large"
          >
            Download Template
          </Button>
        </div>
      </div>

      <h6 className="mt-5 text-secondary">Upload CSV:</h6>
      <div className="row mt-3">
        <div className="col-md-12">
          <input type="file" onChange={handleOnChange} accept=".csv" />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-1">
          <Button
            style={{ width: "100%" }}
            size="large"
            color="secondary"
            variant="contained"
            onClick={submit}
          >
            submit
          </Button>
        </div>
        <div className="col-md-2">
          
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

export default connect(mapStateToProps)(BulkAdjustments);
