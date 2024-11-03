import React, { useEffect, useState, useRef } from "react";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// date
import { DatePicker } from "antd";
import moment from "moment";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

const Report = ({ token, companyId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [companies, setCompanies] = useState([]);
  const [company_id, setCompanyId] = useState("");
  const [branches, setBranches] = useState([]);
  const [branch_id, setBranchId] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [product_id, setProductId] = useState("");
  const [timer, setTimer] = useState(null);
  const [loader, setLoader] = useState(true);

  // DATE
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const { RangePicker } = DatePicker;

  // REFERENCES
  const multiselectRef = useRef();

  // FETCH PRODUCT BY SEARCH
  const searchProduct = async (e) => {
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProduct =
          BASE_URL + "api/v1/product-search?type=&keyword=" + e;
        axios
          .get(apiProduct, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status == true) {
              if (res.data.data != null) {
                setProducts(res.data.data);
                setLoader(false);
              } else {
                setProducts([]);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
  };

  // Multiselect functions
  const addColumn = (list, item) => {
    setProduct(item);
    setProductId(item.id);
    setProducts([]);
  };
  // Remove Product
  const removeProduct = () => {
    setProduct(null);
    setProductId("");
    resetSelectField();
  };
  const resetSelectField = () => {
    multiselectRef?.current?.resetSelectedValues();
    setProducts([]);
  };

  //Date Function
  function onChange(date, dateString) {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  }

  // Fetch Companies
  useEffect(() => {
    const apiCompanies = BASE_URL + "api/v1/companies";

    axios
      .get(apiCompanies, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setCompanies(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Fetch Branches
  useEffect(() => {
    const apiBranches = BASE_URL + "api/v1/branches?company_id=" + company_id;

    axios
      .get(apiBranches, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setBranches(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [company_id]);

  // Download CSV
  const downloadExcel = async () => {
    const apiReportDownload =
      BASE_URL +
      "api/v1/mushok/report?company_id=" +
      company_id +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&branch_id=" +
      branch_id +
      "&product_id=" +
      product_id +
      "&sales=&purchase=";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(apiReportDownload);

    await axios
      .get(apiReportDownload, config)
      .then((response) => {
        if (response.data.status) {
          console.log(response.data);
          const data = response.data.data.map((product, index) => {
            return {
              SL: index + 1,
              Date: moment(product.created_at).format("DD MMM YYYY"),
              Time: moment(product.created_at).format("hh:mm a"),
              Product: product.info.title,
              SKU: product.info.sku,
              "HS Code": product.info.hscode.code,
              "Sales No": product.sales?.sales_no,
              "Customer Name": product.sales?.customer_name,
              "Purchase No": product.purchase?.purchase_no,
              "Vendor Name": product.sales?.vendor_name,
              "Opening Stock No": product.opening?.open_stock_no,
              Quantity: product.qty,
              "Opening Quantity": product.opening_qty,
              "Closing Quantity": product.closing_qty,
              Company: product.company?.slug,
              Branch: product.branch?.name,
              "Branch Opening": product.branch_opening,
              "Branch Closing": product.branch_closing,
              Mushak: product.mushok,
              Nature: product.nature,
            };
          });
          //   console.log(data);
          const today = new Date();
          const fileName = "Mushak_Report_" + today.toDateString();
          const exportType = "csv";
          ExportExcel(data, fileName, exportType);
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
            <div className="col-md-9">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Generate Mushak Report
              </Typography>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 mt-2">
              <h6>Select Company</h6>
              <FormControl>
                <RadioGroup
                  onChange={(e) => {
                    setCompanyId(e.target.value);
                    setBranchId("");
                  }}
                  defaultValue={companyId}
                >
                  {companies.map((company) => (
                    <FormControlLabel
                      value={company.id}
                      control={<Radio />}
                      label={company.slug}
                      key={company.id}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
            <div className="col-md-3 mt-2">
              <h6>Select Branch</h6>
              <FormControl>
                <RadioGroup
                  onChange={(e) => {
                    setBranchId(e.target.value);
                  }}
                >
                  {branches.map((branch) => (
                    <FormControlLabel
                      value={branch.id}
                      control={<Radio />}
                      label={branch.name}
                      key={branch.id}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
            <div className="col-md-3 mt-2">
              <h6>Select Date Range</h6>
              <RangePicker
                onChange={onChange}
                size="large"
                className="shadow-input"
                style={{ height: "58px" }}
              />
            </div>
            <div className="col-md-3 mt-2">
              <h6>Select a Product</h6>
              <Multiselect
                placeholder="Search Products"
                cursor="pointer"
                displayValue="title"
                // onRemove={removeColumn}
                onSelect={addColumn}
                options={products}
                onSearch={(e) => {
                  searchProduct(e);
                }}
                ref={multiselectRef}
                hideSelectedList
                emptyRecordMsg="Search by Name/Sku/Model/HScode"
                className="shadow-input"
                style={{
                  multiselectContainer: {
                    height: "58px",
                  },
                  searchBox: {
                    minHeight: "58px",
                  },
                  inputField: {
                    margin: "10px",
                    width: "90%"
                  },
                }}
              />
              {product && (
                <div className="row mt-5">
                  <div className="col-md-7">
                    <TextField
                      label="Selected Product"
                      variant="outlined"
                      size="large"
                      type="text"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      value={product.title}
                      className="shadow-input"
                      closeOnSelect
                    />
                  </div>
                  <div className="col-md-5">
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      onClick={removeProduct}
                      style={{ height: "43px" }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-4">
              <Button
                variant="contained"
                color="secondary"
                onClick={downloadExcel}
                size="large"
              >
                Generate
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
    companyId: state.auth.company.id,
  };
};

export default connect(mapStateToProps)(Report);
