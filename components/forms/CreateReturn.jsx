import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// bootstarp
import Form from "react-bootstrap/Form";
import {
  Button,
  Snackbar,
  IconButton,
  Alert,
  AlertTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

// Date
import { DatePicker } from "antd";

// icons
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import CloseIcon from "@mui/icons-material/Close";

const CreateReturn = ({ token, userBranch }) => {
  // POST VARIABLES
  const [customer_id, setCustomerId] = useState(0);
  const [customer_code, setCustomerCode] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [customer_email, setCustomerEmail] = useState("");
  const [customer_phone, setCustomerPhone] = useState("");
  const [customer_address, setCustomerAddress] = useState("");
  const [shipping_address, setShippingAddress] = useState("");
  const [branch_id, setBranchId] = useState(0);
  const [challan_date, setChallanDate] = useState(null);
  const [note, setNote] = useState("");
  const [challan_no, setChallanNo] = useState("");
  const [reference_no, setReferenceNo] = useState("");

  // HELPER VARIABLES
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(null);
  const [bulkText, setBulkText] = useState(null);

  // BOOLEANS
  const [loader, setLoader] = useState(false);
  const [loaderCustomers, setLoaderCustomers] = useState(false);
  const [selected, setSelected] = useState(false);
  const [bulkSelect, setBulkSelect] = useState(false);

  // ALERT BOOLEANS
  const [openError, setOpenError] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openBranch, setOpenBranch] = useState(false);

  // REFERENCES
  const multiselectRef = useRef();
  const multiselectRef2 = useRef();

  // STATIC
  const vatTypes = [
    {
      id: 0.0,
      name: "0%",
    },
    {
      id: 5.0,
      name: "5%",
    },
    {
      id: 7.5,
      name: "7.5%",
    },
    {
      id: 10.0,
      name: "10%",
    },
    {
      id: 15.0,
      name: "15%",
    },
  ];

  // For loading to disappear
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 3000);
  });

  // Changing Branch
  useEffect(() => {
    resetSelectField();
    setSelectedProducts([]);
    setProducts([]);
  }, [branch_id]);

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

  // FETCH PRODUCT BY SEARCH
  const searchProduct = async (e) => {
    setLoader(true);
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProduct =
          BASE_URL + "api/v1/product-search?type=&keyword=" + e + "&sales=" + 1;
        axios
          .get(apiProduct, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status == true) {
              if (res.data.data != null) {
                res.data.data.map((product) => {
                  product.vat_rate = product?.sales_vat_rate || 0;
                  product.return_qty = 0;
                  product.return_value = 0;
                  product.return_vat = 0;
                  product.challan_value = 0;
                  product.challan_qty = 0;
                  product.challan_vat = 0;
                });

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
    setSelectedProducts((selectedProducts) => [...selectedProducts, item]);

    setProducts([]);
  };
  const resetSelectField = () => {
    multiselectRef?.current?.resetSelectedValues();
    setProducts([]);
    setLoader(false);
  };

  // Custom remove
  const remove = (item) => {
    setSelectedProducts(selectedProducts.filter((i) => i !== item));
    resetSelectField();
  };

  // Clear all
  const clearAllProducts = () => {
    setSelectedProducts([]);
    resetSelectField();
    setLoader(false);
  };

  // Update dynamic fields
  const updateReturnQty = (e, id) => {
    if (e < 0) {
      e = 0;
    }
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, return_qty: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateReturnValue = (e, id) => {
    if (e < 0) {
      e = 0;
    }
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, return_value: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateReturnVat = (e, id) => {
    if (e < 0) {
      e = 0;
    }
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, return_vat: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateChallanQty = (e, id) => {
    if (e < 0) {
      e = 0;
    }
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, challan_qty: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateChallanValue = (e, id) => {
    if (e < 0) {
      e = 0;
    }
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, challan_value: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateChallanVat = (e, id) => {
    if (e < 0) {
      e = 0;
    }
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, challan_vat: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateVatRate = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, vat_rate: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };

  // calculate total
  const calculateReturnValue = () => {
    let total = 0;
    selectedProducts?.map((product) => {
      total += product.return_value;
    });
    return total.toFixed(2);
  };
  const calculateReturnVat = () => {
    let total = 0;
    selectedProducts?.map((product) => {
      total += product.return_vat;
    });
    return total.toFixed(2);
  };
  const calculateChallanValue = () => {
    let total = 0;
    selectedProducts?.map((product) => {
      total += product.challan_value;
    });
    return total.toFixed(2);
  };
  const calculateChallanVat = () => {
    let total = 0;
    selectedProducts?.map((product) => {
      total += product.challan_vat;
    });
    return total.toFixed(2);
  };

  // FETCH CUSTOMERS BY SERACH
  const searchCustomer = (e) => {
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      const apiCustomers = BASE_URL + "api/v1/customers/search/" + e;
      axios
        .get(apiCustomers, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status) {
            res.data.data.map((customer) => {
              if (customer.bin && customer.bin != 0) {
                if (customer.phone && customer.phone != "NULL") {
                  customer.displayData = `${customer.name} (${customer?.bin}) - ${customer.phone}`;
                } else {
                  customer.displayData = `${customer.name}`;
                }
              } else {
                customer.displayData = `${customer.name}`;
              }
            });
            setCustomers(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500);

    setTimer(newTimer);
  };

  // Multiselect functions 2
  const selectCustomer = (list, item) => {
    setSelectedCustomer(item);
    setCustomerId(item.id);
    setCustomerCode(item.code);
    setCustomerName(item.name);
    setCustomerAddress(item.address);
    setShippingAddress(item.shipping_address);
    setCustomerEmail(item.email);
    setCustomerPhone(item.phone);
    setSelected(true);
    handleClickEventCustomer();
    // alert("Customer Selected");
  };

  const resetSelectField2 = () => {
    multiselectRef2?.current?.resetSelectedValues();
    setCustomers([]);
    // setSelectedCustomer({});
    // setSelected(false);
  };

  // hover functions
  const handleMouseOver = () => {
    setLoaderCustomers(true);
  };

  const handleMouseOut = () => {
    setLoaderCustomers(false);
  };

  // Toast error
  const handleToClose = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpenError(false);
  };
  const handleClickEvent = () => {
    setOpenError(true);
  };
  // Toast CUSTOMER select
  const handleToCloseCustomer = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpenCustomer(false);
  };
  const handleClickEventCustomer = () => {
    setOpenCustomer(true);
  };
  // Toast Branch select
  const handleToCloseBranch = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpenBranch(false);
  };
  const handleClickEventBranch = () => {
    setOpenBranch(true);
  };

  // Bulk Text Handle
  const handleText = (e) => {
    setBulkText(e);
  };
  const formatText = () => {
    const lines = bulkText.split("\n");

    const formattedData = lines.map((line) => {
      let [key, value] = line.split(/\t| /); // Split using either a tab or space as the separator
      if (!value) {
        // If value is empty after splitting, use the entire line as the key and set quantity to 0
        key = line;
        value = 0;
      }
      const quantity = parseInt(value);
      return { sku: key, qty: isNaN(quantity) ? 0 : quantity };
    });
    setBulkSelect(false);
    searchProductSku(formattedData);
  };

  // FETCH PRODUCT BY SKU
  const searchProductSku = async (data) => {
    const skus = data.map((data) => {
      return data.sku;
    });

    const searchData = {
      skus,
    };
    console.log(searchData);
    const apiProduct = BASE_URL + "api/v1/product-multi-search";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    await axios
      .post(apiProduct, searchData, config)
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          res.data.data.map((product) => {
            product.vat_rate = product?.sales_vat_rate || 0;
            product.qty = null;
            addColumnBulk(product);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addColumnBulk = (item) => {
    setSelectedProducts((selectedProducts) => [...selectedProducts, item]);
  };

  // challan date
  function onChangeChallan(date, dateString) {
    setChallanDate(dateString);
  }

  // Post Data
  const submit = () => {
    if (branch_id == 0 && !userBranch) {
      handleClickEventBranch();
    } else if (challan_date == null || challan_date == "") {
      alert("Please select a Challan date!");
    } else if (challan_no == null || challan_no == "") {
      alert("Please select a Challan No!");
    } else {
      const returnedItems = selectedProducts?.map((item) => {
        return {
          id: item.id,
          return_value: item.return_value,
          return_qty: item.return_qty,
          return_vat: item.return_vat,
          challan_value: item.challan_value,
          challan_qty: item.challan_qty,
          challan_vat: item.challan_vat,
          vat_rate: item.vat_rate,
        };
      });
      const returnData = {
        customer_id,
        customer_code,
        customer_name,
        customer_address,
        customer_email,
        customer_phone,
        challan_date,
        branch_id,
        returnedItems,
        reason: note,
        challan_no,
        reference_no,
      };
      console.log(returnData);
      const apiReturn = BASE_URL + "api/v1/sales/manualCreditNote";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(apiReturn, returnData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Sales Returned!");
            console.log(response.data);
            Router.push({
              pathname: "/orders/returnList",
            });
          } else {
            setError(response.data.message);
            console.log(response.data);
            handleClickEvent();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/orders/returnList",
    });
  };

  return (
    <>
      {/* ==== ALERTS ==== */}

      {/* 1. Error Alert */}
      <Snackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        open={openError}
        autoHideDuration={3000}
        onClose={handleToClose}
        action={
          <React.Fragment>
            <IconButton
              size="large"
              aria-label="close"
              color="inherit"
              onClick={handleToClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert onClose={handleToClose} variant="filled" severity="error">
          <AlertTitle className="text-center">Alert</AlertTitle>
          <div className="text-center">{error}</div>
        </Alert>
      </Snackbar>

      {/* 2. Customer Selected Alert */}
      <Snackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        open={openCustomer}
        autoHideDuration={3000}
        onClose={handleToCloseCustomer}
        action={
          <React.Fragment>
            <IconButton
              size="large"
              aria-label="close"
              color="inherit"
              onClick={handleToCloseCustomer}
            >
              <CloseIcon
                fontSize="small"
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert
          severity="success"
          variant="contained"
          onClose={handleToCloseCustomer}
          sx={{
            width: "100%",
            backgroundColor: "#3da58a",
            color: "white",
            fontWeight: "500",
            fontSize: "15px",
          }}
        >
          Customer Selected
        </Alert>
      </Snackbar>

      {/* 3. Select Branch Alert */}
      <Snackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        open={openBranch}
        autoHideDuration={3000}
        onClose={handleToCloseBranch}
        action={
          <React.Fragment>
            <IconButton
              size="large"
              aria-label="close"
              color="inherit"
              onClick={handleToCloseBranch}
            >
              <CloseIcon
                fontSize="small"
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert
          severity="error"
          variant="contained"
          onClose={handleToCloseBranch}
          sx={{
            width: "100%",
            backgroundColor: "#c62828",
            color: "white",
            fontWeight: "500",
            fontSize: "15px",
          }}
        >
          Select a Branch
        </Alert>
      </Snackbar>

      {/* ==== ORDER SECTION ==== */}

      <div className="row">
        <h6 className="mt-3">Order Information:</h6>
      </div>
      <div className="row">
        <div className="col-md-4 mt-2">
          <Multiselect
            // placeholder="Search Customer"
            placeholder={selected ? selectedCustomer.name : "Search Customer"}
            cursor="pointer"
            displayValue="displayData"
            // onRemove={removeColumn}
            onSelect={selectCustomer}
            options={customers}
            onSearch={(e) => {
              searchCustomer(e);
            }}
            ref={multiselectRef2}
            hideSelectedList
            emptyRecordMsg="Search By Name/Email/Phone"
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
        <div className="col-md-1"></div>
      </div>
      <div className="row">
        <div className="col-md-4 mt-4">
          <TextField
            label="Reference No"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => {
              setReferenceNo(e.target.value);
            }}
            className="shadow-input"
          />
        </div>
        <div className="col-md-4 mt-4">
          <TextField
            label="Challan No"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => {
              setChallanNo(e.target.value);
            }}
            className="shadow-input"
          />
        </div>
        <div className="col-md-4 mt-4">
          <DatePicker
            onChange={onChangeChallan}
            size="large"
            className="shadow-input"
            placeholder="Challan Date"
            style={{ width: "100%", height: "58px" }}
          />
        </div>
      </div>
      <div className="row mt-4">
        {userBranch ? (
          <></>
        ) : (
          <div className="col-md-4">
            <TextField
              onChange={(e) => setBranchId(+e.target.value)}
              select
              label="Select Branch"
              style={{ zIndex: "0" }}
              size="large"
              value={branch_id || ""}
              fullWidth
              className="shadow-input"
            >
              {branches?.map((branch, index) => (
                <MenuItem value={branch.id} key={index}>
                  {branch.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}
      </div>

      {/* ==== CUSTOMER SECTION ==== */}

      {selected ? (
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
          <h6 className="mt-3">Customer Information:</h6>
          <div className="row">
            <div className="col-md-4 mt-3">
              <TextField
                label="Customer Name"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                style={{ zIndex: "0" }}
                InputProps={{
                  readOnly: true,
                }}
                value={selectedCustomer.name}
                className="shadow-input"
              />
            </div>
            <div className="col-md-4 mt-3">
              <TextField
                label="Customer Email"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                style={{ zIndex: "0" }}
                InputProps={{
                  readOnly: true,
                }}
                value={selectedCustomer.email}
                className="shadow-input"
              />
            </div>
            <div className="col-md-4 mt-3">
              <TextField
                label="Customer Phone"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                style={{ zIndex: "0" }}
                InputProps={{
                  readOnly: true,
                }}
                value={selectedCustomer.phone}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mt-4">
              <TextField
                label="Customer BIN"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                style={{ zIndex: "0" }}
                InputProps={{
                  readOnly: true,
                }}
                value={selectedCustomer?.bin || "N/A"}
                className="shadow-input"
              />
            </div>
            <div className="col-md-4 mt-4">
              <TextField
                label="Customer Address"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                style={{ zIndex: "0" }}
                InputProps={{
                  readOnly: true,
                }}
                value={selectedCustomer.address}
                className="shadow-input"
              />
            </div>
            <div className="col-md-4 mt-4">
              <TextField
                label="Shipping Address"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                style={{ zIndex: "0" }}
                value={shipping_address || ""}
                className="shadow-input"
                onChange={(e) => {
                  setShippingAddress(e.target.value);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {/* ==== PRODUCTS SECTION ==== */}

      {selected && (
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
            <h6 className="mt-3">Products Information:</h6>
          </div>
          <div className="row">
            <div className="col-md-4 mt-2">
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
            </div>

            <div className="col-md-1 mt-2">
              <Button
                size="large"
                color="secondary"
                variant="contained"
                fullWidth
                // className="float-end"
                onClick={resetSelectField}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <RotateLeftIcon />
              </Button>
            </div>

            <div className="col-md-7 mt-2">
              <Button
                variant="outlined"
                className="float-end"
                onClick={(e) => setBulkSelect(true)}
                size="large"
              >
                Bulk Select
              </Button>
            </div>

            {bulkSelect && (
              <>
                <div className="row mt-4">
                  <div className="col-md-12 text-end">
                    <h6>{`Please follow the format: sku<SPACE>qty`}</h6>
                    <h6>{`Enter each product in a new line`}</h6>
                    <p>For example:</p>
                    <p>1898004817 10</p>
                    <p>LUBOCTANE 15</p>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6"></div>
                  <div className="col-md-6">
                    <TextField
                      type="text"
                      label="SKU QTY"
                      size="large"
                      fullWidth
                      multiline
                      rows={4}
                      value={bulkText || ""}
                      className="shadow-input"
                      onChange={(e) => {
                        {
                          handleText(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12 mb-4">
                    <Button
                      color="secondary"
                      variant="contained"
                      className="float-end"
                      onClick={formatText}
                      size="large"
                    >
                      Import
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      className="float-end me-2"
                      onClick={(e) => {
                        setBulkSelect(false);
                      }}
                      size="large"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {selectedProducts.length ? (
        <>
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-10"></div>
                <div className="col-md-2">
                  <Button
                    variant="contained"
                    color="error"
                    className="float-end mb-2"
                    onClick={clearAllProducts}
                    size="large"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="row">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr className="table-success">
                        <th className="align-middle">SL</th>
                        <th className="align-middle">SKU</th>
                        <th className="align-middle">ITEM NAME</th>
                        <th className="align-middle">RETURN VALUE</th>
                        <th className="align-middle">RETURN QTY</th>
                        <th className="align-middle">RETURN VAT</th>
                        <th className="align-middle">CHALLAN VALUE</th>
                        <th className="align-middle">CHALLAN QTY</th>
                        <th className="align-middle">CHALLAN VAT</th>
                        <th className="align-middle">VAT RATE</th>
                        <th className="align-middle">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProducts?.map((product, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{product.sku}</td>
                          <td>{product.title}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={product.return_value || ""}
                              onChange={(e) => {
                                updateReturnValue(e.target.value, product.id);
                              }}
                              min={0}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={product.return_qty || ""}
                              onChange={(e) => {
                                updateReturnQty(e.target.value, product.id);
                              }}
                              min={0}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={product.return_vat || ""}
                              onChange={(e) => {
                                updateReturnVat(e.target.value, product.id);
                              }}
                              min={0}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={product.challan_value || ""}
                              onChange={(e) => {
                                updateChallanValue(e.target.value, product.id);
                              }}
                              min={0}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={product.challan_qty || ""}
                              onChange={(e) => {
                                updateChallanQty(e.target.value, product.id);
                              }}
                              min={0}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={product.challan_vat || ""}
                              onChange={(e) => {
                                updateChallanVat(e.target.value, product.id);
                              }}
                              min={0}
                            />
                          </td>
                          <td>
                            <Form.Select
                              className="large-field"
                              onChange={(e) =>
                                updateVatRate(e.target.value, product.id)
                              }
                              defaultValue={product.vat_rate}
                            >
                              {vatTypes.map((vt, index) => (
                                <option key={index} value={vt.id}>
                                  {vt.name}
                                </option>
                              ))}
                            </Form.Select>
                          </td>

                          <td>
                            <Link
                              href="#"
                              className="anchor2"
                              onClick={() => {
                                remove(product);
                              }}
                            >
                              <Button
                                variant="contained"
                                size="large"
                                color="error"
                              >
                                remove
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="row mt-4">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th colSpan={2} className="text-center table-success">
                          Payment Summary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>RETURN VALUE TOTAL</td>
                        <td className="text-end">{calculateReturnValue()}</td>
                      </tr>
                      <tr>
                        <td>RETURN VAT TOTAL</td>
                        <td className="text-end">{calculateReturnVat()}</td>
                      </tr>
                      <tr>
                        <td>CHALLAN VALUE TOTAL</td>
                        <td className="text-end">{calculateChallanValue()}</td>
                      </tr>
                      <tr>
                        <td>CHALLAN VAT TOTAL</td>
                        <td className="text-end">{calculateChallanVat()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-4">
              <TextField
                label="Note"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
                className="shadow-input"
                multiline
                rows={3}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {selectedProducts.length && selected ? (
        <div className="row mt-4">
          <div className="col-md-12">
            <Button
              variant="contained"
              size="large"
              color="success"
              className="float-end"
              onClick={submit}
            >
              SAVE
            </Button>
            {/* <Button
              variant="outlined"
              size="large"
              color="success"
              className="float-end me-3"
              onClick={draft}
            >
              DRAFT
            </Button> */}
            <Button
              variant="contained"
              size="large"
              color="error"
              onClick={goBack}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userBranch: state.auth.user.branch_id,
  };
};

export default connect(mapStateToProps)(CreateReturn);
