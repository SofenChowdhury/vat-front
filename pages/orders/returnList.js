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

// Excel
import ExportExcel from "../../components/services/ExportExcel";

//date
import moment from "moment";

const ReturnListOrder = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [returns, setReturns] = useState([]);
  const [loader, setLoader] = useState(true);

  //Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const apiReturns = BASE_URL + "api/v1/sales/return?page=" + page;

    axios
      .get(apiReturns, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setLoader(false);
          setReturns(res.data.data.data);
          setLastPage(res.data.data.last_page);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  const handleChange = (e, page) => {
    setPage(page);
  };

  // GETTERS
  const getPrice = (item, id) => {
    let salesPrice = 0;
    item.sales_items.map((item) => {
      if (item.product_id == id) {
        salesPrice = item.total_price;
      }
    });
    return salesPrice;
  };
  const getQty = (item, id) => {
    let salesQty = 0;
    item.sales_items.map((item) => {
      if (item.product_id == id) {
        salesQty = item.qty;
      }
    });
    return salesQty;
  };
  const getVat = (item, id) => {
    let salesVat = 0;
    item.sales_items.map((item) => {
      if (item.product_id == id) {
        salesVat = item.vat_amount;
      }
    });
    return salesVat;
  };

  const downloadOrders = async () => {
    const apiReturns = BASE_URL + "api/v1/sales/credit-note-download";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .get(apiReturns, config)
      .then((response) => {
        if (response.data.status) {
          let index = 0;
          let temp = {};
          let data = [];
          response.data.data.map((sales) => {
            sales.return_items.map((item) => {
              index++;
              const date = moment(sales.created_at).format("DD-MMM-YYYY");
              const time = moment(sales.created_at).format("hh:mm A");
              temp = {
                SL: index,
                "Return No": sales.return_no,
                "Challan No": sales.sales
                  ? sales.sales.sales_no
                  : sales.challan_no,
                "Challan Date": sales.sales
                  ? moment(sales.sales.challan_date).format("DD-MMM-YYYY")
                  : moment(sales.challan_date).format("DD-MMM-YYYY"),
                "Issue Date": date,
                "Product Title": item.info?.title,
                "Product SKU": item.info?.sku,
                "Challan Value": sales.sales
                  ? getPrice(sales.sales, item.product_id)
                  : item.challan_item_value,
                "Challan Qty": sales.sales
                  ? getQty(sales.sales, item.product_id)
                  : item.challan_item_qty,
                "Challan VAT": sales.sales
                  ? getVat(sales.sales, item.product_id)
                  : item.challan_item_vat,
                "Return Value": item.total_price,
                "Return Qty": item.qty,
                "Return VAT": item.vat_amount,
                "VAT Rate": item.vat_rate,
                "Return Reason": sales.return_reason,
              };
              data.push(temp);
            });
          });
          const date = new Date();
          const fileName = "SalesReturnList_" + date.toDateString();
          const exportType = "csv";
          console.log(data[0]);
          ExportExcel(data, fileName, exportType);
        } else {
          // setFormErrors(Object.values(response.data.errors));
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                Sales Returns List
              </Typography>
            </div>
            <div className="col-md-6">
              <Button
                className="float-end"
                variant="outlined"
                onClick={downloadOrders}
                size="large"
              >
                Download
              </Button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr className="table-success">
                  <th>#</th>
                  <th>Return No</th>
                  <th>Sales No</th>
                  <th>Challan No</th>
                  <th>Challan Date</th>
                  <th>Issue Date</th>
                  <th>Issued By</th>
                  <th>Customer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((item, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{item.return_no}</td>
                    <td>
                      <Link
                        href={`/orders/orderDetails/${item.sales?.id}`}
                        className="anchor3"
                      >
                        {item.sales?.sales_no}
                      </Link>
                    </td>
                    {item.sales ? (
                      <>
                        <td>{item.purchase?.challan_no}</td>
                        <td>
                          {moment(item.purchase?.challan_date).format(
                            "DD MMM YYYY"
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.challan_no}</td>
                        <td>
                          {moment(item.challan_date).format("DD MMM YYYY")}
                        </td>
                      </>
                    )}
                    <td>{moment(item.created_at).format("DD MMM YYYY")}</td>
                    <td>{item.user?.name}</td>
                    {item.customer == null ? (
                      <td>{item.sales?.customer.name}</td>
                    ) : (
                      <td>{item.customer?.name}</td>
                    )}
                    <td>
                      <Link
                        href={`/orders/returnVat/${item.id}`}
                        className="anchor3"
                      >
                        <Button variant="contained" color="secondary" size="large">
                          6.7
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
  };
};

export default connect(mapStateToProps)(ReturnListOrder);
