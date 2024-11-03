import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Pagination,
  TextField,
  MenuItem,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";

// Excel
import ExportExcel from "../../components/services/ExportExcel";
import moment from "moment";

const purchaseList = ({ token, roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { RangePicker } = DatePicker;

  // Search
  const [purchase_no, setPurchaseNo] = useState("");
  const [challan_no, setChallanNo] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [vendor_id, setVendorID] = useState("");
  const [type, setType] = useState("");

  // Helper
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendor_name, setVendorName] = useState(null);
  const [loader, setLoader] = useState(true);
  const [timer, setTimer] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  // Reference Variables
  const multiselectRefVendors = useRef();

  // Fetch Purchase List
  useEffect(() => {
    setLoader(true);
    const apiPurchases =
      BASE_URL +
      "api/v1/purchases/search?page=" +
      page +
      "&type=" +
      type +
      "&vendor_id=" +
      vendor_id +
      "&purchase_no=" +
      purchase_no +
      "&challan_no=" +
      challan_no +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;

    console.log(apiPurchases);

    axios
      .get(apiPurchases, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.status == true) {
          setLoader(false);
          setPurchases(res.data.data.data);
          setLastPage(res.data.data.last_page);
          setTotalData(res.data.data.total);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, purchase_no, challan_no, start_date, end_date, vendor_id, type]);

  // Date Change
  function onChange(date, dateString) {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  }

  // Search
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

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  const downloadPurchases = async () => {
    const apiPurchaseDownload =
      BASE_URL +
      "api/v1/purchases-download?purchase_no=" +
      purchase_no +
      "&challan_no=" +
      challan_no +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .get(apiPurchaseDownload, config)
      .then((response) => {
        if (response.data.status) {
          // console.log(response.data.data);

          let index = 0;
          let temp = {};
          let data = [];
          response.data.data.map((purchase) => {
            purchase.purchase_items.map((item) => {
              index++;
              const date = moment(purchase.created_at).format("DD MMM YYYY");
              const time = moment(purchase.created_at).format("hh:mm A");
              temp = {
                SL: index,
                "Purchase No": purchase.purchase_no,
                "Challan No": purchase.challan_no,
                Date: date,
                Time: time,
                "Purchase Type": purchase.type,
                "Vendor Name": purchase.vendor?.name,
                "Vendor Mobile": purchase.vendor?.contact_number,
                "Vendor BIN": purchase.vendor?.vendor_bin,
                "Vendor TIN": purchase.vendor?.vendor_tin,
                "Item SKU": item.info?.sku,
                "Item Title": item.info?.title,
                "Item Price": item.price,
                "Item Quantity": item.qty,
                "Total Price": item.total_price,
                CD: item.cd,
                RD: item.rd,
                SD: item.sd,
                "VAT Rate": item.vat_rate,
                "VAT Amount": item.vat_amount,
                AT: item.at,
                AIT: item.ait,
                "Rebatable Amount":
                  item.vat_rebetable_amount > 0 ? item.vat_rebetable_amount : 0,
                "Rebatable VAT": item.vat_rebetable_amount,
                "Total TAX": item.tti,
                "Sub Total": +(item.total_price + +item.tti),
                "VAT Rebatabale Amount": item.vat_rebetable_amount,
                "VDS Receive Amount": item.vds_receive_amount,
              };
              data.push(temp);
            });
          });
          console.log(data);
          const fileName = "PurchaseList";
          const exportType = "csv";
          ExportExcel(data, fileName, exportType);
        } else {
          // setFormErrors(Object.values(response.data.errors));
          console.log(response.data);
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
            Purchase List
          </Typography>
        </div>
        <div className="col-md-6">
          <Button
            variant="outlined"
            className="float-end me-2"
            onClick={downloadPurchases}
            size="large"
          >
            Download
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mt-2">
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
        <div className="col-md-2 mt-2">
          <TextField
            label="Purchase No."
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setPurchaseNo(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-2 mt-2">
          <TextField
            label="Challan No."
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setChallanNo(e.target.value)}
            className="shadow-input"
          />
        </div>
        {/* <div className="col-md-3 mt-2"></div> */}
        <div className="col-md-3 mt-2">
          <RangePicker
            onChange={onChange}
            size="large"
            style={{ width: "100%", height: "58px" }}
            className="shadow-input"
          />
        </div>
        <div className="col-md-2 mt-2">
          <TextField
            label="Purchase Type"
            variant="outlined"
            select
            size="large"
            fullWidth
            type="number"
            onChange={(e) => {
              setType(e.target.value);
            }}
            className="shadow-input"
            value={type || ""}
          >
            <MenuItem value={"Contractual"}>Contractual</MenuItem>
            <MenuItem value={"Imported"}>Imported</MenuItem>
            <MenuItem value={"Local"}>Local</MenuItem>
          </TextField>
        </div>
      </div>
      {loader ? (
        <CircularProgress color="success" className="mt-5" />
      ) : (
        <>
          <div className="table-responsive mt-5">
            <table className="table table-striped table-hover">
              <thead>
                <tr className="table-success">
                  <th>Purchase No.</th>
                  <th>Challan No.</th>
                  <th>Challan Date</th>
                  <th>Stock Branch</th>
                  <th>Vendor Name</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Type</th>
                  {roles[0].id != 5 && <th>Return</th>}
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <tr key={index}>
                    <td>
                      <Link
                        href={`/purchases/purchaseDetails/${purchase.id}`}
                        className="anchor3"
                      >
                        {purchase.purchase_no}
                      </Link>
                    </td>
                    <td>{purchase.challan_no}</td>
                    <td>
                      {moment(purchase.challan_date).format("DD MMM YYYY")}
                    </td>
                    <td>{purchase.branch?.name}</td>
                    <td>{purchase.vendor?.name}</td>
                    <td>{purchase.user?.name}</td>
                    <td>
                      {moment(purchase.created_at).format(
                        "DD MMM YYYY - hh:mm A"
                      )}
                    </td>
                    <td>{purchase.type}</td>
                    {roles[0].id != 5 && (
                      <td>
                        <Link
                          className="anchor"
                          href={`/purchases/purchaseReturn/${purchase.id}`}
                        >
                          <Button variant="contained" size="large">
                            Return
                          </Button>
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 d-flex justify-content-center">
              <Pagination
                count={lastPage}
                page={page}
                color="secondary"
                size="large"
                onChange={handleChange}
              />
              {page === lastPage ? (
                <span className="ms-3 mt-2">
                  Showing {1 + (page - 1) * 20} - {totalData} out of {totalData}
                </span>
              ) : (
                <>
                  {totalData === 0 ? (
                    <span className="ms-3 mt-2">Showing 0 out of 0</span>
                  ) : (
                    <span className="ms-3 mt-2">
                      Showing {1 + (page - 1) * 20} - {20 + (page - 1) * 20} out
                      of {totalData}
                    </span>
                  )}
                </>
              )}
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
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(purchaseList);
