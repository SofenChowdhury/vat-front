import React, { useState, useRef } from "react";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

//theme
import { Button, TextField, MenuItem, CircularProgress } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

const AddSalesItem = ({ token, id, branch_id, userBranch }) => {
  //POST VARIABLES
  const [unit_price, setUnitPrice] = useState(null);
  const [qty, setQty] = useState(null);
  const [vat_rate, setVatRate] = useState(null);

  //HELPER VARIABLES
  const [products, setProducts] = useState([]);
  const [timer, setTimer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loader, setLoader] = useState(false);

  // REFERENCES
  const multiselectRef = useRef();

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
    setSelectedProduct(item);
    setVatRate(item.vat_rate);
    setProducts([]);
  };
  const resetSelectField = () => {
    multiselectRef?.current?.resetSelectedValues();
    setProducts([]);
  };

  // HANDLE QUANTITY
  const updateQty = (e, id, stock, type) => {
    const inputQty = e;
    if (type == 4) {
      setQty(+e);
    } else {
      if (
        inputQty === "" ||
        (Number(inputQty) <= stock && Number(inputQty > 0))
      ) {
        setQty(+e);
      }
    }
  };

  const submit = () => {
    const apiUrl = BASE_URL + "api/v1/sales/add-items";
    const saleData = {
      sales_id: id,
      id: selectedProduct.id,
      vat_rate,
      price: (100 / (100 + vat_rate)) * unit_price,
      qty,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(saleData);
    axios
      .post(apiUrl, saleData, config)
      .then((response) => {
        if (response.data.status) {
          console.log(response.data);
          setLoader(true);
          alert("Sales Item added!");
          window.location.reload();
        } else {
          console.log(response.data);
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <h4>Add Item</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-2">
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
            <div className="col-md-6 mt-2">
              {selectedProduct && (
                <Button
                  className="float-end"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setSelectedProduct(null);
                    resetSelectField();
                  }}
                  size="large"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          {selectedProduct && (
            <>
              <div className="row">
                <div className="col-md-10 mt-5">
                  <b className="text-secondary">Title: </b>
                  {selectedProduct?.title}
                </div>
              </div>
              <div className="row">
                <div className="col-md-10 mt-2">
                  <b className="text-secondary">SKU: </b>
                  {selectedProduct?.sku}
                </div>
              </div>
              <div className="row">
                <div className="col-md-10 mt-2">
                  <b className="text-secondary">Stock: </b>
                  {selectedProduct?.stock}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Unit Price"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={unit_price || ""}
                    onChange={(e) => setUnitPrice(+e.target.value)}
                    className="shadow-input"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={qty || ""}
                    onChange={(e) => {
                      updateQty(
                        e.target.value,
                        selectedProduct.id,
                        selectedProduct.stock,
                        selectedProduct.type
                      );
                    }}
                    className="shadow-input"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Sales Vat Rate"
                    variant="outlined"
                    select
                    size="large"
                    fullWidth
                    type="number"
                    onChange={(e) => {
                      setVatRate(e.target.value);
                    }}
                    className="shadow-input"
                    value={vat_rate != null ? vat_rate : ""}
                  >
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={5}>5%</MenuItem>
                    <MenuItem value={7.5}>7.5%</MenuItem>
                    <MenuItem value={10}>10%</MenuItem>
                    <MenuItem value={15}>15%</MenuItem>
                  </TextField>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <Button variant="contained" color="success" onClick={submit} size="large">
                    Add
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
    userBranch: state.auth.user.branch_id,
  };
};

export default connect(mapStateToProps)(AddSalesItem);
