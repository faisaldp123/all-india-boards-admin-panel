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
  Box
} from "@mui/material";

import {
  Dashboard,
  Inventory,
  Category,
  ShoppingCart,
  People,
  Reviews,
  ChevronLeft,
  ChevronRight
} from "@mui/icons-material";

import Link from "next/link";

const drawerWidth = 240;
const collapsedWidth = 70;

export default function Sidebar() {

  const pathname = usePathname();
  const [open,setOpen] = useState(true);

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
  ];

  return (

    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          transition: "0.3s",
          overflowX: "hidden"
        }
      }}
    >

      {/* Toggle Button */}

      <Box
        sx={{
          display:"flex",
          justifyContent: open ? "flex-end" : "center",
          p:1
        }}
      >

        <IconButton onClick={toggleSidebar}>
          {open ? <ChevronLeft/> : <ChevronRight/>}
        </IconButton>

      </Box>

      <List>

        {menu.map((item)=> (

          <ListItemButton
            key={item.label}
            component={Link}
            href={item.path}
            selected={pathname === item.path}
            sx={{ px: open ? 2 : 1 }}
          >

            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            {open && (
              <ListItemText primary={item.label}/>
            )}

          </ListItemButton>

        ))}

      </List>

    </Drawer>

  );

}