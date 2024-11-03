//react
import React, { useState, useEffect } from "react";
import Link from "next/link";

//theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button } from "@mui/material";

//component
import CB from "../../components/forms/CreateBom";

const CreateBom = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Create Bill of Materials
          </Typography>
        </div>
        <div className="col-md-4 mb-2">
          <Link href="/bom/bomList">
            <Button className="float-end" variant="contained" size="large">
              BOM List
            </Button>
          </Link>
        </div>
      </div>

      <CB />
    </>
  );
};

export default CreateBom;
