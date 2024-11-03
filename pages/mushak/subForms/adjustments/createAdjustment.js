//react
import React from "react";

//theme imports
import { tokens } from "../../../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreateAdjustment from "../../../../components/forms/CreateAdjustment";

const createAdjustment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Adjustment Form
      </Typography>
      <CreateAdjustment />
    </>
  );
};

export default createAdjustment;
