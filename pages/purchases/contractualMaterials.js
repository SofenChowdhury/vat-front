import React from "react";

//components
import CreateContractualMaterial from "../../components/forms/CreateContractualMaterial";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

const ContractualMaterials = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Contractual Materials
      </Typography>

      <CreateContractualMaterial />
    </>
  );
};

export default ContractualMaterials;
