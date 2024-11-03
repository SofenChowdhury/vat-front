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

const BulkProduct = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // POST VARIABLES
  const [csvfile, setCsvFile] = useState("");
  const [challan_date, setChallanDate] = useState("");
  const [vendor_id, setVendorId] = useState(null);
  const [stock_branch, setBranchId] = useState(0);

  // HELPER VARIABLES
  const [vendors, setVendors] = useState([]);
  const [branches, setBranches] = useState([]);

  // FETCH BRANCH AND VENDOR
  useEffect(() => {
    const apiVendors = BASE_URL + "api/v1/vendors";
    axios
      .get(apiVendors, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setVendors(res.data.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

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
  function onChangeStart(date, dateString) {
    setChallanDate(dateString);
  }

  // EXCEL UPLOAD
  const handleOnChange = (e) => {
    if (e.target.files) setCsvFile(e.target.files[0]);
  };

  // TEMPLATE DOWNLOAD
  const downloadTemplate = () => {
    const data = [
      {
        sl: "",
        title: "",
        sku: "",
        model: "",
        category: "",
        type: "",
        unit: "",
        price: "",
        hscode: "",
        sales_vat: "",
      },
    ];
    const fileName = "product_template";
    const exportType = "csv";
    ExportExcel(data, fileName, exportType);
  };

  const submit = () => {
    let formData = new FormData();
    formData.append("csvfile", csvfile);
    formData.append("stock_branch", stock_branch);
    formData.append("challan_date", challan_date);
    formData.append("vendor_id", vendor_id);

    // const apiPurchase = BASE_URL + "api/v1/purchases/create-bulk";

    // axios
    //   .post(apiPurchase, formData, {
    //     headers: {
    //       Authorization: "Bearer " + token,
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     if (res.data.status) {
    //       console.log(res.data);
    //       alert("Purchase Uploaded");
    //       Router.push({
    //         pathname: "/purchases/purchaseList",
    //       });
    //     } else {
    //       console.log(res.data);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
            Bulk Product Upload
          </Typography>
        </div>
        <div className="col-md-6">
          <Button
            className="float-end"
            variant="outlined"
            onClick={downloadTemplate}
            size="large"
          >
            Download Template
          </Button>
        </div>
      </div>

      {/* <h6 className="mt-4 text-secondary">Sales Information:</h6> */}
      {/* <div className="row">
        <div className="col-md-4 mt-2">
          <DatePicker
            onChange={onChangeStart}
            size="large"
            className="shadow-input"
            placeholder="Challan Date"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4 mt-2">
          <TextField
            onChange={(e) => {
              setVendorId(e.target.value);
            }}
            select
            label="Vendors"
            size="large"
            value={vendor_id || ""}
            fullWidth
            className="shadow-input"
          >
            {vendors.map((vendor, index) => (
              <MenuItem value={vendor.id} key={index}>
                {vendor.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-4 mt-2">
          <TextField
            onChange={(e) => setBranchId(+e.target.value)}
            select
            label="Stock in Branch"
            size="large"
            fullWidth
            value={stock_branch || ""}
            className="shadow-input"
          >
            {branches?.map((branch, index) => (
              <MenuItem value={branch.id} key={index}>
                {branch.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div> */}
      <h6 className="mt-3 text-secondary">Upload CSV:</h6>
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

export default connect(mapStateToProps)(BulkProduct);
