"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material";

import {
  Dashboard,
  Inventory,
  Category,
  ShoppingCart,
  People,
  Reviews,
  ViewCarousel,
  ChevronLeft,
  ChevronRight,
  Settings
} from "@mui/icons-material";

import Link from "next/link";

const drawerWidth = 240;
const collapsedWidth = 70;

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const menu = [
    { label: "Dashboard", icon: <Dashboard />, path: "/admin" },
    { label: "Products", icon: <Inventory />, path: "/admin/products" },
    { label: "Categories", icon: <Category />, path: "/admin/categories" },
    { label: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
    { label: "Users", icon: <People />, path: "/admin/users" },
    { label: "Reviews", icon: <Reviews />, path: "/admin/reviews" },
    { label: "Homepage", icon: <ViewCarousel />, path: "/admin/homepage" }
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ height: 72, px: open || isMobile ? 2.5 : 1, display: "flex", alignItems: "center", justifyContent: open || isMobile ? "space-between" : "center", borderBottom: "1px solid", borderColor: "divider" }}>
        {(open || isMobile) && <Box sx={{ fontWeight: 800, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>AIB <Box component="span" sx={{ color: "primary.main" }}>Console</Box></Box>}
        {!isMobile && <IconButton onClick={toggleSidebar} size="small">{open ? <ChevronLeft /> : <ChevronRight />}</IconButton>}
      </Box>

      <List sx={{ p: 1.5, flexGrow: 1 }}>
        {menu.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            href={item.path}
            selected={pathname === item.path}
            sx={{
              px: (open || isMobile) ? 2 : 1.5,
              borderRadius: "10px",
              mb: 0.75,
              "&.Mui-selected": {
                backgroundColor: "rgba(49, 86, 217, 0.12)",
                color: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": {
                  color: "primary.main"
                },
                "&:hover": {
                  backgroundColor: "rgba(49, 86, 217, 0.18)"
                }
              }
            }}
            onClick={isMobile ? onMobileClose : undefined}
          >
            <ListItemIcon sx={{ minWidth: (open || isMobile) ? 40 : "auto", color: pathname === item.path ? "inherit" : "text.secondary" }}>
              {item.icon}
            </ListItemIcon>

            {(open || isMobile) && (
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: pathname === item.path ? 600 : 500 }}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            transition: "0.3s",
            overflowX: "hidden",
            boxSizing: "border-box"
          }
        }}
        open={open}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
