import React, { useState, useEffect } from "react";

//redux imports
import { useDispatch } from "react-redux";
import { auth } from "../../store/actions/";

// Themes import
import {
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  FilledInput,
} from "@mui/material";

// Icons imports
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// KeyEvents
import KeyEvent from "../services/KeyEvent";

const LoginForm = () => {
  // VARIABLES FOR POST
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  // REDUX
  const dispatch = useDispatch(auth(email, password));

  // HELPERS
  const [passwordType, setPasswordType] = useState("password");

  // VISIBILITY
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  // LOGIN
  const submitHandler = () => {
    dispatch(auth(email, password));
  };

  KeyEvent(
    "Enter",
    () => {
      submitHandler();
    },
    false
  );

  return (
    <div className="mt-5">
      <div className="row ms-2 me-2">
        <div className="col-md-12">
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Email</InputLabel>
            <FilledInput
              className="custom-filled-input"
              size="large"
              type="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              id="vatEmail"
            />
          </FormControl>
        </div>
      </div>

      <div className="row ms-2 me-2 mt-4">
        <div className="col-md-12">
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Password</InputLabel>
            <FilledInput
              size="large"
              type={passwordType}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePassword} edge="end">
                    {passwordType === "password" ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </div>
      </div>
      <div className="row ms-2 me-2 mt-4">
        <div className="col-md-12 ">
          <Button
            onClick={submitHandler}
            variant="contained"
            className="float-end"
            style={{ backgroundColor: "#255288" }}
            size="large"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
