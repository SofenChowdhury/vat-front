import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

import { CircularProgress, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// PRINT
import { useReactToPrint } from "react-to-print";

// QR
import QRCode from "qrcode.react";

//Icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Print from "@mui/icons-material/Print";

// Time
import moment from "moment";

const ReturnVatPurchase = ({ query, token }) => {
  // HELPER VARIABLES
  const id = +query.id;

  // BOOLEANS
  const [returnDetails, setReturnDetails] = useState({});
  const [loader, setLoader] = useState(true);

  // REFERENCES
  const printRef = useRef();

  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/purchases/return/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setReturnDetails(res.data.data);
          console.log(res.data.data);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // CALCULATIONS
  const calculate = () => {
    let total = 0;
    returnDetails?.return_items?.map((product) => {
      total += product.total_price;
    });
    return total.toFixed(2);
  };
  const calculateQty = () => {
    let total = 0;
    returnDetails?.return_items?.map((product) => {
      total += product.qty;
    });
    return total;
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
        purchasePrice = item.total_price;
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

  console.log(returnDetails);

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row mb-5">
            <div className="col-6">
              <Link href="/purchases/returnList" className="anchor">
                <Button variant="contained" size="large">
                  <ArrowLeftIcon />
                  Return List
                </Button>
              </Link>
            </div>
            <div className="col-6">
              <Button
                variant="contained"
                size="large"
                className="float-end"
                onClick={handlePrint}
              >
                <Print />
                Print
              </Button>
            </div>
          </div>
          <div ref={printRef} className="px-5 py-3">
            {/* HEADERS */}
            <div>
              <div className="row">
                <div className="col-3">
                  {/* <img
                    className="ms-5"
                    alt="profile-user"
                    width="80px"
                    height="80px"
                    src={`../../assets/images/govt.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  /> */}
                </div>
                <div className="col-6 text-center">
                  <div className="row">
                    <b>Government of People's Republic of Bangladesh</b>
                  </div>
                  <div className="row">
                    <b>National Board of Revenue</b>
                  </div>
                  <div className="row">
                    <b>Debit Note</b>
                  </div>
                  <div className="row">
                    <b>[See Clauses (g) of Sub-Rule (1) of Rule 40]</b>
                  </div>
                </div>
                <div className="col-3">
                  <div className="row">
                    <div className="col-12">
                      <b className="float-end me-5">Mushak 6.8</b>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-12">
                      <Link
                        href={`/public/six-eight/${returnDetails.return_no}`}
                      >
                        <QRCode
                          value={`http://vat.fairgroupbd.com/public/six-eight/${returnDetails.return_no}`}
                          style={{ height: "50px", width: "50px" }}
                          className="float-end me-5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-6">
                  <b>Registered Person's Name -</b>{" "}
                  {returnDetails?.company?.name}
                </div>
                <div className="col-6">
                  <b>Debit Note No -</b> {returnDetails?.return_no}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <b>Registered Person's Address -</b>{" "}
                  {returnDetails?.company?.contact_address}
                </div>
                <div className="col-6">
                  <b>External Reference No -</b>{" "}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <b>Registered Person's BIN -</b>{" "}
                  {returnDetails?.company?.company_bin}
                </div>
                <div className="col-6">
                  <b>Purchase No -</b> {returnDetails?.purchase?.purchase_no}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <b>Buyer/Recepient Name -</b> {returnDetails?.vendor?.name}
                </div>
                <div className="col-6">
                  <b>Date of Issue -</b>{" "}
                  {moment(returnDetails?.created_at).format("DD MMM YY")}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <b>Buyer/Recepient BIN -</b>{" "}
                  {returnDetails?.vendor?.vendor_bin}
                </div>
                <div className="col-6">
                  <b>Time of Issue -</b>{" "}
                  {moment(returnDetails?.created_at).format("h:mm a")}
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <b>Buyer/Recepient Name -</b>{" "}
                  {returnDetails?.vendor?.contact_address}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <b>Vehicle Type and Number -</b>{" "}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-3">
              <table className="table table-crammed table-bordered">
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
                    <th className="text-center col-4" rowSpan={2}>
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
                    <th className="text-center">Amount of SD</th>
                    <th className="text-center">
                      Value<sup>1</sup>
                    </th>
                    <th className="text-center">Quantity (PCS)</th>
                    <th className="text-center">Amount of VAT</th>
                    <th className="text-center">Amount of SD</th>
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
                            {moment(
                              returnDetails?.purchase?.challan_date
                            ).format("DD MMM YYYY")}
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
                      <td>
                        {item.info?.title} - {item.info?.sku}
                      </td>

                      {/* CHALLAN INFO */}
                      {returnDetails.purchase ? (
                        <>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              getPrice(item.product_id)
                            )}
                          </td>
                          <td className="text-center">
                            {getQty(item.product_id)}
                          </td>
                          <td className="text-end">
                            {getVat(item.product_id)}
                          </td>
                          <td className="text-end">{getSd(item.product_id)}</td>
                        </>
                      ) : (
                        <>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              item.challan_item_value
                            )}
                          </td>
                          <td className="text-center">
                            {item.challan_item_qty}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(item.challan_item_vat)}
                          </td>
                          <td className="text-end">0</td>
                        </>
                      )}

                      {/* RETURN INFO */}
                      <td className="text-end">
                        {Intl.NumberFormat().format(item.total_price)}
                      </td>
                      <td className="text-center">{item.qty}</td>
                      <td className="text-end">
                        {Intl.NumberFormat().format(item.vat_amount)}
                      </td>
                      <td className="text-end">
                        {Intl.NumberFormat().format(item.sd)}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <th colSpan={8} className="text-end">
                      Total Value
                    </th>
                    <td className="text-end">{calculate()}</td>
                    <td className="text-center">{calculateQty()}</td>
                    <td className="text-end">{calculateVat()}</td>
                    <td className="text-end">{calculateSd()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="row mt-3">
              <div className="col-6"></div>
              <div className="col-6">
                <b>Officer-in-Charge Name :</b>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-6"></div>
              <div className="col-6">
                <b>Designation :</b>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-6"></div>
              <div className="col-6">
                <b>Signature:</b>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-6"></div>
              <div className="col-6">
                <b>Seal :</b>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-5">
                <small>
                  <b>1.</b> Unit Price of Production/Service exclusive of
                  VAT/Supplementary Duty Tax.
                </small>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

ReturnVatPurchase.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(ReturnVatPurchase);
