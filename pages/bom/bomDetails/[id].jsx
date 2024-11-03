import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import { CircularProgress, Typography, useTheme, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

//date format
import moment from "moment";

//Icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const BomDetails = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [bomDetails, setBomDetails] = useState({});
  const id = +query.id;

  const [loader, setLoader] = useState(true);

  const router = useRouter();

  let formatCurrency = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BDT",
  });

  // FETCH BOM DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/boms/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setBomDetails(res.data.data);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Calculate functions
  const calculate = () => {
    let total = 0;
    bomDetails.raw_materials?.map((item) => {
      total += item.price;
    });
    return total.toFixed(2);
  };
  const calculateServices = () => {
    let total = 0;
    bomDetails.services?.map((item) => {
      total += item.amount;
    });
    return total.toFixed(2);
  };
  const calculateAdditions = () => {
    let total = 0;
    bomDetails.bom_value_additions?.map((item) => {
      total += item.amount;
    });
    return total.toFixed(2);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row justify-content-between">
            <div className="col-md-2">
              <Button variant="outlined" size="large" onClick={goBack}>
                <ArrowLeftIcon />
                BOM List
              </Button>
            </div>
          </div>
          <div className="mt-5 p-5">
            <div className="row">
              <div className="col-sm-3">
                <Typography
                  variant="h3"
                  className="mb-4"
                  color={colors.blueAccent[300]}
                >
                  Fair VAT
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4"></div>
              <div className="col-sm-4 text-center">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Bom NO: {bomDetails?.bom_number}</b>
                </Typography>
              </div>
              <div className="col-sm-4"></div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-12 text-center">
                <Typography
                  variant="h3"
                  className="mb-4"
                  color={colors.primary[300]}
                >
                  BOM Details
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-1"></div>
              <div className="col-sm-2">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Finished Good</b>
                </Typography>
              </div>
              <div className="col-sm-3">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  : {bomDetails?.finish_goods?.title}
                </Typography>
              </div>
              <div className="col-sm-1"></div>
              <div className="col-sm-1">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>SKU</b>
                </Typography>
              </div>
              <div className="col-sm-3">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  : {bomDetails?.finish_goods?.sku}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-1"></div>
              <div className="col-sm-2">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Model</b>
                </Typography>
              </div>
              <div className="col-sm-3">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  : {bomDetails?.finish_goods?.model}
                </Typography>
              </div>
              <div className="col-sm-1"></div>
              <div className="col-sm-1">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  <b>Duration</b>
                </Typography>
              </div>
              <div className="col-sm-3">
                <Typography
                  variant="h5"
                  className="mb-2"
                  color={colors.primary[300]}
                >
                  : {moment(bomDetails?.start_date).format("DD MMM YYYY")} -{" "}
                  {moment(bomDetails?.end_date).format("DD MMM YYYY")}
                </Typography>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-1"></div>
              <div className="col-sm-2">
                <Typography
                  variant="h5"
                  className="mb-2 mt-2"
                  color={colors.primary[300]}
                >
                  <b>Declared Price</b>
                </Typography>
              </div>
              <div className="col-sm-2">
                <Typography
                  variant="h5"
                  className="mb-2 mt-2"
                  color={colors.primary[300]}
                >
                  : {formatCurrency.format(bomDetails?.price)}
                </Typography>
              </div>
            </div>

            {/* RAW MATERIALS */}
            <div className="row mt-5">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr className="table-success">
                      <th scope="col">#</th>
                      <th scope="col">Raw Materials</th>
                      <th scope="col">SKU</th>
                      <th scope="col">Quantity (Actual)</th>
                      <th scope="col">Quantity (With Wastage)</th>
                      <th scope="col">Unit of Product</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomDetails?.raw_materials?.map((item, index) => (
                      <tr key={index}>
                        <th>{index + 1}</th>
                        <td>{item?.product?.title}</td>
                        <td>{item?.product?.sku}</td>
                        <td>{(+item?.actual_qty).toFixed(2)}</td>
                        <td>{(+item?.qty_with_wastage).toFixed(2)}</td>
                        <td>{item?.unit}</td>
                        <td className="text-end">{item?.price}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={6} className="text-end">
                        <b>Total</b>
                      </td>
                      <td className="text-end table-success">
                        <b>{calculate()}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SERVICES */}
            <div className="row mt-5">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr className="table-success">
                      <th scope="col">#</th>
                      <th scope="col">Services</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomDetails?.services?.map((item, index) => (
                      <tr key={index}>
                        <th>{index + 1}</th>
                        <td>{item?.info?.title}</td>
                        <td className="text-end">{item?.amount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="text-end">
                        <b>Total</b>
                      </td>
                      <td className="text-end table-success">
                        <b>{calculateServices()}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* VALUE ADDITIONS */}
            <div className="row mt-5">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr className="table-success">
                      <th scope="col">#</th>
                      <th scope="col">Value Additions</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomDetails?.bom_value_additions?.map((item, index) => (
                      <tr key={index}>
                        <th>{index + 1}</th>
                        <td>{item?.value_info?.head}</td>
                        <td className="text-end">{item?.amount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="text-end">
                        <b>Total</b>
                      </td>
                      <td className="text-end table-success">
                        <b>{calculateAdditions()}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-4">
                <b>Declared Price</b>
              </div>
              <div className="col-md-4">
                <b>: {formatCurrency.format(bomDetails?.price)}</b>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <b>Total Price (raw materials, services, value additions)</b>
              </div>
              <div className="col-md-4">
                <b>
                  :{" "}
                  {formatCurrency.format(
                    +calculate() + +calculateAdditions() + +calculateServices()
                  )}
                </b>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

BomDetails.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(BomDetails);
