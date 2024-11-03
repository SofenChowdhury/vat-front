import React, { useState, useEffect, useRef } from "react";

// bootstarp
import { Button, CircularProgress } from "@mui/material";

//redux imports
import { connect } from "react-redux";

//Date
import moment from "moment/moment";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// PRINT
import Print from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";

const SubForm4 = ({ token, query }) => {
  // Helper variables
  const [mushak, setMushak] = useState([]);
  const [company, setCompany] = useState({});
  const [loader, setLoader] = useState(true);

  // REFERENCES
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Query Variables
  const start_date = query?.start_date;
  const end_date = query?.end_date;
  const sales_vat = query?.sales_vat;
  const exempted = query?.exempted;
  const form = query?.form;
  //   const note = query?.note;

  // Fetch Company
  useEffect(() => {
    if (sales_vat) {
      const apiMushak =
        BASE_URL +
        "api/v1/sales-sub-form?" +
        "start_date=" +
        start_date +
        "&end_date=" +
        end_date +
        "&percentage=" +
        +sales_vat +
        "&exempted=" +
        +exempted;

      console.log(apiMushak);
      axios
        .get(apiMushak, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status) {
            setLoader(false);
            setMushak(res.data.data);
            setCompany(res.data.company);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const sum = () => {
    let total = 0;
    if (sales_vat) {
      mushak?.map((data) => {
        total += +data.total_value;
      });
    }

    return Intl.NumberFormat().format(total.toFixed(2));
  };

  const sumVat = () => {
    let total = 0;
    if (sales_vat) {
      mushak?.map((data) => {
        total += +data.total_vat_amount;
      });
    }
    return Intl.NumberFormat().format(total.toFixed(2));
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div>
            <Button
              variant="contained"
              size="large"
              className="float-end"
              onClick={handlePrint}
            >
              <Print />
              Print
            </Button>
          </div>
          <div ref={printRef}>
            <div className="row">
              <div className="col-md-2">
                <img
                  className="ms-5"
                  alt="profile-user"
                  width="80px"
                  height="80px"
                  src={`../../assets/images/govt.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </div>
              <div className="col-md-8 text-center">
                <div className="row">
                  <small style={{ color: "dodgerblue" }}>{company?.name}</small>
                </div>
                <div className="row">
                  <small style={{ color: "dodgerblue" }}>
                    {company?.contact_address}
                  </small>
                </div>
                <div className="row">
                  <small style={{ color: "darkviolet" }}>
                    BIN-{company?.company_bin}
                  </small>
                </div>
                <div className="row">
                  <small style={{ color: "darkviolet" }}>
                    Sub-form for the month of {moment(end_date).format("MMMM")}{" "}
                    {moment(end_date).format("YYYY")}
                  </small>
                </div>
                <div className="row">
                  <small style={{ color: "dodgerblue" }}>
                    Sub-form for local Supply (for note
                    3,4,5,7,10,12,14,18,19,20 and 21)
                  </small>
                </div>
              </div>
              <div className="col-md-2">
                <h6 style={{ color: "darkviolet" }}>{form}</h6>
              </div>
            </div>

            <div className="table-responsive mt-2">
              <table
                className="table table-bordered table-hover"
                style={{ border: "black" }}
              >
                <thead>
                  <tr
                    className="text-center"
                    style={{ background: "lightblue" }}
                  >
                    <th className="pb-0 pt-0">Serial No.</th>
                    <th className="pb-0 pt-0">
                      Goods/Service Commercial Description
                    </th>
                    <th className="pb-0 pt-0">Goods/Service Code</th>
                    <th className="pb-0 pt-0">Goods/Service Name</th>
                    <th className="pb-0 pt-0">Value (a)</th>
                    <th className="pb-0 pt-0">SD (b)</th>
                    <th className="pb-0 pt-0">VAT (c)</th>
                    <th className="pb-0 pt-0">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {mushak &&
                    mushak?.map((data, index) => (
                      <tr key={index}>
                        <td
                          className="text-center pb-0 pt-0"
                          style={{ width: "5%" }}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="text-left pb-0 pt-0"
                          style={{ width: "45%" }}
                        >
                          {data?.category_name}
                        </td>
                        <td
                          className="text-center pb-0 pt-0"
                          style={{ width: "5%" }}
                        >
                          {data?.code}
                        </td>
                        <td
                          className="text-left pb-0 pt-0"
                          style={{ width: "45%" }}
                        >
                          {data?.description}
                        </td>
                        <td
                          className="text-end pb-0 pt-0"
                          style={{ width: "45%" }}
                        >
                          {Intl.NumberFormat().format(
                            (data?.total_value).toFixed(2)
                          )}
                        </td>
                        <td
                          className="text-end pb-0 pt-0"
                          style={{ width: "45%" }}
                        >
                          0
                        </td>
                        <td
                          className="text-end pb-0 pt-0"
                          style={{ width: "45%" }}
                        >
                          {Intl.NumberFormat().format(
                            data.total_vat_amount.toFixed(2)
                          )}
                        </td>
                        <td
                          className="text-center pb-0 pt-0"
                          style={{ width: "45%" }}
                        ></td>
                      </tr>
                    ))}
                  <tr
                    className="text-center"
                    style={{ background: "lightblue" }}
                  >
                    <td className="text-end pb-0 pt-0" colSpan={4}>
                      <strong>TOTAL</strong>
                    </td>
                    <td className="text-end pb-0 pt-0">
                      <strong>{sum()}</strong>
                    </td>
                    <td className="text-end pb-0 pt-0">-</td>
                    <td className="text-end pb-0 pt-0">
                      <strong>{sumVat()}</strong>
                    </td>
                    <td className="text-center pb-0 pt-0"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

SubForm4.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(SubForm4);
