import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
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

const PurchaseReturn = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [purchaseDetails, setPurchaseDetails] = useState({});
  const [reason, setReason] = useState("");

  const [loader, setLoader] = useState(true);
  const [type, setType] = useState(false);
  const [name, setName] = useState("");
  const purchase_id = +query.id;

  // FETCH PURCHASE DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/purchases/" + purchase_id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          res.data.data.purchase_items.map((item) => {
            item.checked = false;
          });
          if (res.data.data.type == "Import") {
            setType(true);
          }
          setName(res.data.data.purchase_no);

          setPurchaseDetails(res.data.data.purchase_items);
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
    const newState = purchaseDetails?.map((product) => {
      if (product.id == id) {
        return { ...product, checked: e };
      }
      return product;
    });
    setPurchaseDetails(newState);
  };
  const updateQty = (e, id) => {
    const newState = purchaseDetails?.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          qty: +e,
          vat_amount: ((+e * product.price) / 100) * +product.vat_rate,
        };
      }
      return product;
    });
    setPurchaseDetails(newState);
  };
  const updatePrice = (e, id) => {
    const newState = purchaseDetails?.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          price: +e,
          vat_amount: ((+e * product.qty) / 100) * +product.vat_rate,
        };
      }
      return product;
    });
    setPurchaseDetails(newState);
  };
  // const updateVatRate = (e, id) => {
  //   const newState = purchaseDetails?.map((product) => {
  //     if (product.id === id) {
  //       return {
  //         ...product,
  //         vat_rate: +e,
  //         vat_amount: ((product.price * product.qty) / 100) * +e,
  //       };
  //     }
  //     return product;
  //   });
  //   setPurchaseDetails(newState);
  // };
  const updateAV = (e, id) => {
    const newState = purchaseDetails?.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          av_amount: +e,
        };
      }
      return product;
    });
    setPurchaseDetails(newState);
  };
  const updateSD = (e, id) => {
    const newState = purchaseDetails?.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          sd_amount: +e,
        };
      }
      return product;
    });
    setPurchaseDetails(newState);
  };
  const updateCD = (e, id) => {
    const newState = purchaseDetails?.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          cd_amount: +e,
        };
      }
      return product;
    });
    setPurchaseDetails(newState);
  };
  const updateRD = (e, id) => {
    const newState = purchaseDetails?.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          rd_amount: +e,
        };
      }
      return product;
    });
    setPurchaseDetails(newState);
  };

  // Calculation
  const calculate = () => {
    let total = 0;
    purchaseDetails?.map((product) => {
      if (type) {
        total +=
          product.price * product.qty +
          +product.vat_amount +
          +product.av_amount +
          +product.cd_amount +
          +product.rd_amount +
          +product.sd_amount;
      } else {
        total += product.price * product.qty + +product.vat_amount;
      }
    });
    return total.toFixed(2);
  };
  const calculateCredit = () => {
    let total = 0;
    purchaseDetails?.map((product) => {
      if (product.checked) {
        if (type) {
          total +=
            product.price * product.qty +
            +product.vat_amount +
            +product.av_amount +
            +product.cd_amount +
            +product.rd_amount +
            +product.sd_amount;
        } else {
          total += product.price * product.qty + +product.vat_amount;
        }
      }
    });
    return total.toFixed(2);
  };

  const submit = () => {
    const items = [];

    purchaseDetails?.map((item, index) => {
      if (item.checked) {
        items.push(item);
      }
    });
    const returnedItems = items.map(
      ({
        product_id,
        av_amount,
        sd_amount,
        cd_amount,
        rd_amount,
        price,
        qty,
        vat_rate,
      }) => {
        return {
          id: product_id,
          av: +av_amount,
          sd: +sd_amount,
          cd: +cd_amount,
          rd: +rd_amount,
          price: price,
          qty: qty,
          vat_rate: +vat_rate,
        };
      }
    );
    const returnData = {
      purchase_id,
      return_reason: reason,
      returnedItems,
    };
    const apiReturn = BASE_URL + "api/v1/purchases/return";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(returnData);
    axios
      .post(apiReturn, returnData, config)
      .then((response) => {
        if (response.data.status) {
          alert("Product Returned!");
          console.log(response.data);
          Router.push({
            pathname: "/purchases/returnList",
          });
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(reason);

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
            Purchase Return
          </Typography>

          <div className="row mt-5">
            <Typography
              variant="h4"
              className="mb-4"
              color={colors.greenAccent[300]}
            >
              Purchase No. {name}
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
                    {type && (
                      <>
                        <th>AV</th>
                        <th>CD</th>
                        <th>RD</th>
                        <th>SD</th>
                      </>
                    )}
                    <th scope="col">Total (Including Vat)</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseDetails?.map((item, index) => (
                    <tr key={index}>
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
                      <td>{item?.info?.title}</td>
                      {item.checked ? (
                        <>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={item.qty}
                              onChange={(e) => {
                                updateQty(e.target.value, item.id);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={item.price}
                              onChange={(e) => {
                                updatePrice(e.target.value, item.id);
                              }}
                            />
                          </td>
                          <td>{+item.vat_rate}%</td>
                          <td>{+item.vat_amount}</td>

                          {type && (
                            <>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.av_amount}
                                  onChange={(e) => {
                                    updateAV(e.target.value, item.id);
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.cd_amount}
                                  onChange={(e) => {
                                    updateCD(e.target.value, item.id);
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.rd_amount}
                                  onChange={(e) => {
                                    updateRD(e.target.value, item.id);
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.sd_amount}
                                  onChange={(e) => {
                                    updateSD(e.target.value, item.id);
                                  }}
                                />
                              </td>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <td>{item.qty}</td>
                          <td>{+item.price}</td>
                          <td>{+item.vat_rate}%</td>
                          <td>{+item.vat_amount}</td>
                          {type && (
                            <>
                              <td>{+item.av_amount}</td>
                              <td>{+item.cd_amount}</td>
                              <td>{+item.rd_amount}</td>
                              <td>{+item.sd_amount}</td>
                            </>
                          )}
                        </>
                      )}

                      {type ? (
                        <td className="text-end">
                          {(
                            item.price * item.qty +
                            +item.vat_amount +
                            +item.av_amount +
                            +item.cd_amount +
                            +item.rd_amount +
                            +item.sd_amount
                          ).toFixed(2)}
                        </td>
                      ) : (
                        <>
                          <td className="text-end">
                            {(item.price * item.qty + +item.vat_amount).toFixed(
                              2
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  <tr>
                    {type ? (
                      <th colSpan={11} className="text-end">
                        Total Amount
                      </th>
                    ) : (
                      <th colSpan={7} className="text-end">
                        Total Amount
                      </th>
                    )}

                    <td className="text-end">{calculate()}</td>
                  </tr>
                  <tr>
                    {type ? (
                      <th colSpan={11} className="text-end">
                        Credit Amount
                      </th>
                    ) : (
                      <th colSpan={7} className="text-end">
                        Credit Amount
                      </th>
                    )}

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

PurchaseReturn.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(PurchaseReturn);
