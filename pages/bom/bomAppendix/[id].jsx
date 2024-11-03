import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import { CircularProgress, Typography, useTheme, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// PDF
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";

// PRINT
import { useReactToPrint } from "react-to-print";

// Date
import moment from "moment/moment";

//Icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Download from "@mui/icons-material/Download";
import Print from "@mui/icons-material/Print";

const BomAppendix = ({ query, token }) => {
  // HELPER VARIABLES
  const [bomDetails, setBomDetails] = useState({});
  const id = +query.id;
  const [len, setLen] = useState(0);
  let date = moment().format("DD MMM YYYY");
  const router = useRouter();

  // BOOLEANS
  const [loader, setLoader] = useState(true);

  // REFERENCES
  const printRef = useRef();

  // PRINT
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // FETCH BOM DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/boms/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setBomDetails(res.data.data);
          setLoader(false);
          if (
            res.data.data.bom_value_additions.length >
            res.data.data.raw_materials.length + +res.data.data.services.length
          )
            setLen(res.data.data.bom_value_additions.length);
          else
            setLen(
              res.data.data.raw_materials.length +
                +res.data.data.services.length
            );
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

    const name = bomDetails?.finish_goods?.title + "_4_3.pdf";

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(name);
  };

  const calculate = () => {
    let total = 0;
    bomDetails?.raw_materials?.map((item) => {
      total += item.price;
    });
    bomDetails?.services?.map((item) => {
      total += item.amount;
    });
    return total.toFixed(2);
  };

  const calculateSettings = () => {
    let total = 0;
    bomDetails?.bom_value_additions?.map((item) => {
      total += item.amount;
    });
    return total.toFixed(2);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <Button variant="outlined" size="large" onClick={goBack}>
                <ArrowLeftIcon />
                BOM List
              </Button>
            </div>
            <div className="col-md-6">
              <Button
                variant="contained"
                size="large"
                className="float-end"
                onClick={downloadPdf}
                color="secondary"
              >
                <Download />
                Download
              </Button>
              <Button
                variant="contained"
                size="large"
                className="float-end me-3"
                onClick={handlePrint}
                color="secondary"
              >
                <Print />
                Print
              </Button>
            </div>
          </div>
          <div ref={printRef} className="p-5">
            {/* HEADERS */}
            <div>
              <div className="row">
                <div className="col-md-4">
                  <img
                    className="ms-5"
                    alt="profile-user"
                    width="80px"
                    height="80px"
                    src={`../../assets/images/govt.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </div>
                <div className="col-md-4 text-center">
                  <div className="row">
                    <b style={{ color: "dodgerblue" }}>
                      Government of People's Republic of Bangladesh
                    </b>
                  </div>
                  <div className="row">
                    <b style={{ color: "dodgerblue" }}>
                      National Board of Revenue
                    </b>
                  </div>
                  <div className="row">
                    <b style={{ color: "darkviolet" }}>Appendix KA</b>
                  </div>
                </div>
                <div className="col-md-4 text-end"></div>
              </div>
              <div className="row mt-5 ">
                <div className="col-md-12">
                  <b>Name of the Entry -</b> {bomDetails?.company.name}
                </div>
              </div>
              <div className="row ">
                <div className="col-md-12">
                  <b>Address -</b> {bomDetails?.company.contact_address}
                </div>
              </div>
              <div className="row ">
                <div className="col-md-12">
                  <b>BIN -</b> {bomDetails?.company.company_bin}
                </div>
              </div>
              <div className="row ">
                <div className="col-md-12">
                  <b>Date of Submission -</b> {date}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-4">
              <table
                className="table table-bordered table-hover"
                style={{ border: "black" }}
              >
                <thead>
                  <tr>
                    <th className="text-center align-middle" rowSpan={2}>
                      SL
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      HS Code of Goods
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Name and Details of Supplied goods (including brand name
                      if applicable)
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Unit of Supply
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Particulars
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Quantity including Wastage
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Purchase Price
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Particulars of Value Addition
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      Value
                    </th>
                    <th className="text-center align-middle" colSpan={2}>
                      7+9
                    </th>
                    <th className="text-center align-middle" rowSpan={2}>
                      vat on 11
                    </th>
                    <th className="text-center align-middle" colSpan={2}>
                      11+12
                    </th>
                    <th className="text-center align-middle" colSpan={2}>
                      selling price
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center align-middle">Current</th>
                    <th className="text-center align-middle">Proposed</th>
                    <th className="text-center align-middle">Current</th>
                    <th className="text-center align-middle">Proposed</th>
                    <th className="text-center align-middle">Wholesale</th>
                    <th className="text-center align-middle">Retail</th>
                  </tr>
                  <tr>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                    <th>7</th>
                    <th>8</th>
                    <th>9</th>
                    <th>10</th>
                    <th>11</th>
                    <th>12</th>
                    <th>13</th>
                    <th>14</th>
                    <th>15</th>
                    <th>16</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let stngs = [];
                    for (let i = 0; i < len; i++) {
                      if (i == 0) {
                        stngs.push(
                          <>
                            <tr>
                              <th>{i + 1}</th>
                              <th>
                                {bomDetails?.finish_goods?.hscode.code_dot}
                              </th>
                              <th>{bomDetails?.finish_goods?.title}</th>
                              <th>PCS</th>
                              <th>
                                {bomDetails?.raw_materials[i]?.product?.title}
                              </th>
                              <th style={{ whiteSpace: "noWrap" }}>
                                {
                                  +bomDetails?.raw_materials[i]
                                    ?.qty_with_wastage
                                }{" "}
                                [
                                {(
                                  ((bomDetails?.raw_materials[i]
                                    ?.qty_with_wastage -
                                    bomDetails?.raw_materials[i]?.actual_qty) /
                                    bomDetails?.raw_materials[i]
                                      ?.qty_with_wastage) *
                                  100
                                ).toFixed(4)}
                                %]
                              </th>
                              <th>{bomDetails?.raw_materials[i]?.price}</th>

                              <th>
                                {
                                  bomDetails?.bom_value_additions[i]?.value_info
                                    .head
                                }
                              </th>
                              <th>
                                {bomDetails?.bom_value_additions[i]?.amount}
                              </th>
                              {/* <th>current</th>
                              <th>proposed</th>
                              <th>vat</th>
                              <th>current</th>
                              <th>proposed</th>
                              <th>wholesale</th>
                              <th>retail</th> */}
                              <th></th>
                              <th></th>
                              <th></th>
                              <th>-</th>
                              <th>{bomDetails?.price}</th>
                              <th></th>
                              <th></th>
                            </tr>
                          </>
                        );
                      } else {
                        if (i < bomDetails?.raw_materials.length) {
                          stngs.push(
                            <>
                              <tr>
                                <th>{i + 1}</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                {bomDetails?.raw_materials[i] ? (
                                  <>
                                    <th>
                                      {
                                        bomDetails?.raw_materials[i]?.product
                                          ?.title
                                      }
                                    </th>
                                    <th style={{ whiteSpace: "noWrap" }}>
                                      {
                                        +bomDetails?.raw_materials[i]
                                          ?.qty_with_wastage
                                      }{" "}
                                      [
                                      {(
                                        ((bomDetails?.raw_materials[i]
                                          ?.qty_with_wastage -
                                          bomDetails?.raw_materials[i]
                                            ?.actual_qty) /
                                          bomDetails?.raw_materials[i]
                                            ?.qty_with_wastage) *
                                        100
                                      ).toFixed(4)}
                                      %]
                                    </th>
                                    <th>
                                      {bomDetails?.raw_materials[i]?.price}
                                    </th>
                                  </>
                                ) : (
                                  <>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                  </>
                                )}
                                <th>
                                  {
                                    bomDetails?.bom_value_additions[i]
                                      ?.value_info.head
                                  }
                                </th>
                                <th>
                                  {bomDetails?.bom_value_additions[i]?.amount}
                                </th>
                                {/* <th>current</th>
                                <th>proposed</th>
                                <th>vat</th>
                                <th>current</th>
                                <th>proposed</th>
                                <th>wholesale</th>
                                <th>retail</th> */}
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                              </tr>
                            </>
                          );
                        } else {
                          stngs.push(
                            <>
                              <tr>
                                <th>{i + 1}</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                {bomDetails?.services[
                                  i - bomDetails?.raw_materials.length
                                ] ? (
                                  <>
                                    <th style={{ background: "#94e2cd" }}>
                                      {
                                        bomDetails?.services[
                                          i - bomDetails?.raw_materials.length
                                        ]?.info?.title
                                      }
                                    </th>
                                    <th style={{ background: "#94e2cd" }}></th>
                                    <th style={{ background: "#94e2cd" }}>
                                      {
                                        bomDetails?.services[
                                          i - bomDetails?.raw_materials.length
                                        ]?.amount
                                      }
                                    </th>
                                  </>
                                ) : (
                                  <>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                  </>
                                )}
                                <th>
                                  {
                                    bomDetails?.bom_value_additions[i]
                                      ?.value_info.head
                                  }
                                </th>
                                <th>
                                  {bomDetails?.bom_value_additions[i]?.amount}
                                </th>
                                {/* <th>current</th>
                                <th>proposed</th>
                                <th>vat</th>
                                <th>current</th>
                                <th>proposed</th>
                                <th>wholesale</th>
                                <th>retail</th> */}
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                              </tr>
                            </>
                          );
                        }
                      }
                    }
                    return stngs;
                  })()}
                  <tr>
                    <th colSpan={6} className="text-end">
                      Total Cost
                    </th>
                    <th>{calculate()}</th>
                    <th className="text-end">Total Amount</th>
                    <th>{calculateSettings()}</th>
                    <th colSpan={7}></th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="row mt-3">
                <div className="col-md-8 text-end">
                  <b>Name of Authorised Person of the entity -</b>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8 text-end">
                  <b>Designation -</b>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8 text-end">
                  <b>Signature -</b>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8 text-end">
                  <b>Seal -</b>
                </div>
              </div>
              <div className="row mt-5">
                <b>Note -</b>
              </div>
              <div className="row ">
                <div className="col-md-12 mt-2">
                  <b>1.</b> Input - Output coefficient is required to submit
                  through online / to the concerned divisional official 15 days
                  before final delivery of any goods.
                </div>
              </div>
              <div className="row ">
                <div className="col-md-12 mt-1">
                  <b>2.</b> If the value of materials/ raw materials of any
                  goods is changed more than 7.5%, in that case the input -
                  output coefficientis required to resubmit.
                </div>
              </div>
              <div className="row ">
                <div className="col-md-12 mt-1">
                  <b>3.</b> Copy of Bill of Entry or Mushak 6.3 is required to
                  enclose as supporting of materials purchase.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

BomAppendix.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(BomAppendix);
