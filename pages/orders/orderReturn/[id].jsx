import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import Form from "react-bootstrap/Form";
import { tokens } from "../../theme";
import {
  CircularProgress,
  Typography,
  useTheme,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const OrderReturn = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [orderDetails, setOrderDetails] = useState({});
  const [reason, setReason] = useState("");

  const [loader, setLoader] = useState(true);
  const [name, setName] = useState("");
  const sales_id = +query.id;

  // FETCH ORDER DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/sales/" + sales_id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          res.data.data.sales_items.map((item) => {
            item.checked = false;
            item.return_qty = item.qty;
          });
          setName(res.data.data.sales_no);
          setOrderDetails(res.data.data.sales_items);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Update dynamic fields
  const updateChecked = (e, id) => {
    const newState = orderDetails?.map((product) => {
      if (product.id == id) {
        return { ...product, checked: e };
      }
      return product;
    });
    setOrderDetails(newState);
  };
  const updateQty = (e, id) => {
    if (e == 0) {
      const newState = orderDetails?.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            return_qty: 1,
            vat_amount: ((1 * product.price) / 100) * +product.vat_rate,
          };
        }
        return product;
      });
      setOrderDetails(newState);
    } else {
      const newState = orderDetails?.map((product) => {
        if (product.id === id) {
          if(e > product.qty) {
            return {
              ...product,
              return_qty: product.qty,
              vat_amount: ((product.qty * product.price) / 100) * +product.vat_rate,
            };
          } else {
            return {
              ...product,
              return_qty: +e,
              vat_amount: ((+e * product.price) / 100) * +product.vat_rate,
            };
          }
          
        }
        return product;
      });
      setOrderDetails(newState);
    }
    
  };

  // Calculation
  const calculate = () => {
    let total = 0;
    orderDetails?.map((product) => {
      total += product.price * product.qty + +product.vat_amount;
    });
    return total.toFixed(2);
  };
  const calculateCredit = () => {
    let total = 0;
    orderDetails?.map((product) => {
      if (product.checked) {
        total += product.price * product.qty + +product.vat_amount;
      }
    });
    return total.toFixed(2);
  };

  const submit = () => {
    const items = [];

    orderDetails?.map((item, index) => {
      if (item.checked) {
        items.push(item);
      }
    });
    const returnedItems = items.map(({ product_id, price, return_qty, vat_rate }) => {
      return {
        id: product_id,
        price: price,
        qty: return_qty,
        vat_rate: +vat_rate,
        sd: 0,
      };
    });
    // const sd = 0;
    const returnData = {
      sales_id,
      returnedItems,
      reason,
    };
    const apiReturn = BASE_URL + "api/v1/sales/return";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(returnData);
    axios
      .post(apiReturn, returnData, config)
      .then((response) => {
        if (response.data.status) {
          alert("Sales Product Returned!");
          console.log(response.data);
          Router.push({
            pathname: "/orders/returnList",
          });
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
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <Typography
            variant="h3"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Sales Return
          </Typography>

          <div className="row mt-5">
            <Typography
              variant="h4"
              className="mb-4"
              color={colors.greenAccent[300]}
            >
              Sales No. {name}
            </Typography>
          </div>
          <div className="row">
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Returned?</th>
                    <th scope="col">#</th>
                    <th scope="col">Product Description</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Unit Price</th>
                    <th scope="col">VAT RATE</th>
                    <th scope="col">VAT</th>
                    <th scope="col">Total (Including Vat)</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails?.map((item, index) => (
                    <>
                      <tr>
                        <td className="pt-0 pb-0 ps-3">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={item.checked}
                                onChange={(e) => {
                                  updateChecked(e.target.checked, item.id);
                                }}
                              />
                            }
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{item?.item_info?.title}</td>
                        {item.checked ? (
                          <>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={item.return_qty}
                                onChange={(e) => {
                                  updateQty(e.target.value, item.id);
                                }}
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{item.qty}</td>
                          </>
                        )}
                        <td>{+item.price}</td>
                        <td>{+item.vat_rate}%</td>
                        <td>{+item.vat_amount.toFixed(2)}</td>
                        <td className="text-end">
                          {(item.price * item.qty + +item.vat_amount).toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <th colSpan={7} className="text-end">
                      Total Amount
                    </th>

                    <td className="text-end">{calculate()}</td>
                  </tr>
                  <tr>
                    <th colSpan={7} className="text-end">
                      Credit Amount
                    </th>

                    <td className="text-end">{calculateCredit()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <Typography variant="h5" color={colors.greenAccent[200]}>
                Reason of Return
              </Typography>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <textarea
                rows="4"
                className="form-control"
                placeholder="Type Here . . ."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <Button
                variant="contained"
                color="success"
                className="float-end"
                onClick={submit}
                size="large"
              >
                Return
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

OrderReturn.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(OrderReturn);
