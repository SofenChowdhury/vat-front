import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import {
  CircularProgress,
  Typography,
  useTheme,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// PRINT
import { useReactToPrint } from "react-to-print";

//modals
import Modal from "../../../components/services/Modal";
import EditPurchaseItems from "../../../components/forms/modalForms/EditPurchaseItems";
import AddPurchaseItem from "../../../components/forms/modalForms/AddPurchaseItem";

//date format
import moment from "moment";
import converter from "number-to-words";

// icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Print from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const PurchaseDetails = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //helpers
  const [purchaseDetails, setPurchaseDetails] = useState({});
  const [loader, setLoader] = useState(true);
  const id = +query.id;
  const [isEditable, setIsEditable] = useState(0);
  const [itemId, setItemId] = useState(null);

  //modals variables
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);

  //menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  //references
  const printRef = useRef();

  //formatting
  let formatCurrency = new Intl.NumberFormat();

  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/purchases/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setPurchaseDetails(res.data.data);
          console.log(res.data.data);
        } else {
          // setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Calculations
  const calculate = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += product.tti + +product.total_price;
    });
    return formatCurrency.format(total.toFixed(2));
  };
  const calculateQty = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.qty;
    });
    return total;
  };
  const calculatePrice = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.total_price;
    });
    return formatCurrency.format(total.toFixed(2));
  };
  const calculateCD = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.cd;
    });
    return formatCurrency.format(total.toFixed(2));
  };
  const calculateRD = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.rd;
    });
    return formatCurrency.format(total.toFixed(2));
  };
  const calculateSD = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.sd;
    });
    return formatCurrency.format(total.toFixed(2));
  };
  const calculateAT = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.at;
    });
    return formatCurrency.format(total.toFixed(2));
  };
  const calculateAIT = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.ait;
    });
    return formatCurrency.format(total.toFixed(2));
  };
  const calculateVAT = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.vat_amount;
    });
    return formatCurrency.format(total.toFixed(2));
  };
  const calculateTax = () => {
    let total = 0;
    purchaseDetails?.purchase_items?.map((product) => {
      total += +product.tti;
    });
    return formatCurrency.format(total.toFixed(2));
  };

  //menu functions
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // PRINT
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/purchases/purchaseList",
    });
  };

  // DELETE
  const handleDelete = (purchaseItemId) => {
    const deleteConfirm = window.confirm(
      "Are you sure you want to delete the item?"
    );
    if (deleteConfirm) {
      const apiUrl = BASE_URL + "api/v1/purchases/remove-item";
      const purchaseData = {
        purchase_id: id,
        item_id: purchaseItemId,
      };
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log(purchaseData);
      axios
        .post(apiUrl, purchaseData, config)
        .then((response) => {
          if (response.data.status) {
            console.log(response.data);
            setLoader(true);
            alert("Purchase Item deleted!");
            window.location.reload();
          } else {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <Modal onClose={() => setShowModalEdit(false)} show={showModalEdit}>
            <EditPurchaseItems id={id} itemId={itemId} />
          </Modal>
          <Modal onClose={() => setShowModalAdd(false)} show={showModalAdd} height={750}>
            <AddPurchaseItem id={id} branch_id={purchaseDetails?.branch_id} type={purchaseDetails.type} />
          </Modal>
          <div className="row">
            <div className="col-md-6">
              <Button variant="contained" onClick={goBack} size="large">
                <ArrowLeftIcon />
                Purchase List
              </Button>
            </div>
            <div className="col-md-6">
              <Button
                variant="outlined"
                size="large"
                className="float-end me-3"
                onClick={handlePrint}
              >
                <Print />
                Print
              </Button>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              {isEditable != 0 ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    className="float-end me-3"
                    onClick={() => {
                      setIsEditable(0);
                    }}
                    color="error"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="large"
                    className="float-end me-3"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <MoreHorizIcon />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        setShowModalAdd(true);
                        window.scrollTo({
                          top: 0,
                          behavior: "instant",
                        });
                      }}
                    >
                      Add Item
                    </MenuItem>
                    {/* <MenuItem
                      onClick={() => {
                        handleClose();
                        setIsEditable(1);
                      }}
                    >
                      Edit Item
                    </MenuItem> */}
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        setIsEditable(2);
                      }}
                    >
                      Delete Item
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </div>
          <div ref={printRef} className="p-3">
            <div className="row">
              <div className="col-md-12 text-center">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  {purchaseDetails?.company?.name}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-center">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  {purchaseDetails?.company?.contact_address}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 text-center">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  Contact No. {purchaseDetails?.company?.contact_number}
                </Typography>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 text-center">
                <Typography
                  variant="h3"
                  className="mb-4"
                  color={colors.primary[300]}
                >
                  Purchase Details
                </Typography>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Purchase No.:</b> {purchaseDetails?.purchase_no}
                </Typography>
              </div>
              {purchaseDetails?.type === "Imported" && (
                <>
                  <div className="col-md-6">
                    <Typography
                      variant="h5"
                      className="mb-2"
                      color={colors.primary[300]}
                    >
                      <b>Custom House:</b> {purchaseDetails?.custom_house}
                    </Typography>
                  </div>
                </>
              )}
            </div>

            <div className="row">
              <div className="col-md-6">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Challan Date:</b>{" "}
                  {moment(purchaseDetails?.challan_date).format("DD MMMM YYYY")}
                </Typography>
              </div>
              <div className="col-md-6">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Challan No:</b> {purchaseDetails?.challan_no}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Vendor Name:</b> {purchaseDetails?.vendor?.name}
                </Typography>
              </div>
              <div className="col-md-6">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Vendor Code:</b> {purchaseDetails?.vendor?.vendor_code}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Vendor Bin:</b> {purchaseDetails?.vendor?.vendor_bin}
                </Typography>
              </div>
              <div className="col-md-6">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Vendor Tin</b>: {purchaseDetails?.vendor?.vendor_tin}
                </Typography>
              </div>
              <div className="col-md-6">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Created At:</b>{" "}
                  {moment(purchaseDetails.created_at).format(
                    "DD MMM YYYY - hh:mm A"
                  )}
                </Typography>
              </div>
            </div>

            {/* TABLE */}
            <div className="row mt-5">
              <div className="table-responsive">
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th className="align-middle">#</th>
                      <th className="align-middle">Product Description</th>
                      <th className="align-middle">SKU</th>
                      <th className="align-middle">HS Code</th>
                      <th className="align-middle">Unit Price</th>
                      <th className="align-middle">Quantity</th>
                      <th className="align-middle">Total Price</th>

                      {purchaseDetails?.type === "Imported" ? (
                        <>
                          <th className="align-middle">CD</th>
                          <th className="align-middle">RD</th>
                          <th className="align-middle">SD</th>
                          <th className="align-middle">AT</th>
                          <th className="align-middle">AIT</th>
                        </>
                      ) : (
                        <th className="align-middle">SD</th>
                      )}

                      <th className="align-middle">Vat Rate</th>
                      <th className="align-middle">Vat Amount</th>
                      <th className="align-middle">Total TAX</th>
                      <th className="align-middle">SUB Total</th>
                      {isEditable != 0 && (
                        <th style={{ padding: "4px" }} className="text-center">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseDetails?.purchase_items?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.info?.title}</td>
                        <td>{item?.info?.sku}</td>
                        <td>{item?.info?.hscode?.code_dot}</td>
                        <td className="text-end">
                          {formatCurrency.format((+item.price).toFixed(2))}
                        </td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-end">
                          {formatCurrency.format(
                            (+item.total_price).toFixed(2)
                          )}
                        </td>
                        {purchaseDetails?.type === "Imported" ? (
                          <>
                            <td className="text-end">
                              {formatCurrency.format((+item.cd).toFixed(2))}
                            </td>
                            <td className="text-end">
                              {formatCurrency.format((+item.rd).toFixed(2))}
                            </td>
                            <td className="text-end">
                              {formatCurrency.format((+item.sd).toFixed(2))}
                            </td>
                            <td className="text-end">
                              {formatCurrency.format((+item.at).toFixed(2))}
                            </td>
                            <td className="text-end">
                              {formatCurrency.format((+item.ait).toFixed(2))}
                            </td>
                          </>
                        ) : (
                          <td className="text-end">
                            {formatCurrency.format((+item.sd).toFixed(2))}
                          </td>
                        )}
                        <td>{+item.vat_rate}%</td>
                        <td className="text-end">
                          {formatCurrency.format((+item.vat_amount).toFixed(2))}
                        </td>

                        <td className="text-end">
                          {formatCurrency.format((+item.tti).toFixed(2))}
                        </td>
                        <td className="text-end">
                          {formatCurrency.format(
                            (item.tti + +item.total_price).toFixed(2)
                          )}
                        </td>
                        {isEditable == 1 && (
                          <td
                            style={{ padding: "4px" }}
                            className="text-center"
                          >
                            <Button
                              onClick={() => {
                                setItemId(item.id);
                                setShowModalEdit(true);
                                window.scrollTo({
                                  top: 0,
                                  behavior: "instant",
                                });
                              }}
                              size="large"
                            >
                              <EditIcon />
                            </Button>
                          </td>
                        )}
                        {isEditable == 2 && (
                          <td
                            style={{ padding: "4px" }}
                            className="text-center"
                          >
                            <Button
                              onClick={() => {
                                handleDelete(item.product_id);
                                window.scrollTo({
                                  top: 0,
                                  behavior: "instant",
                                });
                              }}
                              size="large"
                            >
                              <DeleteIcon />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                    <tr>
                      {purchaseDetails?.type === "Imported" ? (
                        <>
                          <td className="text-end" colSpan={6}>
                            <b>Total Amount:</b>
                          </td>
                          <td className="text-end">{calculatePrice()}</td>
                          <td className="text-end">{calculateCD()}</td>
                          <td className="text-end">{calculateRD()}</td>
                          <td className="text-end">{calculateSD()}</td>
                          <td className="text-end">{calculateAT()}</td>
                          <td className="text-end">{calculateAIT()}</td>
                        </>
                      ) : (
                        <>
                          <td className="text-end" colSpan={6}>
                            <b>Total Amount:</b>
                          </td>
                          <td className="text-end">{calculatePrice()}</td>
                          <td className="text-end">{calculateSD()}</td>
                        </>
                      )}
                      <td></td>
                      <td className="text-end">{calculateVAT()}</td>
                      <td className="text-end">{calculateTax()}</td>
                      <td className="text-end">{calculate()}</td>
                      {isEditable != 0 && <td></td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOOTER */}
            <div className="row mt-5">
              <div className="col-sm-12 capital">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Quantity in Words:</b> {converter.toWords(calculateQty())}{" "}
                  Piece's Only
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 capital">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Amount in Words:</b> Taka {converter.toWords(calculate())}{" "}
                  Only
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 capital">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Created By: </b>
                  {purchaseDetails.user.name}
                </Typography>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

PurchaseDetails.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(PurchaseDetails);
