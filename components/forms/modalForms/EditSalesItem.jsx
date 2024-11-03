import React, { useEffect, useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import { CircularProgress, TextField, MenuItem, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const EditSalesItem = ({ id, itemId, token }) => {
  //post variables
  const [unit_price, setUnitPrice] = useState(null);
  const [qty, setQty] = useState(null);
  const [vat_rate, setVatRate] = useState(null);

  //helper variables
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loader, setLoader] = useState(true);

  //fetch details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/sales/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setLoader(false);
          setOrderDetails(res.data.data);
          res.data.data.sales_items?.map((item) => {
            if (item.id == itemId) {
              setSelectedItem(item);
              setUnitPrice(item.price);
              setQty(item.qty);
              setVatRate(item.vat_rate);
            }
          });
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //update
  const update = () => {
    const apiUrl = BASE_URL + "api/v1/sales/item-update";
    const saleData = {
      sales_id: id,
      salesItem: {
        id: selectedItem.product_id,
        vat_rate,
        price: (100 / (100 + +vat_rate)) * unit_price,
        qty,
      },
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
          alert("Sales Item edited!");
          window.location.reload();
        } else {
          console.log(response.data);
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
              <h4>Update Item</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-3">
              <b>Sales No:</b> {orderDetails.sales_no}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-3">
              <b>Item:</b> {selectedItem.item_info?.title}
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
              {/* <TextField
                label="Quantity"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={qty || ""}
                onChange={(e) => setQty(+e.target.value)}
                className="shadow-input"
              /> */}
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
                value={+vat_rate}
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
              <Button variant="contained" color="success" onClick={update} size="large">
                Update
              </Button>
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
  };
};

export default connect(mapStateToProps)(EditSalesItem);
