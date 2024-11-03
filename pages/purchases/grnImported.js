//react
import React, { useState, useEffect } from "react";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

import CreatePurchaseImported from "../../components/forms/CreatePurchaseImported";

const GrnImported = ({ roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Purchase Imported Product
      </Typography>

      <CreatePurchaseImported /> 
    </>
  );
};

export default GrnImported;
