import React from "react";

// Theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button } from "@mui/material";
import { Download } from "@mui/icons-material";

const CaReportList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const downloadReport = () => {
    alert("No CA Report yet!");
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <Typography variant="h2" className="" color={colors.greenAccent[300]}>
            CA Report List
          </Typography>
        </div>
      </div>
      <div className="row mt-5 p-3">
        <div className="col-md-4">
          <table className="table table-bordered table-hover">
            <thead>
              <tr className="table-success">
                <th className="col-8">Report Year</th>
                <th className="col-4">Download</th>
              </tr>
            </thead>
            {/* <tbody>
              <tr>
                <td>2022</td>
                <td>
                  <Button variant="contained" onClick={downloadReport}>
                    <Download />
                  </Button>
                </td>
              </tr>
              <tr>
                <td>2021</td>
                <td>
                  <Button variant="contained" onClick={downloadReport}>
                    <Download />
                  </Button>
                </td>
              </tr>
              <tr>
                <td>2020</td>
                <td>
                  <Button variant="contained" onClick={downloadReport}>
                    <Download />
                  </Button>
                </td>
              </tr>
            </tbody> */}
          </table>
        </div>
      </div>
    </>
  );
};

export default CaReportList;
