import React, { useState, useRef, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import Form from "react-bootstrap/Form";
import { TextField, Button, MenuItem, Autocomplete } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";

const CreateStock = ({ token }) => {
  const [stock_branch, setBranchId] = useState(0);
  const [stock_date, setStockDate] = useState(null);

  // HELPER VARIABLES
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [timer, setTimer] = useState(null);
  const [branches, setBranches] = useState([]);

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
              setLoader(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
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

  // Date
  function onChange(date, dateString) {
    setStockDate(dateString);
  }

  // Branch handle
  const handleBranchChange = (event, value) => {
    if (value) {
      setBranchId(value.id);
    } else {
      setBranchId(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const stockItems = selectedProducts.map((stock) => {
      return {
        item_id: stock.id,
        price: stock.price,
        qty: stock.qty,
      };
    });

    let item = {
      stock_branch,
      stock_date,
      stockItems,
    };

    axios
      .post(`${BASE_URL}api/v1/stock/create`, item, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        if (response.data.status) {
          alert("Stocks Added");
          console.log(response.data);
          Router.push({
            pathname: "/products/stockList",
          });
        } else {
          // setFormErrors(Object.values(response.data.errors));
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/products/stockList",
    });
  };

  return (
    <>
      <h6 className="mt-4 text-secondary">Products</h6>
      <div className="row">
        <div className="col-md-4">
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
        <div className="col-md-4">
          <Autocomplete
            options={branches}
            getOptionLabel={(option) => option.name}
            onChange={handleBranchChange}
            renderInput={(params) => (
              <TextField {...params} label="Branch" className="shadow-input" />
            )}
            size="large"
          />
          {/* <TextField
            onChange={(e) => setBranchId(+e.target.value)}
            select
            label="Stock in Branch"
            size="large"
            fullWidth
            value={stock_branch || ""}
            className="shadow-input"
          >
            {branches?.map((branch, index) => (
              <MenuItem value={branch.id} key={index}>
                {branch.name}
              </MenuItem>
            ))}
          </TextField> */}
        </div>
        <div className="col-md-4">
          <DatePicker
            onChange={onChange}
            size="large"
            className="shadow-input"
            placeholder="Stock Date"
            style={{ width: "100%", height: "58px" }}
          />
        </div>
      </div>

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
                      <th>SKU</th>
                      <th>ITEM NAME</th>
                      <th>PRICE</th>
                      <th>QTY</th>
                      <th>ITEM TOTAL</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts?.map((product, index) => (
                      <>
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {product.sku}
                          </td>
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
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedProducts.length && stock_branch ? (
            <div className="row mt-5">
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
          ) : (
            <></>
          )}
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

export default connect(mapStateToProps)(CreateStock);
