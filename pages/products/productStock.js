import React, { useEffect, useState } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  CircularProgress,
  Pagination,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

const productStock = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(0);

  // Helper Variables
  const [loader, setLoader] = useState(true);
  const [timer, setTimer] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  // FETCH BRANCHES
  useEffect(() => {
    const apiBranches = BASE_URL + "api/v1/branches";

    axios
      .get(apiBranches, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setBranches(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Branch Change
  const handleBranchChange = (event, value) => {
    if (value) {
      setSelectedBranch(value.id);
    } else {
      setSelectedBranch("");
    }
  };

  // FETCH STOCK
  useEffect(() => {
    clearTimeout(timer);
    setLoader(true);
    const newTimer = setTimeout(() => {
      const apiStock =
        BASE_URL +
        "api/v1/products/stock?branch_id=" +
        selectedBranch +
        "&keyword=" +
        keyword +
        "&type=" +
        type +
        "&page=" +
        page;

      axios
        .get(apiStock, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status) {
            setLoader(false);
            setProducts(res.data.data.data);
            setLastPage(res.data.data.last_page);
            setTotalData(res.data.data.total);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500);

    setTimer(newTimer);
  }, [page, selectedBranch, keyword, type]);

  // Download CSV
  const downloadExcel = async () => {
    const apiProductDownload =
      BASE_URL +
      "api/v1/products/stock/download?branch_id=" +
      selectedBranch +
      "&keyword=" +
      keyword;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .get(apiProductDownload, config)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.status) {
          const data = response.data.data.map((product, index) => {
            return {
              SL: index + 1,
              Name: product.product?.title,
              sku: product.product?.sku,
              "HS Code": product.product?.hscode?.code,
              Branch: product.branch?.name,
              Price: product.product?.price,
              Stock: product.stock,
              "Stock Value": +(product.product?.price * product.stock),
            };
          });
          console.log(data);
          const fileName = "Stock_List";
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

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Product Stock
          </Typography>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mt-2">
          <TextField
            label="Search Product"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setKeyword(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-3 mt-2">
          <Autocomplete
            options={branches}
            getOptionLabel={(option) => option.name}
            onChange={handleBranchChange}
            renderInput={(params) => (
              <TextField {...params} label="Branch" className="shadow-input" />
            )}
            size="large"
          />
        </div>
        <div className="col-md-3 mt-2">
          <TextField
            onChange={(e) => setType(e.target.value)}
            select
            label="Product Type"
            size="large"
            fullWidth
            value={type || ""}
            className="shadow-input"
          >
            <MenuItem value={1}>Finished Goods</MenuItem>
            <MenuItem value={2}>Raw Materials</MenuItem>
            <MenuItem value={3}>Spare Parts</MenuItem>
          </TextField>
        </div>
        <div className="col-md-3 mt-2">
          <Button
            variant="contained"
            className="float-end"
            size="large"
            onClick={downloadExcel}
          >
            Download
          </Button>
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
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">SKU</th>
                  <th scope="col">HS Code</th>
                  <th scope="col">Branch</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Stock Value</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (page - 1) * 20}</td>
                    <td>{product?.product?.title}</td>
                    <td>{product?.product?.sku}</td>
                    <td>{product?.product?.hscode?.code}</td>
                    <td>{product?.branch?.name}</td>
                    <td>{product?.product?.price}</td>
                    <td>
                      <b>{product?.stock}</b>
                    </td>
                    <td>{product?.stock * product?.product?.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row justify-content-center mt-2">
            <div className="col-md-12 d-flex justify-content-center">
              <Pagination
                count={lastPage}
                page={page}
                color="secondary"
                size="large"
                onChange={handleChange}
              />
              {page === lastPage ? (
                <span className="ms-3 mt-2">
                  Showing {1 + (page - 1) * 20} - {totalData} out of {totalData}
                </span>
              ) : (
                <>
                  {totalData === 0 ? (
                    <span className="ms-3 mt-2">Showing 0 out of 0</span>
                  ) : (
                    <span className="ms-3 mt-2">
                      Showing {1 + (page - 1) * 20} - {20 + (page - 1) * 20} out
                      of {totalData}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 d-flex justify-content-center"></div>
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

export default connect(mapStateToProps)(productStock);
