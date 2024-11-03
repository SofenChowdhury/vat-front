import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

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

//date format
import moment from "moment";
import converter from "number-to-words";

// PDF
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

//modal
import Modal from "../../../components/services/Modal";
import EditSalesItem from "../../../components/forms/modalForms/EditSalesItem";
import AddSalesItem from "../../../components/forms/modalForms/AddSalesItem";

//Icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Download from "@mui/icons-material/Download";
import Print from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const OrderDetails = ({ query, token }) => {
  //theme variables
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //helper variables
  const [orderDetails, setOrderDetails] = useState({});
  const [loader, setLoader] = useState(true);
  const id = +query.id;
  const [isEditable, setIsEditable] = useState(0);
  const [itemId, setItemId] = useState(null);

  //router
  const router = useRouter();

  //references
  const printRef = useRef();

  //modals variables
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);

  //menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  //menu functions
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //fetch sale details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/sales/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setOrderDetails(res.data.data);
          console.log(res.data.data);
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const calculate = () => {
    let total = 0;
    orderDetails?.sales_items?.map((product) => {
      total += product.total_price + product.vat_amount;
    });
    return total.toFixed(2);
  };
  const calculateVat = (vat) => {
    let total = 0;
    orderDetails?.sales_items?.map((product) => {
      total += ((product.price * product.qty) / 100) * +product.vat_rate;
    });
    return total.toFixed(2);
  };
  const calculateTotal = () => {
    let total = 0;
    orderDetails?.sales_items?.map((product) => {
      total +=
        ((product.price * product.qty) / 100) * +product.vat_rate +
        product.price * product.qty;
    });
    return total.toFixed(2);
  };
  const calculateQty = () => {
    let total = 0;
    orderDetails?.sales_items?.map((product) => {
      total += product.qty;
    });
    return total;
  };

  // PRINT
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // DOWNLOAD
  const downloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    const name = orderDetails?.sales_no + "_invoice.pdf";

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(name);
  };

  // RETURN
  const goBack = () => {
    router.back();
  };

  // DELETE
  const handleDelete = (salesId) => {
    const deleteConfirm = window.confirm(
      "Are you sure you want to delete the item?"
    );
    if (deleteConfirm) {
      const apiUrl = BASE_URL + "api/v1/sales/remove-items";
      const saleData = {
        sales_id: id,
        item_id: salesId,
      };
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log(saleData);
      axios
        .post(apiUrl, saleData, config)
        .then((response) => {
          if (response.data.status) {
            console.log(response.data);
            setLoader(true);
            alert("Sales Item deleted!");
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
            <EditSalesItem id={id} itemId={itemId} />
          </Modal>
          <Modal onClose={() => setShowModalAdd(false)} show={showModalAdd}>
            <AddSalesItem id={id} branch_id={orderDetails?.branch_id} />
          </Modal>
          <div className="row justify-content-between">
            <div className="col-md-6">
              <Button variant="outlined" size="large" onClick={goBack}>
                <ArrowLeftIcon />
                Sales List
              </Button>
            </div>
            <div className="col-md-6">
              <Button
                variant="outlined"
                size="large"
                className="float-end"
                onClick={downloadPdf}
              >
                <Download />
                Download
              </Button>
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
                    className="float-end me-5"
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
                    className="float-end me-5"
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
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        setIsEditable(1);
                      }}
                    >
                      Edit Item
                    </MenuItem>
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
          <br />
          <div ref={printRef} className="p-5">
            <div className="row mb-4">
              <div className="col-md-12">
                <img
                  alt="hyundai-logo"
                  width="200px"
                  height="50px"
                  src={`../../assets/images/hyundai_logo.png`}
                  style={{ cursor: "pointer" }}
                  className="mt-2"
                />
                <img
                  alt="ftl-logo"
                  width="230px"
                  height="50px"
                  src={`../../assets/images/ftl_logo.png`}
                  style={{ cursor: "pointer" }}
                  className="float-end mt-2"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4 text-center">
                <Typography
                  variant="h6"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>{orderDetails?.company?.name}</b>
                </Typography>
              </div>
              <div className="col-md-4"></div>
            </div>
            <div className="row">
              <div className="col-md-2"></div>
              <div className="col-md-8 text-center">
                <Typography
                  variant="h6"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>{orderDetails?.company?.contact_address}</b>
                </Typography>
              </div>
              <div className="col-md-4"></div>
            </div>
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4 text-center">
                <Typography
                  variant="h6"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Contact No. {orderDetails?.company?.contact_number}</b>
                </Typography>
              </div>
              <div className="col-md-4"></div>
            </div>
            <div className="row mt-3">
              <div className="col-md-4"></div>
              <div className="col-md-4 text-center">
                <Typography
                  variant="h4"
                  className="mb-4"
                  color={colors.primary[300]}
                >
                  Sales Invoice
                </Typography>
              </div>
              <div className="col-md-4"></div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                <Typography variant="h6" color={colors.primary[300]}>
                  <b>Invoice No:</b> {orderDetails?.sales_no}
                </Typography>
              </div>

              <div className="col-md-4">
                <Typography variant="h6" color={colors.primary[300]}>
                  <b>Date:</b>{" "}
                  {moment(orderDetails?.created_at).format("DD MMM YYYY")}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <Typography variant="h6" color={colors.primary[300]}>
                  <b>Customer Name:</b> {orderDetails?.customer_name}
                </Typography>
              </div>

              <div className="col-md-4">
                <Typography variant="h6" color={colors.primary[300]}>
                  <b>Time:</b>{" "}
                  {moment(orderDetails?.created_at).format("hh:mm A")}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <Typography variant="h6" color={colors.primary[300]}>
                  <b>Customer Address:</b> {orderDetails?.customer_address}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <Typography
                  variant="h6"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Mobile:</b> {orderDetails?.customer_phone}
                </Typography>
              </div>
            </div>
            <div className="row mt-2">
              <div className="table-responsive">
                <table
                  className="table table-bordered"
                  style={{ border: "black" }}
                >
                  <thead>
                    <tr>
                      <th style={{ padding: "4px" }} className="text-center">
                        #
                      </th>
                      <th style={{ padding: "4px" }} className="text-center">
                        Product Description
                      </th>
                      <th style={{ padding: "4px" }} className="text-center">
                        SKU
                      </th>
                      <th style={{ padding: "4px" }} className="text-center">
                        Quantity
                      </th>
                      <th style={{ padding: "4px" }} className="text-center">
                        Unit Price
                      </th>
                      <th style={{ padding: "4px" }} className="text-center">
                        Sub Total
                      </th>
                      <th style={{ padding: "4px" }} className="text-center">
                        Vat Rate
                      </th>
                      <th style={{ padding: "4px" }} className="text-center">
                        Vat Amount
                      </th>
                      <th style={{ padding: "4px" }} className="text-center">
                        Total
                      </th>
                      {isEditable != 0 && (
                        <th style={{ padding: "4px" }} className="text-center">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails?.sales_items?.map((item, index) => (
                      <tr key={index}>
                        <th style={{ padding: "4px" }}>{index + 1}</th>
                        <td style={{ padding: "4px" }}>
                          {item.item_info.title}
                        </td>
                        <td style={{ padding: "4px" }}>{item.item_info.sku}</td>
                        <td style={{ padding: "4px" }} className="text-center">
                          {item.qty}
                        </td>
                        <td style={{ padding: "4px" }} className="text-end">
                          {Intl.NumberFormat().format(item.price.toFixed(2))}
                        </td>
                        <td style={{ padding: "4px" }} className="text-end">
                          {Intl.NumberFormat().format(
                            item.total_price.toFixed(2)
                          )}
                        </td>
                        <td style={{ padding: "4px" }} className="text-center">
                          {(+item.vat_rate).toFixed(1)}%
                        </td>
                        <td style={{ padding: "4px" }} className="text-end">
                          {Intl.NumberFormat().format(item.vat_amount)}
                        </td>
                        <td style={{ padding: "4px" }} className="text-end">
                          {Intl.NumberFormat().format(
                            (item.price * item.qty + item.vat_amount).toFixed(2)
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
                      <td style={{ padding: "4px" }} colSpan={5}></td>
                      <td style={{ padding: "4px" }} colSpan={3}>
                        <b>Total Amount:</b>
                      </td>
                      <td style={{ padding: "4px" }} className="text-end">
                        {Intl.NumberFormat().format(calculate())}
                      </td>
                      {isEditable != 0 && <td></td>}
                    </tr>
                    <tr>
                      <td style={{ padding: "4px" }} colSpan={5}></td>
                      <td style={{ padding: "4px" }} colSpan={3}>
                        <b>Discount:</b>
                      </td>
                      <td style={{ padding: "4px" }} className="text-end">
                        0.00
                      </td>
                      {isEditable != 0 && <td></td>}
                    </tr>
                    <tr>
                      <td style={{ padding: "4px" }} colSpan={5}></td>
                      <td style={{ padding: "4px" }} colSpan={3}>
                        <b>Cash/Card Received:</b>
                      </td>
                      <td style={{ padding: "4px" }} className="text-end"></td>
                      {isEditable != 0 && <td></td>}
                    </tr>
                    <tr>
                      <td style={{ padding: "4px" }} colSpan={5}></td>
                      <td style={{ padding: "4px" }} colSpan={3}>
                        <b>Outstanding Balance:</b>
                      </td>
                      <td style={{ padding: "4px" }} className="text-end"></td>
                      {isEditable != 0 && <td></td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-8 capital">
                <Typography variant="h6" color={colors.primary[300]}>
                  <b>Quantity in Words:</b> {converter.toWords(calculateQty())}{" "}
                  Piece(s) Only
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 capital">
                <Typography variant="h6" color={colors.primary[300]}>
                  <b>Amount in Words:</b> {converter.toWords(calculate())} Taka
                  Only
                </Typography>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

OrderDetails.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(OrderDetails);
