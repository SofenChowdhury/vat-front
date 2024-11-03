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
  TextField,
  Autocomplete,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// date time formaT
import { DatePicker } from "antd";
import moment from "moment/moment";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

const TransferList = ({ token, roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { RangePicker } = DatePicker;

  // Search Variables
  const [transfer_no, setTransferNo] = useState("");
  const [branch_from, setBranchFrom] = useState("");
  const [branch_to, setBranchTo] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  // Helper
  const [branches, setBranches] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loader, setLoader] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // FETCH BRANCHES
  useEffect(() => {
    const apiBranches = BASE_URL + "api/v1/branches";

    axios
      .get(apiBranches, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setBranches(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Fetch Transfers
  useEffect(() => {
    setLoader(true);
    const apiTransfers =
      BASE_URL +
      "api/v1/transfers/search?transfer_no=" +
      transfer_no +
      "&branch_from=" +
      branch_from +
      "&branch_to=" +
      branch_to +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date +
      "&page=" +
      page;

    axios
      .get(apiTransfers, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setLoader(false);
          setTransfers(res.data.data.data);
          setLastPage(res.data.data.last_page);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, transfer_no, branch_from, branch_to, start_date, end_date]);

  // Branches Change
  const handleBranchToChange = (event, value) => {
    if (value) {
      setBranchTo(value.id);
    } else {
      setBranchTo("");
    }
  };
  const handleBranchFromChange = (event, value) => {
    if (value) {
      setBranchFrom(value.id);
    } else {
      setBranchFrom("");
    }
  };

  // Date Change
  function onChange(date, dateString) {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  }

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  // Download CSV
  const downloadExcel = async () => {
    const apiTransferDownload =
      BASE_URL +
      "api/v1/transfer-download?transfer_no=" +
      transfer_no +
      "&branch_from=" +
      branch_from +
      "&branch_to=" +
      branch_to +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .get(apiTransferDownload, config)
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          let index = 0;
          let temp = {};
          let data = [];
          response.data.data.map((transfer, index) => {
            transfer.transfer_items.map((item) => {
              index++;
              const date = moment(transfer.created_at).format("DD MMM YYYY");
              const time = moment(transfer.created_at).format("hh:mm A");
              temp = {
                SL: index,
                "Transfer No": transfer.transfer_no,
                "Reference No": transfer.reference_no,
                Date: date,
                Time: time,
                "Branch From": transfer.from_branch.name,
                "Branch To": transfer.to_branch.name,
                "Item SKU": item.item_info.sku,
                "Item Title": item.item_info.title,
                "Item Price": item.price,
                "Item Quantity": item.qty,
                "Total Price": item.qty * item.price,
                "Created By": transfer.user?.name,
              };
              data.push(temp);
            });
          });
          console.log(data);
          const fileName = "Transfer_List";
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
        <div className="col-md-6">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Transferred Products
          </Typography>
        </div>
        <div className="col-md-6 mt-1 mb-3">
          <Button
            className="anchor float-end ms-2"
            variant="outlined"
            onClick={downloadExcel}
            size="large"
          >
            Download
          </Button>
          {roles[0].id != 5 && (
            <Link
              href="/transfers/transferProduct"
              className="anchor float-end me-2"
            >
              <Button variant="outlined" size="large">Transfer Product</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mt-2">
          <TextField
            label="Transfer No"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setTransferNo(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-3 mt-2">
          <Autocomplete
            options={branches}
            getOptionLabel={(option) => option.name}
            onChange={handleBranchFromChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Branch From"
                className="shadow-input"
              />
            )}
            size="large"
          />
        </div>
        <div className="col-md-3 mt-2">
          <Autocomplete
            options={branches}
            getOptionLabel={(option) => option.name}
            onChange={handleBranchToChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Branch To"
                className="shadow-input"
              />
            )}
            size="large"
          />
        </div>
        <div className="col-md-3 mt-2">
          <RangePicker
            onChange={onChange}
            size="large"
            style={{ width: "100%", height: "58px" }}
            className="shadow-input"
          />
        </div>
      </div>
      {loader ? (
        <CircularProgress color="success" className="mt-4" />
      ) : (
        <>
          <div className="table-responsive mt-4">
            <table className="table table-hover table-striped">
              <thead>
                <tr className="table-success">
                  <th>#</th>
                  <th>Transfer No</th>
                  <th>Transferred From</th>
                  <th>Transferred To</th>
                  <th>Transfer Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transfers?.map((transfer, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{transfer.transfer_no}</td>
                    <td>{transfer.from_branch.name}</td>
                    <td>{transfer.to_branch.name}</td>
                    <td>{moment(transfer.created_at).format("DD MMM YY")}</td>
                    <td>{transfer.user?.name}</td>
                    <td>
                      <Link
                        href={`/transfers/transferVat/${transfer.id}`}
                        className="anchor"
                      >
                        <Button variant="contained" color="secondary" size="large">
                          6.5
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
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(TransferList);
