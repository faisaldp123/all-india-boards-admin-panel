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
  ChevronRight
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
    { label: "Reviews", icon: <Reviews />, path: "/admin/reviews" }
    ,{ label: "Homepage", icon: <ViewCarousel />, path: "/admin/homepage" }
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toggle Button - only on desktop */}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
            p: 1,
            borderBottom: "1px solid",
            borderColor: "divider"
          }}
        >
          <IconButton onClick={toggleSidebar}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
      )}

      {/* Brand logo space inside sidebar for mobile */}
      {isMobile && (
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            All India Boards
          </Box>
        </Box>
      )}

      <List sx={{ p: 1 }}>
        {menu.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            href={item.path}
            selected={pathname === item.path}
            sx={{
              px: (open || isMobile) ? 2 : 1.5,
              borderRadius: "8px",
              mb: 0.5,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": {
                  color: "primary.contrastText"
                },
                "&:hover": {
                  backgroundColor: "primary.main",
                  opacity: 0.9
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
