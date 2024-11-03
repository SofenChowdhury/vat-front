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
  CircularProgress,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

// Date
import { DatePicker, TimePicker } from "antd";
import moment from "moment";

// icons
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import CloseIcon from "@mui/icons-material/Close";

const CreateOrder = ({ token, userBranch }) => {
  // POST VARIABLES
  const [customer_id, setCustomerId] = useState(0);
  const [customer_code, setCustomerCode] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [customer_email, setCustomerEmail] = useState("");
  const [customer_phone, setCustomerPhone] = useState("");
  const [customer_address, setCustomerAddress] = useState("");
  const [shipping_address, setShippingAddress] = useState("");
  const [branch_id, setBranchId] = useState(0);
  const [reference_no, setReference] = useState("");
  const [vehicle_no, setVehicle] = useState("");
  const [salesItems, setSalesItems] = useState([]);
  const [note, setNote] = useState("");
  const [challan_date, setChallanDate] = useState(null);
  const [driver_name, setDriverName] = useState("");
  const [driver_mobile, setDriverMobile] = useState("");
  const [challan_no, setChallanNo] = useState("");
  const [challan_time, setChallanTime] = useState(moment("00:00", "HH:mm"));

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
  const [openStock, setOpenStock] = useState(false);

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
                  product.qty = 0;
                  product.vat_rate = product?.sales_vat_rate || 0;
                  product.stock = 0;
                  if ((branch_id || userBranch) && product.stocks) {
                    product.stocks?.map((stock) => {
                      if (
                        stock.branch_id == branch_id ||
                        stock.branch_id == userBranch
                      )
                        product.stock = stock.stock;
                    });
                  } else if (product.stocks) {
                    product.stock = 0;
                  }
                });

                setProducts(res.data.data);
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

    const v_rate = +item.vat_rate;
    const picked = (({ id, price, qty }) => ({
      id,
      price,
      qty,
    }))(item);
    picked.vat_rate = v_rate;
    setSalesItems((salesItems) => [...salesItems, picked]);

    setProducts([]);
  };
  // const removeColumn = (list, item) => {
  //   setSelectedProducts(selectedProducts.filter((i) => i !== item));
  // };
  const resetSelectField = () => {
    multiselectRef?.current?.resetSelectedValues();
    setProducts([]);
  };

  // Custom remove
  const remove = (item) => {
    setSelectedProducts(selectedProducts.filter((i) => i !== item));
    setSalesItems(salesItems.filter((i) => i.id !== item.id));
    resetSelectField();
  };

  // Clear all
  const clearAllProducts = () => {
    setSelectedProducts([]);
    setSalesItems([]);
    resetSelectField();
  };

  // Update dynamic fields
  const updateQty = (e, id, stock, type) => {
    const inputQty = e;

    if (type == 4) {
      const newState = selectedProducts.map((product) => {
        if (product.id === id) {
          return { ...product, qty: +e };
        }
        return product;
      });
      setSelectedProducts(newState);
      const newState2 = salesItems.map((product) => {
        if (product.id === id) {
          return { ...product, qty: +e };
        }
        return product;
      });
      setSalesItems(newState2);
    } else {
      if (
        inputQty === "" ||
        (Number(inputQty) <= stock && Number(inputQty > 0))
      ) {
        const newState = selectedProducts.map((product) => {
          if (product.id === id) {
            return { ...product, qty: +e };
          }
          return product;
        });
        setSelectedProducts(newState);
        const newState2 = salesItems.map((product) => {
          if (product.id === id) {
            return { ...product, qty: +e };
          }
          return product;
        });
        setSalesItems(newState2);
      }
    }
  };

  const updatePrice = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        let newPrice = +((100 * +e) / (100 + +product.vat_rate));
        return { ...product, price: newPrice };
      }
      return product;
    });
    setSelectedProducts(newState);
    const newState2 = salesItems.map((product) => {
      if (product.id === id) {
        let newPrice = +((100 * +e) / (100 + +product.vat_rate));
        return { ...product, price: newPrice };
      }
      return product;
    });
    setSalesItems(newState2);
  };

  const updateVatRate = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, vat_rate: +e };
      }
      return product;
    });
    setSelectedProducts(newState);

    const newState2 = salesItems.map((product) => {
      if (product.id === id) {
        return { ...product, vat_rate: +e };
      }
      return product;
    });
    setSalesItems(newState2);
  };

  // calculate total
  const calculate = () => {
    let total = 0;
    selectedProducts?.map((product) => {
      total += product.price * product.qty;
    });
    return total.toFixed(2);
  };

  const calculateVat = (id) => {
    let total = 0;
    selectedProducts?.map((product) => {
      if (product.id == id) {
        total += +((product.price * product.qty) / 100) * +product.vat_rate;
      }
    });
    return total.toFixed(2);
  };

  const calculateTotalVat = () => {
    let total = 0;
    selectedProducts?.map((product) => {
      total += ((product.price * product.qty) / 100) * +product.vat_rate;
    });
    return total.toFixed(2);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedProducts?.map((product) => {
      total +=
        ((product.price * product.qty) / 100) * +product.vat_rate +
        product.price * product.qty;
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
  // Toast Stock out
  const handleToCloseStock = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpenStock(false);
  };
  const handleClickEventStock = () => {
    setOpenStock(true);
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
            product.stock = 0;
            if (branch_id && product.stocks) {
              product.stocks?.map((stock) => {
                if (stock.branch_id == branch_id) product.stock = stock.stock;
              });
            } else if (product.stocks) {
              product.stock = product.stocks[0]?.stock;
            }
            data.map((item) => {
              if (item.sku === product.sku) {
                if (item.qty <= product.stock) product.qty = item.qty;
                else product.qty = null;
              }
            });
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

    const v_rate = +item.vat_rate;
    const picked = (({ id, price, qty }) => ({
      id,
      price,
      qty,
    }))(item);
    picked.vat_rate = v_rate;
    setSalesItems((salesItems) => [...salesItems, picked]);
  };

  // Date function
  function onChangeChallanDate(date, dateString) {
    setChallanDate(dateString);
  }

  // Time Function
  const handleTimeChange = (time) => {
    setChallanTime(time);
  };

  // Post Data
  const submit = () => {
    // setSalesItems(selectedProducts);
    if (branch_id == 0 && !userBranch) {
      // alert("Please select a branch!");
      handleClickEventBranch();
    } else {
      let stockAvailable = true;
      selectedProducts.map((item) => {
        if (item.qty == 0) {
          alert(`${item.sku} quantity cannot be zero!`);
          stockAvailable = false;
        }
        if (item.qty == null) {
          handleClickEventStock();
          stockAvailable = false;
        }
      });

      if (stockAvailable) {
        setLoader(true);
        const orderData = {
          customer_id,
          customer_code,
          customer_name,
          customer_address,
          customer_email,
          customer_phone,
          shipping_address,
          branch_id,
          salesItems,
          reference_no,
          vehicle_no,
          driver_name,
          driver_mobile,
          note,
          challan_date,
          challan_no,
          challan_time:
            moment(challan_time).format("HH:mm") == "00:00"
              ? ""
              : moment(challan_time).format("HH:mm"),
        };
        console.log(orderData);
        const apiOrder = BASE_URL + "api/v1/sales/create";
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        axios
          .post(apiOrder, orderData, config)
          .then((response) => {
            if (response.data.status) {
              alert("Order Created!");
              console.log(response.data);
              Router.push({
                pathname: "/orders/OrderList",
              });
            } else {
              setLoader(false);
              setError(response.data.message);
              console.log(response.data);
              handleClickEvent();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const draft = () => {
    if (branch_id == 0) {
      // alert("Please select a branch!");
      handleClickEventBranch();
    } else {
      const draftData = {
        customer_id,
        customer_code,
        customer_name,
        customer_address,
        customer_email,
        customer_phone,
        branch_id,
        salesItems,
        reference_no,
        challan_date,
      };
      console.log(draftData);
      const apiDraft = BASE_URL + "api/v1/sales/draft";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(apiDraft, draftData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Draft Created!");
            console.log(response.data);
            Router.push({
              pathname: "/orders/OrderList",
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
      pathname: "/orders/OrderList",
    });
  };

  console.log(salesItems);

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
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

          {/* 4. Stock Out Alert */}
          <Snackbar
            anchorOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            open={openStock}
            autoHideDuration={3000}
            onClose={handleToCloseStock}
            action={
              <React.Fragment>
                <IconButton
                  size="large"
                  aria-label="close"
                  color="inherit"
                  onClick={handleToCloseStock}
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
              onClose={handleToCloseStock}
              sx={{
                width: "100%",
                backgroundColor: "#c62828",
                color: "white",
                fontWeight: "500",
                fontSize: "15px",
              }}
            >
              Not Enough Stock!
            </Alert>
          </Snackbar>

          {/* ==== ORDER SECTION ==== */}

          <div className="row">
            <h6 className="mt-3">Order Information:</h6>
          </div>
          <div className="row">
            <div className="col-md-3 mt-2">
              <Multiselect
                // placeholder="Search Customer"
                placeholder={
                  selected ? selectedCustomer.name : "Search Customer"
                }
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
                    width: "90%",
                  },
                }}
              />
            </div>
            <div className="col-md-1"></div>
          </div>
          <div className="row mt-4">
            {userBranch === "0" || userBranch === null ? (
              <div className="col-md-3">
                <TextField
                  onChange={(e) => {
                    setBranchId(+e.target.value);
                    clearAllProducts();
                  }}
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
            ) : null}
            <div className="col-md-3">
              <TextField
                type="text"
                label="Reference No"
                size="large"
                fullWidth
                style={{ zIndex: "0" }}
                value={reference_no}
                className="shadow-input"
                onChange={(e) => {
                  setReference(e.target.value);
                }}
              />
            </div>
            <div className="col-md-3">
              <TextField
                type="text"
                label="Vehicle Type and Number"
                size="large"
                fullWidth
                style={{ zIndex: "0" }}
                value={vehicle_no}
                className="shadow-input"
                onChange={(e) => {
                  setVehicle(e.target.value);
                }}
              />
            </div>

            <div className="col-md-3">
              <DatePicker
                onChange={onChangeChallanDate}
                size="large"
                className="shadow-input"
                placeholder="Challan Date"
                style={{ width: "100%", height: "58px" }}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-3">
              <TextField
                type="text"
                label="Driver's Name"
                size="large"
                fullWidth
                style={{ zIndex: "0" }}
                value={driver_name}
                className="shadow-input"
                onChange={(e) => {
                  setDriverName(e.target.value);
                }}
              />
            </div>
            <div className="col-md-3">
              <TextField
                type="text"
                label="Driver's Phone"
                size="large"
                fullWidth
                style={{ zIndex: "0" }}
                value={driver_mobile}
                className="shadow-input"
                onChange={(e) => {
                  setDriverMobile(e.target.value);
                }}
              />
            </div>
            <div className="col-md-3">
              <TextField
                type="text"
                label="Challan No"
                size="large"
                fullWidth
                style={{ zIndex: "0" }}
                value={challan_no}
                className="shadow-input"
                onChange={(e) => {
                  setChallanNo(e.target.value);
                }}
              />
            </div>
            <div className="col-md-3">
              <TimePicker
                value={challan_time}
                onChange={handleTimeChange}
                format={"HH:mm"}
                size="large"
                className="shadow-input"
                style={{ width: "100%", height: "58px" }}
              />
            </div>
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
                    value={selectedCustomer.name || ""}
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
                    value={selectedCustomer.email || ""}
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
                    value={customer_phone || ""}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                    }}
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
                    value={selectedCustomer.address || ""}
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
                        width: "90%",
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
                            <th className="align-middle">STOCK</th>
                            <th className="align-middle">
                              UNIT PRICE <br /> (Inc. VAT)
                            </th>
                            <th className="align-middle">QTY</th>
                            <th className="align-middle">VAT %</th>
                            <th className="align-middle">PRICE PER UNIT</th>
                            <th className="align-middle">VAT PER UNIT</th>
                            <th className="align-middle">TOTAL PRICE</th>
                            <th className="align-middle">TOTAL VAT</th>
                            <th className="align-middle">SUB TOTAL</th>
                            <th className="align-middle">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProducts?.map((product, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{product.sku}</td>
                              <td>{product.title}</td>
                              {product.type != 4 ? (
                                <td>{product.stock}</td>
                              ) : (
                                <td>N/A</td>
                              )}
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={
                                    product.price +
                                      (product.price / 100) *
                                        product.vat_rate || ""
                                  }
                                  onChange={(e) => {
                                    updatePrice(e.target.value, product.id);
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={product.qty || ""}
                                  onChange={(e) => {
                                    updateQty(
                                      e.target.value,
                                      product.id,
                                      product.stock,
                                      product.type
                                    );
                                  }}
                                  style={{ maxWidth: "120px" }}
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
                              <td>{product.price.toFixed(2)}</td>
                              <td>
                                {(
                                  (product.price / 100) *
                                  product.vat_rate
                                ).toFixed(2)}
                              </td>

                              <td>
                                {(product.price * product.qty).toFixed(2)}
                              </td>
                              <td>{calculateVat(product.id)}</td>
                              <td>
                                {(
                                  product.price * product.qty +
                                  +calculateVat(product.id)
                                ).toFixed(2)}
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
                            <th
                              colSpan={2}
                              className="text-center table-success"
                            >
                              Payment Summary
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>ITEM TOTAL</td>
                            <td className="text-end">{calculate()}</td>
                          </tr>
                          <tr>
                            <td>VAT TOTAL</td>
                            <td className="text-end">{calculateTotalVat()}</td>
                          </tr>
                          <tr>
                            <td>PAYABLE</td>
                            <td className="text-end">{calculateTotal()}</td>
                          </tr>
                          <tr>
                            <td>DISCOUNT</td>
                            <td className="text-end">0</td>
                          </tr>
                          <tr className="table-dark">
                            <td>NET PAYABLE</td>
                            <td className="text-end">{calculateTotal()}</td>
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

export default connect(mapStateToProps)(CreateOrder);
