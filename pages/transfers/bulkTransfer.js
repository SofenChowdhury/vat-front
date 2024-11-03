//react
import React, { useState, useEffect } from "react";
import Router from "next/router";

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
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

const BulkTransfer = ({ token }) => {
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
        sl: "",
        "Company ID": "",
        "Stock Branch ID": "",
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
    let formData = new FormData();
    formData.append("csvfile", csvfile);

    const apiTransfers = BASE_URL + "api/v1/transfers/upload";

    axios
      .post(apiTransfers, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          console.log(res.data);
          alert("Transfer Uploaded");
          Router.push({
            pathname: "/transfers/transferList",
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
            Bulk Transfer Upload
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

      <h6 className="text-secondary">Upload CSV:</h6>
      <div className="row mt-3">
        <div className="col-md-12">
          <input type="file" onChange={handleOnChange} accept=".csv" />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-2">
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
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(BulkTransfer);
