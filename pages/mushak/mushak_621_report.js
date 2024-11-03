//react
import React, { useState, useEffect, useRef } from "react";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//date
import { DatePicker } from "antd";
import moment from "moment";

const MushakReport = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Post Variables
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [product_id, setProductId] = useState("");

  // Helper Variables
  const [products, setProducts] = useState([]);
  const [type, setType] = useState("year");
  const [showEmpty, setShowEmpty] = useState(false);
  const [loader, setLoader] = useState(false);
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [timer, setTimer] = useState(null);

  const [title, setTitle] = useState("");

  // Date Variables
  const { RangePicker } = DatePicker;

  // Reference Variables
  const multiselectRefGoods = useRef();

  // Date function
  const onChangeYear = (date, dateString) => {
    if (date) {
      setStartDate(`${dateString}-01-01`);
      setEndDate(`${dateString}-12-31`);
    }
  };
  const onChangeMonth = (date, dateString) => {
    const firstDayOfMonth = moment(date).startOf("month");
    const lastDayOfMonth = moment(date).endOf("month");

    setStartDate(firstDayOfMonth.format("YYYY-MM-DD"));
    setEndDate(lastDayOfMonth.format("YYYY-MM-DD"));
  };
  const onChangeDate = (date, dateString) => {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  };

  const searchFinishedGoods = async (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setFinishedGoods([]);
      } else {
        setFinishedGoods([]);
        const apiProduct =
          BASE_URL + "api/v1/product-search?type=1&keyword=" + e;
        axios
          .get(apiProduct, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.status == true) {
              if (res.data.data != null) {
                setFinishedGoods(res.data.data);
              } else {
                setFinishedGoods([]);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
  };

  const generateProducts = () => {};

  const clearSearch = () => {
    setStartDate("");
    setEndDate("");
    setType("year");
    resetSelectFieldGoods();
    setProductId("");
  };

  // Multiselect Functions 2
  const addProduct = (list, item) => {
    setProductId(item.id);
    setTitle(item.title);
    setFinishedGoods([]);
  };
  const resetSelectFieldGoods = () => {
    multiselectRefGoods.current.resetSelectedValues();
    setFinishedGoods([]);
    setTitle("");
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Report (Mushak 6.2.1 Summary)
          </Typography>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mt-4">
          <TextField
            label="Type"
            variant="outlined"
            select
            size="large"
            type="text"
            fullWidth
            value={type || ""}
            className="shadow-input"
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <MenuItem value={"year"}>Year</MenuItem>
            <MenuItem value={"month"}>Month</MenuItem>
            <MenuItem value={"date"}>Date Range</MenuItem>
          </TextField>
        </div>
        <div className="col-md-3 mt-4">
          {type == "year" && (
            <DatePicker
              picker="year"
              onChange={onChangeYear}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
              defaultValue={""}
            />
          )}
          {type == "month" && (
            <DatePicker
              picker="month"
              onChange={onChangeMonth}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
            />
          )}
          {type == "date" && (
            <RangePicker
              onChange={onChangeDate}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
            />
          )}
        </div>
        <div className="col-md-3 mt-4">
          <Multiselect
            placeholder={title ? title : "Search Products Here. ."}
            cursor="pointer"
            displayValue="title"
            // onRemove={removeColumn}
            onSelect={addProduct}
            options={finishedGoods}
            onSearch={(e) => {
              searchFinishedGoods(e);
            }}
            ref={multiselectRefGoods}
            hideSelectedList
            emptyRecordMsg="Search By Product Name/Sku/Model/HS Code"
            className="shadow-input"
            style={{
              multiselectContainer: {
                height: "58px",
              },
              searchBox: {
                minHeight: "58px",
              },
              inputField: {
                margin: "10px",
                width: "90%",
              },
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mt-4">
          <Button
            variant="contained"
            color="error"
            onClick={clearSearch}
            size="large"
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={generateProducts}
            className="ms-2"
            size="large"
          >
            Search
          </Button>
        </div>
      </div>

      {loader ? (
        <CircularProgress className="mt-5" />
      ) : (
        <>
          {showEmpty && products.length == 0 && (
            <div className="row">
              <div className="col-md-12 mt-5">
                <Typography variant="h4" className="mb-4" color="red">
                  No Report Found!
                </Typography>
              </div>
            </div>
          )}

          {products.length > 0 && (
            <>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <Button variant="contained" color="secondary" size="large">
                    Generate Report
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <table className="table table-bordered mt-5">
        <thead>
          <tr className="table-success">
            <th rowSpan={3} className="align-middle text-center">SKU</th>
            <th rowSpan={3} className="align-middle text-center">Product Title</th>
            <th colSpan={2} className="align-middle text-center">Opening Stock</th>
            <th colSpan={6} className="align-middle text-center">Stock In</th>
            <th colSpan={6} className="align-middle text-center">Stock Out</th>
            <th colSpan={2} className="align-middle text-center">Closing Stock</th>
          </tr>
          <tr className="table-success">
            <th rowSpan={2} className="align-middle text-center">Qty</th>
            <th rowSpan={2} className="align-middle text-center">Value</th>
            <th colSpan={3} className="align-middle text-center">Purchase</th>
            <th colSpan={3} className="align-middle text-center">Sales Return</th>
            <th colSpan={3} className="align-middle text-center">Purchase</th>
            <th colSpan={3} className="align-middle text-center">Sales Return</th>
            <th rowSpan={2} className="align-middle text-center">Qty</th>
            <th rowSpan={2} className="align-middle text-center">Value</th>
          </tr>
          <tr className="table-success">
            <th className="align-middle text-center">Qty</th>
            <th className="align-middle text-center">Value</th>
            <th className="align-middle text-center">Vat</th>
            <th className="align-middle text-center">Qty</th>
            <th className="align-middle text-center">Value</th>
            <th className="align-middle text-center">Vat</th>
            <th className="align-middle text-center">Qty</th>
            <th className="align-middle text-center">Value</th>
            <th className="align-middle text-center">Vat</th>
            <th className="align-middle text-center">Qty</th>
            <th className="align-middle text-center">Value</th>
            <th className="align-middle text-center">Vat</th>
          </tr>
        </thead>
      </table>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(MushakReport);
