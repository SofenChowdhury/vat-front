import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  CircularProgress,
  Typography,
  useTheme,
  Button,
  Chip,
  TextField,
  MenuItem,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

// axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";
import moment from "moment";

// Icons
import Download from "@mui/icons-material/Download";
import Print from "@mui/icons-material/Print";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import DescriptionIcon from "@mui/icons-material/Description";

// PDF
// import * as htmlToImage from "html-to-image";
// import { jsPDF } from "jspdf";

// PRINT
import { useReactToPrint } from "react-to-print";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

const PurchaseVat = ({ token, company }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Helper variables
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const { RangePicker } = DatePicker;
  const [mushaks, setMushaks] = useState([]);
  const [timer, setTimer] = useState(null);

  // Booleans
  const [loader, setLoader] = useState(true);
  const [loaderCustomers, setLoaderCustomers] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  // Reference Variable
  const printRef = useRef();
  const tableRef = useRef();
  const multiselectRef = useRef();

  // PRINT
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Multiselect functions 2
  const selectProduct = (list, item) => {
    setProduct(item);
    alert("Raw Material Selected");
  };

  const resetSelectField = () => {
    setProducts([]);
    setProduct({});
    multiselectRef.current.resetSelectedValues();
  };

  // FETCH PPRODUCTS BY SERACH
  const searchProduct = (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProducts =
          BASE_URL + "api/v1/product-search?type=2&keyword=" + e;
        axios
          .get(apiProducts, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status == true) {
              setProducts(res.data.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
  };

  // const downloadPdf = async () => {
  //   const data = await htmlToImage.toPng(printRef.current);

  //   const pdf = new jsPDF();
  //   const imgProperties = pdf.getImageProperties(data);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  //   const name =
  //     product?.title +
  //     "_" +
  //     moment(start_date).format("DD MMM YY") +
  //     "_" +
  //     moment(end_date).format("DD MMM YY") +
  //     "_6.1.pdf";

  //   pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);

  //   pdf.save(name);
  // };

  // hover functions

  const handleMouseOver = () => {
    setLoaderCustomers(true);
  };

  const handleMouseOut = () => {
    setLoaderCustomers(false);
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

  const getMushak = () => {
    const apiMushak =
      BASE_URL +
      "api/v1/mushok/six-one?product_id=" +
      product.id +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;
    // const apiMushak =
    //   BASE_URL +
    //   "api/v1/purchases/mushok_six_one?product_id=" +
    //   product.id +
    //   "&start_date=" +
    //   start_date +
    //   "&end_date=" +
    //   end_date;
    axios
      .get(apiMushak, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setMushaks(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Calculate
  const calculatePurchase = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "credit") total += mushak.qty;
    });
    return total;
  };
  const calculatePurchaseValue = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "credit") total += +mushak.qty * +mushak.price;
    });
    return total.toFixed(2);
  };
  const calculateConsumption = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "debit" && mushak.purchase_return_qty == 0)
        total += mushak.qty;
    });
    return total;
  };
  const calculateConsumptionValue = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "debit" && mushak.purchase_return_qty == 0)
        total += +mushak.qty * +mushak.average_price;
    });
    return total.toFixed(2);
  };
  const calculateReturn = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "debit" && mushak.purchase_return_qty != 0)
        total += mushak.qty;
    });
    return total;
  };
  const calculateReturnValue = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "debit" && mushak.purchase_return_qty != 0)
        total += +mushak.qty * +mushak.average_price;
    });
    return total.toFixed(2);
  };

  // Download CSV
  const downloadExcel = async () => {
    const data = mushaks?.map((mushak, index) => {
      if (mushak.type == "credit") {
        return {
          "SL No": index + 1,
          Date: moment(mushak.created_at).format("DD.MMM.YY"),
          "Opening Stock Quantity": mushak.opening_qty,
          "Opening Stock Value": (
            mushak.opening_qty * mushak.average_price
          ).toFixed(2),
          "Challan No": mushak.purchase?.purchase_no,
          "Challan Date": mushak.purchase?.challan_date,
          "Seller Name": mushak.purchase?.vendor?.name,
          "Seller Address": mushak.purchase?.vendor?.contact_address,
          "Seller NID": "",
          "Product Description": mushak.info?.title,
          "Product Quantity": mushak.qty,
          "Value (Excluding Taxes)": (mushak.price * mushak.qty).toFixed(2),
          "Supplementary Duty": "",
          "VAT Amount": mushak.vat_amount,
          "Stock Consumption Quantity": "",
          "Stock Consumption Value": "",
          "Stock Return Quantity": "",
          "Stock Return Value": "",
          "Closing Stock Quantity": mushak.closing_qty,
          "Closing Stock Value": (mushak.closing_qty * mushak.price).toFixed(2),
          Reference:
            mushak.purchase?.purchase_no || mushak.opening?.open_stock_no,
          Remarks: mushak.nature,
        };
      } else {
        if (mushak.purchase_return_qty) {
          return {
            "SL No": index + 1,
            Date: moment(mushak.created_at).format("DD.MMM.YY"),
            "Opening Stock Quantity": mushak.opening_qty,
            "Opening Stock Value": (
              mushak.opening_qty * mushak.average_price
            ).toFixed(2),
            "Challan No": "",
            "Challan Date": "",
            "Seller Name": "",
            "Seller Address": "",
            "Seller NID": "",
            "Product Description": "",
            "Product Quantity": "",
            "Value (Excluding Taxes)": "",
            "Supplementary Duty": "",
            "VAT Amount": "",
            "Stock Consumption Quantity": "",
            "Stock Consumption Value": "",
            "Stock Return Quantity": mushak.purchase_return_qty,
            "Stock Return Value": (
              mushak.purchase_return_qty * mushak.price
            ).toFixed(2),
            "Closing Stock Quantity": mushak.closing_qty,
            "Closing Stock Value": (mushak.closing_qty * mushak.price).toFixed(
              2
            ),
            Reference: mushak.finished?.goods_no,
            Remarks: mushak.type,
          };
        } else {
          return {
            "SL No": index + 1,
            Date: moment(mushak.created_at).format("DD.MMM.YY"),
            "Opening Stock Quantity": mushak.opening_qty,
            "Opening Stock Value": (
              mushak.opening_qty * mushak.average_price
            ).toFixed(2),
            "Challan No": "",
            "Challan Date": "",
            "Seller Name": "",
            "Seller Address": "",
            "Seller NID": "",
            "Product Description": "",
            "Product Quantity": "",
            "Value (Excluding Taxes)": "",
            "Supplementary Duty": "",
            "VAT Amount": "",
            "Stock Consumption Quantity": mushak.qty,
            "Stock Consumption Value": (mushak.qty * mushak.price).toFixed(2),
            "Stock Return Quantity": "",
            "Stock Return Value": "",
            "Closing Stock Quantity": mushak.closing_qty,
            "Closing Stock Value": (mushak.closing_qty * mushak.price).toFixed(
              2
            ),
            Reference: mushak.finished?.goods_no,
            Remarks: mushak.type,
          };
        }
      }
    });
    console.log(data);
    const fileName = product.title + "_6.1";
    const exportType = "csv";
    ExportExcel(data, fileName, exportType);
  };

  console.log(mushaks);

  return (
    <>
      <div className="row">
        <Typography
          variant="h2"
          className="mb-4"
          color={colors.greenAccent[300]}
        >
          Mushak 6.1
        </Typography>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <h6 className="text-secondary ms-1">Search Raw Material</h6>
          </div>
          <div className="row">
            <div className="col-md-7 mt-2">
              <Multiselect
                placeholder="Type Here. . ."
                cursor="pointer"
                displayValue="title"
                // onRemove={removeColumn}
                onSelect={selectProduct}
                options={products}
                onSearch={(e) => {
                  searchProduct(e);
                }}
                ref={multiselectRef}
                hideSelectedList
                emptyRecordMsg="Search By Product Name/Sku/Model/HS Code"
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
                    width: "90%",
                  },
                }}
              />
            </div>
            <div className="col-md-1 mt-2">
              <Button
                style={{ width: "100%", height: "58px" }}
                color="secondary"
                variant="contained"
                onClick={resetSelectField}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <RotateLeftIcon />
              </Button>
            </div>
            <div className="col-md-3">
              {loaderCustomers && (
                <Chip
                  label="Reset Products"
                  color="secondary"
                  size="large"
                  className="ms-4"
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 mt-2">
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

      {product.title?.length ? (
        <>
          <div className="row mt-5">
            <div className="col-md-6">
              <div className="row">
                <h6 className="text-secondary ms-1">Selected Raw Material</h6>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control shadow-input"
                    value={product.title}
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={getMushak}
                  >
                    Generate 6.1
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {!loader && (
        <>
          <div
            className="mt-5"
            style={{
              background: "rgb(230, 228, 228)",
              marginLeft: "-20px",
              marginRight: "-20px",
            }}
          >
            <br />
          </div>
          <div className="row justify-content-between p-5">
            <div className="col-md-12">
              {/* <Button
                variant="contained"
                size="large"
                onClick={downloadPdf}
                color="secondary"
              >
                <Download />
                Download
              </Button> */}
              <Button
                variant="contained"
                size="large"
                className="ms-3"
                onClick={handlePrint}
                color="secondary"
              >
                <Print />
                Print
              </Button>
              <Button
                variant="contained"
                size="large"
                className="ms-3"
                color="secondary"
                onClick={downloadExcel}
              >
                <DescriptionIcon />
                Excel
              </Button>
            </div>
          </div>
          <div ref={printRef} className="p-5">
            <div className="row justify-content-md-center mt-5">
              <div className="col-md-auto">
                <b>Government of the People's Republic of Bangladesh</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>National Board of Revenue</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>{company.name}</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>{company.contact_address}</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>{company.company_bin}</b>
              </div>
            </div>
            <div className="row justify-content-end">
              <div className="col-sm-2">
                <b style={{ border: "black 3px solid", padding: "8px" }}>
                  MUHSAK 6.1
                </b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>Purchase Account Book</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>[Rule 40(1),Clause KA] & [Rule 41,Clause KA]</b>
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
            <div className="row justify-content-md-center mt-1">
              <div className="col-md-auto">
                <b style={{ fontSize: "20px" }}>
                  {product.title} - {product?.sku}
                </b>
              </div>
            </div>

            {/* TABLE */}
            <div className="row">
              <div className="col-sm-12">
                <div className="mt-4">
                  <table
                    className="table table-hover table-bordered"
                    style={{ border: "black" }}
                    ref={tableRef}
                  >
                    <thead>
                      <tr>
                        <th rowSpan={4} className="text-center align-middle">
                          S/L NO
                        </th>
                        <th rowSpan={4} className="text-center align-middle">
                          Date
                        </th>
                        <th colSpan={2} className="text-center align-middle">
                          Opening Balance of Input Stock
                        </th>
                        <th colSpan={16} className="text-center align-middle">
                          Purchased Stock
                        </th>
                        <th colSpan={2} className="text-center align-middle">
                          Closing Balance of Stock
                        </th>
                        <th rowSpan={4} className="text-center align-middle">
                          Reference
                        </th>
                        <th rowSpan={4} className="text-center align-middle">
                          Remarks
                        </th>
                      </tr>
                      <tr>
                        <th rowSpan={3} className="text-center align-middle">
                          Quantity (Unit)
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Value (Excluding all type of Taxes)
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Challan No/Bill of Entry No
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Date
                        </th>
                        <th colSpan={3} className="text-center align-middle">
                          Seller/Supplier
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Description
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Quantity
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Value (Excluding all type of Taxes)
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Supplementary Duty (If Have)
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          VAT
                        </th>
                        <th colSpan={2} className="text-center align-middle">
                          Total Stock Quantity
                        </th>
                        <th colSpan={4} className="text-center align-middle">
                          Stock Consumption for Production/ Process/ Return
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Quantity (Unit)
                        </th>
                        <th rowSpan={3} className="text-center align-middle">
                          Value
                        </th>
                      </tr>

                      <tr>
                        <th className="text-center align-middle" rowSpan={2}>
                          Name
                        </th>
                        <th className="text-center align-middle" rowSpan={2}>
                          Address
                        </th>
                        <th className="text-center align-middle" rowSpan={2}>
                          Registered/Enlist/ National ID NO
                        </th>
                        <th className="text-center align-middle" rowSpan={2}>
                          Quantity (Unit)
                        </th>
                        <th className="text-center align-middle" rowSpan={2}>
                          Value (Excluding all type of Taxes)
                        </th>
                        <th colSpan={2} className="text-center align-middle">
                          Consumption
                        </th>
                        <th colSpan={2} className="text-center align-middle">
                          Return
                        </th>
                      </tr>
                      <tr>
                        <th className="text-center align-middle">
                          Quantity (Unit)
                        </th>
                        <th className="text-center align-middle">Value</th>
                        <th className="text-center align-middle">
                          Quantity (Unit)
                        </th>
                        <th className="text-center align-middle">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="text-center">1</th>
                        <th className="text-center">2</th>
                        <th className="text-center">3</th>
                        <th className="text-center">4</th>
                        <th className="text-center">5</th>
                        <th className="text-center">6</th>
                        <th className="text-center">7</th>
                        <th className="text-center">8</th>
                        <th className="text-center">9</th>
                        <th className="text-center">10</th>
                        <th className="text-center">11</th>
                        <th className="text-center">12</th>
                        <th className="text-center">13</th>
                        <th className="text-center">14</th>
                        <th className="text-center">15</th>
                        <th className="text-center">16</th>
                        <th className="text-center">17</th>
                        <th className="text-center">18</th>
                        <th className="text-center">19</th>
                        <th className="text-center">20</th>
                        <th className="text-center">21</th>
                        <th className="text-center">22</th>
                        <th className="text-center">23</th>
                        <th className="text-center">24</th>
                      </tr>
                      {mushaks?.map((mushak, index) => (
                        <tr key={index}>
                          <th>{index + 1}</th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {moment(mushak.created_at).format("DD MMM YY")}
                          </th>
                          <th className="text-center">{mushak.opening_qty}</th>
                          <th className="text-end">
                            {(
                              mushak.opening_qty * mushak.average_price
                            ).toFixed(2)}
                          </th>
                          {mushak.type == "credit" ? (
                            <>
                              <th>{mushak.purchase?.challan_no}</th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                {moment(mushak.purchase?.challan_date).format(
                                  "DD MMM YY"
                                )}
                              </th>
                              <th>{mushak.purchase?.vendor?.name}</th>
                              <th>
                                {mushak.purchase?.vendor?.contact_address}
                              </th>
                              <th></th>
                              <th>{mushak.info?.title}</th>
                              <th className="text-center">{mushak.qty}</th>
                              <th className="text-end">
                                {(mushak.price * mushak.qty).toFixed(2)}
                              </th>
                              <th>0</th>
                              <th className="text-end">{mushak.vat_amount}</th>
                              <th className="text-center">
                                {mushak.closing_qty}
                              </th>
                              {mushak.average_price == 0 ? (
                                <th className="text-end">
                                  {(mushak.closing_qty * mushak.price).toFixed(
                                    2
                                  )}
                                </th>
                              ) : (
                                <th className="text-end">
                                  {(
                                    mushak.closing_qty * mushak.average_price
                                  ).toFixed(2)}
                                </th>
                              )}
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </>
                          ) : (
                            <>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              {mushak.purchase_return_qty ? (
                                <>
                                  <th></th>
                                  <th></th>
                                  <th className="text-center">
                                    {mushak.purchase_return_qty}
                                  </th>
                                  {mushak.average_price == 0 ? (
                                    <th className="text-end">
                                      {(
                                        mushak.purchase_return_qty *
                                        mushak.price
                                      ).toFixed(2)}
                                    </th>
                                  ) : (
                                    <th className="text-end">
                                      {(
                                        mushak.purchase_return_qty *
                                        mushak.average_price
                                      ).toFixed(2)}
                                    </th>
                                  )}
                                </>
                              ) : (
                                <>
                                  <th className="text-center">{mushak.qty}</th>
                                  {/* {mushak.average_price == 0 ? (
                                    <th className="text-end">
                                      {(mushak.qty * mushak.price).toFixed(2)}
                                    </th>
                                  ) : (
                                    <th className="text-end">
                                      {(
                                        mushak.qty * mushak.average_price
                                      ).toFixed(2)}ss
                                    </th>
                                  )} */}
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                </>
                              )}
                            </>
                          )}

                          <th className="text-center">{mushak.closing_qty}</th>
                          {mushak.average_price == 0 ? (
                            <th className="text-end">
                              {(mushak.closing_qty * mushak.price).toFixed(2)}
                            </th>
                          ) : (
                            <th className="text-end">
                              {(
                                mushak.closing_qty * mushak.average_price
                              ).toFixed(2)}
                            </th>
                          )}
                          {mushak.type == "credit" ? (
                            <>
                              {mushak.purchase ? (
                                <>
                                  <th>
                                    <Link
                                      href={`/purchases/purchaseDetails/${mushak.purchase.id}`}
                                      className="anchor3"
                                    >
                                      {mushak.purchase?.purchase_no}
                                    </Link>
                                  </th>
                                </>
                              ) : (
                                <>
                                  <th>
                                    <Link
                                      href={`/products/stockDetails/${mushak.open_stock_id}`}
                                      className="anchor3"
                                    >
                                      {mushak.opening?.open_stock_no}
                                    </Link>
                                  </th>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <th>
                                {/* <Link
                                  href={`/purchases/purchaseDetails/${mushak.purchase.id}`}
                                  className="anchor3"
                                > */}
                                {mushak.finished?.goods_no}
                                {/* </Link> */}
                              </th>
                            </>
                          )}
                          <th>{mushak.nature}</th>
                        </tr>
                      ))}
                      <tr>
                        <th colSpan={10} className="text-end">
                          Total
                        </th>
                        <th className="text-center">{calculatePurchase()}</th>
                        <th className="text-end">{calculatePurchaseValue()}</th>
                        <th colSpan={4}></th>
                        <th className="text-center">
                          {calculateConsumption()}
                        </th>
                        <th></th>
                        {/* <th className="text-end">
                          {calculateConsumptionValue()}
                        </th> */}
                        <th className="text-center">{calculateReturn()}</th>
                        <th className="text-end">{calculateReturnValue()}</th>

                        <th colSpan={4}></th>
                      </tr>
                    </tbody>
                  </table>
                </div>
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

export default connect(mapStateToProps)(PurchaseVat);
