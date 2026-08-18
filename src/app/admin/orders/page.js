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
  Button,
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

  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Invoice - #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; padding: 30px; color: #111; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 15px; margin-bottom: 25px; }
            .title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .section-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 4px; letter-spacing: 0.05em; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
            .table th, .table td { border: 1px solid #eee; padding: 12px; text-align: left; }
            .table th { background-color: #f9f9f9; font-weight: 600; }
            .total { text-align: right; font-size: 20px; font-weight: 700; margin-top: 20px; padding-top: 10px; border-top: 1px solid #111; }
            .footer { text-align: center; margin-top: 60px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">ALL INDIA BOARDS</div>
              <div style="margin-top: 5px; color: #555;">Order ID: #${order._id}</div>
              <div>Date: ${new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; font-size: 18px; letter-spacing: 0.05em;">INVOICE</div>
              <div style="margin-top: 5px;">Payment: ${order.paymentMethod} (${order.paymentStatus})</div>
              <div>Status: ${order.orderStatus}</div>
            </div>
          </div>
          
          <div class="details">
            <div style="width: 48%;">
              <div class="section-title">Customer Details</div>
              <div><strong>Email:</strong> \${order.userId?.email || 'N/A'}</div>
              <div><strong>Name:</strong> \${order.userId?.name || 'N/A'}</div>
            </div>
            <div style="width: 48%;">
              <div class="section-title">Shipping Address</div>
              <div><strong>Name:</strong> \${order.shippingAddress?.fullName || 'N/A'}</div>
              <div><strong>Phone:</strong> \${order.shippingAddress?.phone || 'N/A'}</div>
              <div><strong>Address:</strong> \${order.shippingAddress?.address || 'N/A'}</div>
              <div>\${order.shippingAddress?.city || ''}, \${order.shippingAddress?.state || ''} - \${order.shippingAddress?.pincode || ''}</div>
            </div>
          </div>

          <div class="section-title">Order Items</div>
          <table class="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              \${order.products.map(p => \`
                <tr>
                  <td style="font-weight: 500;">\${p.name}</td>
                  <td>₹\${p.price}</td>
                  <td>\${p.quantity}</td>
                  <td>₹\${p.price * p.quantity}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>

          <div class="total">
            Total Amount: ₹\${order.totalPrice}
          </div>

          <div class="footer">
            Thank you for shopping with All India Boards!
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
                        <Box sx={{ p: 3, bgcolor: "background.default", borderTop: "1px solid", borderColor: "divider" }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                            <Box>
                              {/* PRODUCTS */}
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Products:
                              </Typography>
                              {order.products.map((p, i) => (
                                <Typography key={i} variant="body2" sx={{ color: "text.secondary" }}>
                                  • {p.name} (x{p.quantity}) - ₹{p.price}
                                </Typography>
                              ))}
                            </Box>

                            <Button 
                              variant="outlined" 
                              onClick={() => handlePrint(order)}
                              size="small"
                              sx={{ mt: 1 }}
                            >
                              Print Invoice
                            </Button>
                          </Box>

                          {/* SHIPPING */}
                          <Typography sx={{ mt: 2 }} variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Shipping Address:
                          </Typography>

                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {order.shippingAddress?.fullName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {order.shippingAddress?.phone}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {order.shippingAddress?.address}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state} -{" "}
                            {order.shippingAddress?.pincode}
                          </Typography>

                          {/* DATE */}
                          <Typography sx={{ mt: 2 }} variant="body2" sx={{ fontWeight: 600 }}>
                            Order Date:{" "}
                            <span style={{ fontWeight: 400 }}>
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
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