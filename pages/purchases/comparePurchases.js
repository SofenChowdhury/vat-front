import React, { useState, useEffect, useRef } from "react";

//theme
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//date
import { DatePicker } from "antd";
import moment from "moment";

//print
import { useReactToPrint } from "react-to-print";

//icons
import Print from "@mui/icons-material/Print";

const ComparePurchases = ({ token, company }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper Variables
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [format, setFormat] = useState(null);
  const [type, setType] = useState("all");
  const [maxLength, setMaxLength] = useState(0);
  const [loader, setLoader] = useState(true);

  // References
  const printRef = useRef();

  // Date Variables
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  // Fetch Sales
  useEffect(() => {
    setLoader(true);
    const apiSales = BASE_URL + "api/v1/purchases/report/comparison";

    const data = {
      start_date: startDate,
      end_date: endDate,
      format: "year",
      type: type == "all" ? "" : type,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiSales, data, config).then((response) => {
      if (response.data.status) {
        console.log(response.data);
        setPurchaseDetails(response.data.data);
        setMaxLength(
          Math.max(
            response.data.data.current_year.length,
            response.data.data.previous_year.length
          )
        );
        setLoader(false);
      } else {
        console.log(response.data);
      }
    });
  }, [startDate, endDate, type]);

  // Calculations
  const getTotalAmount = (year) => {
    let total = 0;
    if (year == "current") {
      purchaseDetails?.current_year?.map((month) => {
        total += +month.total_value;
      });
    } else {
      purchaseDetails?.previous_year?.map((month) => {
        total += +month.total_value;
      });
    }
    return total.toFixed(2);
  };
  const getTotalVat = (year) => {
    let total = 0;
    if (year == "current") {
      purchaseDetails?.current_year?.map((month) => {
        total += +month.total_vat;
      });
    } else {
      purchaseDetails?.previous_year?.map((month) => {
        total += +month.total_vat;
      });
    }
    return total.toFixed(2);
  };
  const getTotalSD = (year) => {
    let total = 0;
    if (year == "current") {
      purchaseDetails?.current_year?.map((month) => {
        total += +month.total_sd;
      });
    } else {
      purchaseDetails?.previous_year?.map((month) => {
        total += +month.total_sd;
      });
    }
    return total.toFixed(2);
  };
  const getTotalAT = (year) => {
    let total = 0;
    if (year == "current") {
      purchaseDetails?.current_year?.map((month) => {
        total += +month.total_at;
      });
    } else {
      purchaseDetails?.previous_year?.map((month) => {
        total += +month.total_at;
      });
    }
    return total.toFixed(2);
  };

  // Print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Comparative Purchase Statement
          </Typography>
        </div>
        <div className="col-md-6">
          <Button
            variant="contained"
            size="large"
            className="float-end me-3"
            onClick={handlePrint}
            color="secondary"
          >
            <Print />
            Print
          </Button>
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
            <MenuItem value={"all"}>All</MenuItem>
            <MenuItem value={"Local"}>Local</MenuItem>
            <MenuItem value={"Imported"}>Imported</MenuItem>
          </TextField>
        </div>
        <div className="col-md-3 mt-4">
          <TextField
            label="Format"
            variant="outlined"
            select
            size="large"
            type="text"
            fullWidth
            value={format || ""}
            className="shadow-input"
            onChange={(e) => {
              setFormat(e.target.value);
            }}
          >
            <MenuItem value={"year"}>Year</MenuItem>
            <MenuItem value={"month"}>Month</MenuItem>
            <MenuItem value={"date"}>Date Range</MenuItem>
          </TextField>
        </div>
        <div className="col-md-3 mt-4 mb-5">
          {format == "year" && (
            <DatePicker
              picker="year"
              onChange={onChangeYear}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
            />
          )}
          {format == "month" && (
            <DatePicker
              picker="month"
              onChange={onChangeMonth}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
            />
          )}
          {format == "date" && (
            <RangePicker
              onChange={onChangeDate}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
            />
          )}
        </div>
      </div>
      {maxLength > 0 &&
        (loader ? (
          <CircularProgress className="mt-5" />
        ) : (
          <>
            <div className="row px-5" ref={printRef}>
              <div className="row justify-content-center print-only">
                <div className="col-md-6 text-center">
                  <img src={`../../assets/images/ftl_logo.jpg`} alt="" />
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <h6>{company?.name}</h6>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <h6>{company?.contact_address}</h6>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <h6>Comparative Month Wise Purchase Statement</h6>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-3">
                  <small>{moment(Date.now()).format("DD MMMM, YYYY")}</small>
                </div>
                <div className="col-6 text-center">
                  <h6>{`From ${moment(startDate).format(
                    "DD MMM, YYYY"
                  )} To ${moment(endDate).format("DD MMM, YYYY")}`}</h6>
                </div>
              </div>
              <table className="table table-bordered table-hover mt-3">
                <thead>
                  <tr>
                    <th></th>
                    <th colSpan={5} className="align-middle text-center p-4">
                      Previous Year
                    </th>
                    <th colSpan={5} className="align-middle text-center p-4">
                      Current Year
                    </th>
                  </tr>
                  <tr>
                    <th className="align-middle text-center">SL</th>
                    <th className="align-middle text-center">Month Year</th>
                    <th className="align-middle text-center">Amount</th>
                    <th className="align-middle text-center">SD</th>
                    <th className="align-middle text-center">AT</th>
                    <th className="align-middle text-center">VAT</th>
                    <th className="align-middle text-center">Month Year</th>
                    <th className="align-middle text-center">Amount</th>
                    <th className="align-middle text-center">SD</th>
                    <th className="align-middle text-center">AT</th>
                    <th className="align-middle text-center">VAT</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(maxLength)].map((_, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {index < purchaseDetails.previous_year.length ? (
                        <>
                          <td>
                            {moment(
                              purchaseDetails?.previous_year[index]?.month_year,
                              "MM-YYYY"
                            ).format("MMMM, YYYY")}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+purchaseDetails?.previous_year[index]
                                ?.total_value).toFixed(2)
                            )}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+purchaseDetails?.previous_year[index]
                                ?.total_sd).toFixed(2)
                            )}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+purchaseDetails?.previous_year[index]
                                ?.total_at).toFixed(2)
                            )}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+purchaseDetails?.previous_year[index]
                                ?.total_vat).toFixed(2)
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {moment(
                              purchaseDetails?.current_year[index]?.month_year,
                              "MM-YYYY"
                            )
                              .subtract(1, "year")
                              .format("MMMM, YYYY")}
                          </td>
                          <td className="text-end">0</td>
                          <td className="text-end">0</td>
                          <td className="text-end">0</td>
                          <td className="text-end">0</td>
                        </>
                      )}

                      {index < purchaseDetails.current_year.length ? (
                        <>
                          <td>
                            {moment(
                              purchaseDetails?.current_year[index]?.month_year,
                              "MM-YYYY"
                            ).format("MMMM, YYYY")}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+purchaseDetails?.current_year[index]
                                ?.total_value).toFixed(2)
                            )}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+purchaseDetails?.current_year[index]
                                ?.total_sd).toFixed(2)
                            )}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+purchaseDetails?.current_year[index]
                                ?.total_at).toFixed(2)
                            )}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+purchaseDetails?.current_year[index]
                                ?.total_vat).toFixed(2)
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {moment(
                              purchaseDetails?.previous_year[index]?.month_year,
                              "MM-YYYY"
                            )
                              .add(1, "year")
                              .format("MMMM, YYYY")}
                          </td>
                          <td className="text-end">0</td>
                          <td className="text-end">0</td>
                          <td className="text-end">0</td>
                          <td className="text-end">0</td>
                        </>
                      )}
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={2} className="text-end">
                      Total
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(getTotalAmount("previous"))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(getTotalSD("previous"))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(getTotalAT("previous"))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(getTotalAmount("previous"))}
                    </th>
                    <th colSpan={2} className="text-end">
                      {Intl.NumberFormat().format(getTotalAmount("current"))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(getTotalSD("current"))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(getTotalAT("current"))}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(getTotalVat("current"))}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ))}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    company: state.auth.company,
  };
};

export default connect(mapStateToProps)(ComparePurchases);
