import React, { useEffect, useState } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  CircularProgress,
  TextField,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";
import moment from "moment/moment";

const ProductionReport = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper Variables
  const [sku, setSku] = useState("");
  const [goods_no, setGoodsNo] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [goods, setProducts] = useState([]);
  const [loader, setLoader] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Date
  const { RangePicker } = DatePicker;

  // Fetch Good List
  useEffect(() => {
    const apiProducts = BASE_URL + "api/v1/goods/date-wise-report";

    const apiData = {
        sku,
        goods_no,
        start_date,
        end_date
    }

    axios
      .post(apiProducts, apiData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          setLoader(false);
          setProducts(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sku, start_date, end_date, goods_no]);

  // Date Change
  function onChange(date, dateString) {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  }

  // Total Calculations
  const getTotalQty = () => {
    let total = 0;
    goods?.map((good) => {
      total += good.qty;
    });
    return total;
  };

  const getTotalPrice = () => {
    let total = 0;
    goods?.map((good) => {
      total += good.price;
    });
    return total.toFixed(2);
  };

  console.log(goods);

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
                size="large"
              >
                Production Report
              </Typography>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 mt-3">
              <TextField
                label="SKU"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => setSku(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-3 mt-3">
              <TextField
                label="Goods No."
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => setGoodsNo(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-3 mt-3">
              <RangePicker
                onChange={onChange}
                size="large"
                style={{ width: "100%", height: "58px" }}
                className="shadow-input"
              />
            </div>
          </div>
          <div className="table-responsive mt-4">
            <table className="table table-hover table-bordered">
              <thead>
                <tr className="table-success">
                  <th scope="col">#</th>
                  <th scope="col">Goods No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Date</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Company</th>
                  <th scope="col">Branch</th>
                </tr>
              </thead>
              <tbody>
                {goods.map((good, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Link
                        href={`/products/goodDetails/${good.id}`}
                        className="anchor3"
                      >
                        {good.goods_no}
                      </Link>
                    </td>
                    <td>{good.item?.title}</td>
                    <td>{good.item?.sku}</td>
                    <td>{moment(good.created_at).format("DD MMM YY")}</td>
                    <td className="text-center">{good.qty}</td>
                    <td className="text-end">{good.price.toFixed(2)}</td>
                    <td>{good.company?.name}</td>
                    <td>{good.branch?.name}</td>
                  </tr>
                ))}
                <tr>
                  <th colSpan={5} className="text-end">
                    Total
                  </th>
                  <td className="text-center">{getTotalQty()}</td>
                  <td className="text-end">{getTotalPrice()}</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
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

export default connect(mapStateToProps)(ProductionReport);
