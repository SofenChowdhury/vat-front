import React, { useEffect, useState } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme
import { CircularProgress, TextField, MenuItem, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";
import { Sd } from "@mui/icons-material";

const EditPurchaseItems = ({ id, itemId, token }) => {
  //post variables
  const [total_price, setTotalPrice] = useState(null);
  const [qty, setQty] = useState(null);
  const [cd, setCd] = useState(null);
  const [rd, setRd] = useState(null);
  const [sd, setSd] = useState(null);
  const [at, setAt] = useState(null);
  const [ait, setAit] = useState(null);
  const [tti, setTti] = useState(null);
  const [vat_amount, setVatAmount] = useState(null);
  const [vds_receive_amount, setVds] = useState(null);
  const [vat_rebetable_amount, setVatRebatable] = useState(null);
  const [vat_rate, setVatRate] = useState(null);

  //helper variables
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loader, setLoader] = useState(true);

  //fetch details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/purchases/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setLoader(false);
          setPurchaseDetails(res.data.data);
          res.data.data.purchase_items?.map((item) => {
            if (item.id == itemId) {
              setSelectedItem(item);
              setTotalPrice(item.total_price);
              setQty(item.qty);
              setCd(item.cd);
              setRd(item.rd);
              setSd(item.sd);
              setAt(item.at);
              setAit(item.ait);
              setTti(item.tti);
              setVatRate(item.vat_rate);
              setVatAmount(item.vat_amount);
              setVds(item.vds_receive_amount);
              setVatRebatable(item.vat_rebetable_amount);
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
    const apiUrl = BASE_URL + "api/v1/purchases/update-item";
    const purchaseData = {
      id: selectedItem.id,
      total_price,
      qty,
      cd,
      rd,
      sd,
      at,
      ait,
      tti,
      vat_rate,
      vat_amount,
      vds_receive_amount,
      vat_rebetable_amount,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(purchaseData);
    axios
      .post(apiUrl, purchaseData, config)
      .then((response) => {
        if (response.data.status) {
          console.log(response.data);
          setLoader(true);
          alert("Purchase Item edited!");
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
            <div className="col-md-12 mt-1">
              <b>Purchase No:</b> {purchaseDetails?.purchase_no}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-1">
              <b>Challan No:</b> {purchaseDetails?.challan_no}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-1">
              <b>Item:</b> {selectedItem.info?.title}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-3">
              <TextField
                label="Total Price (Without VAT)"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={total_price == null ? "" : total_price}
                onChange={(e) => setTotalPrice(+e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-6 mt-3">
              <TextField
                label="SD"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={sd == null ? "" : sd}
                onChange={(e) => setSd(+e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          {purchaseDetails?.type == "Imported" && (
            <>
              <div className="row">
                <div className="col-md-6 mt-3">
                  <TextField
                    label="CD"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={cd == null ? "" : cd}
                    onChange={(e) => setCd(+e.target.value)}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-6 mt-3">
                  <TextField
                    label="RD"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={rd == null ? "" : rd}
                    onChange={(e) => setRd(+e.target.value)}
                    className="shadow-input"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mt-3">
                  <TextField
                    label="AT"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={at == null ? "" : at}
                    onChange={(e) => setAt(+e.target.value)}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-6 mt-3">
                  <TextField
                    label="AIT"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={ait == null ? "" : ait}
                    onChange={(e) => setAit(+e.target.value)}
                    className="shadow-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="row">
            <div className="col-md-6 mt-3">
              <TextField
                label="VAT Amount"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={vat_amount == null ? "" : vat_amount}
                onChange={(e) => setVatAmount(+e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-6 mt-3">
              <TextField
                label="TTI"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={tti == null ? "" : tti}
                onChange={(e) => setTti(+e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-3">
              <TextField
                label="VDS"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={vds_receive_amount == null ? "" : vds_receive_amount}
                onChange={(e) => setVds(+e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-6 mt-3">
              <TextField
                label="VAT Rebatable"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={vat_rebetable_amount == null ? "" : vat_rebetable_amount}
                onChange={(e) => setVatRebatable(+e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-6 mt-3">
              <TextField
                label="Quantity"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                value={qty || ""}
                onChange={(e) => setQty(+e.target.value)}
                className="shadow-input"
              />
            </div>
          </div> */}
          <div className="row">
            <div className="col-md-6 mt-3">
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
            <div className="col-md-12 mt-3">
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

export default connect(mapStateToProps)(EditPurchaseItems);
