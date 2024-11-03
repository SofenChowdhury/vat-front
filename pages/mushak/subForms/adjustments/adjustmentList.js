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

// Excel
import ExportExcel from "../../../../components/services/ExportExcel";

// Date
import moment from "moment";

const adjustmentList = ({ token, roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [adjustments, setAdjustments] = useState([]);
  const [loader, setLoader] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // FETCHING HS CODES
  useEffect(() => {
    setLoader(true);
    const apiPayments = BASE_URL + "api/v1/vat-adjustment?page=" + page;
    axios
      .get(apiPayments, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setAdjustments(res.data.data.data);
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

  const downloadAdjustments = async () => {
    const apiOrderSearch = BASE_URL + "api/v1/vat-adjustment/download";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .get(apiOrderSearch, config)
      .then((response) => {
        if (response.data.status) {
          let index = 0;
          let temp = {};
          let data = [];
          response.data.data.map((adjustment) => {
            adjustment.challans.map((challan) => {
              index++;
              // const date = moment(sales.created_at).format("DD MMM YYYY");
              // const time = moment(sales.created_at).format("hh:mm A");
              temp = {
                SL: index,
                "Certificate No": adjustment.certificate_no,
                "Certificate Date": adjustment.certificate_date,
                "Deposit Date": adjustment.deposit_date,
                "Ledger Month": moment(adjustment.ledger_month).format("MMMM"),
                "Challan No": challan.challan_no,
                "Challan Date": challan.challan_date,
                Value: challan.value,
                VAT: challan.amount,
                "Vendor/Customer": adjustment.vendor_id
                  ? adjustment.vendor?.name
                  : adjustment.customer?.name,
                Type: adjustment.type,
              };
              data.push(temp);
            });
          });
          const date = new Date();
          const fileName = "AdjustmentList_" + date.toDateString();
          const exportType = "csv";
          ExportExcel(data, fileName, exportType);
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTitle = (adjustment) => {
    if (adjustment.challans[0]?.purchase) {
      return adjustment.challans[0].purchase.vendor?.name;
    }

    if (adjustment.challans[0]?.sales) {
      return adjustment.challans[0].sales.customer?.name;
    }

    if (adjustment.customer) {
      return adjustment.customer?.name;
    }

    if (adjustment.vendor) {
      return adjustment.vendor?.name;
    }

    return "Not found";
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
                TAX Adjustment List
              </Typography>
            </div>
            <div className="col-md-6 mt-1 mb-3">
              <Button
                variant="outlined"
                className="float-end ms-3"
                onClick={downloadAdjustments}
                size="large"
              >
                Download
              </Button>
              {roles[0].id != 5 && (
                <Link
                  href="/mushak/subForms/adjustments/createAdjustment"
                  className="anchor float-end"
                >
                  <Button variant="outlined" size="large">TAX Adjustment</Button>
                </Link>
              )}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead>
                <tr className="table-success">
                  <th>SL</th>
                  <th>Bank</th>
                  <th>Ledger Month</th>
                  <th>Paid By</th>
                  <th>Adjustment Date</th>
                  <th>Vendor/Customer</th>
                  <th>Type</th>
                  <th>Note No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adjustments?.map((payment, index) => (
                  <tr key={index}>
                    <th>{index + 1 + (page - 1) * 20}</th>
                    <td>{payment.bank}</td>
                    <td>{moment(payment.ledger_month).format("MMMM")}</td>
                    <td>{payment.admin?.name}</td>
                    <td>{moment(payment.deposit_date).format("DD MMM YY")}</td>
                    <td>{getTitle(payment)}</td>
                    <td>{payment.type.toUpperCase()}</td>
                    <td>{payment.note_no}</td>
                    <td>
                      <Link
                        href={`/mushak/subForms/adjustments/adjustmentsVat/${payment.id}`}
                        className="anchor3"
                      >
                        <Button variant="contained" color="secondary" size="large">
                          6.6
                        </Button>
                      </Link>
                    </td>
                  </tr>
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

export default connect(mapStateToProps)(adjustmentList);
