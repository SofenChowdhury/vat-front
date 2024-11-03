import React, { useEffect, useState } from "react";
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

//date
import { DatePicker } from "antd";
import moment from "moment";

const PermissionList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helpers
  const [permissions, setPermissions] = useState([]);
  const [loader, setLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // FETCHING ACTIVITIES
  useEffect(() => {
    const apiPermissions = BASE_URL + "api/v1/permissions/paginate?page=" + page;

    axios
      .get(apiPermissions, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          console.log(res.data);
          setLoader(false);
          setPermissions(res.data.data.data);
          setLastPage(res.data.data.last_page);
        } else {
          setErrorMessage(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  // console.log(permissions);

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Permissions
              </Typography>
            </div>
          </div>
          {errorMessage != "" ? (
            <div className="row">
              <h5 className="text-danger">{errorMessage}</h5>
            </div>
          ) : (
            <>
              <table className="table table-hover table-striped mt-4">
                <thead>
                  <tr className="table-success">
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions?.map((permission, index) => (
                    <tr key={index}>
                      <th className="col-1">{index + 1 + (page - 1) * 20}</th>
                      <td className="col-3">{permission.name}</td>
                      <td className="col-3">{permission.description}</td>
                      <td>
                        {permission.roles?.map((role, index) => (
                          <span
                            class="badge bg-info p-2 text-dark me-4"
                            style={{ fontSize: "13px" }}
                          >
                            {role.name}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(PermissionList);
