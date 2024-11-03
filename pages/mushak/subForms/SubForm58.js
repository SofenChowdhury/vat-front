import React, { useEffect, useState } from "react";
import Link from "next/link";

// Theme imports
import { tokens } from "../../theme";

//redux imports
import { connect } from "react-redux";

import { CircularProgress, Typography, useTheme } from "@mui/material";
import moment from "moment/moment";
//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const SubForm58 = ({ token, query }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [mushak, setMushak] = useState([]);
  const [loader, setLoader] = useState(true);

  //Currency
  let formatCurrency = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BDT",
  });

  //Query subform data
  const note = query?.note;
  const start_date = query?.start_date;
  const end_date = query?.end_date;

  useEffect(() => {
    const apiMushak =
      BASE_URL +
      "api/v1/vat-payment-sub-form?" +
      "start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&note_no=" +
      +note;
    axios
      .get(apiMushak, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setMushak(res.data.data);
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const sum = () => {
    let total = 0;
    mushak?.payments.map((data, index) => {
      total += data?.amount;
    });

    return total.toFixed(2);
  };


  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Note - {note}
          </Typography>
          <div>
            <div className="row justify-content-md-center mt-2">
              <div className="col-md-12 text-center">
                <b>{mushak?.company?.name}</b>
              </div>
            </div>
            <div className="row justify-content-md-center mt-1">
              <div className="col-md-12 text-center">{mushak?.company?.contact_address}</div>
            </div>
            <div className="row justify-content-md-center mt-1">
              <div className="col-md-12 text-center">BIN-{mushak?.company?.company_bin}</div>
            </div>
            <div className="row justify-content-md-center mt-1">
              <div className="col-md-12 text-center">
                <b>Sub-form for the month of {moment(mushak?.end_date).format("MMMM")}{" "}
                    {moment(mushak?.end_date).format("YYYY")}</b>
              </div>
            </div>
            <div className="row justify-content-md-center mt-1">
              <div className="col-md-12 text-center">
                <b>Sub form (for note 58,59,60,61,62,63 and 64)</b>
              </div>
            </div>
            <table className="table table-bordered mt-2">
              <thead>
                <tr className="table-success">
                  <th className="text-center align-middle">SL</th>
                  <th className="text-center align-middle">
                    Treasury Challan No/ Token No
                  </th>
                  <th className="text-center align-middle">Bank/ CGA</th>
                  <th className="text-center align-middle">
                    Branch/ CAFO/ DCO
                  </th>
                  <th className="text-center align-middle">Date</th>
                  <th className="text-center align-middle">
                    Tax Deposit Account Code
                  </th>
                  <th className="text-center align-middle">Amount</th>
                  <th className="text-center align-middle">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mushak.payments?.map((data, index) => (
                  <tr key={index}>
                    <td className="text-center align-middle">{index + 1}</td>
                    {data.method ? (
                      <td className="text-center align-middle">
                        <Link
                          href={{
                            pathname: "/public/eChallan",
                            query: {
                              chalan_no: data.treasury_challan_no,
                              chalan_date: data.payment_date,
                              bank_id: data.bank_id,
                              bank_branch_id: data.branch_id,
                              trans_type: data.method
                            },
                          }}
                          target="_blank"
                          className="anchor3"
                        >
                          {data.treasury_challan_no}
                        </Link>
                      </td>
                    ) : (
                      <td className="text-center align-middle">
                        <Link
                          href={{
                            pathname:
                              "http://103.48.16.132/echalan/details.php",
                            query: {
                              challanNo: data.treasury_challan_no,
                            },
                          }}
                          target="_blank"
                          className="anchor3"
                        >
                          {data.treasury_challan_no}
                        </Link>
                      </td>
                    )}

                    <td className="text-center align-middle">{data.bank}</td>
                    <td className="text-center align-middle">{data.branch}</td>
                    <td className="text-center align-middle">
                      {moment(data?.payment_date).format("DD MMM YYYY")}
                    </td>
                    <td className="text-center align-middle">
                      {data.account_code}
                    </td>
                    <td className="text-end align-middle">
                      {data.amount.toFixed(2)}
                    </td>
                    <td className="text-center align-middle">{data.remarks}</td>
                  </tr>
                ))}
                <tr className="table-success">
                  <td className="text-end align-middle" colSpan={6}>
                    <strong>Total</strong>
                  </td>
                  <td className="text-end align-middle">
                    <strong>{sum()}</strong>
                  </td>
                  <td className="text-center align-middle"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};
// export default SubForm58;

SubForm58.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(SubForm58);
