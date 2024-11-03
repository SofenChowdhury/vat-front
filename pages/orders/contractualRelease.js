import React from "react";

import CreateContractualRelease from "../../components/forms/CreateContractualRelease";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

const ContractualRelease = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Contractual Release
      </Typography>

      <CreateContractualRelease />
    </>
  );
};

export default ContractualRelease;
