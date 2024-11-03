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
  Pagination,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Icon import
import EditIcon from "@mui/icons-material/Edit";

const vendorList = ({ token, roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [bin, setBin] = useState("");

  const [customers, setCustomers] = useState([]);
  const [loader, setLoader] = useState(true);
  const [timer, setTimer] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // FETCHING CUSTOMERS
  useEffect(() => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      const apiCustomers =
        BASE_URL +
        "api/v1/customers?page=" +
        page +
        "&phone=" +
        phone +
        "&code=" +
        code +
        "&name=" +
        name +
        "&email=" +
        email +
        "&type=" +
        type +
        "&bin=" +
        bin;

      axios
        .get(apiCustomers, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status == true) {
            setLoader(false);
            setCustomers(res.data.data.data);
            setLastPage(res.data.data.last_page);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500);

    setTimer(newTimer);
  }, [page, name, code, email, phone, bin, type]);

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Customers
              </Typography>
            </div>
            <div className="col-md-6 mt-1 mb-3">
              {roles[0].id != 5 && (
                <Link href="/customers/createCustomer" className="anchor">
                  <Button variant="outlined" className="float-end" size="large">
                    Create Customer
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mb-2">
              <h6 className="text-secondary">Search</h6>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2 mb-4">
              <TextField
                label="Name"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => setName(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-2 mb-4">
              <TextField
                label="Code"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => setCode(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-2 mb-4">
              <TextField
                label="Email"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-2 mb-4">
              <TextField
                label="Phone"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => setPhone(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-2 mb-4">
              <TextField
                label="BIN"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => setBin(e.target.value)}
                className="shadow-input"
              />
            </div>
            <div className="col-md-2 mb-4">
              <TextField
                onChange={(e) => setType(e.target.value)}
                select
                label="Type"
                size="large"
                fullWidth
                value={type}
                className="shadow-input"
              >
                <MenuItem value="Dealer">Dealer</MenuItem>
                <MenuItem value="Corporate">Corporate</MenuItem>
                <MenuItem value="Retail">Retail</MenuItem>
              </TextField>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr className="table-success">
                  <th scope="col">#</th>
                  <th scope="col">Customer ID</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Customer Code</th>
                  <th scope="col">Customer Phone</th>
                  <th scope="col">Customer Address</th>
                  <th scope="col">Customer Email</th>
                  <th scope="col">Customer BIN</th>
                  {roles[0].id != 5 && <th scope="col">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={index}>
                    <th>{index + 1 + (page - 1) * 20}</th>
                    <td>{customer.id}</td>
                    <td>
                      <Link
                        href={`/customers/customerProfile/${customer.id}`}
                        className="anchor3"
                      >
                        {customer.name}
                      </Link>
                    </td>
                    <td>{customer.code}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>{customer.email}</td>
                    <td>{customer.bin}</td>
                    {roles[0].id != 5 && (
                      <td>
                        <Link href={`/customers/updateCustomer/${customer.id}`}>
                          <Button size="large">
                            <EditIcon cursor="pointer" />
                          </Button>
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row justify-content-center mb-2">
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

export default connect(mapStateToProps)(vendorList);
