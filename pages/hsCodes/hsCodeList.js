import React, { useEffect, useState } from "react";
import Router from "next/router";
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
  TextField,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

const hsCodeList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [codes, setCodes] = useState([]);
  const [input, setInput] = useState("");
  const [loader, setLoader] = useState(true);
  const [timer, setTimer] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // FETCHING HS CODES
  useEffect(() => {
    setLoader(true);

    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      const apiCodes =
        BASE_URL + "api/v1/hs-codes?hscode=" + input + "&page=" + page;
      axios
        .get(apiCodes, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status == true) {
            setLoader(false);
            setCodes(res.data.data.data);
            setLastPage(res.data.data.last_page);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500);

    setTimer(newTimer);
  }, [page, input]);

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  // Download CSV
  const downloadExcel = async () => {
    const apiHscodeDownload =
      BASE_URL + "api/v1/hs-codes-download?keyword=" + input;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .get(apiHscodeDownload, config)
      .then((response) => {
        if (response.data.status) {
          const data = response.data.data.map((hscode) => {
            return {
              ID: hscode.id,
              Name: hscode.description,
              Code: hscode.code,
              "Code Dot": hscode.code_dot,
              CD: hscode.cd,
              RD: hscode.rd,
              SD: hscode.sd,
              VAT: hscode.vat,
              AT: hscode.at,
              AIT: hscode.ait,
            };
          });
          console.log(data);
          const fileName = "HS_Code_List";
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
        <div className="col-md-9">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            HS Codes
          </Typography>
        </div>
        <div className="col-md-3 mb-4">
          <TextField
            label="Search HS Code"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setInput(e.target.value)}
            className="shadow-input"
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-md-12">
          <Button variant="outlined" onClick={downloadExcel} size="large">
            Download
          </Button>
        </div>
      </div>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead>
                <tr className="table-success">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Code Dot</th>
                  <th>CD</th>
                  <th>RD</th>
                  <th>SD</th>
                  <th>VAT</th>
                  <th>AT</th>
                  <th>AIT</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {codes?.map((code, index) => (
                    <tr key={index}>
                      <td>{code.id}</td>
                      <td>{code.description}</td>
                      <td>{code.code}</td>
                      <td>{code.code_dot}</td>
                      <td>{code.cd}</td>
                      <td>{code.rd}</td>
                      <td>{code.sd}</td>
                      <td>{code.vat}</td>
                      <td>{code.at}</td>
                      <td>{code.ait}</td>
                      <td>{code.total}</td>
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

export default connect(mapStateToProps)(hsCodeList);
