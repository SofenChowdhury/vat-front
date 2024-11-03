import React from "react";
import Router from "next/router";

// theme
import { Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

//redux imports
import { useDispatch } from "react-redux";
import { logout, setCollapse } from "../../../store/actions/auth";
import { connect } from "react-redux";

// LOGOUT

const LogoutModal = ({ token }) => {
  const dispatch = useDispatch();

  const submitHandler = () => {
    const apiUrl = BASE_URL + "api/v1/auth/logout";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(apiUrl, "", config)
      .then(() => {
        Router.push({
          pathname: "/",
        });
        dispatch(logout());
      })
      .catch((error) => {
        if (error.response.status == 401) {
          dispatch(logout());
          Router.push({
            pathname: "/",
          });
        }
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12 text-center">
          <h6>Your token has expired!</h6>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 text-center">
          <h6>Please logout and Login again.</h6>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-12 text-center">
          <Button variant="contained" color="secondary" onClick={submitHandler}>
            Login
          </Button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(LogoutModal);
