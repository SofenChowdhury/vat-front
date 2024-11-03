import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { CircularProgress } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// Time
import moment from "moment";

const SixSeven = ({ query, token }) => {
  // HELPER VARIABLES
  const id = query.id;

  // BOOLEANS
  const [returnDetails, setReturnDetails] = useState({});
  const [loader, setLoader] = useState(true);

  // REFERENCES
  const printRef = useRef();

  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/public/credit-note/" + id;
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

  // CALCULATIONS
  const calculate = () => {
    let total = 0;
    returnDetails?.return_items?.map((product) => {
      total += product.price * product.qty;
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
    let salesPrice = 0;
    returnDetails?.sales?.sales_items.map((item) => {
      if (item.product_id == id) {
        salesPrice = item.price;
      }
    });
    return salesPrice;
  };
  const getQty = (id) => {
    let salesQty = 0;
    returnDetails?.sales?.sales_items.map((item) => {
      if (item.product_id == id) {
        salesQty = item.qty;
      }
    });
    return salesQty;
  };
  const getVat = (id) => {
    let salesVat = 0;
    returnDetails?.sales?.sales_items.map((item) => {
      if (item.product_id == id) {
        salesVat = item.vat_amount;
      }
    });
    return salesVat;
  };
  const getSd = (id) => {
    let salesSd = 0;
    returnDetails?.sales?.sales_items.map((item) => {
      if (item.product_id == id) {
        salesSd = item.sd;
      }
    });
    return salesSd;
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div ref={printRef} className="p-3">
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
                    <b>Government of People's Republic of Bangladesh</b>
                  </div>
                  <div className="row">
                    <b>National Board of Revenue</b>
                  </div>
                  <div className="row">
                    <b>Credit Note</b>
                  </div>
                  <div className="row">
                    <b>[See Clauses (g) of Sub-Rule (1) of Rule 40]</b>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="row">
                    <div className="col-md-12">
                      <b className="float-end me-5">Mushak 6.7</b>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-md-7"></div>
                <div className="col-md-5">
                  <b>Credit Note No -</b> {returnDetails?.return_no}
                </div>
              </div>
              <div className="row ">
                <div className="col-md-7"></div>
                <div className="col-md-5">
                  <b>External Reference No -</b> {returnDetails?.reference_no}
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

              {returnDetails?.company_id == null ? (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Registered Person's Name -</b>{" "}
                      {returnDetails?.sales?.company?.name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Registered Person's BIN -</b>{" "}
                      {returnDetails?.sales?.company.company_bin}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Registered Person's Address -</b>{" "}
                      {returnDetails?.sales?.company.contact_address}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Registered Person's Name -</b>{" "}
                      {returnDetails?.company?.name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Registered Person's BIN -</b>{" "}
                      {returnDetails?.company.company_bin}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Registered Person's Address -</b>{" "}
                      {returnDetails?.company.contact_address}
                    </div>
                  </div>
                </>
              )}

              {returnDetails?.customer_id == null ? (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Buyer/Recepient Name -</b>{" "}
                      {returnDetails?.sales?.customer.name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Buyer/Recepient BIN -</b>{" "}
                      {returnDetails?.sales?.customer.bin}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Buyer/Recepient Address -</b>{" "}
                      {returnDetails?.sales?.customer.address}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Buyer/Recepient Name -</b>{" "}
                      {returnDetails?.customer?.name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Buyer/Recepient BIN -</b>{" "}
                      {returnDetails?.customer?.bin}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <b>Buyer/Recepient Address -</b>{" "}
                      {returnDetails?.customer?.address}
                    </div>
                  </div>
                </>
              )}

              <div className="row">
                <div className="col-md-12">
                  <b>Vehicle Type and Number -</b>{" "}
                  {returnDetails?.sales?.vehicle_no}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-3">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr style={{ fontSize: "11px" }}>
                    <th className="text-center align-middle" rowSpan={2}>
                      SL No
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Tax Challan No & Date
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Credit Note Issue Reason
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Product Description
                    </th>
                    <th className="text-center align-middle" colSpan={4}>
                      Supply Mentioned in Invoice
                    </th>
                    <th className="text-center align-middle" colSpan={4}>
                      Corresponds with the Decreasing Adjustment
                    </th>
                  </tr>
                  <tr style={{ fontSize: "11px" }}>
                    <th className="text-center align-middle">
                      Value<sup>1</sup>
                    </th>
                    <th className="text-center align-middle">Quantity (PCS)</th>
                    <th className="text-center align-middle">Amount of VAT</th>
                    <th className="text-center align-middle">
                      Amount of Supplementary Duty
                    </th>
                    <th className="text-center align-middle">
                      Value<sup>1</sup>
                    </th>
                    <th className="text-center align-middle">Quantity (PCS)</th>
                    <th className="text-center align-middle">Amount of VAT</th>
                    <th className="text-center align-middle">
                      Amount of Supplementary Duty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {returnDetails?.return_items?.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      {returnDetails?.challan_no == null ? (
                        <td style={{ whiteSpace: "nowrap" }}>
                          <Link
                            href={`/orders/orderDetails/${returnDetails?.sales_id}`}
                            className="anchor3"
                          >
                            {returnDetails.sales?.sales_no}
                          </Link>
                          <br />
                          {moment(returnDetails?.sales?.created_at).format(
                            "DD MMM YY"
                          )}
                        </td>
                      ) : (
                        <td>
                          {returnDetails.challan_no} -{" "}
                          {moment(returnDetails?.challan_date).format(
                            "DD MMM YY"
                          )}
                        </td>
                      )}
                      <td>{returnDetails.return_reason}</td>
                      <td style={{ maxWidth: "200px" }}>
                        {item.info?.title} {item.info?.sku}
                      </td>

                      {/* CHALLAN INFO */}
                      {returnDetails.sales ? (
                        <>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              getPrice(item.product_id) *
                                getQty(item.product_id)
                            )}
                          </td>
                          <td className="text-center">
                            {getQty(item.product_id)}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              getVat(item.product_id)
                            )}
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
                          <td className="text-end">{item.challan_item_qty}</td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(item.challan_item_vat)}
                          </td>
                          <td className="text-end">0</td>
                        </>
                      )}

                      {/* RETURN INFO */}
                      <td className="text-end">
                        {Intl.NumberFormat().format(
                          (item.price * item.qty).toFixed(2)
                        )}
                      </td>
                      <td className="text-center">{item.qty}</td>
                      <td className="text-end">
                        {Intl.NumberFormat().format(item.vat_amount)}
                      </td>
                      <td className="text-end">{item.sd}</td>
                    </tr>
                  ))}

                  <tr>
                    <th colSpan={8} className="p-1 text-end">
                      Total Value
                    </th>
                    <td className="p-1 text-end">
                      {Intl.NumberFormat().format(calculate())}
                    </td>
                    <td className="p-1 text-end">{calculateQty()}</td>
                    <td className="p-1 text-end">
                      {Intl.NumberFormat().format(calculateVat())}
                    </td>
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
            <div className="row mt-3">
              <div className="col-md-7"></div>
              <div className="col-md-5">
                <b>Signature:</b>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-7"></div>
              <div className="col-md-5">
                <b>Seal :</b>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mt-3">
                <b>1.</b> Value excluding all type of Taxes.
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

SixSeven.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(SixSeven);
