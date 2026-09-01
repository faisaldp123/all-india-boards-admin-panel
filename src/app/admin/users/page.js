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
  Chip,
  CircularProgress,
  TableContainer,
} from "@mui/material";
import PageHeader from "@/components/admin/PageHeader";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("USER FETCH ERROR:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <PageHeader title="Customers" description="View customer accounts and access roles." />

      <Paper>
        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer><Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Joined</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name || "N/A"}</TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <Chip
                        label={user.role || "user"}
                        color={user.role === "admin" ? "error" : "primary"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table></TableContainer>
        )}
      </Paper>
    </Box>
  );
}
