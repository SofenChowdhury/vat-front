//react
import React, { useState, useEffect } from "react";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

import RegisterForm from "../../components/forms/RegisterForm";

const createUser = ({ roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [superAdmin, setSuperAdmin] = useState(false);

  useEffect(() => {
    roles.map((role) => {
      if (role.name === "SuperAdmin") {
        setSuperAdmin(true);
      }
    });
  }, []);

  return (
    <>
      {superAdmin ? (
        <>
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Create User
          </Typography>
          {superAdmin && <RegisterForm />}
        </>
      ) : (
        <Typography variant="h3" color={colors.greenAccent[300]}>
          Permission required!
        </Typography>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(createUser);
