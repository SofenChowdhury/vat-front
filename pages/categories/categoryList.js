import React, { useEffect, useState } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button, CircularProgress } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Icon import
import EditIcon from "@mui/icons-material/Edit";

const CategoryList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const apiCategories = BASE_URL + "api/v1/categories";

    axios
      .get(apiCategories, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setCategories(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-6">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Categories
              </Typography>
            </div>
            <div className="col-6 mt-1">
              <Link href="/categories/createCategory" className="anchor">
                <Button variant="outlined" className="float-end" size="large">
                  Create Category
                </Button>
              </Link>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr className="table-success">
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((category, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    {category.status ? (
                      <td>Active</td>
                    ) : (
                      <td>Inactive</td>
                    )}
                    <td>
                    <Link href={`/categories/updateCategory/${category.id}`}>
                        <button className="btn btn-light btn-sm me-1">
                          <EditIcon cursor="pointer" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default connect(mapStateToProps)(CategoryList);
