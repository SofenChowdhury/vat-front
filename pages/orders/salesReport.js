import React, { useState, useEffect, useRef } from "react";

//theme
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

const SalesReport = ({ token, company }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Post Variables
  const [branch_id, setBranchId] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [mobile, setMobile] = useState("");
  const [reference_no, setReferenceNo] = useState("");
  const [sales_no, setSalesNo] = useState("");
  const [status, setStatus] = useState(1);

  // Helper Variables
  const [customers, setCustomers] = useState([]);
  const [customer_name, setCustomerName] = useState(null);
  const [customer_id, setCustomerID] = useState("");
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [timer, setTimer] = useState(null);
  const [type, setType] = useState("year");
  const [showEmpty, setShowEmpty] = useState(false);
  const [loader, setLoader] = useState(false);

  // Date Variables
  const { RangePicker } = DatePicker;

  // Reference Variables
  const multiselectRefCustomers = useRef();

  // FETCH BRANHCES
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

  // Fetch Orders
  const generateOrders = () => {
    setLoader(true);
    const apiOrderSearch =
      BASE_URL +
      "api/v1/sales/download?branch_id=" +
      branch_id +
      "&sales_no=" +
      sales_no +
      "&mobile=" +
      mobile +
      "&status=" +
      status +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&customer_id=" +
      customer_id +
      "&reference_no=" +
      reference_no;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(apiOrderSearch);
    axios
      .get(apiOrderSearch, config)
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setOrders(response.data.data);
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
    resetSelectFieldCustomer();
    setStartDate("");
    setEndDate("");
    setType("year");
    setStatus(1);
    setBranchId("");
    setMobile("");
    setSalesNo("");
    setReferenceNo("");
    setOrders([]);
  };

  // Branch Change
  const handleBranchChange = (event, value) => {
    if (value) {
      setBranchId(value.id);
    } else {
      setBranchId("");
    }
  };

  const searchCustomers = async (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setCustomers([]);
      } else {
        setCustomers([]);
        const apiCustomers = BASE_URL + "api/v1/customers/search/" + e;
        axios
          .get(apiCustomers, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status == true) {
              setCustomers(res.data.data);
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
  const addCustomer = (list, item) => {
    setCustomerName(item.name);
    setCustomerID(item.id);
    setCustomers([]);
  };
  const resetSelectFieldCustomer = () => {
    multiselectRefCustomers.current.resetSelectedValues();
    setCustomers([]);
    setCustomerName(null);
    setCustomerID("");
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
    doc.text("Sales Report", 15, 25);
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
      head: [
        [
          "Sales No",
          "Sales Date",
          "Customer Name",
          "Customer BIN",
          "Item SKU",
          "Qunatity",
          "Value",
          "SD",
          "VAT",
        ],
      ],
      body: orders.flatMap((order) =>
        order.sales_items.map((sale) => [
          order.sales_no,
          order.challan_date,
          order.customer_name,
          order.customer?.bin,
          sale.item_info.sku,
          {
            content: sale.qty,
            styles: { halign: "center" },
          },
          {
            content: Intl.NumberFormat().format(sale.total_price.toFixed(2)),
            styles: { halign: "right" },
          },
          {
            content: "0",
            styles: { halign: "right" },
          },
          {
            content: Intl.NumberFormat().format(sale.vat_amount.toFixed(2)),
            styles: { halign: "right" },
          },
        ])
      ),
      foot: [
        [
          {
            content: "Total",
            colSpan: 5,
            styles: { halign: "right" },
          },
          {
            content: Intl.NumberFormat().format((+getTotalQty()).toFixed(2)),
            styles: { halign: "center" },
          },
          {
            content: Intl.NumberFormat().format((+getTotalValue()).toFixed(2)),
            styles: { halign: "right" },
          },
          {
            content: "0",
            styles: { halign: "right" },
          },
          {
            content: Intl.NumberFormat().format((+getTotalVat()).toFixed(2)),
            styles: { halign: "right" },
          },
        ],
      ],
      startY: 42,
      styles: {
        cellPadding: 0.6,
        lineColor: (226, 227, 229),
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: (226, 227, 229),

        lineColor: (226, 227, 229),
        textColor: 0,
      },
      footStyles: {
        fillColor: (226, 227, 229),
        lineColor: (226, 227, 229),
        textColor: 0,
      },
      theme: "plain",
      // html: ".table",
      // useCss: true,
    });

    doc.output("dataurlnewwindow");
  };

  const getTotalQty = () => {
    let total = 0;
    orders?.map((order) => {
      order.sales_items?.map((item) => {
        total += +item.qty;
      });
    });
    return total;
  };
  const getTotalValue = () => {
    let total = 0;
    orders?.map((order) => {
      order.sales_items?.map((item) => {
        total += +item.total_price;
      });
    });
    return total;
  };
  const getTotalVat = () => {
    let total = 0;
    orders?.map((order) => {
      order.sales_items?.map((item) => {
        total += +item.vat_amount;
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
            Sales Report
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
            onChange={(e) => setStatus(e.target.value)}
            select
            label="Order Status"
            size="large"
            fullWidth
            value={status}
            className="shadow-input"
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </TextField>
        </div>
        <div className="col-md-3 mt-4">
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
      </div>
      <div className="row">
        <div className="col-md-3 mt-4">
          <Multiselect
            placeholder={
              customer_name ? customer_name : "Search Customers Here. . ."
            }
            cursor="pointer"
            displayValue="name"
            // onRemove={removeColumn}
            onSelect={addCustomer}
            options={customers}
            onSearch={(e) => {
              searchCustomers(e);
            }}
            ref={multiselectRefCustomers}
            hideSelectedList
            emptyRecordMsg="Search By Name"
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
        <div className="col-md-3 mt-4">
          <TextField
            label="Customer Phone"
            variant="outlined"
            size="large"
            type="text"
            value={mobile || ""}
            fullWidth
            onChange={(e) => setMobile(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-3 mt-4">
          <TextField
            label="Sales No"
            variant="outlined"
            size="large"
            type="text"
            value={sales_no || ""}
            fullWidth
            onChange={(e) => setSalesNo(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-3 mt-4">
          <TextField
            label="Reference No"
            variant="outlined"
            size="large"
            type="text"
            value={reference_no || ""}
            fullWidth
            onChange={(e) => setReferenceNo(e.target.value)}
            className="shadow-input"
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
            onClick={generateOrders}
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
          {showEmpty && orders.length == 0 && (
            <div className="row">
              <div className="col-md-12 mt-5">
                <Typography variant="h4" className="mb-4" color="red">
                  No Report Found!
                </Typography>
              </div>
            </div>
          )}

          {orders.length > 0 && (
            <>
              <table className="table mt-5 table-bordered" id=".table">
                <thead>
                  <tr className="table-success">
                    <th>Sales No</th>
                    <th>Sales Date</th>
                    <th>Customer Name</th>
                    <th>Customer BIN</th>
                    <th>Item SKU</th>
                    <th>Quantity</th>
                    <th>Value</th>
                    <th>SD</th>
                    <th>VAT</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order, index) =>
                    order.sales_items?.map((sale, idx) => (
                      <tr key={`${index}-${idx}`}>
                        <td>{order.sales_no}</td>
                        <td>{order.challan_date}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.customer?.bin}</td>
                        <td>{sale.item_info?.sku}</td>
                        <td className="text-center">{sale.qty}</td>
                        <td className="text-end">
                          {Intl.NumberFormat().format(
                            (+sale.total_price).toFixed(2)
                          )}
                        </td>
                        <td className="text-end">0</td>
                        <td className="text-end">
                          {Intl.NumberFormat().format(
                            (+sale.vat_amount).toFixed(2)
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr>
                    <th colSpan={5} className="text-end">
                      Total
                    </th>
                    <td className="text-center">
                      {Intl.NumberFormat().format((+getTotalQty()).toFixed(2))}
                    </td>
                    <td className="text-end">
                      {Intl.NumberFormat().format(
                        (+getTotalValue()).toFixed(2)
                      )}
                    </td>
                    <td className="text-end">0</td>
                    <td className="text-end">
                      {Intl.NumberFormat().format((+getTotalVat()).toFixed(2))}
                    </td>
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

export default connect(mapStateToProps)(SalesReport);
