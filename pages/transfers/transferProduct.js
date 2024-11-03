//react
import React, { useState, useEffect } from "react";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreateTransfer from "../../components/forms/CreateTransfer";

const TransferProduct = ({ roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Transfer Product
      </Typography>

      <CreateTransfer />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(TransferProduct);
