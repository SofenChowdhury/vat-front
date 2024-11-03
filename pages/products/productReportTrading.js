import React, { useState, useEffect, useRef } from "react";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// bootstarp
import Multiselect from "multiselect-react-dropdown";
import { tokens } from "../theme";
import {
  Button,
  useTheme,
  Typography,
  Pagination,
  CircularProgress,
} from "@mui/material";

// Date
import { DatePicker } from "antd";
import moment from "moment";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

const productReportTrading = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // POST VARIABLES
  const [productId, setProductId] = useState(null);
  const [productTitle, setProductTitle] = useState(null);

  // HELPER VARIABLES
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [timer, setTimer] = useState(null);
  const [loader, setLoader] = useState(false);

  // REFERENCES
  const multiselectRef = useRef();

  // DATE
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const { RangePicker } = DatePicker;

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  // search products
  const searchProduct = async (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProducts =
          BASE_URL + "api/v1/product-search?type=&keyword=" + e;
        axios
          .get(apiProducts, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status) {
              setProducts(res.data.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
  };

  // Multiselect functions
  const addColumn = (list, item) => {
    setProductTitle(item.title);
    setProductId(item.id);
    setProducts([]);
  };
  const resetSelectField = () => {
    multiselectRef.current.resetSelectedValues();
    setProducts([]);
  };

  // Clear all
  const clearAllProducts = () => {
    setProductTitle(null);
    setProductId(null);
    setStartDate("");
    setEndDate("");
    setStocks(null);
    resetSelectField();
    setPage(1);
    setLastPage(1);
    setTotalData(0);
  };

  //Date Function
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

  // Fetch Stocks
  useEffect(() => {
    // if (start_date != "" && end_date != "") {
      fetchStocks();
    // }
  }, [page, start_date, end_date, productId]);

  const fetchStocks = () => {
    setLoader(true);
    const apiReport = BASE_URL + "api/v1/products/stock-report?page=" + page;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = {
      product_id: productId,
      type:1,
      start_date,
      end_date,
      branch_id: 21
    };

    console.log(data);

    axios.post(apiReport, data, config).then((response) => {
      console.log(response.data);
      if (response.data.status) {
        setStocks(response.data.data.data);
        setLastPage(response.data.data.last_page);
        setTotalData(response.data.data.total);
        setLoader(false);
      } else {
        console.log(response.data);
      }
    });
  };

  // Calculations
  const getClosingQty = (item) => {
    let qty =
      item.branch_opening +
      item.totalStockInProduction +
      item.totalPurchase +
      item.stockReceived +
      item.totalSalesReturn -
      item.stockTransfer -
      item.totalSales -
      item.totalPurchaseReturn;
    return qty;
  };

  // Download CSV
  const downloadExcel = async () => {
    const apiReportDownload =
      BASE_URL + "api/v1/products/stock-report-download";

    const data = {
      product_id: productId,
      type:1,
      start_date,
      end_date,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .post(apiReportDownload, data, config)
      .then((response) => {
        if (response.data.status) {
          const data = response.data.data.map((stock, index) => {
            return {
              SL: index + 1,              
              "HS Code": stock.code,
              Description: stock.description,
              SKU: stock.sku,
              Name: stock.title,
              Opening: stock.branch_opening.toFixed(2),
              StockIn: stock.totalStockInProduction.toFixed(2),
              Purchase: stock.totalPurchase.toFixed(2),
              StockReceived: stock.stockReceived.toFixed(2),
              "Sales Return": stock.totalSalesReturn.toFixed(2),
              Sales: stock.totalSales.toFixed(2),
              StockTransfer: stock.stockTransfer.toFixed(2),
              "Purchase Return": stock.totalPurchaseReturn.toFixed(2),
              Closing: getClosingQty(stock).toFixed(2),
            };
          });
          console.log(data);
          const fileName = "Stock_Summary";
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

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Production Report
          </Typography>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mt-2">
          <Multiselect
            placeholder={
              productTitle ? productTitle : "Search products here..."
            }
            cursor="pointer"
            displayValue="title"
            // onRemove={removeColumn}
            onSelect={addColumn}
            options={products}
            onSearch={(e) => {
              searchProduct(e);
            }}
            ref={multiselectRef}
            hideSelectedList
            emptyRecordMsg="Search for Products with Name/Sku/Model"
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
        <div className="col-md-2 mt-2">
          <RangePicker
            onChange={onChange}
            size="large"
            className="shadow-input"
            style={{ height: "58px" }}
          />
        </div>
        <div className="col-md-3 mt-2">
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={clearAllProducts}
          >
            <CloseIcon style={{ fontSize: "43" }} />
          </Button>
        </div>
        <div className="col-md-4 mt-2">
          <Button
            variant="contained"
            className="float-end"
            color="secondary"
            size="large"
            onClick={downloadExcel}
          >
            <DownloadIcon style={{ fontSize: "43" }} />
          </Button>
        </div>
      </div>

      {loader ? (
        <CircularProgress color="success" className="mt-4" />
      ) : (
        <>
          <div className="row justify-content-md-center mt-5">
            <div className="col-md-auto">
              <b>Stock Valuation</b>
            </div>
          </div>
          <div className="row justify-content-md-center mt-2">
            <div className="col-md-auto">
              <b>
                For the Period of {moment(start_date).format("DD MMM, YYYY")} to{" "}
                {moment(end_date).format("DD MMM, YYYY")}
              </b>
            </div>
          </div>
          <div className="table-responsive mt-3">
            <table className="table table-hover table-striped">
              <thead>
                <tr className="table-success">
                  <th>SL</th>
                  <th>Name of Item</th>
                  <th>SKU</th>
                  <th>Opening</th>
                  <th>Stock In</th>
                  <th>Purchase</th>
                  <th>Stock Received</th>
                  <th>Sales Return</th>
                  <th>Sales</th>
                  <th>Stock Transfer</th>
                  <th>Purchase Return</th>
                  <th>Closing</th>
                </tr>
              </thead>
              <tbody>
                {stocks?.map((stock, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (page - 1) * 20}</td>
                    <td>{stock.title}</td>
                    <td>{stock.sku}</td>
                    <td>{stock.branch_opening.toFixed(2)}</td>
                    <td>{stock.totalStockInProduction.toFixed(2)}</td>
                    <td>{stock.totalPurchase.toFixed(2)}</td>
                    <td>{stock.stockReceived.toFixed(2)}</td>
                    <td>{stock.totalSalesReturn.toFixed(2)}</td>                
                    <td>{stock.totalSales.toFixed(2)}</td>                    
                    <td>{stock.stockTransfer.toFixed(2)}</td>                    
                    <td>{stock.totalPurchaseReturn.toFixed(2)}</td>
                    <td>{getClosingQty(stock).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row justify-content-center mt-2">
            <div className="col-md-12 d-flex justify-content-center">
              <Pagination
                count={lastPage}
                page={page}
                color="secondary"
                size="large"
                onChange={handleChange}
              />
              {page === lastPage ? (
                <span className="ms-3 mt-2">
                  Showing {1 + (page - 1) * 20} - {totalData} out of {totalData}
                </span>
              ) : (
                <>
                  {totalData === 0 ? (
                    <span className="ms-3 mt-2">Showing 0 out of 0</span>
                  ) : (
                    <span className="ms-3 mt-2">
                      Showing {1 + (page - 1) * 20} - {20 + (page - 1) * 20} out
                      of {totalData}
                    </span>
                  )}
                </>
              )}
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

export default connect(mapStateToProps)(productReportTrading);
