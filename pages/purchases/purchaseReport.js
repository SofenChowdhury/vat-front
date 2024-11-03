import React, { useState, useEffect, useRef } from "react";

//theme
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//date
import { DatePicker } from "antd";
import moment from "moment";

//report
import jsPDF from "jspdf";
import "jspdf-autotable";

const PurchaseReport = ({ token, company }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Post Variables
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [challan_no, setChallanNo] = useState("");
  const [purchase_no, setPurchaseNo] = useState("");

  // Helper Variables
  const [vendors, setVendors] = useState([]);
  const [vendor_name, setVendorName] = useState(null);
  const [vendor_id, setVendorID] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [timer, setTimer] = useState(null);
  const [type, setType] = useState("year");
  const [showEmpty, setShowEmpty] = useState(false);
  const [loader, setLoader] = useState(false);

  // Date Variables
  const { RangePicker } = DatePicker;

  // Reference Variables
  const multiselectRefVendors = useRef();

  // Fetch Orders
  const generatePurchases = () => {
    setLoader(true);
    const apiPurchaseDownload =
      BASE_URL +
      "api/v1/purchases-download?purchase_no=" +
      purchase_no +
      "&challan_no=" +
      challan_no +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&vendor_id=" +
      vendor_id;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(apiPurchaseDownload, config)
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setPurchases(response.data.data);
          setShowEmpty(true);
          setLoader(false);
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Clear Search
  const clearSearch = () => {
    setShowEmpty(false);
    resetSelectFieldVendor();
    setStartDate("");
    setEndDate("");
    setType("year");
    setChallanNo("");
    setPurchaseNo("");
    setPurchases([]);
  };

  // SEARCH VENDORS
  const searchVendors = async (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setVendors([]);
      } else {
        setVendors([]);
        const apiVendors = BASE_URL + "api/v1/vendors/search?keyword=" + e;
        axios
          .get(apiVendors, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status == true) {
              setVendors(res.data.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
  };

  // Multiselect Functions
  const addVendor = (list, item) => {
    setVendorName(item.name);
    setVendorID(item.id);
    setVendors([]);
  };
  const resetSelectFieldVendor = () => {
    multiselectRefVendors.current.resetSelectedValues();
    setVendors([]);
    setVendorName("");
    setVendorID("");
  };

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

  // Report Function
  const generatePdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(16);
    doc.text(company.name, 15, 10);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(company.contact_address, 15, 15);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Purchase Report", 15, 25);
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`VAT Reg. No: ${company.company_bin}`, 15, 30);
    doc.setFontSize(9);
    doc.text(
      `Printing Date: ${moment(Date.now()).format("DD MMM, YYYY hh:mm a")}`,
      15,
      37
    );
    doc.text(
      `From Date: ${moment(start_date).format("DD MMM, YYYY")}`,
      100,
      37
    );
    doc.text(`To Date: ${moment(end_date).format("DD MMM, YYYY")}`, 185, 37);

    doc.autoTable({
      html: ".table",
      startY: 40,
      useCss: true,
    });

    doc.output("dataurlnewwindow");
  };

  const getTotalQty = () => {
    let total = 0;
    purchases?.map((purchase) => {
      purchase.purchase_items?.map((item) => {
        total += +item.qty;
      });
    });
    return total;
  };
  const getTotalValue = () => {
    let total = 0;
    purchases?.map((purchase) => {
      purchase.purchase_items?.map((item) => {
        total += +item.total_price;
      });
    });
    return total;
  };
  const getTotalVat = () => {
    let total = 0;
    purchases?.map((purchase) => {
      purchase.purchase_items?.map((item) => {
        total += +item.vat_amount;
      });
    });
    return total;
  };
  const getTotalSD = () => {
    let total = 0;
    purchases?.map((purchase) => {
      purchase.purchase_items?.map((item) => {
        total += +item.sd;
      });
    });
    return total;
  };
  const getTotalAT = () => {
    let total = 0;
    purchases?.map((purchase) => {
      purchase.purchase_items?.map((item) => {
        total += +item.at;
      });
    });
    return total;
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
            Purchase Report
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
          <TextField
            label="Purchase No"
            variant="outlined"
            size="large"
            type="text"
            value={purchase_no || ""}
            fullWidth
            onChange={(e) => setPurchaseNo(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-3 mt-4">
          <TextField
            label="Challan No"
            variant="outlined"
            size="large"
            type="text"
            value={challan_no || ""}
            fullWidth
            onChange={(e) => setChallanNo(e.target.value)}
            className="shadow-input"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mt-4">
          <Multiselect
            placeholder={vendor_name ? vendor_name : "Search Vendors Here. . ."}
            cursor="pointer"
            displayValue="name"
            // onRemove={removeColumn}
            onSelect={addVendor}
            options={vendors}
            onSearch={(e) => {
              searchVendors(e);
            }}
            ref={multiselectRefVendors}
            hideSelectedList
            emptyRecordMsg="Search By Name, Phone, Email, BIN"
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
            onClick={generatePurchases}
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
          {showEmpty && purchases.length == 0 && (
            <div className="row">
              <div className="col-md-12 mt-5">
                <Typography variant="h4" className="mb-4" color="red">
                  No Report Found!
                </Typography>
              </div>
            </div>
          )}

          {purchases.length > 0 && (
            <>
              <table className="table mt-5 table-bordered" id=".table">
                <thead>
                  <tr className="table-success">
                    <th>Purchase No</th>
                    <th>Challan No</th>
                    <th>Purchase Date</th>
                    <th>Vendor Name</th>
                    <th>Vendor BIN</th>
                    <th>Item SKU</th>
                    <th>Quantity</th>
                    <th>Value</th>
                    <th>SD</th>
                    <th>AT</th>
                    <th>VAT</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases?.map((purchase, index) =>
                    purchase.purchase_items?.map((item, idx) => (
                      <tr key={`${index}-${idx}`}>
                        <td>{purchase.purchase_no}</td>
                        <td>{purchase.challan_no}</td>
                        <td>{purchase.challan_date}</td>
                        <td>{purchase.vendor?.name}</td>
                        <td>{purchase.vendor?.vendor_bin}</td>
                        <td>{item.info?.sku}</td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-end">
                          {Intl.NumberFormat().format(
                            (+item.total_price).toFixed(2)
                          )}
                        </td>
                        <td className="text-end">
                          {Intl.NumberFormat().format((+item.sd).toFixed(2))}
                        </td>
                        <td className="text-end">
                          {Intl.NumberFormat().format((+item.at).toFixed(2))}
                        </td>
                        <td className="text-end">
                          {Intl.NumberFormat().format(
                            (+item.vat_amount).toFixed(2)
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr>
                    <th colSpan={6} className="text-end">
                      Total
                    </th>
                    <th className="text-center">
                      {Intl.NumberFormat().format((+getTotalQty()).toFixed(2))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(
                        (+getTotalValue()).toFixed(2)
                      )}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format((+getTotalSD()).toFixed(2))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format((+getTotalAT()).toFixed(2))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format((+getTotalVat()).toFixed(2))}
                    </th>
                  </tr>
                </tbody>
              </table>

              <div className="row">
                <div className="col-md-12 mt-4">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={generatePdf}
                    size="large"
                  >
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
    company: state.auth.company,
  };
};

export default connect(mapStateToProps)(PurchaseReport);
