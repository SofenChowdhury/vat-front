import React from "react";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";

const userProfile = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="row">
      <div className="col-md-4 text-center">
        <img
          alt="profile-user"
          width={200}
          height={200}
          src={`../../assets/images/user.png`}
          style={{ cursor: "pointer", borderRadius: "50%" }}
        />
        <Typography
          variant="h4"
          className="mt-3"
          color={colors.blueAccent[300]}
        >
          {user?.name}
        </Typography>
        <Typography
          variant="h5"
          className="mt-3"
          color={colors.grey[300]}
        >
          {user?.roles[0]?.name}
        </Typography>
      </div>
      <div className="col-md-6">
        <Typography
          variant="h2"
          className="mb-4"
          color={colors.greenAccent[300]}
        >
          User Profile
        </Typography>
        <Typography
          variant="h5"
          className="mt-3"
          color={colors.primary[300]}
        >
          Email
        </Typography>
        <input type="text" className="form-control mt-2" value={user?.email} disabled />
        <Typography
          variant="h5"
          className="mt-3"
          color={colors.primary[300]}
        >
          Phone
        </Typography>
        <input type="text" className="form-control mt-2" value={user?.phone} disabled />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(userProfile);
