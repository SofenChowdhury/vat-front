import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../../pages/theme";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// bootstarp
import Form from "react-bootstrap/Form";
import {
  Typography,
  useTheme,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

// Date
import { DatePicker } from "antd";

// Icons
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

const CreateBom = ({ token }) => {
  // THEME
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // VARIABLE FOR POST
  const [product_id, setProductId] = useState(0);
  const [status, setStatus] = useState(true);
  const [bomItems, setBomItems] = useState([]);
  const [bomServices, setBomServices] = useState([]);

  // HELPER VARIABLES
  const [rawMaterials, setRawMaterials] = useState([]);
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [settings, setSettings] = useState([]);
  const [difference, setDifference] = useState(0);
  const [price, setPrice] = useState(0);
  const [title, setTitle] = useState("");
  const [timer, setTimer] = useState(null);

  // REFERENCES
  const multiselectRef = useRef();
  const multiselectRefGoods = useRef();
  const multiselectRefServices = useRef(null);

  // BOOLEANS
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);

  // DATE
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  // FETCH FINISHED GOOD BY SKU
  const searchFinishedGoods = async (e) => {
    setLoader(true);
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setFinishedGoods([]);
      } else {
        setFinishedGoods([]);
        const apiProduct =
          BASE_URL + "api/v1/product-search?type=1&keyword=" + e;
        axios
          .get(apiProduct, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.status == true) {
              if (res.data.data != null) {
                setFinishedGoods(res.data.data);
                setLoader(false);
              } else {
                setFinishedGoods([]);
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

  // FETCH RAW MATERIALS BY SKU
  const searchRawMaterials = async (e) => {
    setLoader(true);

    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (e == "") {
        setRawMaterials([]);
      } else {
        setRawMaterials([]);
        const apiProduct =
          BASE_URL + "api/v1/product-search?type=2&keyword=" + e;
        axios
          .get(apiProduct, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.status == true) {
              if (res.data.data != null) {
                res.data.data.map((product) => {
                  product.actual_qty = 1;
                  product.qty_with_wastage = 1;
                  product.unit = "PCS";
                });
                setRawMaterials(res.data.data);
                setLoader(false);
              } else {
                setRawMaterials([]);
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

  // FETCH Services BY SKU
  // const searchServices = async (e) => {
  //   setLoader(true);
  //   if (e == "") {
  //     setServices([]);
  //   } else {
  //     setServices([]);
  //     const apiProduct = BASE_URL + "api/v1/products/search/" + e;
  //     axios
  //       .get(apiProduct, {
  //         headers: { Authorization: "Bearer " + token },
  //       })
  //       .then((res) => {
  //         if (res.data.status == true) {
  //           if (res.data.data != null) {
  //             res.data.data.map((product) => {
  //               if (product.type == 4) {
  //                 setServices((rawMaterials) => [...rawMaterials, product]);
  //               }
  //             });
  //             setLoader(false);
  //           } else {
  //             setServices([]);
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // };

  // FETCH ALL Services

  useEffect(() => {
    const apiServices = BASE_URL + "api/v1/products/services";

    axios
      .get(apiServices, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setServices(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Multiselect functions
  const addColumn = (list, item) => {
    setSelectedProducts((selectedProducts) => [...selectedProducts, item]);
    const picked = (({ id, actual_qty, qty_with_wastage, unit, price }) => ({
      id,
      actual_qty,
      qty_with_wastage,
      unit,
      price,
    }))(item);
    setBomItems((bomItems) => [...bomItems, picked]);
    setRawMaterials([]);
  };
  const resetSelectField = () => {
    multiselectRef.current.resetSelectedValues();
    setRawMaterials([]);
    setLoader(false);
  };

  // Multiselect Functions 2
  const addProduct = (list, item) => {
    setProductId(item.id);
    setPrice(item.price);
    setTitle(item.title);
    setFinishedGoods([]);
    alert("Finished Good Selected");
  };
  const resetSelectFieldGoods = () => {
    multiselectRefGoods.current.resetSelectedValues();
    setFinishedGoods([]);
    setLoader(false);
  };

  // Multiselect functions 3
  const addService = (list, item) => {
    setSelectedServices((selectedProducts) => [...selectedProducts, item]);
    const picked = (({ id, price }) => ({
      id,
      price,
    }))(item);
    setBomServices((bomServices) => [...bomServices, picked]);
    // setServices([]);
  };
  const resetSelectFieldServices = () => {
    multiselectRefServices.current.resetSelectedValues();
    // setServices([]);
    setLoader(false);
  };

  // Custom remove
  const remove = (item) => {
    setSelectedProducts(selectedProducts.filter((i) => i !== item));
    setBomItems(bomItems.filter((i) => i.id !== item.id));
    resetSelectField();
  };
  const removeService = (item) => {
    setSelectedServices(selectedServices.filter((i) => i !== item));
    setBomServices(bomServices.filter((i) => i.id !== item.id));
    resetSelectFieldServices();
  };

  // Clear all
  const clearAllProducts = () => {
    setSelectedProducts([]);
    setBomItems([]);
    resetSelectField();
  };

  // Update dynamic fields
  const updateQty = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, actual_qty: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
    const newState2 = bomItems.map((product) => {
      if (product.id === id) {
        return { ...product, actual_qty: +e };
      }
      return product;
    });
    setBomItems(newState2);
  };
  const updateQtyWastage = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, qty_with_wastage: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
    const newState2 = bomItems.map((product) => {
      if (product.id === id) {
        return { ...product, qty_with_wastage: +e };
      }
      return product;
    });
    setBomItems(newState2);
  };
  const updatePrice = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, price: +e };
      }
      return product;
    });
    setSelectedProducts(newState);
    const newState2 = bomItems.map((product) => {
      if (product.id === id) {
        return { ...product, price: +e };
      }
      return product;
    });
    setBomItems(newState2);
  };
  const updateUnit = (e, id) => {
    const newState = selectedProducts.map((product) => {
      if (product.id === id) {
        return { ...product, unit: e };
      }
      return product;
    });
    setSelectedProducts(newState);
    const newState2 = bomItems.map((product) => {
      if (product.id === id) {
        return { ...product, unit: e };
      }
      return product;
    });
    setBomItems(newState2);
  };
  const updateSettingsPrice = (e, id) => {
    const newState = settings.map((item) => {
      if (item.id === id) {
        return { ...item, price: +e };
      }
      return item;
    });
    setSettings(newState);
  };
  const updatePriceService = (e, id) => {
    const newState = selectedServices.map((product) => {
      if (product.id === id) {
        return { ...product, price: +e };
      }
      return product;
    });
    setSelectedServices(newState);
    const newState2 = bomServices.map((product) => {
      if (product.id === id) {
        return { ...product, price: +e };
      }
      return product;
    });
    setBomServices(newState2);
  };

  // Date function
  function onChangeStart(date, dateString) {
    setStartDate(dateString);
  }
  function onChangeEnd(date, dateString) {
    setEndDate(dateString);
  }

  // Calculate Functions
  const calculate = () => {
    let total = 0;
    bomItems?.map((item) => {
      total += item.price;
    });
    return total.toFixed(2);
  };
  const calculateServices = () => {
    let total = 0;
    bomServices?.map((item) => {
      total += item.price;
    });
    return total.toFixed(2);
  };

  const calculateSettings = () => {
    let total = 0;
    settings.map((item) => {
      total += item.price;
    });
    return total.toFixed(2);
  };

  // total raw materials
  const totalPrice = () => {
    let total = 0;
    selectedProducts.map((item) => {
      total += item.price;
    });
    return total.toFixed(2);
  };
  const totalQty = () => {
    let total = 0;
    selectedProducts.map((item) => {
      total += item.actual_qty;
    });
    return total.toFixed(2);
  };
  const totalWastage = () => {
    let total = 0;
    selectedProducts.map((item) => {
      total += item.qty_with_wastage;
    });
    return total.toFixed(2);
  };

  //total services
  const totalPriceServices = () => {
    let total = 0;
    selectedServices.map((item) => {
      total += item.price;
    });
    return total.toFixed(2);
  };

  const generate = () => {
    setShow(true);
    let diff = price - (+calculate() + +calculateServices());
    setDifference(price - (+calculate() + +calculateServices()));
    getSettings(diff);
  };

  const getSettings = async (difference) => {
    const apiUrl = BASE_URL + "api/v1/value-additions";
    await axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          res.data.data?.map((item) => {
            item.price = +((difference / 100) * +item.percentage).toFixed(2);
          });
          setSettings(res.data.data);
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //calculate percentage
  const getPercentage = () => {
    return (calculateSettings() / price) * 100;
  };

  // Post Function
  const submit = () => {
    if (product_id == 0) {
      alert("Please select a Finished Good!");
    } else if (start_date == "" || end_date == "") {
      alert("Please Enter all the Dates!");
    } else if (bomItems.length == 0) {
      alert("Please enter Raw Materials!");
    } else {
      const valueAdditions = settings?.map(({ id, price }) => {
        return { id: id, amount: price };
      });

      let tempStatus = 0;
      if (status) {
        tempStatus = 1;
      }
      const bomData = {
        product_id,
        status: tempStatus,
        start_date,
        end_date,
        price,
        bomItems,
        bomServices,
        valueAdditions,
      };

      console.log(bomData);
      const apiBom = BASE_URL + "api/v1/boms/create";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(apiBom, bomData, config)
        .then((response) => {
          if (response.data.status) {
            alert("Bom Created!");
            console.log(response.data);
            Router.push({
              pathname: "/bom/bomList",
            });
          } else {
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
      <div>
        <Typography variant="h4" className="mb-4" color={colors.primary[300]}>
          Bill of Materials Information
        </Typography>
      </div>
      <div className="p-4">
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <h6 className="text-secondary">Search Finished Good:</h6>
            </div>
            <div className="row">
              <div className="col-md-10 mt-2">
                <Multiselect
                  placeholder="Type Here. . ."
                  cursor="pointer"
                  displayValue="title"
                  // onRemove={removeColumn}
                  onSelect={addProduct}
                  options={finishedGoods}
                  onSearch={(e) => {
                    searchFinishedGoods(e);
                  }}
                  ref={multiselectRefGoods}
                  hideSelectedList
                  emptyRecordMsg="Search By Product Name/Sku/Model/HS Code"
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
              <div className="col-md-2 mt-2">
                <Button
                  style={{ width: "100%", height: "58px" }}
                  size="large"
                  color="secondary"
                  variant="contained"
                  onClick={resetSelectFieldGoods}
                >
                  <RotateLeftIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {title && (
          <>
            <div className="row mt-5">
              <div className="col-md-8 mt-3">
                <TextField
                  label="Selected Finished Good"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={title}
                  InputProps={{
                    readOnly: true,
                  }}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-3">
                <TextField
                  label="Declare Price"
                  variant="outlined"
                  size="large"
                  type="text"
                  fullWidth
                  value={price || ""}
                  onChange={(e) => {
                    setPrice(+e.target.value);
                  }}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mt-4">
                <DatePicker
                  onChange={onChangeStart}
                  size="large"
                  className="shadow-input"
                  placeholder="Start Date"
                  style={{ width: "100%", height: "58px" }}
                />
              </div>
              <div className="col-md-4 mt-4">
                <DatePicker
                  onChange={onChangeEnd}
                  size="large"
                  className="shadow-input"
                  placeholder="End Date"
                  style={{ width: "100%", height: "58px" }}
                />
              </div>
              <div className="col-md-2 mt-4">
                <FormControlLabel
                  checked={status}
                  control={<Checkbox />}
                  label={status ? "Active" : "Inactive"}
                  onChange={(e) => {
                    setStatus(e.target.checked);
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

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

      {/* ==== RAW MATERIALS SECTION ==== */}

      <div>
        <div className="row mt-4">
          <div className="col-md-10">
            <Typography
              variant="h4"
              className="mb-4"
              color={colors.primary[300]}
            >
              Raw Materials
            </Typography>
          </div>
        </div>
      </div>
      <div className="mb-5 p-4">
        <div className="row">
          <h6 className="text-secondary">Search Raw Materials:</h6>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-10 mt-2">
                <Multiselect
                  placeholder="Type Here. . ."
                  cursor="pointer"
                  displayValue="title"
                  // onRemove={removeColumn}
                  onSelect={addColumn}
                  options={rawMaterials}
                  onSearch={(e) => {
                    searchRawMaterials(e);
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
              <div className="col-md-2 mt-2">
                <Button
                  style={{ width: "100%", height: "58px" }}
                  size="large"
                  color="secondary"
                  variant="contained"
                  onClick={resetSelectField}
                >
                  <RotateLeftIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {bomItems.length ? (
        <>
          <div className="row p-4">
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead>
                  <tr className="table-success">
                    <th scope="col">SL</th>
                    <th scope="col">Item Name</th>
                    <th scope="col">Actual Quantity</th>
                    <th scope="col">Quantity With Wastage</th>
                    <th scope="col">Price</th>
                    <th scope="col">UOM</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product, index) => (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{product.title}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control large-field"
                            value={product.actual_qty || ""}
                            onChange={(e) => {
                              updateQty(e.target.value, product.id);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control large-field"
                            value={product.qty_with_wastage || ""}
                            onChange={(e) => {
                              updateQtyWastage(e.target.value, product.id);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control large-field"
                            value={product.price || ""}
                            onChange={(e) => {
                              updatePrice(e.target.value, product.id);
                            }}
                          />
                        </td>
                        <td>
                          <Form.Select
                            onChange={(e) => {
                              updateUnit(e.target.value, product.id);
                            }}
                          >
                            <option value={"PCS"}>PCS</option>
                            <option value={"KG"}>KG</option>
                            <option value={"LTR"}>LTR</option>
                            <option value={"CFT"}>CFT</option>
                            <option value={"SET"}>SET</option>
                            <option value={"UNIT"}>UNIT</option>
                            <option value={"NOS"}>NOS</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Link
                            href="#"
                            className="anchor2"
                            onClick={() => {
                              remove(product);
                            }}
                          >
                            <Button
                              variant="contained"
                              size="large"
                              color="error"
                            >
                              remove
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <th colSpan={2} className="text-end">
                      TOTAL
                    </th>
                    <td>{totalQty()}</td>
                    <td>{totalWastage()}</td>
                    <td>{totalPrice()}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <></>
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

      {/* ==== SERVICES SECTION ==== */}

      <div className="">
        <div className="row mt-4">
          <div className="col-md-10">
            <Typography
              variant="h4"
              className="mb-4"
              color={colors.primary[300]}
            >
              Services
            </Typography>
          </div>
        </div>
      </div>
      <div className="mb-5 p-4">
        <div className="row">
          <h6 className="text-secondary">Search Services:</h6>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-10 mt-2">
                <Multiselect
                  placeholder="Type Here. . ."
                  cursor="pointer"
                  displayValue="title"
                  // onRemove={removeColumn}
                  onSelect={addService}
                  options={services}
                  // onSearch={(e) => {
                  //   searchServices(e);
                  // }}
                  ref={multiselectRefServices}
                  hideSelectedList
                  emptyRecordMsg="Select Services"
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
              {/* <div className="col-md-2 mt-2">
                <Button
                  style={{ width: "100%" }}
                  size="large"
                  color="secondary"
                  variant="contained"
                  onClick={resetSelectFieldServices}
                >
                  <RotateLeftIcon />
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {bomServices.length ? (
        <>
          <div className="row p-4">
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead>
                  <tr className="table-success">
                    <th scope="col">SL</th>
                    <th scope="col">Service Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedServices.map((product, index) => (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{product.title}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control large-field"
                            value={product.price || ""}
                            onChange={(e) => {
                              updatePriceService(e.target.value, product.id);
                            }}
                          />
                        </td>
                        <td>
                          <Link
                            href="#"
                            className="anchor2"
                            onClick={() => {
                              removeService(product);
                            }}
                          >
                            <Button
                              variant="contained"
                              size="large"
                              color="error"
                            >
                              remove
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <th colSpan={2} className="text-end">
                      TOTAL
                    </th>
                    <td>{totalPriceServices()}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <></>
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

      {/* ==== VALUE ADDITION SECTION ==== */}

      <div className="row mt-4">
        <div className="col-md-6">
          <Typography variant="h4" color={colors.primary[300]}>
            Value Additions
          </Typography>
        </div>
        <div className="col-md-6">
          <Button className="float-end" variant="contained" onClick={generate}>
            Generate
          </Button>
        </div>
        {show && (
          <>
            <div className="table-responsive mt-3 p-5">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr className="table-success">
                    <th colSpan={3} className="text-center">
                      Details of Value Addition
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center">
                      Particulars of Value Addition
                    </th>
                    <th className="text-center">Tentative Percentage</th>
                    <th className="text-center">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {settings?.map((setting, index) => (
                    <tr key={index}>
                      <td>{setting.head}</td>
                      <td>{setting.percentage} %</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={setting.price || ""}
                          onChange={(e) => {
                            updateSettingsPrice(e.target.value, setting.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th className="text-end" colSpan={2}>
                      Total
                    </th>
                    <td>
                      {calculateSettings()}
                      {calculateSettings() == difference.toFixed(2) ? (
                        <span className="text-secondary">
                          {" "}
                          <b>
                            ({getPercentage().toFixed(2)}% of Declared Price)
                          </b>
                        </span>
                      ) : (
                        <span className="text-danger">
                          {" "}
                          <b>(Does not match with required Total)</b>
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-end" colSpan={2}>
                      Required Total
                    </th>
                    <td>{difference.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Button
                  variant="contained"
                  color="success"
                  onClick={submit}
                  className="float-end"
                  size="large"
                >
                  Create BOM
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateBom);
