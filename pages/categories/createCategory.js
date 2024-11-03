import React from "react";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreateCategoryComponent from "../../components/forms/CreateCategory";

const CreateCategory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-3" color={colors.greenAccent[300]}>
        Create Category
      </Typography>
      <CreateCategoryComponent />
    </>
  );
};

export default CreateCategory;
