//react
import React from "react";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreateGood from "../../components/forms/CreateGood";

const ReceiveGood = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Receive Finished Good
      </Typography>
      <CreateGood />
    </>
  );
};

export default ReceiveGood;
