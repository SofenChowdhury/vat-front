import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// bootstarp
import Form from "react-bootstrap/Form";
import Multiselect from "multiselect-react-dropdown";
import {
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

// Date
import { DatePicker } from "antd";

const CreateGtImported = ({ token, userBranch }) => {
  // VARIABLE FOR POST
  const [challan_no, setChallanNo] = useState("");
  const [challan_date, setChallanDate] = useState("");
  const [posting_date, setPostingDate] = useState("");
  const [vendor_id, setVendorId] = useState(null);
  const [stock_branch, setBranchId] = useState(0);

  // HELPER VARIABLES
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [dataVendor, setDataVendor] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [timer, setTimer] = useState(null);
  const [bulkText, setBulkText] = useState(null);

  // BOOLEANS
  const [loader, setLoader] = useState(false);
  const [loaderSumbit, setLoaderSumbit] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [bulkSelect, setBulkSelect] = useState(false);

  // REFERENCES
  const multiselectRef = useRef();
  const multiselectRefVendor = useRef();

  // STATIC
  const vatTypes = [
    {
      id: 0,
      name: "0%",
    },
    {
      id: 5,
      name: "5%",
    },
    {
      id: 7.5,
      name: "7.5%",
    },
    {
      id: 10,
      name: "10%",
    },
    {
      id: 15,
      name: "15%",
    },
  ];

  // For loading to disappear
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 5000);
  });

  // Fetch Branches
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

  // FETCH PRODUCT BY SEARCH
  const searchProduct = async (e) => {
    setLoader(true);
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setProducts([]);
      } else {
        setProducts([]);
        const apiProducts = BASE_URL + "api/v1/product-search?&keyword=" + e;
        axios
          .get(apiProducts, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status) {
              res.data.data.map((product) => {
                product.qty = 0;
                product.price = 0;

                // rates
                product.vat = product.hscode?.vat || 0;
                product.sd = product.hscode?.sd || 0;

                // Rebatable
                if (product.vat_rebatable_percentage > 0) {
                  product.isRebatable = true;
                } else {
                  product.isRebatable = false;
                }
              });
              setProducts(res.data.data);
              setLoader(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
  };

  // Multiselect functions
  const addColumn = (list, item) => {
    setSelectedProducts((selectedProducts) => [...selectedProducts, item]);
    setProducts([]);
  };
  const resetSelectField = () => {
    multiselectRef.current.resetSelectedValues();
    setProducts([]);
    setLoader(false);
  };

  // Custom remove
  const remove = (item) => {
    setSelectedProducts(selectedProducts.filter((i) => i !== item));
    resetSelectField();
  };

  // Clear all
  const clearAllProducts = () => {
    setSelectedProducts([]);
    resetSelectField();
    setLoader(false);
  };

  // Update dynamic fields
  const updateQty = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, qty: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updatePrice = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, price: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateVatRate = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, vat: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateSD = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, sd: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateRebatable = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, isRebatable: e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };
  const updateRebatablePercentage = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, vat_rebatable_percentage: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
  };

  // calculate total
  const calculate = () => {
    let total = 0;
    selectedProducts?.map((product) => {
      total += product.price;
    });
    return total;
  };
  const calculateProductTax = (id) => {
    let productTax = 0;
    selectedProducts.map((item) => {
      if (item.id === id) {
        const sd = +((item.price / 100) * +item.sd).toFixed(2);
        const vat = +(((item.price + sd) / 100) * +item.vat).toFixed(2);
        productTax = +(sd + vat).toFixed(2);
      }
    });
    return productTax.toFixed(2);
  };
  const calculateTotalTax = () => {
    let totalTax = 0;
    selectedProducts?.map((item) => {
      totalTax += +calculateProductTax(item.id);
    });
    return totalTax.toFixed(2);
  };
  const calculateProductVds = (id) => {
    let productVds = 0;
    selectedProducts.map((item) => {
      if (item.id === id) {
        const sd = +((item.price / 100) * +item.sd).toFixed(2);
        const vat = +(((item.price + sd) / 100) * +item.vat).toFixed(2);
        productVds = (vat / 100) * item.vds_percentage;
      }
    });
    return productVds.toFixed(2);
  };
  const calculateTotalVds = () => {
    let totalVds = 0;
    selectedProducts?.map((item) => {
      totalVds += +calculateProductVds(item.id);
    });
    return totalVds.toFixed(2);
  };
  const calculateProductVdr = (id) => {
    let productVdr = 0;
    selectedProducts.map((item) => {
      if (item.id === id) {
        const sd = +((item.price / 100) * +item.sd).toFixed(2);
        const vat = +(((item.price + sd) / 100) * +item.vat).toFixed(2);
        productVdr = (vat / 100) * item.vat_rebatable_percentage;
      }
    });
    return productVdr.toFixed(2);
  };
  const calculateTotalVdr = () => {
    let totalVdr = 0;
    selectedProducts?.map((item) => {
      if (item.isRebatable) {
        totalVdr += +calculateProductVdr(item.id);
      }
    });
    return totalVdr.toFixed(2);
  };

  // Date function
  function onChangeStart(date, dateString) {
    setChallanDate(dateString);
  }
  function onChangePosting(date, dateString) {
    setPostingDate(dateString);
  }

  //Vendor Method
  const addVendor = (list, item) => {
    setDataVendor(item);
    setIsVendor(true);
    setVendorId(item.id);
    setVendors();
  };
  const resetSelectFieldVendor = () => {
    multiselectRefVendor.current.resetSelectedValues();
    setDataVendor(null);
    setIsVendor(false);
    setVendors();
  };
  const searchVendors = (e) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setVendors([]);
      } else {
        setVendors([]);
        const apiVendors = BASE_URL + "api/v1/vendors/search?&keyword=" + e;
        axios
          .get(apiVendors, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            if (res.data.status) {
              setVendors(res.data.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 500);

    setTimer(newTimer);
  };

  // Bulk Text Handle
  const handleText = (e) => {
    setBulkText(e);
  };
  // const formatText = () => {
  //   const lines = bulkText.split("\n");

  //   const formattedData = lines.map((line) => {
  //     let [key, value] = line.split(/\t| /); // Split using either a tab or space as the separator
  //     if (!value) {
  //       // If value is empty after splitting, use the entire line as the key and set quantity to 0
  //       key = line;
  //       value = 0;
  //     }
  //     const quantity = parseInt(value);
  //     return { sku: key, qty: isNaN(quantity) ? 0 : quantity };
  //   });
  //   console.log(formattedData);
  //   setBulkSelect(false);
  //   searchProductSku(formattedData);
  // };

  const formatText = () => {
    const lines = bulkText.split("\n");

    const formattedData = lines.map((line) => {
      const [key, value, price] = line.split(/\t| /); // Split using either a tab or space as the separator
      const quantity = parseInt(value) || 0;
      const unitPrice = parseFloat(price) || 0;

      return { sku: key, qty: quantity, price: unitPrice };
    });

    // Filter out entries where both quantity and price are 0
    const filteredData = formattedData.filter(
      (entry) => entry.qty !== 0 || entry.price !== 0
    );

    // If SKU is present but quantity and price are 0, add the entry
    lines.forEach((line) => {
      const [key] = line.split(/\t| /);
      const existingEntry = filteredData.find((entry) => entry.sku === key);
      if (!existingEntry) {
        filteredData.push({ sku: key, qty: 0, price: 0 });
      }
    });

    // Now filteredData contains SKU, qty, and price for each line, with entries for missing quantities and prices
    console.log(filteredData);
    setBulkSelect(false);
    searchProductSku(filteredData);
  };

  // FETCH PRODUCT BY SKU
  const searchProductSku = async (data) => {
    const skus = data.map((data) => {
      return data.sku;
    });

    const searchData = {
      skus,
    };
    const apiProduct = BASE_URL + "api/v1/product-multi-search";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    await axios
      .post(apiProduct, searchData, config)
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          res.data.data.map((product) => {
            product.price = 0;
            product.qty = 0;

            // rates
            product.vat = product.hscode?.vat || 0;
            product.sd = product.hscode?.sd || 0;

            // Rebatable
            if (product.vat_rebatable_percentage > 0) {
              product.isRebatable = true;
            } else {
              product.isRebatable = false;
            }

            // Quantity
            data.map((item) => {
              // console.log(item.sku, product.sku);
              if (item.sku.toUpperCase() === product.sku.toUpperCase()) {
                product.qty = item.qty;
                product.price = item.price;
              }
            });

            addColumnBulk(product);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addColumnBulk = (item) => {
    setSelectedProducts((selectedProducts) => [...selectedProducts, item]);
  };

  // SUBMIT PURCHASE
  const onSubmit = () => {
    if (challan_no == "") {
      alert("Please Enter Challan No");
    } else if (challan_date == "") {
      alert("Please Enter Challan Date");
    }
    // else if (stock_branch == 0 && !userBranch) {
    //   alert("Please Select a Branch");
    // }
    else {
      let type = "Local";

      setLoaderSumbit(true);

      const purchaseItems = selectedProducts.map((item) => {
        const sd = +((item.price / 100) * +item.sd).toFixed(2);
        const vat = +(((item.price + sd) / 100) * +item.vat).toFixed(2);
        const tti = +(sd + vat);
        const vds_receive_amount = +calculateProductVds(item.id);

        let vat_rebetable_amount = 0;
        if (item.isRebatable)
          vat_rebetable_amount = +calculateProductVdr(item.id);

        return {
          item_id: item.id,
          hs_code_id: item.hscode?.id,
          price: item.price / item.qty,
          qty: item.qty,
          cd: null,
          rd: null,
          sd: sd,
          vat_rate: item.vat,
          vat_amount: vat,
          at: null,
          ait: null,
          tti: tti,
          vds_receive_amount,
          vat_rebetable_amount,
        };
      });

      let item = {
        vendor_id,
        stock_branch,
        type,
        challan_no,
        challan_date,
        purchaseItems,
        posting_date,
      };
      console.log(item);
      axios
        .post(`${BASE_URL}api/v1/purchases/create`, item, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          if (response.data.status) {
            alert("Goods Received");
            console.log(response.data);
            Router.push({
              pathname: "/purchases/purchaseList",
            });
          } else {
            // setFormErrors(Object.values(response.data.errors));
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
      pathname: "/purchases/purchaseList",
    });
  };

  return (
    <>
      {loaderSumbit ? (
        <CircularProgress />
      ) : (
        <>
          <h6 className="mt-5 text-secondary">GRN Information</h6>
          <div className="row">
            <div className="col-md-6 mt-4">
              <Multiselect
                placeholder="Search vendors here..."
                cursor="pointer"
                displayValue="name"
                // onRemove={removeColumn}
                onSelect={addVendor}
                options={vendors}
                onSearch={(e) => {
                  searchVendors(e);
                }}
                ref={multiselectRefVendor}
                hideSelectedList
                emptyRecordMsg="Search for Vendors with Name/Email"
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
                    width: "90%",
                  },
                }}
              />
            </div>
            {userBranch != 0 ? (
              <></>
            ) : (
              <div className="col-md-6 mt-4">
                <TextField
                  onChange={(e) => setBranchId(+e.target.value)}
                  select
                  label="Stock in Branch"
                  size="large"
                  fullWidth
                  value={stock_branch || ""}
                  className="shadow-input"
                >
                  {branches?.map((branch, index) => (
                    <MenuItem value={branch.id} key={index}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-md-4 mt-4">
              <TextField
                label="Challan No"
                variant="outlined"
                size="large"
                type="text"
                fullWidth
                onChange={(e) => {
                  setChallanNo(e.target.value);
                }}
                className="shadow-input"
              />
            </div>
            <div className="col-md-4 mt-4">
              <DatePicker
                onChange={onChangeStart}
                size="large"
                h
                className="shadow-input"
                placeholder="Challan Date"
                style={{ width: "100%", height: "58px" }}
              />
            </div>
            <div className="col-md-4 mt-4">
              <DatePicker
                onChange={onChangePosting}
                size="large"
                className="shadow-input"
                placeholder="Posting Date"
                style={{ width: "100%", height: "58px" }}
              />
            </div>
          </div>

          {isVendor && (
            <>
              <div
                className="mt-5"
                style={{
                  background: "rgb(230, 228, 228)",
                  marginLeft: "-20px",
                  marginRight: "-20px",
                }}
              >
                <br />
              </div>
              <div className="row">
                <div className="col-md-6 mt-3">
                  <h6 className="text-secondary">Vendor Information:</h6>
                </div>
                <div className="col-md-6 mt-3">
                  <Button
                    variant="outlined"
                    className="float-end"
                    color="error"
                    onClick={resetSelectFieldVendor}
                    size="large"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-4">
                  <TextField
                    label="Vendor Name"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    value={dataVendor.name}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-8 mt-4">
                  <TextField
                    label="Vendor Address"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    value={dataVendor.contact_address}
                    className="shadow-input"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-4">
                  <TextField
                    label="Contact Person"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    value={dataVendor.contact_person}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-4 mt-4">
                  <TextField
                    label="Vendor BIN"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    value={dataVendor.vendor_bin}
                    className="shadow-input"
                  />
                </div>
                <div className="col-md-4 mt-4">
                  <TextField
                    label="Vendor TIN"
                    variant="outlined"
                    size="large"
                    type="text"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    value={dataVendor.vendor_tin}
                    className="shadow-input"
                  />
                </div>
              </div>
            </>
          )}

          <div
            className="mt-5"
            style={{
              background: "rgb(230, 228, 228)",
              marginLeft: "-20px",
              marginRight: "-20px",
            }}
          >
            <br />
          </div>
          <h6 className="mt-4 text-secondary">Products</h6>
          <div className="row">
            <div className="col-md-4 mt-4">
              <Multiselect
                placeholder="Search products here..."
                cursor="pointer"
                displayValue="title"
                // onRemove={removeColumn}
                onSelect={addColumn}
                options={products}
                onSearch={(e) => {
                  searchProduct(e);
                }}
                ref={multiselectRef}
                hideSelectedList
                emptyRecordMsg="Search for Products with Name/Sku/Model"
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
                    width: "90%",
                  },
                }}
              />
            </div>
            <div className="col-md-1 mt-2">
              {loader && <CircularProgress color="success" />}
            </div>
            <div className="col-md-7 mt-2">
              <Button
                variant="outlined"
                className="float-end"
                onClick={(e) => setBulkSelect(true)}
                size="large"
              >
                Bulk Select
              </Button>
            </div>
          </div>

          {bulkSelect && (
            <>
              <div className="row mt-4">
                <div className="col-md-12 text-end">
                  <h6>{`Please follow the format: <SKU> <Qty> <Price>`}</h6>
                  <h6>{`Enter each product in a new line`}</h6>
                  <p>For example:</p>
                  <p>1898004817 10 500</p>
                  <p>LUBOCTANE 15 1000</p>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <TextField
                    type="text"
                    label="SKU"
                    size="large"
                    fullWidth
                    multiline
                    rows={4}
                    value={bulkText || ""}
                    className="shadow-input"
                    onChange={(e) => {
                      {
                        handleText(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12 mb-4">
                  <Button
                    color="secondary"
                    variant="contained"
                    className="float-end"
                    onClick={formatText}
                    size="large"
                  >
                    Import
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    className="float-end me-2"
                    onClick={(e) => {
                      setBulkSelect(false);
                    }}
                    size="large"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedProducts.length ? (
            <>
              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-10"></div>
                    <div className="col-md-2">
                      <Button
                        variant="contained"
                        color="error"
                        className="float-end mb-2"
                        onClick={clearAllProducts}
                        size="large"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr className="table-success">
                          <th>SL</th>
                          <th>SKU</th>
                          <th>ITEM NAME</th>
                          <th>VATABLE VALUE</th>
                          <th>QTY</th>
                          <th>SUB TOTAL</th>
                          <th>SD %</th>
                          <th>VAT %</th>
                          <th>TAX AMOUNT</th>
                          <th>VDS AMOUNT</th>
                          <th>REBATABLE</th>
                          <th style={{ whiteSpace: "nowrap" }}>REBATABLE %</th>
                          <th>ITEM TOTAL</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProducts?.map((product, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td style={{ whiteSpace: "nowrap" }}>
                              {product.sku}
                            </td>
                            <td>{product.title}</td>
                            <td style={{ width: "110px" }}>
                              <input
                                type="number"
                                className="form-control"
                                value={product.price == 0 ? "" : product.price}
                                onChange={(e) => {
                                  updatePrice(e?.target?.value, product?.id);
                                }}
                                style={{ width: "200px" }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={product.qty == 0 ? "" : product.qty}
                                onChange={(e) => {
                                  updateQty(e.target.value, product.id);
                                }}
                                style={{ width: "65px" }}
                              />
                            </td>
                            <td>{product.price.toFixed(2)}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={product?.sd}
                                onChange={(e) => {
                                  updateSD(e.target.value, product.id);
                                }}
                                style={{ width: "60px" }}
                              />
                            </td>
                            <td>
                              <Form.Select
                                className="large-field"
                                onChange={(e) =>
                                  updateVatRate(e?.target?.value, product?.id)
                                }
                                defaultValue={product.vat}
                              >
                                {vatTypes.map((vt) => (
                                  <option key={vt.id} value={vt.id}>
                                    {vt.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td>{calculateProductTax(product.id)}</td>
                            <td>{calculateProductVds(product.id)}</td>
                            <td>
                              <FormControlLabel
                                checked={product.isRebatable}
                                control={<Checkbox />}
                                onChange={(e) => {
                                  updateRebatable(e.target.checked, product.id);
                                }}
                              />
                            </td>
                            {product.isRebatable ? (
                              <td>
                                <Form.Select
                                  className="large-field"
                                  onChange={(e) => {
                                    updateRebatablePercentage(
                                      e.target.value,
                                      product.id
                                    );
                                  }}
                                  defaultValue={
                                    product.vat_rebatable_percentage
                                  }
                                >
                                  <option value={100}>100%</option>
                                  <option value={80}>80%</option>
                                  <option value={0}>0%</option>
                                </Form.Select>
                              </td>
                            ) : (
                              <td>N/A</td>
                            )}
                            <td>
                              {(
                                +calculateProductTax(product.id) +
                                +product.price
                              ).toFixed(2)}
                            </td>
                            <td>
                              <Button
                                variant="contained"
                                size="large"
                                color="error"
                                onClick={() => {
                                  remove(product);
                                }}
                              >
                                remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-5">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            colSpan={2}
                            className="text-center table-success"
                          >
                            Payment Summary
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">TOTAL ITEM </td>
                          <td className="text-end">{calculate().toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="text-center">TOTAL TAX </td>
                          <td className="text-end">{calculateTotalTax()}</td>
                        </tr>
                        <tr>
                          <td className="text-center">TOTAL VDS</td>
                          <td className="text-end">{calculateTotalVds()}</td>
                        </tr>
                        <tr>
                          <td className="text-center">TOTAL REBATABLE</td>
                          <td className="text-end">{calculateTotalVdr()}</td>
                        </tr>

                        <tr className="table-dark">
                          <td className="text-center">NET PAYABLE</td>
                          <td className="text-end">..</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          {selectedProducts.length && isVendor ? (
            <div className="row mt-5">
              <div className="col-md-12">
                <Button
                  variant="contained"
                  size="large"
                  color="success"
                  className="float-end"
                  onClick={onSubmit}
                >
                  SAVE
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  color="error"
                  className="float-end me-3"
                  onClick={goBack}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userBranch: state.auth.user.branch_id,
  };
};

export default connect(mapStateToProps)(CreateGtImported);
