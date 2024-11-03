//react
import React from "react";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";
import TextsmsIcon from "@mui/icons-material/Textsms";
//components

import CreateTicket from "../../components/forms/CreateTicket";

const CreateTickets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      {/* <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Create Support Ticket 
      </Typography>
      <CreateTicket /> */}
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Create Support Ticket{" "}
        <sup>
          <TextsmsIcon />
        </sup>
      </Typography>
      <CreateTicket />
    </>
  );
};

export default CreateTickets;
