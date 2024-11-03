import React, { useState, useRef } from "react";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

//theme
import {
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";
import Form from "react-bootstrap/Form";

const AddPurchaseItem = ({ token, id, branch_id, userBranch, type }) => {
  //POST VARIABLES
  const [total_price, setTotalPrice] = useState(null);
  const [qty, setQty] = useState(null);
  const [cd_rate, setCD] = useState(null);
  const [rd_rate, setRD] = useState(null);
  const [sd_rate, setSD] = useState(null);
  const [vat_rate, setVatRate] = useState(null);
  const [at_rate, setAT] = useState(null);
  const [ait_rate, setAIT] = useState(null);
  const [vdr_rate, setVdr] = useState(null);

  //HELPER VARIABLES
  const [isRebatable, setisRebatable] = useState(false);
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
          BASE_URL + "api/v1/product-search?type=2&keyword=" + e;
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
    setVatRate(item.hscode?.vat);
    setCD(item.hscode.cd);
    setRD(item.hscode.rd);
    setSD(item.hscode.sd);
    setAT(item.hscode.at);
    setAIT(item.hscode.ait);
    setVdr(item.vat_rebatable_percentage);
    if (item.vat_rebatable_percentage > 0) {
      setisRebatable(true);
    } else {
      setisRebatable(false);
    }
    setProducts([]);
  };
  const resetSelectField = () => {
    multiselectRef?.current?.resetSelectedValues();
    setProducts([]);
  };

  // HANDLE QUANTITY
  const updateQty = (e) => {
    setQty(+e);
  };

  const submit = () => {
    const apiUrl = BASE_URL + "api/v1/purchases/add-item";

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    let cd = 0;
    let rd = 0;
    let sd = 0;
    let vat = 0;
    let at = 0;
    let ait = 0;
    let tti = 0;
    let vat_rebetable_amount = 0;

    let purchaseItem = {};

    if (type == "Imported") {
      cd = +((total_price / 100) * +cd_rate).toFixed(2);
      rd = +((total_price / 100) * +rd_rate).toFixed(2);
      sd = +(((total_price + cd + rd) / 100) * +sd_rate).toFixed(2);
      vat = +(((total_price + cd + rd + sd) / 100) * +vat_rate).toFixed(2);
      at = +(((total_price + cd + rd + sd) / 100) * +at_rate).toFixed(2);
      ait = +((total_price / 100) * +ait_rate).toFixed(2);
      tti = +(cd + rd + sd + vat + at + ait).toFixed(2);
      if (isRebatable) {
        vat_rebetable_amount = +((vat / 100) * vdr_rate).toFixed(2);
      }
      purchaseItem = {
        item_id: selectedProduct.id,
        cd,
        rd,
        sd,
        vat,
        at,
        ait,
        tti,
        total_price,
        qty,
        price: total_price / qty,
        vat_rate,
        vat_amount: vat,
        vds_receive_amount: 0,
        vat_rebetable_amount,
      };
    } else {
      sd = +((total_price / 100) * +sd_rate).toFixed(2);
      vat = +(((total_price + sd) / 100) * +vat_rate).toFixed(2);
      tti = +(sd + vat);
      if (isRebatable) {
        vat_rebetable_amount = +((vat / 100) * vdr_rate).toFixed(2);
      }
      purchaseItem = {
        item_id: selectedProduct.id,
        cd: null,
        rd: null,
        sd,
        vat,
        at: null,
        ait: null,
        tti,
        total_price,
        qty,
        price: total_price / qty,
        vat_rate,
        vat_amount: vat,
        vds_receive_amount: 0,
        vat_rebetable_amount,
      };
    }



     

    const purchaseData = {
      purchase_id: id,
      purchaseItem,
    };
    console.log(purchaseData);

    axios
      .post(apiUrl, purchaseData, config)
      .then((response) => {
        if (response.data.status) {
          console.log(response.data);
          setLoader(true);
          alert("Purchase Item added!");
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
                    width: "90%",
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
              {/* <div className="row">
                <div className="col-md-10 mt-2">
                  <b className="text-secondary">Stock: </b>
                  {selectedProduct?.stock}
                </div>
              </div> */}
              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Total Price"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={total_price || ""}
                    onChange={(e) => setTotalPrice(+e.target.value)}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={qty || ""}
                    onChange={(e) => {
                      updateQty(e.target.value);
                    }}
                    className="shadow-input"
                  />
                </div>
              </div>
              {type == "Imported" && (
                <div className="row">
                  <div className="col-md-6 mt-4">
                    <TextField
                      label="CD"
                      variant="outlined"
                      size="large"
                      type="text"
                      fullWidth
                      value={cd_rate || ""}
                      onChange={(e) => setCD(+e.target.value)}
                      className="shadow-input"
                    />
                  </div>
                  <div className="col-md-6 mt-4">
                    <TextField
                      label="RD"
                      variant="outlined"
                      size="large"
                      type="text"
                      fullWidth
                      value={rd_rate || ""}
                      onChange={(e) => setRD(+e.target.value)}
                      className="shadow-input"
                    />
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="SD"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={sd_rate || ""}
                    onChange={(e) => setSD(+e.target.value)}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Vat Rate"
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

              {type == "Imported" && (
                <div className="row">
                  <div className="col-md-6 mt-4">
                    <TextField
                      label="AT"
                      variant="outlined"
                      size="large"
                      type="text"
                      fullWidth
                      value={at_rate || ""}
                      onChange={(e) => setAT(+e.target.value)}
                      className="shadow-input"
                    />
                  </div>
                  <div className="col-md-6 mt-4">
                    <TextField
                      label="AIT"
                      variant="outlined"
                      size="large"
                      type="text"
                      fullWidth
                      value={ait_rate || ""}
                      onChange={(e) => setAIT(+e.target.value)}
                      className="shadow-input"
                    />
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-md-3 mt-4 ms-1">
                  <FormControlLabel
                    label="Is Rebatable?"
                    checked={isRebatable}
                    control={<Checkbox />}
                    onChange={(e) => {
                      setisRebatable(e.target.checked);
                    }}
                  />
                </div>
                <div className="col-md-6 mt-4">
                  {isRebatable && (
                    <TextField
                      label="Vat Rebatable Percentage"
                      variant="outlined"
                      select
                      size="large"
                      fullWidth
                      type="number"
                      onChange={(e) => {
                        setVdr(e.target.value);
                      }}
                      className="shadow-input"
                      value={vdr_rate != null ? vdr_rate : ""}
                    >
                      <MenuItem value={100}>100%</MenuItem>
                      <MenuItem value={80}>80%</MenuItem>
                      <MenuItem value={0}>0%</MenuItem>
                    </TextField>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mt-4">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={submit}
                    size="large"
                  >
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

export default connect(mapStateToProps)(AddPurchaseItem);
