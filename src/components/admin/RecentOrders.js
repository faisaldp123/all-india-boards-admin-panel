"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";

export default function RecentOrders({ orders }) {

  return (

    <Paper sx={{ p:2 }}>

      <h3>Recent Orders</h3>

      <Table>

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

              <TableCell>{order._id}</TableCell>

              <TableCell>
                {order.userId?.email || "Customer"}
              </TableCell>

              <TableCell>
                ₹{order.totalPrice}
              </TableCell>

              <TableCell>
                {order.orderStatus}
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Paper>

  );

}