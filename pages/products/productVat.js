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
// import * as htmlToImage from "html-to-image";
// import { jsPDF } from "jspdf";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

// PRINT
import { useReactToPrint } from "react-to-print";

const ProductVat = ({ token, company }) => {
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

  // FETCH PPRODUCTS BY SERACH
  const searchProduct = (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProducts =
          BASE_URL + "api/v1/product-search?type=1&keyword=" + e;
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

  // download
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

  //print
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
      "api/v1/purchases/mushok_six_two?product_id=" +
      product.id +
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
    return total.toFixed(2);
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
    return total.toFixed(2);
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
    return total.toFixed(2);
  };

  // Download CSV
  const downloadExcel = () => {
    const data = mushaks.map((mushak, index) => {
      return {
        Index: index + 1,
        Date: moment(mushak.created_at).format("DD-MMM-YY"),
        Title: product?.title,
        "Opening QTY": mushak.opening_qty,
        "Opening Value": (mushak.opening_qty * mushak.average_price).toFixed(2),
        "Production QTY": mushak.type == "credit" ? mushak.qty : "",
        "Production Value":
          mushak.type == "credit" ? (mushak.qty * mushak.price).toFixed(2) : "",
        "Return QTY": mushak.sales_return_qty,
        "Return Value": (mushak.sales_return_qty * mushak.price).toFixed(2),
        "Sales QTY": mushak.type == "debit" ? mushak.qty : "",
        "Sales Value":
          mushak.type == "debit" ? (mushak.qty * mushak.price).toFixed(2) : "",
        "Closing QTY": mushak.closing_qty,
        "Closing Value":
          mushak.average_price == 0
            ? (mushak.closing_qty * mushak.price).toFixed(2)
            : (mushak.closing_qty * mushak.average_price).toFixed(2),
        "Invoice No": mushak?.sales?.sales_no,
        "Invoice Date":
          mushak.type == "credit"
            ? ""
            : moment(mushak?.sales?.created_at).format("DD MMM YY h:mm a"),
        "Customer Name": mushak.sales?.customer
          ? mushak.sales.customer.name
          : mushak.sales?.customer_name,
        "Customer Address": mushak.sales?.customer
          ? mushak.sales.customer.address
          : mushak.sales?.customer_address,
        Remarks: mushak.type,
      };
    });
    console.log(data);
    const fileName = `${product.title}_6.2`;
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
          Mushak 6.2
        </Typography>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <h6 className="text-secondary ms-1">Search Finished Goods</h6>
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
                    width: "90%"
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
                    Generate 6.2
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
                className="float-end"
                onClick={downloadExcel}
                color="secondary"
              >
                <Download />
                Download
              </Button>
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
                <b style={{ border: "black 3px solid", padding: "8px" }}>
                  MUHSAK 6.2
                </b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>Sales Account Book</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>[Rule 40(1),Clause KA & Rule 41,Clause KHA]</b>
              </div>
            </div>
            <div className="row justify-content-md-center mt-1">
              <div className="col-md-auto">
                <b>Name of Registered Person: {company?.name}</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>BIN of Registered Person: {company?.company_bin}</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>Challan Issuing Address: {company?.contact_address}</b>
              </div>
            </div>
            <div className="row justify-content-md-center mt-3">
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
                    <th colSpan={24} className="text-center align-middle">
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
                      Opening
                    </th>
                    <th colSpan={4} className="text-center align-middle">
                      Production/Return
                    </th>
                    <th colSpan={2} className="text-center align-middle">
                      Total
                    </th>
                    <th colSpan={3} className="text-center align-middle">
                      Buyer/Customer Information
                    </th>
                    <th colSpan={2} className="text-center align-middle">
                      On Invoice
                    </th>
                    <th colSpan={5} className="text-center align-middle">
                      Supplied Products
                    </th>
                    <th colSpan={2} className="text-center align-middle">
                      Closing
                    </th>
                    <th rowSpan={3} className="text-center align-middle">
                      References
                    </th>
                    <th rowSpan={3} className="text-center align-middle">
                      Remarks
                    </th>
                  </tr>

                  <tr>
                    <th className="text-center align-middle" rowSpan={2}>
                      Quantity (Unit)
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Value
                    </th>
                    <th className="text-center align-middle" colSpan={2}>
                      Production
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
                      Reg No.
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
                      Qty
                    </th>
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
                      QTY
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Value
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
                        {moment(mushak.created_at).format("DD-MMM-YY")}
                      </th>
                      <th>{mushak.opening_qty}</th>
                      <th>
                        {(mushak.opening_qty * mushak.average_price).toFixed(2)}
                      </th>
                      {mushak.type == "credit" ? (
                        <>
                          {mushak.sales_return_qty ? (
                            <>
                              <th></th>
                              <th></th>
                              <th>{mushak.sales_return_qty}</th>
                              <th>
                                {(
                                  mushak.sales_return_qty * mushak.price
                                ).toFixed(2)}
                              </th>
                            </>
                          ) : (
                            <>
                              <th>{mushak.qty}</th>
                              <th>{(mushak.qty * mushak.price).toFixed(2)}</th>
                              <th></th>
                              <th></th>
                            </>
                          )}

                          <th>{mushak.closing_qty}</th>
                          {mushak.average_price == 0 ? (
                            <th>
                              {(mushak.closing_qty * mushak.price).toFixed(2)}
                            </th>
                          ) : (
                            <th>
                              {(
                                mushak.closing_qty * mushak.average_price
                              ).toFixed(2)}
                            </th>
                          )}
                        </>
                      ) : (
                        <>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </>
                      )}

                      {mushak.type == "credit" ? (
                        <>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>{mushak?.info?.sku}</th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </>
                      ) : (
                        <>
                          {mushak.sales.customer ? (
                            <>
                              <th>{mushak?.sales?.customer?.name}</th>
                              <th>{mushak?.sales?.customer?.bin}</th>
                              <th>{mushak?.sales?.customer?.address}</th>
                            </>
                          ) : (
                            <>
                              <th>{mushak?.sales.customer_name}</th>
                              <th>{mushak?.sales.customer_bin}</th>
                              <th>{mushak?.sales.customer_address}</th>
                            </>
                          )}

                          <th>{mushak?.sales?.sales_no}</th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {moment(mushak?.sales.created_at).format(
                              "DD MMM YY h:mm a"
                            )}
                          </th>
                          <th>{mushak?.info?.sku}</th>
                          <th>{mushak.qty}</th>
                          <th>{(mushak.qty * mushak.price).toFixed(2)}</th>
                          <th>{(mushak?.sd_amount).toFixed(2)}</th>
                          <th>{(mushak?.vat_amount).toFixed(2)}</th>
                        </>
                      )}

                      <th>{mushak.closing_qty}</th>
                      {mushak.average_price == 0 ? (
                        <th>
                          {(mushak.closing_qty * mushak.price).toFixed(2)}
                        </th>
                      ) : (
                        <th>
                          {(mushak.closing_qty * mushak.average_price).toFixed(
                            2
                          )}
                        </th>
                      )}

                      {mushak.type == "credit" ? (
                        <th>{mushak.finished?.goods_no}</th>
                      ) : (
                        <th>{mushak.sales?.sales_no}</th>
                      )}
                      <th>{mushak.type}</th>
                    </tr>
                  ))}
                  <tr>
                    <th className="text-end" colSpan={4}>
                      Total
                    </th>
                    <th>{calculateProduction()}</th>
                    <th>{calculateProductionValue()}</th>
                    <th>{calculateReturn()}</th>
                    <th>{calculateReturnValue()}</th>
                    <th colSpan={8}></th>
                    <th>{calculateSales()}</th>
                    <th>{calculateSalesValue()}</th>
                    <th colSpan={6}></th>
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
    company: state.auth.company,
  };
};

export default connect(mapStateToProps)(ProductVat);
