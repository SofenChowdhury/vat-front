import React, { useState, useRef, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// bootstarp
import {
  Button,
  TextField,
  Snackbar,
  Autocomplete,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";

// icons
import CloseIcon from "@mui/icons-material/Close";

const CreateTransfer = ({ token }) => {
  // VARIABLE FOR POST
  const [branch_from, setBranchFrom] = useState(null);
  const [branch_to, setBranchTo] = useState(null);
  const [reference_no, setReferenceNo] = useState(null);
  const [vehicle_info, setVehicleNo] = useState(null);
  const [note, setNote] = useState(null);
  const [posting_date, setPostingDate] = useState(null);

  // HELPER VARIABLES
  const [products, setProducts] = useState([]);
  const [timer, setTimer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [bulkText, setBulkText] = useState(null);
  const [error, setError] = useState("");

  // ALERT BOOLEANS
  const [openError, setOpenError] = useState(false);

  // BOOOLEAN
  const [bulkSelect, setBulkSelect] = useState(false);

  // REFERENCES
  const multiselectRef = useRef();

  // Multiselect functions
  const addColumn = (list, item) => {
    setSelectedProducts((selectedProducts) => [...selectedProducts, item]);
    setProducts([]);
  };
  const resetSelectField = () => {
    multiselectRef.current.resetSelectedValues();
    setProducts([]);
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

  // FETCH PRODUCT BY SEARCH
  const searchProduct = async (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProducts = BASE_URL + "api/v1/product-search?&keyword=" + e;
        axios
          .get(apiProducts, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status == true) {
              res.data.data.map((product) => {
                product.qty = 1;
              });
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

  // update branches
  const handleBranchFromChange = (event, value) => {
    if (value) {
      setBranchFrom(value.id);
    } else {
      setBranchFrom(null);
    }
  };
  const handleBranchToChange = (event, value) => {
    if (value) {
      setBranchTo(value.id);
    } else {
      setBranchTo(null);
    }
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
  };
  const updatePrice = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, price: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
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
        if (res.data.status) {
          res.data.data.map((product) => {
            data.map((item) => {
              if (item.sku === product.sku) {
                product.qty = item.qty;
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
  };

  // Date
  function onChangePosting(date, dateString) {
    setPostingDate(dateString);
  }

  // SUBMIT PURCHASE
  const onSubmit = () => {
    if (branch_from == 0) {
      alert("Please Enter a Branch to Transfer From");
    } else if (branch_to == 0) {
      alert("Please Enter a Branch to Transfer From");
    } else if (note == null) {
      alert("Please Enter a Note");
    } else if (vehicle_info == null) {
      alert("Please Enter Vehicle Information");
    } else {
      const transferItems = selectedProducts.map((item) => {
        return {
          item_id: item.id,
          price: item.price,
          qty: item.qty,
        };
      });

      let item = {
        branch_from,
        branch_to,
        note,
        vehicle_info,
        transferItems,
        reference_no,
        posting_date,
      };
      console.log(item);
      const apiTransfer = BASE_URL + "api/v1/transfers/create";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(apiTransfer, item, config)
        .then((response) => {
          console.log(response.data);
          if (response.data.status) {
            alert("Product Transferred!");
            console.log(response.data);
            Router.push({
              pathname: "/transfers/transferList",
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
      pathname: "/transfers/transferList",
    });
  };

  // TOAST ERROR
  const handleToClose = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpenError(false);
  };
  const handleClickEvent = () => {
    setOpenError(true);
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
          <div className="text-center">{error}</div>
        </Alert>
      </Snackbar>

      <div className="row">
        <div className="col-md-3">
          <Autocomplete
            options={branches}
            getOptionLabel={(option) => option.name}
            onChange={handleBranchFromChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Branch From"
                className="shadow-input"
              />
            )}
            size="large"
          />
        </div>
        <div className="col-md-3">
          <Autocomplete
            options={branches}
            getOptionLabel={(option) => option.name}
            onChange={handleBranchToChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Branch To"
                className="shadow-input"
              />
            )}
            size="large"
          />
        </div>
        <div className="col-md-2">
          <TextField
            label="Vehicle Info"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setVehicleNo(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-2">
          <TextField
            label="Reference No"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setReferenceNo(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-2">
          <DatePicker
            onChange={onChangePosting}
            size="large"
            className="shadow-input"
            placeholder="Posting Date"
            style={{ width: "100%", height: "58px" }}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <TextField
            label="Note"
            variant="outlined"
            size="large"
            fullWidth
            multiline
            rows={4}
            onChange={(e) => {
              setNote(e.target.value);
            }}
            className="shadow-input"
          />
        </div>
      </div>

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

      <div className="row mt-4">
        <div className="col-md-12">
          <h6 className="text-secondary">Choose Products</h6>
        </div>
      </div>
      <div className="row">
        <div className="col-md-5">
          <Multiselect
            placeholder="Search products here..."
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
            emptyRecordMsg="Search for Products with Name/Sku/Model"
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

      {selectedProducts.length ? (
        <>
          <div className="row mt-3">
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
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr className="table-success">
                      <th>SL</th>
                      <th>ITEM NAME</th>
                      <th>PRICE</th>
                      <th>QUANTITY</th>
                      <th>SUB TOTAL</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts?.map((product, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>{product.title}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={product.price}
                            onChange={(e) => {
                              updatePrice(e?.target?.value, product?.id);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={product.qty}
                            onChange={(e) => {
                              updateQty(e.target.value, product.id);
                            }}
                          />
                        </td>
                        <td>{(product.price * product.qty).toFixed(2)}</td>
                        <td>
                          <Button
                            variant="contained"
                            size="large"
                            color="error"
                            onClick={() => {
                              remove(product);
                            }}
                          >
                            remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Button
                variant="contained"
                size="large"
                color="success"
                className="float-end"
                onClick={onSubmit}
              >
                SAVE
              </Button>
              <Button
                variant="contained"
                size="large"
                color="error"
                className="float-end me-3"
                onClick={goBack}
              >
                CANCEL
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

export default connect(mapStateToProps)(CreateTransfer);
