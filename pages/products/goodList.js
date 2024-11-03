import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";

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
  TextField,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Date
import { DatePicker } from "antd";
import moment from "moment/moment";

// Icons
import { Delete } from "@mui/icons-material";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

const GoodList = ({ token }) => {
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
    const apiProducts =
      BASE_URL +
      "api/v1/goods?page=" +
      page +
      "&sku=" +
      sku +
      "&goods_no=" +
      goods_no +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;

    axios
      .get(apiProducts, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setLoader(false);
          setProducts(res.data.data.data);
          setLastPage(res.data.data.last_page);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, sku, start_date, end_date, goods_no]);

  // Date Change
  function onChange(date, dateString) {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  }

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  // DELETING VENDOR
  const onDelete = (e, id, name) => {
    const deleteConfirm = window.confirm(
      "Are you sure you want to delete the item?"
    );
    if (deleteConfirm) {
      setLoader(true);
      const goodData = { id };
      const apiGoods = BASE_URL + "api/v1/goods/delete";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log(goodData);
      axios.post(apiGoods, goodData, config).then((response) => {
        console.log(response.data);
        if (response.data.status) {
          alert(`Deleted Good ${name}`);
          Router.reload(window.location.pathname);
        } else {
          console.log(response.data);
        }
      });
    }
  };

  // Download CSV
  const downloadExcel = async () => {
    const apiProducts =
      BASE_URL +
      "api/v1/goods-download?sku=" +
      sku +
      "&goods_no=" +
      goods_no +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .get(apiProducts, config)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.status) {
          const data = response.data.data.map((good, index) => {
            return {
              SL: index + 1,
              "Goods No.": good.goods_no,
              Name: good.item?.title,
              SKU: good.item?.sku,
              Date: moment(good.created_at).format("DD MMM YY"),
              Quantity: good.qty,
              Price: good.price,
              Company: good.company?.name,
              Branch: good.branch?.name,
            };
          });

          console.log(data);
          const fileName = "Received_Good_List";
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
              >
                Received Finished Goods
              </Typography>
            </div>
            <div className="col-md-6 mt-1">
              <Link href="/products/receiveGood" className="anchor">
                <Button variant="outlined" className="float-end" size="large">
                  Receive New Product
                </Button>
              </Link>
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
            <div className="col-md-3 mt-3">
              <Button
                variant="contained"
                className="float-end"
                size="large"
                onClick={downloadExcel}
              >
                Download
              </Button>
            </div>
          </div>
          <div className="table-responsive mt-4">
            <table className="table table-hover">
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
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {goods.map((good, index) => (
                  <tr key={index}>
                    <th>{index + 1 + (page - 1) * 20}</th>
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
                    <td>{good.qty}</td>
                    <td>{good.price}</td>
                    <td>{good.company?.name}</td>
                    <td>{good.branch?.name}</td>
                    <td>
                      <Delete
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          onDelete(e, good.id, good.item?.title);
                        }}
                      />
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
  };
};

export default connect(mapStateToProps)(GoodList);
