import React, { useEffect, useState, useRef } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Icons
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

const bomTemplate = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [product_id, setProductId] = useState(0);
  const [price, setPrice] = useState(null);
  const [csvfile, setCsvfile] = useState(null);

  const [finishedGoods, setFinishedGoods] = useState([]);
  const [title, setTitle] = useState("");
  const [timer, setTimer] = useState(null);

  const multiselectRefGoods = useRef();

  // Multiselect Functions
  const addProduct = (list, item) => {
    setProductId(item.id);
    setTitle(item.title);
    setFinishedGoods([]);
  };
  const resetSelectFieldGoods = () => {
    multiselectRefGoods.current.resetSelectedValues();
    setFinishedGoods([]);
    setLoader(false);
  };

  // FETCH FINISHED GOOD BY SEARCH
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

  // EXCEL UPLOAD
  const handleOnChange = (e) => {
    if (e.target.files) setCsvfile(e.target.files[0]);
  };

  const submit = () => {
    let formData = new FormData();
    formData.append("csvfile", csvfile);
    formData.append("product_id", product_id);
    formData.append("price", price);

    const apiBom = BASE_URL + "api/v1/boms/bulk-upload";

    axios
      .post(apiBom, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status == true) {
          alert("Bom Uploaded");
          Router.push({
            pathname: "/bom/bomList",
          });
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
            BOM Template
          </Typography>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 mt-2">
          <Multiselect
            placeholder="Search Finished Good. . ."
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
        <div className="col-md-1 mt-2">
          <Button
            style={{ width: "100%" }}
            size="large"
            color="secondary"
            variant="contained"
            onClick={resetSelectFieldGoods}
          >
            <RotateLeftIcon />
          </Button>
        </div>
      </div>
      {title && (
        <>
          <div className="row mt-5">
            <div className="col-md-6 mt-3">
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
            <div className="col-md-6  mt-3">
              <TextField
                label="Declare Price"
                variant="outlined"
                size="large"
                type="number"
                fullWidth
                value={price || ""}
                className="shadow-input"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <input type="file" onChange={handleOnChange} accept=".csv" />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-2">
              <Button
                style={{ width: "100%" }}
                size="large"
                color="secondary"
                variant="contained"
                onClick={submit}
              >
                submit
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
  };
};

export default connect(mapStateToProps)(bomTemplate);
