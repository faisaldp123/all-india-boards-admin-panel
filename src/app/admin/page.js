"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import useAdminAuth from "@/hooks/useAdminAuth";

import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Paper
} from "@mui/material";

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
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useAdminAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Dashboard Stats
        const statsRes = await API.get("/admin/dashboard");
        setStats(statsRes.data);

        // ✅ Recent Orders
        const ordersRes = await API.get("/orders");
        setOrders(ordersRes.data.slice(0, 5));

      } catch (err) {
        console.error("DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>

        {/* 🔥 STAT CARDS */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<ShoppingCartIcon />}
            color="#4caf50"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={<InventoryIcon />}
            color="#ff9800"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={`₹${stats?.totalRevenue || 0}`}
            icon={<PaymentsIcon />}
            color="#9c27b0"
          />
        </Grid>

        {/* 📊 CHARTS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Revenue
            </Typography>
            <RevenueChart data={stats?.monthlyRevenue || []} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Orders
            </Typography>
            <OrdersChart data={stats?.monthlyOrders || []} />
          </Paper>
        </Grid>

        {/* 📦 ORDER STATUS */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Status Overview
            </Typography>

            {stats?.orderStatusStats?.map((item, i) => (
              <Typography key={i}>
                {item._id}: {item.count}
              </Typography>
            ))}
          </Paper>
        </Grid>

        {/* 🧾 RECENT ORDERS */}
        <Grid item xs={12} md={6}>
          <RecentOrders orders={orders} />
        </Grid>

        {/* ⚠️ LOW STOCK */}
        <Grid item xs={12} md={6}>
          <LowStock products={stats?.lowStockProducts || []} />
        </Grid>

      </Grid>
    </Box>
  );
}