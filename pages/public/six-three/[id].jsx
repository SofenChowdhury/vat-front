import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Theme imports
import { tokens } from "../../theme";
import { CircularProgress, Typography, useTheme, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

//DateTime
import moment from "moment";

//Converter
import converter from "number-to-words";

const SixThree = ({ query }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [orderDetails, setOrderDetails] = useState({});
  const [loader, setLoader] = useState(true);
  const id = query.id;

  const getOrderDetails = () => {
    const apiUrl = BASE_URL + "api/v1/public/check-challan/" + id;
    axios
      .get(apiUrl)
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          setLoader(false);
          setOrderDetails(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  const calculate = () => {
    let total = 0;
    orderDetails?.sales_items?.map((product) => {
      total += product.total_price;
    });
    return total.toFixed(2);
  };
  const calculateVat = () => {
    let total = 0;
    orderDetails?.sales_items?.map((product) => {
      total += +product.vat_amount;
    });
    return total.toFixed(2);
  };
  const calculateTotal = () => {
    let total = 0;
    orderDetails?.sales_items?.map((product) => {
      total += product.total_price + product.vat_amount;
    });
    return total.toFixed(2);
  };
  const calculateQty = () => {
    let total = 0;
    orderDetails?.sales_items?.map((product) => {
      total += product.qty;
    });
    return total;
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div>
            <div className="row justify-content-md-centeR mt-3">
              <div className="col-3">
                <img
                  alt="profile-user"
                  width="80px"
                  height="80px"
                  src={`../../assets/images/govt.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </div>
              <div className="col-md-6 text-center">
                <b>Government of the People's Republic of Bangladesh</b>
                <br />
                <b>National Board of Revenue</b>
              </div>
              <div className="col-md-3 text-end">
                <b style={{ border: "2px solid black", padding: "5px" }}>
                  Mushak 6.3
                </b>
              </div>
            </div>

            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <b>Tax Challan (Invoice)</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                [See clauses (GA) and (CHA) of Sub-Rule (1) of Rule 40]
              </div>
            </div>
            <div className="row justify-content-md-center mt-1">
              <div className="col-md-auto">
                Name of Registered Person: <b>{orderDetails?.company?.name}</b>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                BIN of Registered Person: {orderDetails?.company?.company_bin}
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                Address: {orderDetails?.company?.contact_address}
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                Challan Issuing Address: {orderDetails?.branch?.address}
              </div>
            </div>
            <hr />
            <div className="small-text">
              <div className="row justify-content-between mt-3">
                <div className="col-8">
                  <b>Name of Purchaser: </b>
                  {orderDetails.customer.name}
                </div>
                <div className="col-4">
                  <b>Challan No: </b>
                  {orderDetails.sales_no}
                </div>
              </div>
              <div className="row justify-content-between mt-1">
                <div className="col-8">
                  <b>BIN of Purchaser: </b>
                  {orderDetails.customer.bin}
                </div>
                <div className="col-4">
                  <b>Reference No: </b>
                  {orderDetails.reference_no}
                </div>
              </div>
              <div className="row justify-content-between mt-1">
                <div className="col-8">
                  <b>Address of Purchaser: </b>
                  {orderDetails.customer.address}
                </div>
                <div className="col-4">
                  <b>Date of Issue: </b>
                  {moment(orderDetails.challan_date).format("DD MMMM, YYYY")}
                </div>
              </div>
              <div className="row justify-content-between mt-1">
                <div className="col-8">
                  <b>Destination of Supply: </b>
                  {orderDetails.shipping_address}
                </div>
                <div className="col-4">
                  <b>Time of Issue: </b>
                  {moment(orderDetails.created_at).format("hh:mm A")}
                </div>
              </div>
              <div className="row justify-content-between mt-1">
                <div className="col-8">
                  <b>Vehicle Type and Number: </b>
                  {orderDetails.vehicle_no}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-4">
              <table
                className="table table-hover table-bordered"
                style={{ border: "1px solid black" }}
              >
                <thead>
                  <tr style={{ fontSize: "10px" }}>
                    <th className="text-center align-middle">S/L NO</th>
                    <th className="text-center align-middle">
                      Good/Service Description (Incases with Brand Name)
                    </th>
                    <th className="text-center align-middle">Unit of Supply</th>
                    <th className="text-center align-middle">Quantity</th>
                    <th className="text-center align-middle">
                      Unit Value <sup>1</sup> (TAKA)
                    </th>
                    <th className="text-center align-middle">
                      Total Value <sup>1</sup> (TAKA)
                    </th>
                    <th className="text-center align-middle">SD Rate</th>
                    <th className="text-center align-middle">SD AMOUNT</th>
                    <th className="text-center align-middle">
                      VAT Rate/Specific Tax
                    </th>
                    <th className="text-center align-middle">
                      VAT Rate/Specific Tax Amount (TAKA)
                    </th>
                    <th className="text-center align-middle">
                      Value Including all types of Duty & Tax (TAKA)
                    </th>
                    <th className="text-center align-middle">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      1
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      2
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      3
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      4
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      5
                    </th>

                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      6
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      7
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      8
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      9
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      10
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      11
                    </th>
                    <th
                      className="text-center align-middle"
                      style={{ padding: "4px" }}
                    >
                      12
                    </th>
                  </tr>
                  {orderDetails?.sales_items?.map((item, index) => (
                    <tr key={index}>
                      <th style={{ padding: "4px" }}>{index + 1}</th>
                      <td style={{ padding: "4px", fontSize: "12px" }}>
                        {item.item_info.title} - {item.item_info.sku}
                      </td>
                      <td style={{ padding: "4px" }}>
                        {item.item_info.unit_type}
                      </td>
                      <td className="text-center" style={{ padding: "4px" }}>
                        {item.qty}
                      </td>
                      <td className="text-end" style={{ padding: "4px" }}>
                        {Intl.NumberFormat().format(item.price.toFixed(2))}
                      </td>
                      <td className="text-end" style={{ padding: "4px" }}>
                        {Intl.NumberFormat().format(
                          item.total_price.toFixed(2)
                        )}
                      </td>
                      <td className="text-end" style={{ padding: "4px" }}></td>
                      <td className="text-end" style={{ padding: "4px" }}></td>
                      <td className="text-center" style={{ padding: "4px" }}>
                        {item.vat_rate} %
                      </td>
                      <td className="text-end" style={{ padding: "4px" }}>
                        {Intl.NumberFormat().format(item.vat_amount.toFixed(2))}
                      </td>
                      <td className="text-end" style={{ padding: "4px" }}>
                        {Intl.NumberFormat().format(
                          (item.total_price + item.vat_amount).toFixed(2)
                        )}
                      </td>
                      <td style={{ padding: "4px" }}></td>
                    </tr>
                  ))}

                  <tr>
                    <td
                      colSpan={5}
                      className="text-end"
                      style={{ padding: "4px" }}
                    >
                      <b>Total</b>
                    </td>
                    <td className="text-end" style={{ padding: "4px" }}>
                      {Intl.NumberFormat().format(calculate())}
                    </td>
                    <td colSpan={3} style={{ padding: "4px" }}></td>
                    <td className="text-end" style={{ padding: "4px" }}>
                      {Intl.NumberFormat().format(calculateVat())}
                    </td>
                    <td className="text-end" style={{ padding: "4px" }}>
                      {Intl.NumberFormat().format(calculateTotal())}
                    </td>
                    <td style={{ padding: "4px" }}></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="row mt-2">
                <div className="col-md-12 capital">
                  <Typography variant="h6" color={colors.primary[300]}>
                    <b>Quantity in Words:</b>{" "}
                    {converter.toWords(calculateQty())} Piece(s) Only
                  </Typography>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 capital">
                  <Typography variant="h6" color={colors.primary[300]}>
                    <b>Amount in Words:</b>{" "}
                    {converter.toWords(calculateTotal())} Taka Only
                  </Typography>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-12">
                  <b>Name of Authorized Person of Organaization:</b>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <b>Designation:</b>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-8">
                  <b>Signature:</b>
                </div>
                <div className="col-md-4">
                  <b>Seal:</b>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-12">
                  <b>1.</b> Value excluding all types of taxes.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

SixThree.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

export default SixThree;
