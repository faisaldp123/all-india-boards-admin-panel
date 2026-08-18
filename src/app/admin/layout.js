"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import CustomThemeProvider from "@/components/admin/ThemeProvider";
import "bootstrap/dist/css/bootstrap.min.css";

import { Box } from "@mui/material";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <CustomThemeProvider>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerClose} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Topbar onSidebarToggle={handleDrawerToggle} />
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {children}
          </Box>
        </Box>
      </Box>
    </CustomThemeProvider>
  );
}