import React, { useState, useEffect, useRef } from "react";

//redux imports
import { connect } from "react-redux";

import { CircularProgress } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";


// Time
import moment from "moment";

const SixEight = ({ query, token }) => {
  // HELPER VARIABLES
  const id = query.id;

  // BOOLEANS
  const [returnDetails, setReturnDetails] = useState({});
  const [loader, setLoader] = useState(true);

  // REFERENCES
  const printRef = useRef();

  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/public/debit-note/" + id;
    console.log(apiUrl);
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
          console.log(res.data);
        if (res.data.status) {
          setLoader(false);
          setReturnDetails(res.data.data);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // CALCULATIONS
  const calculate = () => {
    let total = 0;
    returnDetails?.return_items?.map((product) => {
      total += product.price;
    });
    return total.toFixed(2);
  };
  const calculateQty = () => {
    let total = 0;
    returnDetails?.return_items?.map((product) => {
      total += product.qty;
    });
    return total.toFixed(2);
  };
  const calculateVat = () => {
    let total = 0;
    returnDetails?.return_items?.map((product) => {
      total += product.vat_amount;
    });
    return total.toFixed(2);
  };
  const calculateSd = () => {
    let total = 0;
    returnDetails?.return_items?.map((product) => {
      total += product.sd;
    });
    return total.toFixed(2);
  };

  // GETTERS
  const getPrice = (id) => {
    let purchasePrice = 0;
    returnDetails?.purchase?.purchase_items.map((item) => {
      if (item.product_id == id) {
        purchasePrice = item.price;
      }
    });
    return purchasePrice;
  };
  const getQty = (id) => {
    let purchaseQty = 0;
    returnDetails?.purchase?.purchase_items.map((item) => {
      if (item.product_id == id) {
        purchaseQty = item.qty;
      }
    });
    return purchaseQty;
  };
  const getVat = (id) => {
    let purchaseVat = 0;
    returnDetails?.purchase?.purchase_items.map((item) => {
      if (item.product_id == id) {
        purchaseVat = item.vat_amount;
      }
    });
    return purchaseVat;
  };
  const getSd = (id) => {
    let purchaseSd = 0;
    returnDetails?.purchase?.purchase_items.map((item) => {
      if (item.product_id == id) {
        purchaseSd = item.sd;
      }
    });
    return purchaseSd;
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div ref={printRef} style={{ scale: "0.9" }}>
            {/* HEADERS */}
            <div>
              <div className="row">
                <div className="col-md-2">
                  {/* <img
                    className="ms-5"
                    alt="profile-user"
                    width="80px"
                    height="80px"
                    src={`../../assets/images/govt.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  /> */}
                </div>
                <div className="col-md-8 text-center">
                  <div className="row">
                    <b>
                      Government of People's Republic of Bangladesh
                    </b>
                  </div>
                  <div className="row">
                    <b>
                      National Board of Revenue
                    </b>
                  </div>
                  <div className="row">
                    <b>Debit Note</b>
                  </div>
                  <div className="row">
                    <b>
                      [See Clauses (g) of Sub-Rule (1) of Rule 40]
                    </b>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="row">
                    <div className="col-md-12">
                      <b className="float-end me-5">Mushak 6.8</b>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-md-7"></div>
                <div className="col-md-5">
                  <b>Debit Note No -</b> {returnDetails?.return_no}
                </div>
              </div>
              <div className="row ">
                <div className="col-md-7"></div>
                <div className="col-md-5">
                  <b>External Reference No -</b>{" "}
                </div>
              </div>
              <div className="row ">
                <div className="col-md-7"></div>
                <div className="col-md-5">
                  <b>Purchase No -</b> {returnDetails?.purchase?.purchase_no}
                </div>
              </div>
              <div className="row ">
                <div className="col-md-7"></div>
                <div className="col-md-5">
                  <b>Date of Issue -</b>{" "}
                  {moment(returnDetails?.created_at).format("DD MMM YY")}
                </div>
              </div>
              <div className="row">
                <div className="col-md-7"></div>
                <div className="col-md-5">
                  <b>Time of Issue -</b>{" "}
                  {moment(returnDetails?.created_at).format("h:mm a")}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <b>Registered Person's Name -</b>{" "}
                  {returnDetails?.company?.name}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <b>Registered Person's BIN -</b>{" "}
                  {returnDetails?.company?.company_bin}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <b>Registered Person's Address -</b>{" "}
                  {returnDetails?.company?.contact_address}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <b>Buyer/Recepient Name -</b> {returnDetails?.vendor?.name}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <b>Buyer/Recepient BIN -</b>{" "}
                  {returnDetails?.vendor?.vendor_bin}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <b>Buyer/Recepient Name -</b>{" "}
                  {returnDetails?.vendor?.contact_address}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <b>Vehicle Type and Number -</b>{" "}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-3">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th className="text-center" rowSpan={2}>
                      SL No
                    </th>
                    <th className="text-center" rowSpan={2}>
                      TAX Challan No & Date
                    </th>
                    <th className="text-center" rowSpan={2}>
                      Debit Note Issue Reason
                    </th>
                    <th className="text-center" rowSpan={2}>
                      Product Description
                    </th>
                    <th className="text-center" colSpan={4}>
                      Challan Description
                    </th>
                    <th className="text-center" colSpan={4}>
                      Associated with Incremental Coordination
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center">
                      Value<sup>1</sup>
                    </th>
                    <th className="text-center">Quantity (PCS)</th>
                    <th className="text-center">Amount of VAT</th>
                    <th className="text-center">
                      Amount of Supplementary Duty
                    </th>
                    <th className="text-center">
                      Value<sup>1</sup>
                    </th>
                    <th className="text-center">Quantity (PCS)</th>
                    <th className="text-center">Amount of VAT</th>
                    <th className="text-center">
                      Amount of Supplementary Duty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {returnDetails?.return_items?.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      {returnDetails.purchase ? (
                        <>
                          <td>
                            {returnDetails?.purchase?.challan_no} -{" "}
                            {returnDetails?.purchase?.challan_date}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {returnDetails?.challan_no} -{" "}
                            {returnDetails?.challan_date}
                          </td>
                        </>
                      )}

                      <td>{returnDetails.return_reason}</td>
                      <td>{item.info.title}</td>

                      {/* CHALLAN INFO */}
                      <td className="text-end">{getPrice(item.product_id)}</td>
                      <td className="text-center">{getQty(item.product_id)}</td>
                      <td className="text-end">{getVat(item.product_id)}</td>
                      <td className="text-end">{getSd(item.product_id)}</td>

                      {/* RETURN INFO */}
                      <td className="text-end">{item.price}</td>
                      <td className="text-center">{item.qty}</td>
                      <td className="text-end">{item.vat_amount}</td>
                      <td className="text-end">{item.sd}</td>
                    </tr>
                  ))}

                  <tr>
                    <th colSpan={8} className="p-1 text-end">
                      Total Value
                    </th>
                    <td className="p-1 text-end">{calculate()}</td>
                    <td className="p-1 text-end">{calculateQty()}</td>
                    <td className="p-1 text-end">{calculateVat()}</td>
                    <td className="p-1 text-end">{calculateSd()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="row mt-3">
              <div className="col-md-7"></div>
              <div className="col-md-5">
                <b>Officer-in-Charge Name :</b>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-7"></div>
              <div className="col-md-5">
                <b>Designation :</b>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-7"></div>
              <div className="col-md-5">
                <b>Signature:</b>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-7"></div>
              <div className="col-md-5">
                <b>Seal :</b>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mt-3">
                <b>1.</b> Unit Price of Production/Service exclusive of
                VAT/Supplementary Duty Tax.
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

SixEight.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(SixEight);
