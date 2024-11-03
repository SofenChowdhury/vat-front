//react
import React, { useState, useEffect } from "react";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreateProduct from "../../components/forms/CreateProduct";

const createProduct = ({ roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Create Product
      </Typography>

      <CreateProduct />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(createProduct);
