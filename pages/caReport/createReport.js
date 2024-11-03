import React, { useState } from "react";

// Theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button } from "@mui/material";

//date
import { DatePicker } from "antd";

const UploadCaReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [csvfile, setCsvfile] = useState(null);

  // EXCEL UPLOAD
  const handleOnChange = (e) => {
    if (e.target.files) setCsvfile(e.target.files[0]);
  };

  // Date function
  const onChangeYear = (date, dateString) => {
    if (date) {
      setStartDate(`${dateString}-01-01`);
      setEndDate(`${dateString}-12-31`);
    }
  };

  const submit = () => {
    alert("No CA Report yet!");
  };
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <Typography variant="h2" className="" color={colors.greenAccent[300]}>
            Upload CA Report
          </Typography>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
        <DatePicker
              picker="year"
              onChange={onChangeYear}
              size="large"
              style={{ width: "100%", height: "58px" }}
              className="shadow-input"
              defaultValue={""}
            />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-12">
          <input type="file" onChange={handleOnChange} accept=".csv" />
        </div>
      </div>
      <div className="row mt-5">
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
  );
};

export default UploadCaReport;
