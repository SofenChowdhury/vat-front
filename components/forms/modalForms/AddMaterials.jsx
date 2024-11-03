import React, { useState, useEffect, useRef } from "react";

import { TextField } from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

const AddMaterials = () => {
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h4>Add Materials</h4>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <TextField
            label="Search Material"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            className="shadow-input"
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <TextField
            label="Quantity"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            className="shadow-input"
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <TextField
            label="Price"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            className="shadow-input"
          />
        </div>
      </div>
    </>
  );
};

export default AddMaterials;
