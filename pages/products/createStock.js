//react
import React from "react";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreateStockComponent from "../../components/forms/CreateStock";

const CreateStock = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Add Product Stock
      </Typography>
      <CreateStockComponent />
    </>
  );
};

export default CreateStock;