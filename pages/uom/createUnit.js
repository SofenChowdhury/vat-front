//react
import React from "react";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreateUnitComponent from "../../components/forms/CreateUnit";

const CreateUnit = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <CreateUnitComponent />
    </>
  );
};

export default CreateUnit;
