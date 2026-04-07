"use client";

import { useContext, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge
} from "@mui/material";

import {
  DarkMode,
  LightMode,
  Notifications
} from "@mui/icons-material";

import { ColorModeContext } from "./ThemeProvider";

export default function Topbar() {

  const { toggleTheme } = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  return (

    <AppBar position="static" color="primary">

      <Toolbar sx={{ justifyContent: "space-between" }}>

        <Typography variant="h6">
          All India Boards Admin
        </Typography>

        <div>

          {/* Notifications */}
          <IconButton color="inherit">

            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>

          </IconButton>

          {/* Theme Toggle */}
          <IconButton color="inherit" onClick={toggleTheme}>
            <DarkMode />
          </IconButton>

          {/* User Avatar */}
          <IconButton color="inherit" onClick={openMenu}>
            <Avatar>A</Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >

            <MenuItem>Profile</MenuItem>

            <MenuItem onClick={logout}>
              Logout
            </MenuItem>

          </Menu>

        </div>

      </Toolbar>

    </AppBar>

  );

}