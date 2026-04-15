"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import slugify from "slugify"; // ✅ import slugify here

import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // ✅ PROTECT ROUTE
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= ADD CATEGORY =================
  const addCategory = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // ✅ Generate slug on frontend
      const slug = slugify(name.trim(), { lower: true });

      await API.post("/categories", {
        name: name.trim(),
        slug, // ✅ send slug along with name
      });

      setSuccess("Category added successfully!");
      setName("");
      setOpen(false);

      fetchCategories();
    } catch (err) {
      console.error("ADD ERROR:", err);

      setError(
        err.response?.data?.message || "Failed to add category"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteCategory = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Categories Dashboard
      </Typography>

      {/* SUCCESS MESSAGE */}
      {success && (
        <Typography color="green" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}

      {/* ADD BUTTON */}
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Category
      </Button>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Category</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={addCategory}
            disabled={loading || !name.trim()}
          >
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TABLE */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.slug || "-"}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => deleteCategory(cat._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}