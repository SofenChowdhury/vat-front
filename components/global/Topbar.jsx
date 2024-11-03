import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//redux imports
import { useDispatch } from "react-redux";
import { logout, setCollapse } from "../../store/actions/auth";
import { connect } from "react-redux";

//date
import moment from "moment";

//theme imports
import {
  Box,
  useTheme,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { tokens } from "../../pages/theme";
// import { InputBase } from "@mui/material";

// Icon Imports
// import SearchIcon from "@mui/icons-material/Search";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyIcon from "@mui/icons-material/Key";

const Topbar = ({ token, isCollapsed, name }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Responsive
  const [width, setWidth] = useState(window.innerWidth);

  // SET WINDOW SIZE
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const dispatch = useDispatch();

  // LOGOUT
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

  // SET COLLAPSED
  const change = () => {
    dispatch(setCollapse(!isCollapsed));
  };

  // Dropdown

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        p={2}
        backgroundColor="#fcfaf7"
      >
        {isCollapsed && width < 600 && (
          <Button
            style={{ background: "transparent", color: colors.grey[100] }}
          >
            <MenuOutlinedIcon onClick={change} />
          </Button>
        )}
        <Box
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          display="flex"
        >
          {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton> */}
        </Box>

        <Box display="flex">
          {/* <Link href="/users/userProfile">
            <IconButton>
              <PersonOutlinedIcon />
            </IconButton>
          </Link>
          <IconButton onClick={submitHandler}>
            <LogoutIcon />
          </IconButton> */}

          <Button disabled style={{ color: "orange", fontSize: "14px" }} className="me-4">
            {moment(currentTime).format("hh:mm:ss a")}
          </Button>
          <Button
            endIcon={<ArrowDropDownIcon />}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            {name}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Link href="/users/userProfile" className="anchor">
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonOutlinedIcon />
                </ListItemIcon>
                Profile
              </MenuItem>
            </Link>
            <Link href="/users/changePassword" className="anchor">
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <KeyIcon />
                </ListItemIcon>
                Change Password
              </MenuItem>
            </Link>
            <MenuItem onClick={submitHandler}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isCollapsed: state.collapse.isCollapse,
    name: state.auth.user.name,
  };
};

export default connect(mapStateToProps)(Topbar);
