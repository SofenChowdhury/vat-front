import React, { useState, useRef } from "react";

//theme
import { tokens } from "../theme";
import { Typography, useTheme, Button } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//redux imports
import { connect } from "react-redux";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//date
import { DatePicker } from "antd";
import moment from "moment";

//report
import jsPDF from "jspdf";
import "jspdf-autotable";

const BomReport = ({ token, company }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Post Variables
  const [product_id, setProductId] = useState(0);

  // Helper Variables
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [boms, setBoms] = useState([]);
  const [title, setTitle] = useState("");
  const [timer, setTimer] = useState(null);
  const [maxLengths, setMaxLengths] = useState([]);

  // REFERENCES
  const multiselectRefGoods = useRef();

  // SEARCH FINISHED GOOD
  const searchFinishedGoods = async (e) => {
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

  // Fetch Orders
  const generateBoms = () => {
    const apiBoms = BASE_URL + "api/v1/boms/history";

    const data = {
      product_id,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(apiBoms, data, config)
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setBoms(response.data.data);
          const newMaxLengths = response.data.data.map((bom) => {
            const maxLength = Math.max(
              bom.bom_value_additions.length,
              bom.services.length,
              bom.raw_materials.length
            );
            return maxLength;
          });
          setMaxLengths(newMaxLengths);
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Clear Search
  const clearSearch = () => {
    resetSelectFieldGoods();
    setTitle("");
    setProductId("");
    setBoms([]);
  };

  // Multiselect Functions
  const addProduct = (list, item) => {
    setProductId(item.id);
    setTitle(item.title);
    setFinishedGoods([]);
  };
  const resetSelectFieldGoods = () => {
    multiselectRefGoods.current.resetSelectedValues();
    setFinishedGoods([]);
  };

  //calculate Percentage
  const getPercentage = (index) => {
    let settingsAmount = 0;
    boms[index]?.bom_value_additions.map((addition) => {
      settingsAmount += +addition.amount;
    });
    return (settingsAmount / boms[index]?.price) * 100;
  };

  // Report Function
  const generatePdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(16);
    doc.text(company.name, 15, 10);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(company.contact_address, 15, 15);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Sales Report", 15, 25);
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`VAT Reg. No: ${company.company_bin}`, 15, 30);
    doc.setFontSize(9);
    doc.text(
      `Printing Date: ${moment(Date.now()).format("DD MMM, YYYY hh:mm a")}`,
      15,
      37
    );
    doc.text(
      `From Date: ${moment(start_date).format("DD MMM, YYYY")}`,
      100,
      37
    );
    doc.text(`To Date: ${moment(end_date).format("DD MMM, YYYY")}`, 185, 37);

    doc.autoTable({
      html: ".table",
      startY: 40,
      useCss: true,
    });

    doc.output("dataurlnewwindow");
  };

  // Calculate
  const getTotalRawMaterialsQty = (bom) => {
    let total = 0;
    bom.raw_materials?.map((rm) => {
      total += +rm.qty_with_wastage;
    });
    return total;
  };
  const getTotalRawMaterialsAmount = (bom) => {
    let total = 0;
    bom.raw_materials?.map((rm) => {
      total += +rm.price;
    });
    return total;
  };
  const getTotalServicesAmount = (bom) => {
    let total = 0;
    bom.services?.map((service) => {
      total += +service.price;
    });
    return total;
  };
  const getTotalAdditionsAmount = (bom) => {
    let total = 0;
    bom.bom_value_additions?.map((addition) => {
      total += +addition.amount;
    });
    return total;
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <Typography variant="h2" color={colors.greenAccent[300]}>
            4.3 Report
          </Typography>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mt-4">
          <Multiselect
            placeholder={title ? title : "Type Here. . ."}
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
      </div>

      <div className="row">
        <div className="col-md-12 mt-4">
          <Button
            variant="contained"
            color="error"
            onClick={clearSearch}
            size="large"
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={generateBoms}
            className="ms-2"
            size="large"
          >
            Search
          </Button>
        </div>
      </div>

      {boms.length > 0 && (
        <div className="custom-line-height">
          <div className="row">
            <div className="col-md-12 mt-5">
              <h5>{company.name}</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">{company.contact_address}</div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-1">BIN: {company.company_bin}</div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-3">
              <h6>
                Finished Good: {boms[0].finish_goods?.title} (
                {boms[0].finish_goods?.unit_type})
              </h6>
            </div>
          </div>
          {boms?.map((bom, index) => (
            <>
              <table className="table table-bordered mt-5">
                <thead>
                  <tr>
                    {index == 0 ? (
                      <th colSpan={7} className="text-center table-success">
                        According to Current 4.3
                      </th>
                    ) : (
                      <th colSpan={7} className="text-center table-warning">
                        According to Previous 4.3
                      </th>
                    )}
                  </tr>
                  <tr className="table-secondary">
                    <th className="text-end">Declared Price</th>
                    <th className="text-end">
                      {Intl.NumberFormat().format((+bom.price).toFixed(2))}
                    </th>
                    <th colSpan={5}></th>
                  </tr>
                  <tr className="table-secondary">
                    <th className="text-end">Addition Percentage</th>
                    <th className="text-end">
                      {getPercentage(index).toFixed(2)} %
                    </th>
                    <th colSpan={5}></th>
                  </tr>
                  <tr className="table-secondary">
                    <th className="text-end">Created At</th>
                    <th className="text-end">
                      {moment(bom.created_at).format("DD MMM, YYYY")}
                    </th>
                    <th colSpan={5}></th>
                  </tr>
                  <tr>
                    <th colSpan={3} className="text-center">
                      Raw Materials
                    </th>
                    <th colSpan={2} className="text-center">
                      Services
                    </th>
                    <th colSpan={2} className="text-center">
                      Additions
                    </th>
                  </tr>
                  <tr>
                    <th>Item Name</th>
                    <th>Required Quantity</th>
                    <th>Amount</th>
                    <th>Item Name</th>
                    <th>Amount</th>
                    <th>Item Name</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(maxLengths[index])].map((_, idx) => (
                    <tr key={idx}>
                      {idx < bom.raw_materials.length ? (
                        <>
                          <td>{bom.raw_materials[idx]?.product?.title}</td>
                          <td className="text-center">
                            {bom.raw_materials[idx]?.qty_with_wastage} -{" "}
                            {bom.raw_materials[idx]?.unit}
                          </td>
                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+bom.raw_materials[idx]?.price).toFixed(2)
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td></td>
                          <td></td>
                          <td></td>
                        </>
                      )}
                      {idx < bom.services.length ? (
                        <>
                          <td>{bom.services[idx]?.info?.title}</td>

                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+bom.services[idx]?.price).toFixed(2)
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td></td>
                          <td></td>
                        </>
                      )}
                      {idx < bom.bom_value_additions.length ? (
                        <>
                          <td>
                            {bom.bom_value_additions[idx]?.value_info?.head}
                          </td>

                          <td className="text-end">
                            {Intl.NumberFormat().format(
                              (+bom.bom_value_additions[idx]?.amount).toFixed(2)
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td></td>
                          <td></td>
                        </>
                      )}
                    </tr>
                  ))}
                  <tr>
                    <th className="text-end">Total</th>
                    <th className="text-center">
                      {getTotalRawMaterialsQty(bom)}
                    </th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(
                        (+getTotalRawMaterialsAmount(bom)).toFixed(2)
                      )}
                    </th>
                    <th></th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(
                        (+getTotalServicesAmount(bom)).toFixed(2)
                      )}
                    </th>
                    <th></th>
                    <th className="text-end">
                      {Intl.NumberFormat().format(
                        (+getTotalAdditionsAmount(bom)).toFixed(2)
                      )}
                    </th>
                  </tr>
                </tbody>
              </table>
            </>
          ))}

          {/* <div className="row">
            <div className="col-md-12 mt-4">
              <Button
                variant="contained"
                color="secondary"
                onClick={generatePdf}
                size="large"
              >
                Generate Report
              </Button>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    company: state.auth.company,
  };
};

export default connect(mapStateToProps)(BomReport);
