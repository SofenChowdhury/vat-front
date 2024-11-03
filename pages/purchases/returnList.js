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
  Menu,
  MenuItem,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

//date
import moment from "moment";

//modal
import Modal from "../../components/services/Modal";

//modal-component
import UpdatePurchaseReturn from "../../components/forms/modalForms/UpdatePurchaseReturn";

// Icon import
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";


const ReturnListPurchase = ({ token, roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [returns, setReturns] = useState([]);
  const [loader, setLoader] = useState(true);
  const [returnId, setReturnId] = useState(null);

  //Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  //menu
  const [anchorEls, setAnchorEls] = useState({});

  //modals variables
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const apiReturns = BASE_URL + "api/v1/purchases/return?page=" + page;

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

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  const getPrice = (item, id) => {
    let purchasePrice = 0;
    item.purchase_items?.map((item) => {
      if (item.product_id == id) {
        purchasePrice = item.total_price;
      }
    });
    return purchasePrice;
  };
  const getQty = (item, id) => {
    let purchaseQty = 0;
    item.purchase_items?.map((item) => {
      if (item.product_id == id) {
        purchaseQty = item.qty;
      }
    });
    return purchaseQty;
  };
  const getVat = (item, id) => {
    let purchaseVat = 0;
    item.purchase_items?.map((item) => {
      if (item.product_id == id) {
        purchaseVat = item.vat_amount;
      }
    });
    return purchaseVat;
  };

  const downloadOrders = async () => {
    const apiReturns = BASE_URL + "api/v1/purchases/return-download";
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
          response.data.data?.map((purchase) => {
            purchase.return_items.map((item) => {
              index++;
              const date = moment(purchase.created_at).format("DD-MMM-YYYY");
              const time = moment(purchase.created_at).format("hh:mm A");
              temp = {
                SL: index,
                "Return No": purchase.return_no,
                "Challan No": purchase.purchase
                  ? purchase.purchase.challan_no
                  : purchase.challan_no,
                "Challan Date": purchase.purchase
                  ? moment(purchase.purchase.challan_date).format("DD-MMM-YYYY")
                  : moment(purchase.challan_date).format("DD-MMM-YYYY"),
                "Issue Date": date,
                "Product Title": item.info?.title,
                "Product SKU": item.info?.sku,
                "Challan Value": purchase.purchase
                  ? getPrice(purchase.purchase, item.product_id)
                  : item.challan_item_value,
                "Challan Qty": purchase.purchase
                  ? getQty(purchase.purchase, item.product_id)
                  : item.challan_item_qty,
                "Challan VAT": purchase.purchase
                  ? getVat(purchase.purchase, item.product_id)
                  : item.challan_item_vat,
                "Return Value": item.total_price,
                "Return Qty": item.qty,
                "Return VAT": item.vat_amount,
                "VAT Rate": item.vat_rate,
                "Return Reason": purchase.return_reason,
              };
              data.push(temp);
            });
          });
          const date = new Date();
          const fileName = "PurchaseReturnList_" + date.toDateString();
          const exportType = "csv";
          console.log(data[0]);
          ExportExcel(data, fileName, exportType);
        } else {
          // setFormErrors(Object.values(response.data.errors));
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClick = (event, orderId) => {
    setAnchorEls((prevState) => ({
      ...prevState,
      [orderId]: event.currentTarget,
    }));
  };

  const handleClose = (orderId) => {
    setAnchorEls((prevState) => ({
      ...prevState,
      [orderId]: null,
    }));
  };

  return (
    <>
      {loader ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <Modal onClose={() => setShowModal(false)} show={showModal} height={700}>
            <UpdatePurchaseReturn returnId={returnId} />
          </Modal>
          <div className="row">
            <div className="col-md-6">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Purchase Return List
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
                  <th>Purchase No</th>
                  <th>Challan No</th>
                  <th>Challan Date</th>
                  <th>Issue Date</th>
                  <th>Issued By</th>
                  <th>Company</th>
                  <th>Vendor</th>
                  <th>Mushak</th>
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
                        href={`/purchases/purchaseDetails/${item.purchase?.id}`}
                        className="anchor3"
                      >
                        {item.purchase?.purchase_no}
                      </Link>
                    </td>
                    {item.purchase ? (
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
                    <td>{item.company?.name}</td>
                    <td>{item.vendor?.name}</td>
                    <td>
                      <Link
                        href={`/purchases/returnVat/${item.id}`}
                        className="anchor3"
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                        >
                          6.8
                        </Button>
                      </Link>
                    </td>
                    {roles[0].id != 5 && (
                      <td>
                        <Button
                          variant="outlined"
                          size="large"
                          aria-controls={`basic-menu-${item.return_no}`}
                          aria-haspopup="true"
                          aria-expanded={Boolean(anchorEls[item.id])}
                          onClick={(event) => handleClick(event, item.id)}
                        >
                          <MoreHorizIcon />
                        </Button>
                        <Menu
                          id={`basic-menu-${item.return_no}`}
                          anchorEl={anchorEls[item.id]}
                          open={Boolean(anchorEls[item.id])}
                          onClose={() => handleClose(item.id)}
                          MenuListProps={{
                            "aria-labelledby": `menu-${item.id}`,
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              handleClose(item.id);
                              setReturnId(item.id);
                              setShowModal(true);
                              window.scrollTo({
                                top: 0,
                                behavior: "instant",
                              });
                            }}
                          >
                            Edit
                          </MenuItem>
                          {/* <MenuItem
                            onClick={() => {
                              handleClose(item.id);
                              handleDelete(item.id);
                            }}
                          >
                            Delete
                          </MenuItem> */}
                        </Menu>
                      </td>
                    )}
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
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(ReturnListPurchase);
