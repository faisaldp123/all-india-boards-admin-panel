"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper, Typography, TableContainer, Chip
} from "@mui/material";

export default function RecentOrders({ orders }) {

  return (

    <Paper sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
      <Typography variant="h6">Recent orders</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Latest customer purchases</Typography>
      <TableContainer>
      <Table size="small">

        <TableHead>

          <TableRow>

            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {orders.map(order => (

            <TableRow key={order._id}>

              <TableCell sx={{ fontWeight: 700 }}>#{order._id.slice(-6).toUpperCase()}</TableCell>

              <TableCell>
                {order.userId?.email || "Customer"}
              </TableCell>

              <TableCell>
                ₹{order.totalPrice}
              </TableCell>

              <TableCell>
                <Chip label={order.orderStatus} size="small" variant="outlined" />
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>
      </TableContainer>

    </Paper>

  );

}
