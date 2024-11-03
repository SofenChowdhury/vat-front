import React, { useState, useRef } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// bootstarp
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  MenuItem,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Icons
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

const CreateProduct = ({ token }) => {
  // VARIABLES FOR POST
  const [title, setTitle] = useState("");
  const [cd, setCd] = useState(null);
  const [rd, setRd] = useState(null);
  const [sd, setSd] = useState(null);
  const [at, setAt] = useState(null);
  const [ait, setAit] = useState(null);
  const [vat_rate, setVatRate] = useState(null);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [model, setModel] = useState("");
  const [sku, setSku] = useState("");
  const [category_id, setCategory] = useState(null);
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState("");
  const [unit_type, setUnitType] = useState(null);
  const [origin, setOrigin] = useState("");
  const [hs_code, setHsCode] = useState("");
  const [hs_code_id, setHsCodeId] = useState("");
  const [vds_percentage, setVdsPercentage] = useState(0);
  const [vat_rebatable_percentage, setRebatable] = useState(0);
  const [sales_vat_rate, setSalesVatRate] = useState(0);

  // HELPER VARIABLES
  const [formErrors, setFormErrors] = useState("");
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState(false);
  const [timer, setTimer] = useState(null);
  const [codes, setCodes] = useState([]);
  const [hsTitle, setHsTitle] = useState("");

  // REFERENCES
  const multiselectRef = useRef();

  // FETCH CATEGORY
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

  const submit = () => {
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
    };
    console.log(productData);
    const apiProduct = BASE_URL + "api/v1/products/create";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (photo == "") {
      alert("Please select an Image!");
    } else {
      axios
        .post(apiProduct, productData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Product Information Created!");
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
            setFormErrors(Object.values(response.data.errors));
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/products/finishedGoodList",
    });
  };

  console.log(sales_vat_rate);

  return (
    <>
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
                value={category_id || ""}
                className="shadow-input"
              >
                {categories?.map((option, index) => (
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
                value={type || ""}
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
                value={status == null ? "" : status}
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
                onChange={(e) => setUnitType(e.target.value)}
                select
                label="Unit Type"
                size="large"
                fullWidth
                value={unit_type || ""}
                className="shadow-input"
              >
                <MenuItem value="NOS">NOS</MenuItem>
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
                onChange={(e) => {
                  setOrigin(e.target.value);
                }}
                className="shadow-input"
              />
            </div>
          </div>

          <hr className="mt-4" />

          <div className="row">
            <div className="col-md-5 mt-2 pe-3">
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
            <div className="col-md-1 mt-2">
              <Button
                style={{ width: "25px" }}
                size="large"
                color="secondary"
                variant="contained"
                onClick={resetSelectField}
                className="float-end"
              >
                <RotateLeftIcon />
              </Button>
            </div>
            {hs_code && (
              <div className="col-md-6 mt-2">
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
                <input
                  type="text"
                  className="form-control input mt-3"
                  placeholder="Please upload a Image."
                  disabled
                />
              )}
            </div>
          </div>
          <hr className="mt-4" />
          <div className="row mt-4">
            <div className="col-md-12">
              <TextField
                label="Price"
                variant="outlined"
                size="large"
                fullWidth
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
                type="number"
                onChange={(e) => {
                  setVdsPercentage(+e.target.value);
                }}
                className="shadow-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="row mt-5">
        <div className="col-md-12">
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className="float-end"
            onClick={submit}
            style={{ width: "100%" }}
          >
            Create Product
          </Button>
          {/* <Button
            variant="contained"
            size="large"
            color="error"
            className="float-end me-3"
            onClick={goBack}
          >
            Cancel
          </Button> */}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateProduct);
