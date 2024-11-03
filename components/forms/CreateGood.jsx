import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Date
import { DatePicker } from "antd";
import dayjs from "dayjs";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// bootstarp
import Form from "react-bootstrap/Form";
import { Button, TextField, Chip, MenuItem } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

// icons
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

const CreateGood = ({ token }) => {
  // POST VARIABLES
  const [branch_id, setBranchId] = useState(0);
  const [product_id, setProductId] = useState(0);
  const [qty, setQty] = useState(1);
  const [production_date, setProductionDate] = useState("");

  // HELPER VARIABLES
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [timer, setTimer] = useState(null);

  // BOOLEANS
  const [selected, setSelected] = useState(false);
  const [loaderProduct, setLoaderProduct] = useState(false);

  // REFERENCES
  const multiselectRef = useRef();

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

  // FETCH FINISHED GOOD BY SEARCH
  const searchFinishedGoods = async (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProduct =
          BASE_URL + "api/v1/product-search?type=1&keyword=" + e;
        axios
          .get(apiProduct, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status == true) {
              if (res.data.data != null) {
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
    setProductId(item.id);
    setProducts([]);
    setSelected(true);
  };
  // const removeColumn = (list, item) => {
  //   setSelectedProducts(selectedProducts.filter((i) => i !== item));
  // };
  const resetSelectField = () => {
    multiselectRef.current.resetSelectedValues();
    setProducts([]);
  };

  //clear Product
  const clear = () => {
    setSelectedProduct({});
    setProductId(0);
    setSelected(false);
    resetSelectField();
  };

  // hover functions
  const handleMouseOver = () => {
    setLoaderProduct(true);
  };
  const handleMouseOut = () => {
    setLoaderProduct(false);
  };

  //DATE
  function onChange(date, dateString) {
    setProductionDate(dateString);
  }
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current > dayjs().endOf("day");
  };

  //POST DATA
  const submit = () => {
    if (branch_id == 0) {
      alert("Please select a branch!");
    } else if (production_date == "") {
      alert("Please enter the Production Date");
    } else {
      const goodData = {
        product_id,
        branch_id,
        qty,
        production_date,
      };
      console.log(goodData);
      const apiGood = BASE_URL + "api/v1/goods/create";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(apiGood, goodData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Goods Received");
            console.log(response.data);
            Router.push({
              pathname: "/products/goodList",
            });
          } else {
            alert(response.data.message);
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
        <h6 className="text-secondary">Select a Product</h6>
      </div>
      <div className="row mt-2">
        <div className="col-md-6">
          <Multiselect
            placeholder="Search Product"
            cursor="pointer"
            displayValue="title"
            // onRemove={removeColumn}
            onSelect={addColumn}
            options={products}
            onSearch={(e) => {
              searchFinishedGoods(e);
            }}
            ref={multiselectRef}
            hideSelectedList
            emptyRecordMsg="Type the exact SKU to find a product."
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
        <div className="col-md-1">
          <Button
            size="large"
            color="secondary"
            variant="contained"
            onClick={resetSelectField}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <RotateLeftIcon />
          </Button>
        </div>
        <div className="col-md-2">
          {loaderProduct && (
            <Chip label="Reset Products" color="secondary" size="large" />
          )}
        </div>
      </div>
      {selected ? (
        <>
          <div className="row mt-5">
            <div className="col-md-4">
              <h6 className="text-secondary mt-2">Product Details</h6>
            </div>
            <div className="col-md-8">
              <Button
                variant="contained"
                color="error"
                className="float-end"
                onClick={clear}
                size="large"
              >
                Clear Product
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-4">
              <TextField
                label="Product Name"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                className="shadow-input"
                value={selectedProduct.title}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="col-md-2 mt-4">
              <TextField
                label="Quantity"
                variant="outlined"
                size="large"
                type="number"
                fullWidth
                className="shadow-input"
                value={qty || ""}
                onChange={(e) => {
                  setQty(+e.target.value);
                }}
              />
            </div>
            <div className="col-md-2 mt-4">
              <DatePicker
                onChange={onChange}
                size="large"
                style={{ width: "100%", height: "58px" }}
                disabledDate={disabledDate}
                className="shadow-input"
              />
            </div>
            <div className="col-md-2 mt-4">
              <TextField
                onChange={(e) => setBranchId(+e.target.value)}
                select
                label="Branch"
                size="large"
                fullWidth
                className="shadow-input"
              >
                {branches?.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <Button
                variant="contained"
                color="success"
                className="float-end"
                onClick={submit}
                size="large"
              >
                Save
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

export default connect(mapStateToProps)(CreateGood);
