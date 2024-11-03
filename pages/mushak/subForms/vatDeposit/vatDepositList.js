import React, { useEffect, useState } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../../theme";
import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../../base";

// Date
import { DatePicker } from "antd";

const vatDepositList = ({ token, roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [payments, setPayments] = useState([]);
  const [loader, setLoader] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // FETCHING HS CODES
  useEffect(() => {
    setLoader(true);
    const apiPayments = BASE_URL + "api/v1/vat-payments?page=" + page;
    axios
      .get(apiPayments, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setPayments(res.data.data.data);
          setLastPage(res.data.data.last_page);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  return (
    <>
      {loader ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                TAX Deposit List
              </Typography>
            </div>
            <div className="col-md-6 mt-1 mb-3">
              {roles[0].id != 5 && (
                <Link
                  href="/mushak/subForms/vatDeposit/createVatDeposit"
                  className="anchor float-end"
                >
                  <Button variant="outlined" size="large">Deposit TAX</Button>
                </Link>
              )}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead>
                <tr className="table-success">
                  <th>Challan No</th>
                  <th>Bank</th>
                  <th>Ledger Month</th>
                  <th>Paid By</th>
                  <th>Payment Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment, index) => (
                  <>
                    <tr key={index}>
                      <td>{payment.treasury_challan_no}</td>
                      <td>{payment.bank}</td>
                      <td>{payment.ledger_month}</td>
                      <td>{payment.admin?.name}</td>
                      <td>{payment.payment_date}</td>
                      <td>{payment.type}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 d-flex justify-content-center">
              <Pagination
                count={lastPage}
                page={page}
                color="secondary"
                size="large"
                onChange={handleChange}
              />
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
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(vatDepositList);
