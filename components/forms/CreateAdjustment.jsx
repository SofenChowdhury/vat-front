import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import {
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//date
import { DatePicker } from "antd";
import moment from "moment";

// icons
import SearchIcon from "@mui/icons-material/Search";

const CreateAdjustment = ({ token }) => {
  // Post Variables
  const [type, setType] = useState(null);
  const [reference_no, setReferenceNo] = useState(null);
  const [bank, setBank] = useState(null);
  const [branch, setBranch] = useState(null);
  const [account_code, setAccountCode] = useState(null);
  const [certificate_no, setCertificateNo] = useState(null);
  const [certificate_date, setCertificateDate] = useState(null);
  const [note_no, setNoteNo] = useState(null);
  const [deposit_date, setDepositDate] = useState(null);
  const [ledger_month, setLedgerMonth] = useState(null);
  const [remarks, setRemarks] = useState(null);

  // Helper Variables
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [challan_items, setChallans] = useState([]);
  const [timer, setTimer] = useState(null);
  const [customer_name, setCustomerName] = useState(null);
  const [customer_id, setCustomerID] = useState("");
  const [vendor_name, setVendorName] = useState(null);
  const [vendor_id, setVendorID] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selected, setSelected] = useState(false);

  // Reference Variables
  const multiselectRefCustomers = useRef();
  const multiselectRefVendors = useRef();

  // Date function
  function onChangeCertificate(date, dateString) {
    setCertificateDate(dateString);
  }
  function onChangeDeposit(date, dateString) {
    setDepositDate(dateString);
  }

  // Month Selector
  function onChangeMonth(date, dateString) {
    setLedgerMonth("");
    let FirstDay = new Date(
      moment(dateString).format("YYYY"),
      moment(dateString).format("MM") - 1,
      1
    );
    FirstDay = moment(FirstDay).format("YYYY-MM-DD");
    setLedgerMonth(FirstDay);
  }
  function onChangeMonthSearch(date, dateString) {
    setStartDate("");
    setEndDate("");

    let FirstDay = new Date(
      moment(dateString).format("YYYY"),
      moment(dateString).format("MM") - 1,
      1
    );
    let LastDay = new Date(
      moment(dateString).format("YYYY"),
      moment(dateString).format("MM"),
      0
    );

    FirstDay = moment(FirstDay).format("YYYY-MM-DD");
    LastDay = moment(LastDay).format("YYYY-MM-DD");

    setStartDate(FirstDay);
    setEndDate(LastDay);
  }

  // SEARCH CUSTOMERS
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
  const addCustomer = (list, item) => {
    setCustomerName(item.name);
    setCustomerID(item.id);
    setCustomers([]);
    setSelected(true);
    alert("Customer Selected");
  };
  const resetSelectFieldCustomer = () => {
    multiselectRefCustomers.current.resetSelectedValues();
    setCustomers(null);
    setCustomerName(null);
  };

  // Multiselect Functions 2
  const addVendor = (list, item) => {
    setVendorName(item.name);
    setVendorID(item.id);
    setVendors([]);
    setSelected(true);
    alert("vendor Selected");
  };
  const resetSelectFieldVendor = () => {
    multiselectRefVendors.current.resetSelectedValues();
    setVendors(null);
  };

  // Update dynamic fields
  const updateChecked = (e, id) => {
    const newState = challan_items?.map((product) => {
      if (product.id == id) {
        return { ...product, checked: e };
      }
      return product;
    });
    setChallans(newState);
  };

  // Calculations
  const calculateVDS = (id) => {
    let total = 0;
    challan_items?.map((challan) => {
      if (challan.id == id) {
        challan?.purchase_items?.map((product) => {
          total += product.vds_receive_amount;
        });
      }
    });
    return total.toFixed(2);
  };
  const calculateAV = (id) => {
    let total = 0;
    challan_items?.map((challan) => {
      if (challan.id == id) {
        if (type === "increasing") {
          challan?.purchase_items?.map((product) => {
            total += +product.price * +product.qty;
          });
        } else {
          challan?.sales_items?.map((product) => {
            total += +product.price * +product.qty;
          });
        }
      }
    });
    return total.toFixed(2);
  };
  const calculateVAT = (id) => {
    let total = 0;
    challan_items?.map((challan) => {
      if (challan.id == id) {
        challan?.sales_items?.map((sale) => {
          total += sale.vat_amount;
        });
      }
    });
    return total.toFixed(2);
  };

  const calculateTotalVDS = () => {
    let total = 0;
    challan_items?.map((challan) => {
      if (challan.checked) {
        total += +calculateVDS(challan.id);
      }
    });
    return total.toFixed(2);
  };
  const calculateTotalAV = () => {
    let total = 0;
    challan_items?.map((challan) => {
      if (challan.checked) {
        total += +calculateAV(challan.id);
      }
    });
    return total.toFixed(2);
  };
  const calculateTotalVAT = () => {
    let total = 0;
    challan_items?.map((challan) => {
      if (challan.checked) {
        total += +calculateVAT(challan.id);
      }
    });
    return total.toFixed(2);
  };

  // Search orders/purchases
  const submitSearch = () => {
    const apiChallans =
      BASE_URL +
      "api/v1/vat-adjustment/challan?type=" +
      type +
      "&vendor_id=" +
      vendor_id +
      "&customer_id=" +
      customer_id +
      "&start_date=" +
      startDate +
      "&end_date=" +
      endDate;

    axios
      .get(apiChallans, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          res.data.data.map((item) => {
            item.checked = false;
          });
          setChallans(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Post Data
  const submit = () => {
    let temp = [];

    challan_items.map((ch) => {
      if (ch.checked) {
        temp.push(ch);
      }
    });

    const challans = temp.map((challan) => {
      if (challan.checked) {
        if (type == "increasing") {
          return {
            id: challan.id,
            value: calculateAV(challan.id),
            amount: calculateVDS(challan.id),
          };
        } else {
          return {
            id: challan.id,
            value: calculateAV(challan.id),
            amount: calculateVAT(challan.id),
          };
        }
      } else return null;
    });

    let totalAmount = 0;
    if (type == "increasing") totalAmount = calculateTotalVDS();
    else totalAmount = calculateTotalVAT();

    const adjustmentData = {
      type,
      vendor_id,
      customer_id,
      bank,
      branch,
      account_code,
      reference_no,
      certificate_no,
      certificate_date,
      note_no,
      value: calculateTotalAV(),
      amount: totalAmount,
      deposit_date,
      ledger_month,
      remarks,
      challans,
    };
    const apiAdjustment = BASE_URL + "api/v1/vat-adjustment/payment";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(adjustmentData);

    if (temp.length == 0) {
      alert("Select at least one invoice for adjustment!");
    } else {
      axios
        .post(apiAdjustment, adjustmentData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Adjustment Made");
            Router.push({
              pathname: "/mushak/subForms/adjustments/adjustmentList",
            });
            console.log(response.data);
          } else {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6 mt-4">
          <TextField
            label="Deposit Type"
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
            <MenuItem value={"increasing"}>Increasing</MenuItem>
            <MenuItem value={"decreasing"}>Decreasing</MenuItem>
          </TextField>
        </div>
        <div className="col-md-6 mt-4">
          {type && (
            <div>
              {type === "decreasing" ? (
                <Multiselect
                  placeholder="Search Customers Here. . ."
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
                  emptyRecordMsg="Search By Purchase No/Challan No"
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
              ) : (
                <></>
              )}
              {type === "increasing" ? (
                <Multiselect
                  placeholder="Search Vendors Here. . ."
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
                      width: "90%"
                    },
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
      {selected && (
        <div className="row mt-3">
          <div className="col-md-6 mt-4">
            <div>
              {type === "increasing" ? (
                <TextField
                  label="Vendor Name"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={vendor_name || ""}
                  className="shadow-input"
                  inputProps={{
                    readOnly: true,
                  }}
                />
              ) : (
                <TextField
                  label="Customer Name"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={customer_name || ""}
                  className="shadow-input"
                  inputProps={{
                    readOnly: true,
                  }}
                />
              )}
            </div>
          </div>
          <div className="col-md-5 mt-4">
            <DatePicker
              onChange={onChangeMonthSearch}
              placeholder="Select Month"
              size="large"
              picker="month"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
            />
          </div>
          <div className="col-md-1 mt-4">
            <Button
              variant="contained"
              className="float-end"
              style={{
                height: "42px",
              }}
              size="large"
              onClick={submitSearch}
            >
              <SearchIcon />
            </Button>
          </div>
        </div>
      )}

      {challan_items.length ? (
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

          <div className="table-responsive mt-5">
            <table className="table table-bordered table-striped">
              <thead>
                <tr className="table-success">
                  <th className="text-center">Adjusted?</th>
                  {type == "increasing" ? (
                    <>
                      <th className="text-center">Purchase No</th>
                      <th>Price Total</th>
                      <th>VDS Total</th>
                    </>
                  ) : (
                    <>
                      <th className="text-center">Sales No</th>
                      <th className="text-center">Price Total</th>
                      <th className="text-center">VAT Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {challan_items?.map((challan, index) => (
                  <tr key={index}>
                    <td className="pt-0 pb-0 ps-3">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={challan.checked}
                            onChange={(e) => {
                              updateChecked(e.target.checked, challan.id);
                            }}
                          />
                        }
                      />
                    </td>
                    <td>{challan.purchase_no || challan.sales_no}</td>
                    <td className="text-end">{calculateAV(challan.id)}</td>
                    {type == "increasing" ? (
                      <>
                        <td className="text-end">{calculateVDS(challan.id)}</td>
                      </>
                    ) : (
                      <>
                        <td className="text-end">{calculateVAT(challan.id)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr className="table-success">
                      <th colSpan={2} className="text-center">
                        Adjustment Summary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Total Price</th>
                      <td className="text-end">{calculateTotalAV()}</td>
                    </tr>
                    <tr>
                      <th>Total Adjustment</th>
                      {type == "increasing" ? (
                        <>
                          <td className="text-end">{calculateTotalVDS()}</td>
                        </>
                      ) : (
                        <>
                          <td className="text-end">{calculateTotalVAT()}</td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {challan_items.length ? (
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
          <div className="row">
            <div className="col-md-6 mt-4">
              <div>
                {type === "increasing" ? (
                  <>
                    <TextField
                      label={"Adjustment Type"}
                      variant="outlined"
                      select
                      size="large"
                      type="text"
                      fullWidth
                      value={note_no || ""}
                      className="shadow-input"
                      onChange={(e) => {
                        setNoteNo(e.target.value);
                      }}
                    >
                      <MenuItem value={24}>
                        VAT Deducted at Source from Suppliers (24)
                      </MenuItem>
                      <MenuItem value={27}>Other Adjustments (27)</MenuItem>
                    </TextField>
                  </>
                ) : (
                  <></>
                )}
                {type === "decreasing" ? (
                  <>
                    <TextField
                      label={"Adjustment Type"}
                      variant="outlined"
                      select
                      size="large"
                      type="text"
                      fullWidth
                      value={note_no || ""}
                      className="shadow-input"
                      onChange={(e) => {
                        setNoteNo(e.target.value);
                      }}
                    >
                      <MenuItem value={29}>
                        VAT Deducted at Source from the Supplies Delivered (29)
                      </MenuItem>
                      <MenuItem value={32}>Other Adjustments (32)</MenuItem>
                    </TextField>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {note_no == 27 || note_no == 32 ? (
              <>
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Reference No"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    className="shadow-input"
                    onChange={(e) => {
                      setReferenceNo(e.target.value);
                    }}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="row">
            <div className="col-md-6 mt-4">
              <TextField
                label="Bank"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                className="shadow-input"
                onChange={(e) => {
                  setBank(e.target.value);
                }}
              />
            </div>
            <div className="col-md-6 mt-4">
              <TextField
                label="Branch"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                className="shadow-input"
                onChange={(e) => {
                  setBranch(e.target.value);
                }}
              />
            </div>
          </div>
          {note_no == 24 || note_no == 29 ? (
            <>
              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Account Code"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    className="shadow-input"
                    onChange={(e) => {
                      setAccountCode(e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Reference No"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    className="shadow-input"
                    onChange={(e) => {
                      setReferenceNo(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Certificate No"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    className="shadow-input"
                    onChange={(e) => {
                      setCertificateNo(e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-6 mt-4">
                  <DatePicker
                    placeholder="Certificate Date"
                    size="large"
                    style={{ width: "100%", height: "58px" }}
                    className="shadow-input"
                    onChange={onChangeCertificate}
                  />
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="row">
            <div className="col-md-6 mt-4">
              <DatePicker
                placeholder="Date of Adjustment"
                size="large"
                style={{ width: "100%", height: "58px" }}
                className="shadow-input"
                onChange={onChangeDeposit}
              />
            </div>
            <div className="col-md-6 mt-4">
              <DatePicker
                onChange={onChangeMonth}
                placeholder="Ledger Month"
                size="large"
                picker="month"
                style={{ width: "100%", height: "58px" }}
                className="shadow-input"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mt-4">
              <TextField
                label="Remarks"
                variant="outlined"
                size="large"
                type="text"
                multiline
                rows={4}
                fullWidth
                className="shadow-input"
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <Button
                variant="contained"
                color="secondary"
                style={{ width: "100%" }}
                onClick={submit}
              >
                Adjust TAX
              </Button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateAdjustment);
