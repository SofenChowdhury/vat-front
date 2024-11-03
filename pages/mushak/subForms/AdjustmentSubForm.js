import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

// PRINT
import { useReactToPrint } from "react-to-print";
import Print from "@mui/icons-material/Print";

// Theme imports
import { tokens } from "../../theme";

//redux imports
import { connect } from "react-redux";

import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

//Date
import moment from "moment/moment";

const AdjustmentSubForm = ({ token, query }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [mushak24, setMushak24] = useState([]);
  const [mushak27, setMushak27] = useState([]);
  const [mushak29, setMushak29] = useState([]);
  const [mushak32, setMushak32] = useState([]);
  const [mushak26, setMushak26] = useState([]);
  const [mushak31, setMushak31] = useState([]);

  //Query subform data
  const form = query?.form;
  const note = query?.note;
  const start_date = query?.start_date;
  const end_date = query?.end_date;
  const vds_increasing_amount_24 = query?.vds_increasing_amount_24;
  const vds_decreasing_amount_29 = query?.vds_decreasing_amount_29;
  const debit_note_amount_26 = query?.debit_note_amount_26;
  const debit = query?.debit;
  const increasing = query?.increasing;
  const credit_note_amount_31 = query?.credit_note_amount_31;
  const credit = query?.credit;
  const decreasing = query?.decreasing;
  const other_increasing_amount_27 = query?.other_increasing_amount_27;
  const other_decreasing_amount_32 = query?.other_decreasing_amount_32;
  const supplier = query?.supplier;
  const buyer = query?.buyer;

  //Currency
  let formatCurrency = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BDT",
  });

  // REFERENCES
  const printRef = useRef();
  const multiselectRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    if (debit_note_amount_26) {
      const apiMushak =
        BASE_URL +
        "api/v1/purchases-return-sub-form?" +
        "start_date=" +
        start_date +
        "&end_date=" +
        end_date;
      axios
        .get(apiMushak, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res?.data?.status) {
            setMushak26(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (credit_note_amount_31) {
      const apiMushak =
        BASE_URL +
        "api/v1/sales/return-sub-form?" +
        "start_date=" +
        start_date +
        "&end_date=" +
        end_date;
      axios
        .get(apiMushak, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res?.data?.status) {
            setMushak31(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (vds_increasing_amount_24) {
      const apiMushak =
        BASE_URL +
        "api/v1/vds-adjustment-sub-form?" +
        "start_date=" +
        start_date +
        "&end_date=" +
        end_date +
        "&note_no=" +
        +vds_increasing_amount_24;
      axios
        .get(apiMushak, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res?.data?.status) {
            setMushak24(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (other_increasing_amount_27) {
      const apiMushak =
        BASE_URL +
        "api/v1/vds-adjustment-sub-form?" +
        "start_date=" +
        start_date +
        "&end_date=" +
        end_date +
        "&note_no=" +
        +other_increasing_amount_27;
      axios
        .get(apiMushak, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res?.data?.status) {
            setMushak27(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (vds_decreasing_amount_29) {
      const apiMushak =
        BASE_URL +
        "api/v1/vds-adjustment-sub-form?" +
        "start_date=" +
        start_date +
        "&end_date=" +
        end_date +
        "&note_no=" +
        +vds_decreasing_amount_29;
      axios
        .get(apiMushak, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res?.data?.status) {
            setMushak29(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (other_decreasing_amount_32) {
      const apiMushak =
        BASE_URL +
        "api/v1/vds-adjustment-sub-form?" +
        "start_date=" +
        start_date +
        "&end_date=" +
        end_date +
        "&note_no=" +
        +other_decreasing_amount_32;
      axios
        .get(apiMushak, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res?.data?.status) {
            setMushak32(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const sum = () => {
    let total = 0;
    if (debit_note_amount_26) {
      mushak26?.map((data) =>
        data?.return_items?.map((dt) => (total += dt?.price))
      );
    }
    if (credit_note_amount_31) {
      mushak31?.map((data) =>
        data?.return_items?.map((dt) => (total += dt?.price))
      );
    }
    if (vds_increasing_amount_24) {
      mushak24?.map((data) =>
        data?.challans?.map((dt) => (total += dt?.value))
      );
    }
    if (other_increasing_amount_27) {
      mushak27?.map((data) =>
        data?.challans?.map((dt) => (total += dt?.value))
      );
    }
    if (vds_decreasing_amount_29) {
      mushak29?.map((data) =>
        data?.challans?.map((dt) => (total += dt?.value))
      );
    }
    if (other_decreasing_amount_32) {
      mushak32?.map((data) =>
        data?.challans?.map((dt) => (total += dt?.value))
      );
    }
    return total.toFixed(2);
  };

  const qty = () => {
    let total = 0;
    if (debit_note_amount_26) {
      mushak26?.map((data) =>
        data?.return_items?.map((dt) => (total += dt?.qty))
      );
    }
    if (credit_note_amount_31) {
      mushak31?.map((data) =>
        data?.return_items?.map((dt) => (total += dt?.qty))
      );
    }
    return total;
  };

  const sumVat = () => {
    let total = 0;
    if (debit_note_amount_26) {
      mushak26?.map((data) =>
        data?.return_items?.map((dt) => (total += dt?.vat_amount))
      );
    }
    if (credit_note_amount_31) {
      mushak31?.map((data) =>
        data?.return_items?.map((dt) => (total += dt?.vat_amount))
      );
    }
    if (vds_increasing_amount_24) {
      mushak24?.map((data) =>
        data?.challans?.map((dt) => (total += dt?.amount))
      );
    }
    if (other_increasing_amount_27) {
      mushak27?.map((data) =>
        data?.challans?.map((dt) => (total += dt?.amount))
      );
    }
    if (vds_decreasing_amount_29) {
      mushak29?.map((data) =>
        data?.challans?.map((dt) => (total += dt?.amount))
      );
    }
    if (other_decreasing_amount_32) {
      mushak32?.map((data) =>
        data?.challans?.map((dt) => (total += dt?.amount))
      );
    }
    return total.toFixed(2);
  };
  console.log(mushak24);

  const renderMushak24 = () => {
    let indexNumber = 1;
    if (mushak24.length > 0) {
      return mushak24.map((data, index) =>
        data.challans?.map((dt, i) => (
          <tr key={index * data.challans.length + i}>
            <td className="text-center align-middle">
              {indexNumber++}
            </td>
            <td className="text-center align-middle">
              {data.vendor
                ? data.vendor?.vendor_bin
                : dt.purchase?.vendor?.vendor_bin}
            </td>
            <td className="text-center align-middle">
              {data.vendor ? data.vendor?.name : dt.purchase?.vendor?.name}
            </td>
            <td className="text-center align-middle">
              {data.vendor
                ? data.vendor?.contact_address
                : dt.purchase?.vendor?.contact_address}
            </td>

            <td className="text-end align-middle">{dt?.value}</td>
            <td className="text-end align-middle">{dt?.amount}</td>
            <td className="text-center align-middle">
              {dt.purchase ? dt.purchase?.challan_no : dt.challan_no}
            </td>
            <td className="text-center align-middle">
              {dt.purchase
                ? moment(dt.purchase?.challan_date).format("DD-MMM-YYYY")
                : moment(dt.challan_date).format("DD-MMM-YYYY")}
            </td>
            <td className="text-center align-middle">{data?.certificate_no}</td>
            <td className="text-center align-middle">
              {moment(data?.certificate_date).format("DD-MMM-YYYY")}
            </td>
            <td className="text-center align-middle">{data?.account_code}</td>
            <td className="text-center align-middle">{data?.reference_no}</td>
            <td className="text-center align-middle">
              {moment(data?.deposit_date).format("DD-MMM-YYYY")}
            </td>
            <td className="text-center align-middle">{data?.remarks}</td>
            {/* <td className="text-center align-middle">{formatCurrency.format(data?.amount)}</td> */}
            {/* <td className="text-center align-middle">{data?.remarks}</td> */}
          </tr>
        ))
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div>
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
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        {form}
      </Typography>
      <div ref={printRef}>
        <div className="row justify-content-md-center mt-2">
          <div className="col-md-12 text-center">
            <b>
              {mushak26[0]?.purchase?.company?.name}
              {mushak31[0]?.sales?.company?.name}
            </b>
          </div>
        </div>
        <div className="row justify-content-md-center mt-1">
          <div className="col-md-12 text-center">
            {mushak26[0]?.purchase?.company?.contact_address}
            {mushak31[0]?.sales?.company?.contact_address}
          </div>
        </div>
        <div className="row justify-content-md-center mt-1">
          <div className="col-md-12 text-center">
            {mushak26[0]?.purchase?.company?.company_bin}
            {mushak31[0]?.sales?.company?.company_bin}
          </div>
        </div>
        {/* <div className="row justify-content-md-center mt-1">
          <div className="col-md-12 text-center">
            <b>Sub-form for the month of October-2022</b>
          </div>
        </div> */}
        <div className="row justify-content-md-center mt-1">
          <div className="col-md-12 text-center">
            <b>
              Sub Form - {vds_increasing_amount_24} {debit_note_amount_26}{" "}
              {other_increasing_amount_27} {vds_decreasing_amount_29}{" "}
              {credit_note_amount_31} {other_decreasing_amount_32}{" "}
              {!(debit_note_amount_26 || credit_note_amount_31) &&
                "(VAT Deducted at Source from Suppliers)"}
            </b>
          </div>
        </div>
        {debit_note_amount_26 == 26 || credit_note_amount_31 == 31 ? (
          <table className="table table-bordered mt-2">
            <thead>
              <tr className="table-success">
                <th className="text-center align-middle">SL</th>
                <th className="text-center align-middle">
                  {debit}
                  {credit} note no.
                </th>
                <th className="text-center align-middle">Issue date</th>
                <th className="text-center align-middle">VAT challan No</th>
                <th className="text-center align-middle">VAT challan Date</th>
                <th className="text-center align-middle">
                  Value of {increasing}
                  {decreasing} Adjustment
                </th>
                <th className="text-center align-middle">
                  Quantity of {increasing}
                  {decreasing} Adjustment
                </th>
                <th className="text-center align-middle">
                  VAT {increasing}
                  {decreasing} Adjustment
                </th>
                <th className="text-center align-middle">
                  SD {increasing}
                  {decreasing} Adjustment
                </th>
                <th className="text-center align-middle">Note</th>
              </tr>
            </thead>
            <tbody>
              {mushak26 &&
                mushak26?.map((data, index) =>
                  data?.return_items?.map((dt, i) => (
                    <tr>
                      <td className="text-center align-middle">{index + 1}</td>
                      <td className="text-center align-middle">
                        {data?.return_no}
                      </td>
                      <td className="text-center align-middle">
                        {moment(data?.created_at).format("DD-MMM-YYYY")}
                      </td>
                      <td className="text-center align-middle">
                        {dt?.challan_no}
                      </td>
                      <td className="text-center align-middle">
                        {moment(dt?.challan_date).format("DD-MMM-YYYY")}
                      </td>
                      <td className="text-end align-middle">{dt?.price}</td>
                      <td className="text-end align-middle">{dt?.qty}</td>
                      <td className="text-end align-middle">
                        {(dt?.price * dt?.qty * 15) / 100}
                      </td>
                      <td className="text-end align-middle">{dt?.sd}</td>
                      <td className="text-end align-middle"></td>
                    </tr>
                  ))
                )}
              {mushak31 &&
                mushak31?.map((data, index) =>
                  data?.return_items?.map((dt, i) => (
                    <tr>
                      <td className="text-center align-middle">{index + 1}</td>
                      <td className="text-center align-middle">
                        {data?.return_no}
                      </td>
                      <td className="text-center align-middle">
                        {moment(data?.challan_date).format("DD-MMM-YYYY")}
                      </td>
                      <td className="text-center align-middle">
                        {data?.sales?.sales_no}
                      </td>
                      <td className="text-center align-middle">
                        {moment(data?.sales?.challan_date).format(
                          "DD-MMM-YYYY"
                        )}
                      </td>
                      <td className="text-end align-middle">{dt?.price}</td>
                      <td className="text-end align-middle">{dt?.qty}</td>
                      <td className="text-end align-middle">
                        {dt?.vat_amount}
                      </td>
                      <td className="text-end align-middle">{dt?.sd}</td>
                      <td className="text-center align-middle"></td>
                    </tr>
                  ))
                )}
              <tr className="table-success">
                <td className="text-center align-middle" colSpan={5}>
                  <strong>Total</strong>
                </td>
                <td className="text-end align-middle">
                  <strong>{formatCurrency.format(sum())}</strong>
                </td>
                <td className="text-end align-middle">
                  <strong>{qty()}</strong>
                </td>
                <td className="text-end align-middle">
                  <strong>{formatCurrency.format(sumVat())}</strong>
                </td>
                <td className="text-end align-middle">
                  <strong></strong>
                </td>
                <td className="text-center align-middle"></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            {other_increasing_amount_27 == 27 ||
            other_decreasing_amount_32 == 32 ? (
              <table className="table table-bordered mt-2">
                <thead>
                  <tr className="table-success">
                    <th className="text-center align-middle">Serial No.</th>
                    <th className="text-center align-middle">
                      Invoice No. (Challan/Bill No. etc.)
                    </th>
                    <th className="text-center align-middle">
                      Invoice / Challan/Bill Date
                    </th>
                    <th className="text-center align-middle">Value</th>
                    <th className="text-center align-middle">Deducted VAT</th>
                    <th className="text-center align-middle">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {mushak27 &&
                    mushak27?.map((data, index) =>
                      data?.challans?.map((dt, i) => (
                        <tr>
                          <td className="text-center align-middle">
                            {index + 1}
                          </td>
                          <td className="text-center align-middle">
                            {dt?.purchase?.challan_no}
                          </td>
                          <td className="text-center align-middle">
                            {moment(dt?.purchase?.challan_date).format(
                              "DD-MMM-YYYY"
                            )}
                          </td>
                          <td className="text-end align-middle">{dt?.value}</td>
                          <td className="text-end align-middle">
                            {dt?.amount}
                          </td>
                          <td className="text-center align-middle">
                            {data?.remarks}
                          </td>
                        </tr>
                      ))
                    )}
                  {mushak32 &&
                    mushak32?.map((data, index) =>
                      data?.challans?.map((dt, i) => (
                        <tr>
                          <td className="text-center align-middle">
                            {index + 1}
                          </td>
                          <td className="text-center align-middle">
                            {data.challan_no}
                          </td>
                          <td className="text-center align-middle">
                            {moment(dt?.sales?.created_at).format(
                              "DD-MMM-YYYY"
                            )}
                          </td>
                          <td className="text-end align-middle">{dt?.value}</td>
                          <td className="text-end align-middle">
                            {dt?.amount}
                          </td>
                          <td className="text-center align-middle">
                            {data?.remarks}
                          </td>
                        </tr>
                      ))
                    )}
                  <tr className="table-success">
                    <td className="text-center align-middle" colSpan={3}>
                      <strong>Total</strong>
                    </td>
                    <td className="text-end align-middle">
                      <strong>{formatCurrency.format(sum())}</strong>
                    </td>
                    <td className="text-end align-middle">
                      <strong>{formatCurrency.format(sumVat())}</strong>
                    </td>
                    <td className="text-center align-middle"></td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="table table-bordered mt-2">
                <thead>
                  <tr className="table-success">
                    <th className="text-center align-middle">Serial No.</th>
                    <th className="text-center align-middle">
                      {supplier} {buyer} Bin
                    </th>
                    <th className="text-center align-middle">
                      {supplier} {buyer} Name
                    </th>
                    <th className="text-center align-middle">
                      {supplier} {buyer} Address
                    </th>
                    <th className="text-center align-middle">Value</th>
                    <th className="text-center align-middle">Deducted VAT</th>
                    <th className="text-center align-middle">
                      Invoice No. (Challan/Bill No. etc.)
                    </th>
                    <th className="text-center align-middle">
                      Invoice / Challan/Bill Date
                    </th>
                    <th className="text-center align-middle">
                      VAT Deduction at Source Certificate No
                    </th>
                    <th className="text-center align-middle">
                      VAT Deduction at Source Certificate Date
                    </th>
                    <th className="text-center align-middle">
                      Tax Deposit Account Code
                    </th>
                    <th className="text-center align-middle">
                      Tax Deposit Serial Number of Bank Transfer
                    </th>
                    <th className="text-center align-middle">
                      Tax Deposit Date
                    </th>
                    <th className="text-center align-middle">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {renderMushak24()}

                  {mushak29 &&
                    mushak29?.map((data, index) =>
                      data?.challans?.map((dt, i) => (
                        <tr>
                          <td className="text-center align-middle">
                            {index + 1}
                          </td>
                          <td className="text-center align-middle">
                            {data.customer
                              ? data.customer?.bin
                              : dt.sales?.customer?.bin}
                          </td>
                          <td className="text-center align-middle">
                            {data.customer
                              ? data.customer?.name
                              : dt.sales?.customer?.name}
                          </td>
                          <td className="text-center align-middle">
                            {data.customer
                              ? data.customer?.address
                              : dt.sales?.customer?.address}
                          </td>
                          <td className="text-end align-middle">{dt?.value}</td>
                          <td className="text-end align-middle">
                            {dt?.amount}
                          </td>
                          <td className="text-center align-middle">
                            {dt?.sales?.sales_no}
                          </td>
                          <td className="text-center align-middle">
                            {moment(dt?.sales?.created_at).format(
                              "DD-MMM-YYYY"
                            )}
                          </td>
                          <td className="text-center align-middle">
                            {data?.certificate_no}
                          </td>
                          <td className="text-center align-middle">
                            {moment(data?.certificate_date).format(
                              "DD-MMM-YYYY"
                            )}
                          </td>
                          <td className="text-center align-middle">
                            {data?.account_code}
                          </td>
                          <td className="text-center align-middle">
                            {data?.reference_no}
                          </td>
                          <td className="text-center align-middle">
                            {moment(data?.deposit_date).format("DD-MMM-YYYY")}
                          </td>
                          <td className="text-center align-middle">
                            {data?.remarks}
                          </td>
                        </tr>
                      ))
                    )}
                  <tr className="table-success">
                    <td className="text-center align-middle" colSpan={4}>
                      <strong>Total</strong>
                    </td>
                    <td className="text-end align-middle">
                      <strong>{formatCurrency.format(sum())}</strong>
                    </td>
                    <td className="text-end align-middle">
                      <strong>{formatCurrency.format(sumVat())}</strong>
                    </td>
                    <td className="text-center align-middle" colSpan={7}>
                      <strong></strong>
                    </td>
                    <td className="text-center align-middle">
                      {/* <Link href={{
                          pathname: "/mushak/mushak_91",
                        }}
                        target="_blank"
                  >
                    Mushak-9.1
                  </Link> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
};
// export default SubForm58;

AdjustmentSubForm.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(AdjustmentSubForm);
