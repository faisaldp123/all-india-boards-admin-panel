"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRow, setOpenRow] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Packed": return "info";
      case "Shipped": return "primary";
      case "Delivered": return "success";
      case "Cancelled": return "error";
      default: return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Orders Management
      </Typography>

      <Paper>
        {loading ? (
          <Box textAlign="center" p={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Order ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <>
                  {/* MAIN ROW */}
                  <TableRow key={order._id}>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          setOpenRow(openRow === order._id ? null : order._id)
                        }
                      >
                        {openRow === order._id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>

                    <TableCell>{order._id.slice(-6)}</TableCell>

                    <TableCell>
                      {order.userId?.email}
                    </TableCell>

                    <TableCell>₹{order.totalPrice}</TableCell>

                    <TableCell>
                      <Select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Packed">Packed</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>

                      <Chip
                        label={order.orderStatus}
                        color={getStatusColor(order.orderStatus)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={order.paymentStatus}
                        color={
                          order.paymentStatus === "Paid"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>

                  {/* EXPANDED DETAILS */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={openRow === order._id}>
                        <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>

                          {/* PRODUCTS */}
                          <Typography variant="subtitle1">
                            Products:
                          </Typography>

                          {order.products.map((p, i) => (
                            <Typography key={i}>
                              • {p.name} (x{p.quantity}) - ₹{p.price}
                            </Typography>
                          ))}

                          {/* SHIPPING */}
                          <Typography sx={{ mt: 2 }} variant="subtitle1">
                            Shipping Address:
                          </Typography>

                          <Typography>
                            {order.shippingAddress?.fullName}
                          </Typography>
                          <Typography>
                            {order.shippingAddress?.phone}
                          </Typography>
                          <Typography>
                            {order.shippingAddress?.address}
                          </Typography>
                          <Typography>
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state} -{" "}
                            {order.shippingAddress?.pincode}
                          </Typography>

                          {/* DATE */}
                          <Typography sx={{ mt: 2 }}>
                            Order Date:{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </Typography>

                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}