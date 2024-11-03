//react
import React, { useState } from "react";

// Theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button } from "@mui/material";

// Components
import CreateOrder from "../../components/forms/CreateOrder";
import CreateCustomer from "../../components/forms/CreateCustomer";
import Modal from "../../components/services/Modal";


const createOrder = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // MODALS
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  return (
    <>
      <Modal
        onClose={() => setShowCustomerModal(false)}
        show={showCustomerModal}
      >
        <CreateCustomer />
      </Modal>
      <div className="row">
        <div className="col-sm-3">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Create Order
          </Typography>
        </div>
        <div className="col-sm-6"></div>
        <div className="col-sm-3">
          <Button
            variant="outlined"
            className="float-end"
            size="large"
            onClick={() => {
              setShowCustomerModal(true);
            }}
          >
            NEW CUSTOMER
          </Button>
        </div>
      </div>

      <CreateOrder />
    </>
  );
};

export default createOrder;
