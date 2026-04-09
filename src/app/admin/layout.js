"use client";

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import CustomThemeProvider from "@/components/admin/ThemeProvider";
import "bootstrap/dist/css/bootstrap.min.css";

import { Box } from "@mui/material";

export default function AdminLayout({ children }) {

  return (

    <CustomThemeProvider>

      <Box sx={{ display: "flex" }}>

        <Sidebar />

        <Box sx={{ flexGrow: 1 }}>

          <Topbar />

          <Box sx={{ p: 3 }}>
            {children}
          </Box>

        </Box>

      </Box>

    </CustomThemeProvider>

  );

}