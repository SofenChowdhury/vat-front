import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// bootstarp
import { tokens } from "../../../pages/theme";
import Form from "react-bootstrap/Form";
import {
  Typography,
  useTheme,
  Button,
  Snackbar,
  IconButton,
  Alert,
  AlertTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

// iconsreference
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import CloseIcon from "@mui/icons-material/Close";

// date
import { DatePicker } from "antd";

const DraftUpdate = ({ query, token }) => {
  // THEME VARIABLES
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // POST VARIABLES
  const [customer_id, setCustomerId] = useState(0);
  const [customer_code, setCustomerCode] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [customer_email, setCustomerEmail] = useState("");
  const [customer_phone, setCustomerPhone] = useState("");
  const [customer_address, setCustomerAddress] = useState("");
  const [branch_id, setBranchId] = useState(0);
  const [reference_no, setReference] = useState("");
  const [challan_date, setChallanDate] = useState(null);
  //   const [salesItems, setSalesItems] = useState([]);

  // HELPER VARIABLES
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(null);
  const id = +query.id;
  //   const [draftDetails, setDraftDetails] = useState({});

  // BOOLEANS
  const [loader, setLoader] = useState(false);
  const [loaderCustomers, setLoaderCustomers] = useState(false);
  const [selected, setSelected] = useState(false);

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

  // FETCH DRAFT DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/sales/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          //   setDraftDetails(res.data.data);
          setCustomerId(res.data.data.customer_id);
          setCustomerAddress(res.data.data.customer_address);
          setCustomerCode(res.data.data.customer_code);
          setCustomerEmail(res.data.data.customer_email);
          setCustomerName(res.data.data.customer_name);
          setCustomerPhone(res.data.data.customer_phone);
          setBranchId(res.data.data.branch_id);
          setReference(res.data.data.reference_no);
          setSelected(true);
          setSelectedCustomer(res.data.data.customer);

          setSelectedProducts([]);
          res.data.data.sales_items.map((item) => {
            item.vat_rate = +item.vat_rate;
            setSelectedProducts((selectedProducts) => [
              ...selectedProducts,
              item,
            ]);
          });

          //   console.log(res.data.data);
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          BASE_URL + "api/v1/product-search?type=&keyword=" + e;
        axios
          .get(apiProduct, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status == true) {
              if (res.data.data != null) {
                res.data.data.map((product) => {
                  product.qty = 1;
                  product.vat_rate = product?.hscode?.vat || 0;
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
    multiselectRef.current.resetSelectedValues();
    setProducts([]);
    setLoader(false);
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
    // resetSelectField();
    setLoader(false);
  };

  // Update dynamic fields
  const updateQty = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, qty: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
    // const newState2 = salesItems.map((product) => {
    //   if (product.id === id) {
    //     return { ...product, qty: +e };
    //   }
    //   return product;
    // });
    // setSalesItems(newState2);
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
    // const newState2 = salesItems.map((product) => {
    //   if (product.id === id) {
    //     let newPrice = +((100 * +e) / (100 + +product.vat_rate));
    //     return { ...product, price: newPrice };
    //   }
    //   return product;
    // });
    // setSalesItems(newState2);
  };

  const updateVatRate = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, vat_rate: +e };
      }
      return product;
    });
    setSelectedProducts(newState);

    // const newState2 = salesItems.map((product) => {
    //   if (product.id === id) {
    //     return { ...product, vat_rate: +e };
    //   }
    //   return product;
    // });
    // setSalesItems(newState2);
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
          if (res.data.status == true) {
            res.data.data.map((customer) => {
              customer.displayData = `${customer.name} ${customer.phone}`;
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
    setCustomerEmail(item.email);
    setCustomerPhone(item.phone);
    setSelected(true);
    handleClickEventCustomer();
    // alert("Customer Selected");
  };

  const resetSelectField2 = () => {
    multiselectRef2.current.resetSelectedValues();
    setCustomers([]);
    setSelectedCustomer({});
    setSelected(false);
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

  // Date function
  function onChange(date, dateString) {
    setChallanDate(dateString);
  }

  // UPDATE DATA
  const update = () => {
    if (branch_id == 0) {
      // alert("Please select a branch!");
      handleClickEventBranch();
    } else {
      const salesItems = selectedProducts.map((product) => {
        return {
          sales_item_id: product.id,
          vat_rate: product.vat_rate,
          price: +product.price.toFixed(2),
          qty: product.qty,
        };
      });

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
        sales_id: id,
        challan_date,
      };

      console.log(draftData);
      const apiDraft = BASE_URL + "api/v1/sales/draft-update";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(apiDraft, draftData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Draft Updated!");
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

      {/* ==== HEADER ==== */}

      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Update Draft
      </Typography>

      {/* ==== ORDER SECTION ==== */}

      <div className="row">
        <h6 className="mt-3">Order Information:</h6>
      </div>
      <div className="row">
        <div className="col-md-4 mt-2">
          <Multiselect
            // placeholder="Search Customer"
            placeholder={selected ? selectedCustomer?.name : "Search Customer"}
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
      <div className="row mt-4">
        <div className="col-md-4">
          {/* <TextField placeholder="aluuuuuuuuu" /> */}
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
        <div className="col-md-4">
          <TextField
            type="text"
            label="Reference No"
            size="large"
            fullWidth
            value={reference_no}
            className="shadow-input"
            onChange={(e) => {
              setReference(e.target.value);
            }}
          />
        </div>
        <div className="col-md-4">
          <DatePicker
            onChange={onChange}
            placeholder="Select Challan Date"
            size="large"
            style={{ width: "100%", height: "58px" }}
            className="shadow-input"
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
                InputProps={{
                  readOnly: true,
                }}
                value={selectedCustomer.phone}
                className="shadow-input"
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
          {/* <div className="row">
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
                onClick={resetSelectField2}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <RotateLeftIcon />
              </Button>
            </div>
          </div> */}
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
                        <th className="align-middle">UNIT PRICE</th>
                        <th className="align-middle">VAT %</th>
                        <th className="align-middle">PRICE PER UNIT</th>
                        <th className="align-middle">VAT PER UNIT</th>
                        <th className="align-middle">QTY</th>
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
                          <td>{product.item_info.sku}</td>
                          <td>{product.item_info.title}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={
                                product.price +
                                  (product.price / 100) * product.vat_rate || ""
                              }
                              onChange={(e) => {
                                updatePrice(e.target.value, product.id);
                              }}
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
                            {((product.price / 100) * product.vat_rate).toFixed(
                              2
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={product.qty}
                              onChange={(e) => {
                                updateQty(e.target.value, product.id);
                              }}
                              style={{ maxWidth: "120px" }}
                            />
                          </td>

                          <td>{(product.price * product.qty).toFixed(2)}</td>
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
                        <th colSpan={2} className="text-center table-success">
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
              onClick={update}
            >
              UPDATE
            </Button>
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

DraftUpdate.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(DraftUpdate);
