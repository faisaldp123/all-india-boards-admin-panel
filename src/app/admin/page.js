"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

import { Grid, Typography, Box } from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";

import StatCard from "@/components/admin/StatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import OrdersChart from "@/components/admin/OrdersChart";
import RecentOrders from "@/components/admin/RecentOrders";
import LowStock from "@/components/admin/LowStock";

export default function Dashboard() {

  const [stats,setStats] = useState({});
  const [orders,setOrders] = useState([]);
  const [products,setProducts] = useState([]);

  useEffect(()=>{

    API.get("/admin/dashboard")
      .then(res=>setStats(res.data));

    API.get("/orders")
      .then(res=>setOrders(res.data.slice(0,5)));

    API.get("/products")
      .then(res=>{

        const lowStock = res.data.products.filter(
          p=>p.stock < 5
        );

        setProducts(lowStock);

      });

  },[]);

  return (

    <Box>

      <Typography variant="h5" sx={{ mb:3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>

        {/* STAT CARDS */}

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            icon={<ShoppingCartIcon />}
            color="#4caf50"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts || 0}
            icon={<InventoryIcon />}
            color="#ff9800"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue || 0}`}
            icon={<PaymentsIcon />}
            color="#9c27b0"
          />
        </Grid>


        {/* CHARTS */}

        <Grid item xs={12} md={6}>
          <RevenueChart data={stats.monthlyRevenue || []} />
        </Grid>

        <Grid item xs={12} md={6}>
          <OrdersChart data={stats.monthlyOrders || []} />
        </Grid>


        {/* WIDGETS */}

        <Grid item xs={12} md={6}>
          <RecentOrders orders={orders}/>
        </Grid>

        <Grid item xs={12} md={6}>
          <LowStock products={products}/>
        </Grid>

      </Grid>

    </Box>

  );

}