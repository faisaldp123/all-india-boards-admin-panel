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
  Badge,
  useTheme,
  useMediaQuery,
  Box
} from "@mui/material";

import {
  DarkMode,
  LightMode,
  Notifications
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

import { ColorModeContext } from "./ThemeProvider";

export default function Topbar({ onSidebarToggle }) {
  const { toggleTheme } = useContext(ColorModeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  return (
    <AppBar position="static" color="default" sx={{ width: "100%" }}>
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, sm: 3 }, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.03em", fontSize: { xs: "1rem", sm: "1.15rem" } }}>
            All India Boards <Box component="span" sx={{ color: "primary.main" }}>Admin</Box>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0, sm: 0.5 } }}>
          {/* Notifications */}
          <IconButton color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Theme Toggle */}
          <IconButton color="inherit" onClick={toggleTheme}>
            {theme.palette.mode === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>

          {/* User Avatar */}
          <IconButton color="inherit" onClick={openMenu}>
            <Avatar sx={{ width: 32, height: 32, fontSize: "0.9rem", bgcolor: "primary.main" }}>A</Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            <MenuItem onClick={closeMenu}>Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
