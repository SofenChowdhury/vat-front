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
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Excel
import ExportExcel from "../../components/services/ExportExcel";

// Icon import
import EditIcon from "@mui/icons-material/Edit";

const RawMaterialList = ({ token, roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(true);
  const [sku, setSku] = useState("");
  const [model, setModel] = useState("");
  const [title, setTitle] = useState("");
  const [timer, setTimer] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    setLoader(true);

    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      const apiProducts =
        BASE_URL +
        "api/v1/products?sku=" +
        sku +
        "&model=" +
        model +
        "&title=" +
        title +
        "&type=2&page=" +
        page;

      axios
        .get(apiProducts, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status == true) {
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
  }, [page, model, sku, title]);

  // Download CSV
  const downloadExcel = async () => {
    const apiProductDownload =
      BASE_URL +
      "api/v1/products/download?sku=" +
      sku +
      "&model=" +
      model +
      "&title=" +
      title +
      "&type=2";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios
      .get(apiProductDownload, config)
      .then((response) => {
        if (response.data.status) {
          const data = response.data.data.map((product, index) => {
            return {
              Index: index + 1,
              ID: product.id,
              Name: product.title,
              SKU: product.sku,
              Model: product.model,
              Price: product.price,
              Category: product.category?.name,
              "HS Code": product.hscode?.code,
              CD: product.hscode?.cd,
              RD: product.hscode?.rd,
              SD: product.hscode?.sd,
              AT: product.hscode?.ait,
              AIT: product.hscode?.ait,
              "VAT Rebatable Percentage": product.vat_rebatable_percentage,
              "VDS Percentage": product.vds_percentage,
            };
          });
          console.log(data);
          const fileName = "Raw_Materials_List";
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
        <div className="col-md-6">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Raw Materials
          </Typography>
        </div>
        <div className="col-md-6 mt-1 mb-3">
          <Button
            className="anchor float-end"
            variant="outlined"
            onClick={downloadExcel}
            size="large"
          >
            Download
          </Button>
          {roles[0].id != 5 && (
            <Link
              href="/products/createProduct"
              className="anchor float-end me-2"
            >
              <Button variant="outlined" size="large">
                Create Product
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h6 className="text-secondary">Search</h6>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-4">
          <TextField
            label="Sku"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setSku(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-4 mb-4">
          <TextField
            label="Title"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
            className="shadow-input"
          />
        </div>
        <div className="col-md-4 mb-4">
          <TextField
            label="Model"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setModel(e.target.value)}
            className="shadow-input"
          />
        </div>
      </div>
      {loader ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead>
                <tr className="table-success">
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>sku</th>
                  <th>HS Code</th>
                  <th>Price</th>
                  {roles[0].id != 5 && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => (
                  <tr key={index}>
                    <th>{index + 1 + (page - 1) * 20}</th>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>{product.sku}</td>
                    <td>{product.hscode?.code}</td>
                    <td className="text-end">{(+product.price).toFixed(2)}</td>
                    {roles[0].id != 5 && (
                      <td>
                        <Link href={`/products/updateProduct/${product.id}`}>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                          >
                            <EditIcon cursor="pointer" />
                          </Button>
                        </Link>

                        {/* <button
                        className="btn btn-light btn-sm text-danger"
                        onClick={(e) => onDelete(e, product.id, product.name)}
                      >
                        <DeleteIcon cursor="pointer" />
                      </button> */}
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

export default connect(mapStateToProps)(RawMaterialList);
