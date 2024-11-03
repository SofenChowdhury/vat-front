//react
import React from "react";

//theme imports
import { tokens } from "../../../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreateVatDeposit from "../../../../components/forms/CreateVatDeposit";

const createVatDeposit = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Deposit Form
      </Typography>
      <CreateVatDeposit />
    </>
  );
};

export default createVatDeposit;
