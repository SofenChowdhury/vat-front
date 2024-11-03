import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

//axios
import axios from "axios";
import { BASE_URL } from "../../../../../base";

import { Button } from "@mui/material";

//redux imports
import { connect } from "react-redux";

// PRINT
import { useReactToPrint } from "react-to-print";

//date
import moment from "moment";

//Icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Print from "@mui/icons-material/Print";

const AdjustmentsVat = ({ query, token }) => {
  //Helper variables
  const id = +query.id;
  const [adjustmentDetails, setadjustmentDetails] = useState(null);

  //router
  const router = useRouter();

  //Print
  const printRef = useRef();

  //Fetching Adjustment Details
  useEffect(() => {
    const apiAdjustment = BASE_URL + "api/v1/vat-adjustment/" + id;
    axios
      .get(apiAdjustment, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setadjustmentDetails(res.data.data);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //calculation
  const totalVat = () => {
    let t = 0;
    adjustmentDetails?.challans?.map((data) => {
      t += data.amount;
    });
    return t.toFixed(2);
  };
  const totalValue = () => {
    let t = 0;
    adjustmentDetails?.challans?.map((data) => {
      t += data.value + data.amount;
    });
    return t.toFixed(2);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // return route
  const goBack = () => {
    router.back();
  };

  console.log(adjustmentDetails);

  return (
    <>
      <div className="row justify-content-between">
        <div className="col-2">
          <Button variant="outlined" size="large" onClick={goBack}>
            <ArrowLeftIcon />
            Adjustment List
          </Button>
        </div>
        <div className="col-10">
          {/* <Button
                variant="contained"
                size="large"
                className="float-end"
                onClick={downloadPdf}
              >
                <Download />
                Download
              </Button> */}
          <Button
            variant="outlined"
            size="large"
            className="float-end me-3"
            onClick={handlePrint}
          >
            <Print className="me-2" />
            Print
          </Button>
        </div>
      </div>

      {/* HEADERS */}
      <div className="px-5 py-3" ref={printRef}>
        <div>
          <div className="row">
            <div className="col-2">
              {/* <img
                className="ms-5"
                alt="profile-user"
                width="80px"
                height="80px"
                src={`/../../../assets/images/govt.png`}
                style={{ cursor: "pointer", borderRadius: "50%" }}
              /> */}
            </div>
            <div className="col-8 text-center">
              <div className="row">
                <b>Government of People's Republic of Bangladesh</b>
              </div>
              <div className="row">
                <b>National Board of Revenue</b>
              </div>
              <div className="row">
                <b>Withholding Certificate</b>
              </div>
              <div className="row">
                <b>[see Clauses (চ) of Sub -Rule (1) of Rule 40]</b>
              </div>
              <div className="row">
                <b>
                  Name of Withholding Entity: {adjustmentDetails?.company?.name}
                </b>
              </div>
              <div className="row">
                <b>
                  Address of Withholding Entity:{" "}
                  {adjustmentDetails?.company?.contact_address}
                </b>
              </div>
              <div className="row">
                <b>
                  BIN of Withholding Entity (If applicable):{" "}
                  {adjustmentDetails?.company?.company_bin}
                </b>
              </div>
            </div>
            <div className="col-2 text-end">
              <b>Mushak 6.6</b>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-7"></div>
            <div className="col-5">
              {/* <b>Debit Note No -</b> {returnDetails?.return_no} */}
            </div>
          </div>

          <div className="row ">
            <div className="col-7">
              <b>Certificate No:</b> {adjustmentDetails?.certificate_no}
            </div>
            <div className="col-5">
              <b>Date of Issue: </b> {adjustmentDetails?.certificate_date}
              {/* {moment(returnDetails?.created_at).format("DD MMM YY")} */}
            </div>
          </div>
          <div className="row mt-4">
            <p style={{ textAlign: "justify" }}>
              This is to certified that VAT has been deducted at source from the
              supplier having VAT deductitble at Source in accordance with
              section 49 of the Act. The VAT so deducted has been deposited in
              the government treasury by book transfer/treasury challan in the
              return. A copy has been attached. <b>(If Applicable)</b>
            </p>
          </div>
          <div className="table-responsive mt-3">
            <table className="table table-hover table-bordered table-crammed">
              <thead>
                <tr>
                  <th rowSpan={2} className="text-center align-middle">
                    SL No
                  </th>
                  {adjustmentDetails?.type == "increasing" ? (
                    <>
                      <th colSpan={2} className="text-center align-middle">
                        Supplier
                      </th>
                    </>
                  ) : (
                    <>
                      <th colSpan={2} className="text-center align-middle">
                        Customer
                      </th>
                    </>
                  )}

                  <th colSpan={2} className="text-center align-middle">
                    Concerned tax Invoice
                  </th>
                  <th rowSpan={2} className="text-center align-middle">
                    Total Value of Supply (TAKA)
                  </th>
                  <th rowSpan={2} className="text-center align-middle">
                    Amount of VAT (TAKA)
                  </th>
                  <th rowSpan={2} className="text-center align-middle">
                    Amount of VAT withheld at source (TAKA)
                  </th>
                </tr>
                <tr>
                  <th className="text-center align-middle">Name</th>
                  <th className="text-center align-middle">BIN</th>
                  <th className="text-center align-middle">Number</th>
                  <th className="text-center align-middle">Issue Date</th>
                </tr>
              </thead>
              <tbody>
                {adjustmentDetails?.challans?.map((challan, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    {adjustmentDetails?.type == "increasing" ? (
                      <>
                        
                        {challan.purchase ? (
                          <>
                          <td>{challan.purchase?.vendor?.name}</td>
                        <td>{challan.purchase?.vendor?.vendor_bin}</td>
                            <td>{challan.purchase.purchase_no}</td>
                            <td>{challan.purchase.challan_date}</td>
                          </>
                        ) : (
                          <>
                          <td>{adjustmentDetails?.vendor?.name}</td>
                          <td>{adjustmentDetails?.vendor?.vendor_bin}</td>
                            <td>{challan.challan_no}</td>
                            <td>{challan.challan_date}</td>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <td>{challan.sales?.customer?.name}</td>
                        <td>{challan.sales?.customer?.bin}</td>
                        {challan.sales ? (
                          <>
                            <td>{challan.sales.sales_no}</td>
                            <td>
                              {moment(challan.sales.challan_date).format(
                                "MMM DD, YYYY"
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{challan.challan_no}</td>
                            <td>
                              {moment(challan.challan_date).format(
                                "MMM DD, YYYY"
                              )}
                            </td>
                          </>
                        )}
                      </>
                    )}

                    <td className="text-end align-middle">
                      {challan.value + challan.amount}
                    </td>
                    <td className="text-end align-middle">{challan.amount}</td>
                    <td className="text-end align-middle">{challan.amount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={5} className="text-end align-middle">
                    Total
                  </th>
                  <th className="text-end align-middle">{totalValue()}</th>

                  <th className="text-end align-middle"> {totalVat()} </th>
                  <th className="text-end align-middle">{totalVat()}</th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <b>Officer-in-charge:</b>{" "}
            </div>
          </div>
          <div className="row ">
            <div className="col-12 mt-4 mb-4">
              <b>Signature:</b>{" "}
            </div>
          </div>
          <div className="row ">
            <div className="col-12">
              <b>Name:</b>{" "}
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12">
              <b>1. </b> Value including all type of taxes.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AdjustmentsVat.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(AdjustmentsVat);
