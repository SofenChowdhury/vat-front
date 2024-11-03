import React, { useEffect, useState } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Icon import
import EditIcon from "@mui/icons-material/Edit";

const roleList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const apiRoles = BASE_URL + "api/v1/roles";

    axios
      .get(apiRoles, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status == true) {
          setRoles(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Role List
      </Typography>
      <table className="table table-striped">
        <thead>
          <tr className="table-success">
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={index}>
              <th className="col-2">{index + 1}</th>
              <td>{role.name}</td>
              <td className="col-2">
                <Link href={`/roles/updateRole/${role.id}`}>
                  <Button size="large">
                    <EditIcon cursor="pointer" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(roleList);
