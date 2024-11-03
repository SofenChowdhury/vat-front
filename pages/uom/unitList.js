import React, { useEffect, useState } from "react";
import Router from "next/router";
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
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Icon import
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const unitList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [units, setUnits] = useState([]);
  const [loader, setLoader] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const apiUnits = BASE_URL + "api/v1/units";

    axios
      .get(apiUnits, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          setLoader(false);
          setUnits(res.data.data.data);
          setLastPage(res.data.data.last_page);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  const handleChange = (e, page) => {
    setPage(page);
  };

  // DELETING UNIT
  const onDelete = (e, id, name) => {
    const unitData = { id };
    const apiUnit = BASE_URL + "api/v1/units/delete";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiUnit, unitData, config).then((response) => {
      if (response.data.status) {
        alert(`Deleted Unit ${name}`);
        Router.reload(window.location.pathname);
      } else {
        console.log(response.data);
      }
    });
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Unit of Materials
              </Typography>
            </div>
            <div className="col-md-6 mt-1">
              <Link href="/uom/createUnit" className="anchor">
                <Button variant="outlined" className="float-end" size="large">
                  Create Unit
                </Button>
              </Link>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr className="table-success">
                  <th className="col-1">#</th>
                  <th className="col-3">Name</th>
                  <th className="col-6">Remarks</th>
                  <th className="col-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {units?.map((unit, index) => (
                  <tr key={index + 1 + (page - 1) * 20}>
                    <th scope="row">{index + 1}</th>
                    <td>{unit.name}</td>
                    <td>{unit.remarks}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Link
                        href={`/uom/updateUnit/${unit.id}`}
                        className="anchor"
                      >
                        <Button variant="outlined" color="success" size="large">
                          <EditIcon />
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        color="error"
                        className="ms-2"
                        onClick={(e) => onDelete(e, unit.id, unit.name)}
                        size="large"
                      >
                        <DeleteIcon />
                      </Button>
                    </td>
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

export default connect(mapStateToProps)(unitList);
