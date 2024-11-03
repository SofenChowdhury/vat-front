import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// bootstarp
import Multiselect from "multiselect-react-dropdown";
import {
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

// Date
import { DatePicker } from "antd";

const CreateContractualMaterial = ({ token, userBranch }) => {
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

  // BOOLEANS
  const [isVendor, setIsVendor] = useState(false);

  // REFERENCES
  const multiselectRef = useRef();
  const multiselectRefVendor = useRef();

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

  // Submit
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
      let type = "Contractual";


      const purchaseItems = selectedProducts.map((item) => {

        return {
          item_id: item.id,
          hs_code_id: item.hscode?.id,
          price: 0,
          qty: item.qty,
          cd: 0,
          rd: 0,
          sd: 0,
          vat_rate: 0,
          vat_amount: 0,
          at: 0,
          ait: 0,
          tti: 0,
          vds_receive_amount: 0,
          vat_rebetable_amount: 0,
        };
      });

      let data = {
        vendor_id,
        stock_branch,
        type,
        challan_no,
        challan_date,
        purchaseItems,
        posting_date,
      };
      console.log(data);

      axios
        .post(`${BASE_URL}api/v1/purchases/create`, data, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          if (response.data.status) {
            alert("Contractual Purchase Created");
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

  return (
    <>
      <h6 className="mt-5 text-secondary">General Information</h6>
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
      </div>
      {selectedProducts.length > 0 && (
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
                      <th>QTY</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts?.map((product, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td style={{ whiteSpace: "nowrap" }}>{product.sku}</td>
                        <td>{product.title}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={product.qty == 0 ? "" : product.qty}
                            onChange={(e) => {
                              updateQty(e.target.value, product.id);
                            }}
                            style={{ width: "165px" }}
                          />
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
    userBranch: state.auth.user.branch_id,
  };
};

export default connect(mapStateToProps)(CreateContractualMaterial);
