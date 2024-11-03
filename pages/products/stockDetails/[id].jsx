import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import { CircularProgress, Typography, useTheme, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

//date format
import moment from "moment";

// PRINT
import { useReactToPrint } from "react-to-print";

//Icons
import Print from "@mui/icons-material/Print";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const StockDetails = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // HELPER VARIABLES
  const [stockDetails, setStockDetails] = useState({});
  const id = +query.id;
  const [loader, setLoader] = useState(true);

  // REFERENCES
  const printRef = useRef();

  // PRINT
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // FETCH BOM DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/stock/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setStockDetails(res.data.data);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const calculate = () => {
    let total = 0;
    stockDetails?.stock_items.map((item) => {
      total += item.price * item.qty;
    });
    return total.toFixed(2);
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row justify-content-between">
            <div className="col-md-6">
              <Link href="/products/stockList" className="anchor">
                <Button variant="contained" size="large">
                  <ArrowLeftIcon />
                  Opening Stock List
                </Button>
              </Link>
            </div>
            <div className="col-md-6">
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
          <div className="mt-5 p-5" ref={printRef}>
            <div className="row">
              <div className="col-md-3">
                <Typography
                  variant="h3"
                  className="mb-4"
                  color={colors.blueAccent[300]}
                >
                  Fair VAT
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4 text-center">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Stock NO: {stockDetails?.open_stock_no}</b>
                </Typography>
              </div>
              <div className="col-md-4"></div>
            </div>
            <div className="row mt-4 ">
              <div className="col-md-12">
                <b>Company Name -</b> {stockDetails?.company.name} (
                {stockDetails.company.company_bin})
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <b>Branch Name -</b> {stockDetails.branch?.name}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12">
                <b>Date -</b>{" "}
                {moment(stockDetails?.created_at).format("DD MMM YYYY")}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <b>Time -</b>{" "}
                {moment(stockDetails?.created_at).format("hh:mm a")}
              </div>
            </div>

            <div className="mt-5">
              <table
                className="table table-bordered table-hover"
                style={{ border: "black" }}
              >
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stockDetails?.stock_items.map((item, index) => (
                    <tr>
                      <th>{index + 1}</th>
                      <td>{item.info.title}</td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                      <td>{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={4} className="text-end">
                      Total
                    </th>
                    <th>{calculate()}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

StockDetails.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(StockDetails);
