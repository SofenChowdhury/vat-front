import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { CircularProgress, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// PDF
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";

// PRINT
import { useReactToPrint } from "react-to-print";

// QR
import QRCode from "qrcode.react";

//Icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Download from "@mui/icons-material/Download";
import Print from "@mui/icons-material/Print";

// Time
import moment from "moment";

const ReturnVatOrder = ({ query, token }) => {
  // HELPER VARIABLES
  const id = +query.id;

  // BOOLEANS
  const [returnDetails, setReturnDetails] = useState({});
  const [loader, setLoader] = useState(true);

  // REFERENCES
  const printRef = useRef();

  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/sales/return/" + id;
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

  const downloadPdf = async () => {
    const data = await htmlToImage.toPng(printRef.current);

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    const name = "6_8.pdf";

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(name);
  };

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
    let salesPrice = 0;
    returnDetails?.sales?.sales_items.map((item) => {
      if (item.product_id == id) {
        salesPrice = item.total_price;
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

  console.log(returnDetails);

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row mb-5">
            <div className="col-md-6">
              <Link href="/orders/returnList" className="anchor">
                <Button variant="contained" size="large" >
                  <ArrowLeftIcon />
                  Return List
                </Button>
              </Link>
            </div>
            <div className="col-md-6">
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
          <div
            ref={printRef}
            className="px-5 py-3 small-text custom-line-height"
          >
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
                    <b>Credit Note</b>
                  </div>
                  <div className="row">
                    <b>[See Clauses (g) of Sub-Rule (1) of Rule 40]</b>
                  </div>
                </div>
                <div className="col-3">
                  <div className="row">
                    <div className="col-12">
                      <b className="float-end me-5">Mushak 6.7</b>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-12">
                      <Link
                        href={`/public/six-seven/${returnDetails.return_no}`}
                      >
                        <QRCode
                          value={`http://vat.fairgroupbd.com/public/six-seven/${returnDetails.return_no}`}
                          style={{ height: "50px", width: "50px" }}
                          className="float-end me-5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-6">
                  {returnDetails?.company_id == null ? (
                    <>
                      <b>Registered Person's Name -</b>{" "}
                      {returnDetails?.sales?.company?.name}
                    </>
                  ) : (
                    <>
                      <b>Registered Person's Name -</b>{" "}
                      {returnDetails?.company?.name}
                    </>
                  )}
                </div>
                <div className="col-6">
                  <b>Credit Note No -</b> {returnDetails?.return_no}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  {returnDetails?.company_id == null ? (
                    <>
                      <b>Registered Person's BIN -</b>{" "}
                      {returnDetails?.sales?.company.company_bin}
                    </>
                  ) : (
                    <>
                      <b>Registered Person's BIN -</b>{" "}
                      {returnDetails?.company.company_bin}
                    </>
                  )}
                </div>
                <div className="col-6">
                  <b>External Reference No -</b> {returnDetails?.reference_no}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  {returnDetails?.company_id == null ? (
                    <>
                      <b>Registered Person's Address -</b>{" "}
                      {returnDetails?.sales?.company.contact_address}
                    </>
                  ) : (
                    <>
                      <b>Registered Person's Address -</b>{" "}
                      {returnDetails?.company.contact_address}
                    </>
                  )}
                </div>

                <div className="col-6">
                  <b>Date of Issue -</b>{" "}
                  {moment(returnDetails?.created_at).format("DD MMM YY")}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  {returnDetails?.customer_id == null ? (
                    <>
                      <b>Buyer/Recepient Name -</b>{" "}
                      {returnDetails?.sales?.customer.name}
                    </>
                  ) : (
                    <>
                      <b>Buyer/Recepient Name -</b>{" "}
                      {returnDetails?.customer?.name}
                    </>
                  )}
                </div>
                <div className="col-6">
                  <b>Time of Issue -</b>{" "}
                  {moment(returnDetails?.created_at).format("h:mm a")}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  {returnDetails?.customer_id == null ? (
                    <>
                      <b>Buyer/Recepient BIN -</b>{" "}
                      {returnDetails?.sales?.customer.bin}
                    </>
                  ) : (
                    <>
                      <b>Buyer/Recepient BIN -</b>{" "}
                      {returnDetails?.customer?.bin}
                    </>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  {returnDetails?.customer_id == null ? (
                    <>
                      <b>Buyer/Recepient Address -</b>{" "}
                      {returnDetails?.sales?.customer.address}
                    </>
                  ) : (
                    <>
                      <b>Buyer/Recepient Address -</b>{" "}
                      {returnDetails?.customer?.address}
                    </>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <b>Vehicle Type and Number -</b>{" "}
                  {returnDetails?.sales?.vehicle_no}
                </div>
                <div className="col-6"></div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-3">
              <table className="table table-hover table-bordered table-crammed">
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
                    <th className="text-center align-middle">Amount of SD</th>
                    <th className="text-center align-middle">
                      Value<sup>1</sup>
                    </th>
                    <th className="text-center align-middle">Quantity (PCS)</th>
                    <th className="text-center align-middle">Amount of VAT</th>
                    <th className="text-center align-middle">Amount of SD</th>
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
                              getPrice(item.product_id)
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
                          item.total_price.toFixed(2)
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
                    <td className="p-1 text-center">{calculateQty()}</td>
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
            <div className="row mt-3">
              <div className="col-6"></div>
              <div className="col-6">
                <b>Signature:</b>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6"></div>
              <div className="col-6">
                <b>Seal :</b>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <b>1.</b> Value excluding all type of Taxes.
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

ReturnVatOrder.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(ReturnVatOrder);
