import React, { useEffect, useState } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//Time Date
import moment from "moment";

const StockList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [stocks, setStocks] = useState([]);
  const [loader, setLoader] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const handleChange = (e, page) => {
    setPage(page);
  };

  // Fetch Opening Stocks
  useEffect(() => {
    const apiProducts = BASE_URL + "api/v1/stock?page=" + page;

    axios
      .get(apiProducts, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setStocks(res.data.data.data);
          setLastPage(res.data.data.last_page);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  console.log(stocks);

  return (
    <>
      {loader ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <div className="row"></div>
          <div className="row">
            <div className="col-md-6">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Opening Stock List
              </Typography>
            </div>
            <div className="col-md-6 mt-1">
              <Link href="/products/createStock" className="anchor">
                <Button variant="outlined" className="float-end" size="large">
                  Add Stock
                </Button>
              </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr className="table-success">
                  <th>#</th>
                  <th>Stock No</th>
                  <th>Date</th>
                  <th>Company</th>
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>
                      <Link
                        className="anchor3"
                        href={`/products/stockDetails/${stock.id}`}
                      >
                        {stock.open_stock_no}
                      </Link>
                    </td>
                    <td>{moment(stock.created_at).format("DD MMM YY")}</td>
                    <td>{stock.company.name} ({stock.company.company_bin})</td>
                    <td>{stock.branch?.name}</td>
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
  };
};

export default connect(mapStateToProps)(StockList);
