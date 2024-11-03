//theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

//components
import CreatePurchaseReturn from "../../components/forms/CreatePurchaseReturn";

const ManualPurchaseReturn = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Purchase Return
      </Typography>

      <CreatePurchaseReturn />
      <br />
    </>
  );
};

export default ManualPurchaseReturn;
