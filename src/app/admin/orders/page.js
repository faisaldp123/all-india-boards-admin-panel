"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Typography
} from "@mui/material";

export default function OrdersPage() {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {

    const res = await API.get("/orders");

    setOrders(res.data);

  };

  useEffect(() => {

    fetchOrders();

  }, []);

  const updateStatus = async (id, status) => {

    await API.put(`/orders/${id}/status`, {
      status
    });

    fetchOrders();

  };

  return (

    <div>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Orders
      </Typography>

      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Total</TableCell>
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

                <Select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                >

                  <MenuItem value="Pending">
                    Pending
                  </MenuItem>

                  <MenuItem value="Packed">
                    Packed
                  </MenuItem>

                  <MenuItem value="Shipped">
                    Shipped
                  </MenuItem>

                  <MenuItem value="Delivered">
                    Delivered
                  </MenuItem>

                </Select>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>

  );

}