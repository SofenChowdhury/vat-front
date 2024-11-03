import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// Icons
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

const UpdateProduct = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // VARIABLES FOR POST
  const [title, setTitle] = useState("");
  const [cd, setCd] = useState("");
  const [rd, setRd] = useState("");
  const [sd, setSd] = useState("");
  const [at, setAt] = useState("");
  const [ait, setAit] = useState(0);
  const [vat_rate, setVatRate] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState(0);
  const [status, setStatus] = useState(1);
  const [model, setModel] = useState("");
  const [sku, setSku] = useState("");
  const [category_id, setCategory] = useState(0);
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState("");
  const [hs_code, setHsCode] = useState("meow");
  const [hs_code_id, setHsCodeId] = useState("");
  const [unit_type, setUnit] = useState("PCS");
  const [origin, setOrigin] = useState(null);
  const [vds_percentage, setVds] = useState(0);
  const [vat_rebatable_percentage, setRebatable] = useState(0);
  const [sales_vat_rate, setSalesVatRate] = useState(0);
  const product_id = +query.id;

  // HELPER VARIABLES
  const [formErrors, setFormErrors] = useState("");
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(true);
  const [thumbnail, setThumbnail] = useState("");
  const [checked, setChecked] = useState(false);
  const [codes, setCodes] = useState([]);
  const [timer, setTimer] = useState(null);
  const [hsTitle, setHsTitle] = useState("");

  // REFERENCES
  const multiselectRef = useRef();

  // FETCH CATEGORIES
  useState(() => {
    const apiUrl = BASE_URL + "api/v1/categories";
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setCategories(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // FETCH PRODUCT DETAILS
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/products/" + product_id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          setLoader(false);
          setTitle(res.data.data.title);
          setCd(res.data.data.hscode?.cd);
          setRd(res.data.data.hscode?.rd);
          setSd(res.data.data.hscode?.sd);
          setAt(res.data.data.hscode?.at);
          setAit(res.data.data.hscode?.ait);
          setVatRate(+res.data.data.hscode?.vat);
          setPrice(res.data.data.price);
          setType(res.data.data.type);
          setStatus(res.data.data.status);
          setModel(res.data.data.model);
          setSku(res.data.data.sku);
          setCategory(res.data.data.category_id);
          setDetails(res.data.data.details);
          setHsCode(res.data.data.hscode?.code);
          setHsCodeId(res.data.data.hscode?.id);
          setHsTitle(res.data.data.hscode?.description);
          setOrigin(res.data.data.origin);
          setVds(res.data.data.vds_percentage);
          setRebatable(res.data.data.vat_rebatable_percentage);
          setSalesVatRate(res.data.data?.sales_vat_rate);
          if (res.data.data.vat_rebatable_percentage) {
            setChecked(true);
          }
          {
            res.data.data.photo
              ? setThumbnail(
                  BASE_URL + "storage/thumbnails/" + res.data.data.photo
                )
              : setThumbnail("");
          }
        } else {
          setFormErrors(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // PHOTO
  const onChange = async (e) => {
    let files = e.target.files || e.dataTransfer.files;
    // console.log(files);
    if (files.length > 0) {
      uploadDocuments(e, files[0]);
    }
  };

  const uploadDocuments = async (event, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const response = submitFile(reader.result, file.name);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const submitFile = (result, name) => {
    // console.log(result, name);
    setPhoto(result);
  };

  // Multiselect functions
  const addColumn = (list, item) => {
    setHsCode(item.code);
    setHsCodeId(item.id);
    setCd(item.cd);
    setRd(item.rd);
    setSd(item.sd);
    setAit(item.ait);
    setAt(item.at);
    setHsTitle(item.description);
    setVatRate(item.vat);
    setCodes([]);
  };
  const resetSelectField = () => {
    multiselectRef.current.resetSelectedValues();
    setCodes([]);
    setHsCode(null);
    setHsCodeId(null);
    setCd(null);
    setRd(null);
    setSd(null);
    setAit(null);
    setAt(null);
    setHsTitle(null);
    setVatRate(null);
  };

  // HS CODE SEARCH
  const searchCode = (value) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (value == "") {
        setCodes([]);
      } else {
        setCodes([]);
        const apiCode = BASE_URL + "api/v1/hs-codes-search?keyword=" + value;
        axios
          .get(apiCode, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            // console.log(res.data);
            if (res.data.status == true) {
              if (res.data.data != null) {
                setCodes(res.data.data);
                setLoader(false);
              } else {
                setCodes([]);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
  };

  // POST UPDATED DATA
  const submit = (e) => {
    e.preventDefault();
    setLoader(true);
    const apiProduct = BASE_URL + "api/v1/products/update";
    const productData = {
      title,
      category_id,
      hs_code_id,
      hs_code,
      sku,
      model,
      details,
      type,
      price,
      photo,
      status,
      origin,
      vat_rebatable_percentage,
      vds_percentage,
      unit_type,
      sales_vat_rate,
      product_id,
    };
    console.log(productData);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiProduct, productData, config).then((response) => {
      if (response.data.status) {
        // alert("Product Details Updated!");
        if (type == 1) {
          Router.push({
            pathname: "/products/finishedGoodList",
          });
        } else if (type == 2) {
          Router.push({
            pathname: "/products/rawMaterialList",
          });
        } else if (type == 4) {
          Router.push({
            pathname: "/products/serviceList",
          });
        } else {
          Router.push({
            pathname: "/products/accessoriesList",
          });
        }
      } else {
        console.log(response.data);
        setFormErrors(response.data.errors);
      }
    });
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/products/finishedGoodList",
    });
  };

  return (
    <>
      {loader ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Update Product
          </Typography>
          <div className="row">
            <h4 className="text-danger" style={{ fontWeight: 200 }}>
              {formErrors[0]}
            </h4>
            {/* LEFT COLUMN */}
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Name"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-6 mt-4">
                  <TextField
                    label="SKU"
                    variant="outlined"
                    size="large"
                    fullWidth
                    value={sku}
                    onChange={(e) => {
                      setSku(e.target.value);
                    }}
                    className="shadow-input"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Model"
                    variant="outlined"
                    size="large"
                    fullWidth
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                    }}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-6 mt-4">
                  <TextField
                    onChange={(e) => setCategory(+e.target.value)}
                    select
                    label="Product Category"
                    size="large"
                    fullWidth
                    value={category_id}
                    className="shadow-input"
                  >
                    {categories.map((option, index) => (
                      <MenuItem key={index} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    onChange={(e) => setType(+e.target.value)}
                    select
                    label="Product Type"
                    size="large"
                    fullWidth
                    value={type}
                    className="shadow-input"
                  >
                    <MenuItem value={1}>Finished Goods</MenuItem>
                    <MenuItem value={2}>Raw Materials</MenuItem>
                    <MenuItem value={3}>Accessories</MenuItem>
                    <MenuItem value={4}>Services</MenuItem>
                  </TextField>
                </div>
                <div className="col-md-6 mt-4">
                  <TextField
                    onChange={(e) => setStatus(+e.target.value)}
                    select
                    label="Status"
                    size="large"
                    fullWidth
                    value={status}
                    className="shadow-input"
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                  </TextField>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mt-4">
                  <TextField
                    onChange={(e) => setUnit(e.target.value)}
                    select
                    label="Unit Type"
                    size="large"
                    value={unit_type}
                    fullWidth
                    className="shadow-input"
                  >
                    <MenuItem value="PCS">PCS</MenuItem>
                    <MenuItem value="KG">KG</MenuItem>
                    <MenuItem value="CFT">CFT</MenuItem>
                    <MenuItem value="SET">SET</MenuItem>
                  </TextField>
                </div>
                <div className="col-md-6 mt-4">
                  <TextField
                    label="Origin"
                    variant="outlined"
                    size="large"
                    fullWidth
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                    }}
                    className="shadow-input"
                  />
                </div>
              </div>

              <hr className="mt-4" />
              <div className="row">
                <div className="col-md-6 mt-2">
                  <Multiselect
                    placeholder="Search HS Code"
                    cursor="pointer"
                    displayValue="code"
                    // onRemove={removeColumn}
                    onSelect={addColumn}
                    options={codes}
                    onSearch={(e) => {
                      searchCode(e);
                    }}
                    ref={multiselectRef}
                    hideSelectedList
                    emptyRecordMsg="Search By Raw Material Name/Sku/Model/HS Code"
                    className="shadow-input"
                    style={{
                      multiselectContainer: {
                        height: "58px",
                      },
                      searchBox: {
                        minHeight: "58px",
                      },
                      inputField: {
                        margin: "10px",
                        width: "90%"
                      },
                    }}
                  />
                </div>
                <div className="col-md-6 mt-2">
                  <Button
                    style={{ width: "25px" }}
                    size="large"
                    color="secondary"
                    variant="contained"
                    onClick={resetSelectField}
                  >
                    <RotateLeftIcon />
                  </Button>
                </div>
              </div>

              <div className="row">
                {hs_code && (
                  <>
                    <div className="col-md-6 mt-4">
                      <TextField
                        label="HS Code"
                        variant="outlined"
                        size="large"
                        fullWidth
                        className="shadow-input"
                        value={hs_code}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                    <div className="col-md-6 mt-4">
                      <TextField
                        label="HS Code Name"
                        variant="outlined"
                        size="large"
                        fullWidth
                        className="shadow-input"
                        value={hsTitle}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              {hs_code && (
                <>
                  <div className="row">
                    <div className="col-md-6 mt-4">
                      <TextField
                        label="CD"
                        variant="outlined"
                        size="large"
                        fullWidth
                        value={cd}
                        type="number"
                        // onChange={(e) => {
                        //   setCd(e.target.value);
                        // }}
                        InputProps={{
                          readOnly: true,
                        }}
                        className="shadow-input"
                      />
                    </div>
                    <div className="col-md-6 mt-4">
                      <TextField
                        label="RD"
                        variant="outlined"
                        size="large"
                        fullWidth
                        value={rd}
                        type="number"
                        // onChange={(e) => {
                        //   setRd(e.target.value);
                        // }}
                        InputProps={{
                          readOnly: true,
                        }}
                        className="shadow-input"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mt-4">
                      <TextField
                        label="SD"
                        variant="outlined"
                        size="large"
                        fullWidth
                        type="number"
                        value={sd}
                        // onChange={(e) => {
                        //   setSd(e.target.value);
                        // }}
                        InputProps={{
                          readOnly: true,
                        }}
                        className="shadow-input"
                      />
                    </div>
                    <div className="col-md-6 mt-4">
                      <div className="col-md-12">
                        <TextField
                          onChange={(e) => setVatRate(e.target.value)}
                          label="Vat Rate"
                          size="large"
                          fullWidth
                          value={vat_rate}
                          InputProps={{
                            readOnly: true,
                          }}
                          className="shadow-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mt-4">
                      <TextField
                        label="AT"
                        variant="outlined"
                        size="large"
                        fullWidth
                        type="number"
                        value={at}
                        // onChange={(e) => {
                        //   setAt(e.target.value);
                        // }}
                        InputProps={{
                          readOnly: true,
                        }}
                        className="shadow-input"
                      />
                    </div>
                    <div className="col-md-6 mt-4">
                      <TextField
                        label="AIT"
                        variant="outlined"
                        size="large"
                        fullWidth
                        type="number"
                        value={ait}
                        // onChange={(e) => {
                        //   setAit(e.target.value);
                        // }}
                        InputProps={{
                          readOnly: true,
                        }}
                        className="shadow-input"
                      />
                    </div>
                  </div>
                </>
              )}

              <hr className="mt-4" />

              <div className="row mt-4">
                <div className="col-md-12">
                  <TextField
                    label="Short Description"
                    variant="outlined"
                    size="large"
                    fullWidth
                    value={details || ""}
                    multiline
                    rows={4}
                    onChange={(e) => {
                      setDetails(e.target.value);
                    }}
                    className="shadow-input"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-md-4">
              <div className="row mt-4">
                <div className="col-md-12">
                  <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    fullWidth
                    size="large"
                  >
                    Add Image
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={onChange}
                    />
                  </Button>
                  {/* <h6 className="text-secondary">Input Image</h6> */}

                  {/* <input className="form-control" onChange={onChange} type="file" /> */}
                  {photo ? (
                    <img className="form-control mt-3" src={photo} />
                  ) : (
                    <>
                      {thumbnail ? (
                        <img
                          className="form-control mt-3"
                          src={thumbnail}
                          alt="Path not found!"
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control input mt-3"
                          placeholder="Please upload a Image."
                          disabled
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12">
                  <TextField
                    label="Price"
                    variant="outlined"
                    size="large"
                    fullWidth
                    value={price}
                    type="number"
                    onChange={(e) => {
                      setPrice(+e.target.value);
                    }}
                    className="shadow-input"
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12">
                  <TextField
                    label="Sales Vat Rate"
                    variant="outlined"
                    select
                    size="large"
                    fullWidth
                    type="number"
                    onChange={(e) => {
                      setSalesVatRate(+e.target.value);
                    }}
                    className="shadow-input"
                    value={sales_vat_rate}
                  >
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={5}>5%</MenuItem>
                    <MenuItem value={7.5}>7.5%</MenuItem>
                    <MenuItem value={10}>10%</MenuItem>
                    <MenuItem value={15}>15%</MenuItem>
                  </TextField>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12 ms-1">
                  <FormControlLabel
                    label="VAT Rebatable"
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => {
                          setChecked(e.target.checked);
                        }}
                      />
                    }
                  />
                </div>
              </div>
              {checked && (
                <div className="row mt-4">
                  <div className="col-md-12">
                    <TextField
                      label="VAT Rebatable Percentage"
                      variant="outlined"
                      size="large"
                      fullWidth
                      value={vat_rebatable_percentage}
                      type="number"
                      onChange={(e) => {
                        setRebatable(+e.target.value);
                      }}
                      className="shadow-input"
                    />
                  </div>
                </div>
              )}
              <div className="row mt-4">
                <div className="col-md-12">
                  <TextField
                    label="VDS Percentage"
                    variant="outlined"
                    size="large"
                    fullWidth
                    value={vds_percentage}
                    type="number"
                    onChange={(e) => {
                      setVds(+e.target.value);
                    }}
                    className="shadow-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="row mt-4">
            <div className="col-md-12">
              <Button
                variant="contained"
                size="large"
                color="error"
                onClick={goBack}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                size="large"
                color="success"
                className="float-end"
                onClick={submit}
              >
                Update
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

UpdateProduct.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UpdateProduct);
