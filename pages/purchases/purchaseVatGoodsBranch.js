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
  Chip,
  MenuItem,
  TextField,
  Autocomplete,
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

// PDF
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

// PRINT
import { useReactToPrint } from "react-to-print";

const purchaseVatGoodsBranch = ({ token }) => {
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
  const [branches, setBranches] = useState([]);
  const [branch_id, setBranchId] = useState(0);

  // Booleans
  const [loader, setLoader] = useState(true);
  const [loaderCustomers, setLoaderCustomers] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  // Reference Variable
  const printRef = useRef();
  const multiselectRef = useRef();

  // Multiselect functions 2
  const selectProduct = (list, item) => {
    setProduct(item);
    alert("Finished Good Selected");
  };

  const resetSelectField = () => {
    setProducts([]);
    setProduct({});
    multiselectRef.current.resetSelectedValues();
  };

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

  // FETCH PPRODUCTS BY SERACH
  const searchProduct = (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProducts =
          BASE_URL + "api/v1/product-search?type=&keyword=" + e;
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

  // download and print
  const downloadPdf = async () => {
    const data = await htmlToImage.toPng(printRef.current);

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    const name =
      product?.title +
      "_" +
      moment(start_date).format("DD MMM YY") +
      "_" +
      moment(end_date).format("DD MMM YY") +
      "_6.1.pdf";

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(name);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

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
      // let LastDay = new Date(
      //   moment(today).format("YYYY"),
      //   moment(today).format("MM"),
      //   0
      // );
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

  // hover functions
  const handleMouseOver = () => {
    setLoaderCustomers(true);
  };

  const handleMouseOut = () => {
    setLoaderCustomers(false);
  };

  const getMushak = () => {
    const apiMushak =
      BASE_URL +
      "api/v1/mushok/six-two-one?product_id=" +
      product.id +
      "&branch_id=" +
      branch_id +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;

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
  const calculateProduction = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "credit" && mushak.sales_return_qty == 0)
        total += mushak.qty;
    });
    return total;
  };
  const calculateProductionValue = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "credit" && mushak.sales_return_qty == 0)
        total += +mushak.price * +mushak.qty;
    });
    return total;
  };
  const calculateReturn = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "credit" && mushak.sales_return_qty != 0)
        total += mushak.qty;
    });
    return total;
  };
  const calculateReturnValue = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "credit" && mushak.sales_return_qty != 0)
        total += +mushak.price * +mushak.qty;
    });
    return total;
  };
  const calculateSales = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "debit") total += mushak.qty;
    });
    return total;
  };
  const calculateSalesValue = () => {
    let total = 0;
    mushaks?.map((mushak) => {
      if (mushak.type === "debit") total += +mushak.price * +mushak.qty;
    });
    return total;
  };

  const handleBranchChange = (event, value) => {
    if (value) {
      setBranchId(value.id);
    } else {
      setBranchId(null);
    }
  };

  console.log(branch_id);

  return (
    <>
      <div className="row">
        <Typography
          variant="h2"
          className="mb-4"
          color={colors.greenAccent[300]}
        >
          Mushak 6.2.1 Branch
        </Typography>
      </div>
      <div className="row">
        <div className="col-md-4">
          <h6 className="text-secondary">Branches</h6>
          {/* <TextField
            onChange={(e) => setBranchId(+e.target.value)}
            select
            label="Branch"
            size="large"
            fullWidth
            value={branch_id || ""}
            className="shadow-input mt-2"
          >
            {branches?.map((branch, index) => (
              <MenuItem value={branch.id} key={index}>
                {branch.name}
              </MenuItem>
            ))}
          </TextField> */}
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
        <div className="col-md-4">
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
              <div className="col-md-8 mt-2">
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
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="row">
            <h6 className="text-secondary ms-1">Search Products</h6>
          </div>
          <div className="row">
            <div className="col-md-7">
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
                    width: "90%"
                  },
                }}
              />
            </div>
            <div className="col-md-1">
              <Button
                style={{ width: "100%" }}
                size="large"
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
      </div>

      {product.title?.length ? (
        <>
          <div className="row mt-5">
            <div className="col-md-6">
              <div className="row">
                <h6 className="text-secondary ms-1">Selected Finished Good</h6>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
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
                    Generate 6.2.1 Branch
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
              <Button
                variant="contained"
                size="large"
                onClick={downloadPdf}
                color="secondary"
              >
                <Download />
                Download
              </Button>
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
            <div className="row justify-content-end">
              <div className="col-sm-2">
                <b>MUHSAK 6.2.1</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>Purchase Account Book</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>
                  (Applicable for registered or enlisted person engaged in
                  supply of goods or services)
                </b>
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
            <div className="mt-4">
              <table
                className="table table-hover table-bordered"
                style={{ border: "black" }}
              >
                <thead>
                  <tr>
                    <th colSpan={31} className="text-center align-middle">
                      Product/Service Sales
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} className="text-center align-middle">
                      S/L NO
                    </th>
                    <th rowSpan={4} className="text-center align-middle">
                      Date
                    </th>
                    <th colSpan={2} className="text-center align-middle">
                      Opening Balance of Saleable stock
                    </th>
                    <th colSpan={5} className="text-center align-middle">
                      Purchase / Received Stock / Return
                    </th>
                    <th colSpan={2} className="text-center align-middle">
                      Total Stock
                    </th>
                    <th colSpan={3} className="text-center align-middle">
                      Supplier / Seller
                    </th>
                    <th colSpan={2} className="text-center align-middle">
                      Purchase Challan or Bill of Entry Details
                    </th>
                    <th colSpan={6} className="text-center align-middle">
                      Supplied Products
                    </th>
                    <th colSpan={3} className="text-center align-middle">
                      Buyer/Receipent
                    </th>
                    <th colSpan={2} className="text-center align-middle">
                      Description of Challans
                    </th>
                    <th colSpan={2} className="text-center align-middle">
                      Branch Closing
                    </th>
                    <th rowSpan={3} className="text-center align-middle">
                      References
                    </th>
                    <th rowSpan={3} className="text-center align-middle">
                      Remarks
                    </th>
                  </tr>

                  <tr>
                    <th className="text-center align-middle" rowSpan={3}>
                      Branch Opening
                    </th>
                    <th className="text-center align-middle" rowSpan={3}>
                      Value
                    </th>
                    <th className="text-center align-middle" colSpan={3}>
                      Purchase/ Reveived
                    </th>
                    <th className="text-center align-middle" colSpan={2}>
                      Return
                    </th>

                    <th className="text-center align-middle" rowSpan={2}>
                      Quantity (Unit)
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Value
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Name
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Registration Number / Enlist Number / National ID Number
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Address
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Number
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Date & Time
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Description
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Sales Qty
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Transfer Qty
                    </th>
                    {/* <th className="text-center align-middle" rowSpan={2}>
                      Transfer Qty
                    </th> */}
                    <th className="text-center align-middle" rowSpan={2}>
                      Value (Without SD & VAT)
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      SD
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      VAT
                    </th>

                    <th className="text-center align-middle" rowSpan={2}>
                      Name
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      BIN No / Enlistment No / National ID No
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Address
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Number
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Date
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Quantity
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Value
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center align-middle">Qty Purchase</th>
                    <th>Qty Received</th>

                    <th className="text-center align-middle">Value</th>
                    <th className="text-center align-middle">Quantity</th>
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
                    <th className="text-center">25</th>
                    <th className="text-center">26</th>
                    <th className="text-center">27</th>
                    <th className="text-center">28</th>
                    <th className="text-center">29</th>
                    <th className="text-center">30</th>
                    <th className="text-center">31</th>
                  </tr>
                  {mushaks?.map((mushak, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        {moment(mushak.created_at).format("DD-MMM-YY")}
                      </th>
                      <th>{mushak.branch_opening}</th>
                      <th>{mushak.branch_opening * mushak.average_price}</th>

                      {mushak.type == "credit" ? (
                        <>
                          {mushak.sales_return_qty ? (
                            <>
                              <th></th>
                              <th></th>
                              <th>-</th>
                              <th>{mushak.sales_return_qty}</th>
                              <th>{mushak.sales_return_qty * mushak.price}</th>
                            </>
                          ) : (
                            <>
                              {mushak.is_transfer ? (
                                <>
                                  <th>-</th>
                                  <th>{mushak.qty}</th>
                                </>
                              ) : (
                                <>
                                  <th>{mushak.qty}</th>
                                  <th>-</th>
                                </>
                              )}

                              <th>{mushak.qty * mushak.price}</th>

                              {/* return */}
                              <th></th>
                              <th></th>
                            </>
                          )}

                          {mushak?.nature === "OpeningStock" ? (
                            <th>{mushak.branch_opening}</th>
                          ) : (
                            <th>{mushak.qty + mushak.branch_opening}</th>
                          )}

                          {mushak.average_price == 0 ? (
                            <th>{mushak.qty * mushak.price}</th>
                          ) : (
                            <th>{mushak.qty * mushak.average_price}</th>
                          )}
                        </>
                      ) : (
                        <>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>{mushak.branch_opening}</th>
                          <th>
                            {mushak.branch_opening * mushak.average_price}
                          </th>
                        </>
                      )}

                      {mushak.type == "credit" ? (
                        <>
                          {mushak.sales_return_qty ? (
                            <>
                              <th>{mushak?.sales?.customer?.name}</th>
                              <th>{mushak?.sales?.customer?.nid}</th>
                              <th>{mushak?.sales?.customer?.address}</th>
                            </>
                          ) : (
                            <>
                              {mushak.is_transfer ? (
                                <>
                                  {/* branch from */}
                                  <th>{mushak?.transfer?.from_branch?.name}</th>
                                  <th></th>

                                  <th>
                                    {mushak?.transfer?.from_branch?.address}
                                  </th>
                                </>
                              ) : (
                                <>
                                  <th>{mushak?.purchase?.vendor?.name}</th>
                                  <th>
                                    {mushak?.purchase?.vendor?.vendor_bin}
                                  </th>
                                  <th>
                                    {mushak?.purchase?.vendor?.contact_address}
                                  </th>
                                </>
                              )}

                              {/* branch from */}
                              {/* <th>{mushak?.purchase?.vendor?.name}</th>
                              <th>{mushak?.purchase?.vendor?.vendor_bin}</th>
                              <th>
                                {mushak?.purchase?.vendor?.contact_address}
                              </th> */}
                            </>
                          )}

                          <th>{mushak?.purchase?.challan_no}</th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {mushak?.purchase?.challan_date}
                          </th>
                          <th>{mushak?.info.title}</th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>-</th>
                        </>
                      ) : (
                        <>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>{mushak?.info.title}</th>
                          {/* <th>{mushak.qty}fffffffff</th> */}
                          {mushak.is_transfer ? (
                            <>
                              <th>-</th>
                              <th>{mushak.qty}</th>
                            </>
                          ) : (
                            <>
                              <th>{mushak.qty}</th>
                              <th>-</th>
                            </>
                          )}

                          <th>{mushak.qty * mushak.price}</th>
                          <th>{mushak?.sd_amount}</th>
                          <th>{mushak?.vat_amount}</th>

                          {/* branch to */}
                          {/* 
                          <th>{mushak?.sales?.customer?.name}</th>
                          <th>{mushak?.sales?.customer?.nid}</th>
                          <th>{mushak?.sales?.customer?.address}</th> */}
                          {mushak.is_transfer ? (
                            <>
                              {/* branch from */}
                              <th>{mushak?.transfer?.to_branch?.name}</th>
                              <th></th>

                              <th>{mushak?.transfer?.to_branch?.address}</th>
                            </>
                          ) : (
                            <>
                              <th>{mushak?.sales?.customer?.name}</th>
                              <th>{mushak?.sales?.customer?.nid}</th>
                              <th>{mushak?.sales?.customer?.address}</th>
                            </>
                          )}

                          <th>{mushak?.sales?.sales_no}</th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {moment(mushak?.created_at).format("DD MMM YY")}
                          </th>
                        </>
                      )}

                      <th>{mushak.branch_closing}</th>
                      {mushak.average_price == 0 ? (
                        <th>
                          {(mushak.branch_closing * mushak.price).toFixed(2)}
                        </th>
                      ) : (
                        <th>
                          {(
                            mushak.branch_closing * mushak.average_price
                          ).toFixed(2)}
                        </th>
                      )}

                      {mushak.type == "credit" ? (
                        <th>{mushak.finished?.goods_no}</th>
                      ) : (
                        <th>{mushak.sales?.sales_no}</th>
                      )}
                      <th>{mushak?.nature}</th>
                    </tr>
                  ))}
                  <tr>
                    <th className="text-end" colSpan={4}>
                      Total
                    </th>
                    <th>{calculateProduction()}</th>
                    <th></th>
                    <th>{calculateProductionValue()}</th>
                    <th>{calculateReturn()}</th>
                    <th>{calculateReturnValue()}</th>
                    <th colSpan={9}></th>
                    <th>{calculateSales()}</th>
                    <th>{calculateSalesValue()}</th>
                    <th colSpan={12}></th>
                  </tr>
                </tbody>
              </table>
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

export default connect(mapStateToProps)(purchaseVatGoodsBranch);
