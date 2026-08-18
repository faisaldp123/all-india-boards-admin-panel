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
  const [imageFile, setImageFile] = useState(null);
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

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Image upload failed");
    return data.secure_url;
  };

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
      const image = await uploadImageToCloudinary();

      await API.post("/categories", {
        name: name.trim(),
        image,
        slug, // ✅ send slug along with name
      });

      setSuccess("Category added successfully!");
      setName("");
      setImageFile(null);
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

          <Button component="label" variant="outlined" sx={{ mt: 2 }}>
            {imageFile ? "Change category image" : "Upload category image"}
            <input hidden type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </Button>
          {imageFile && <Box component="img" src={URL.createObjectURL(imageFile)} alt="Category preview" sx={{ display: "block", mt: 2, width: 120, height: 80, objectFit: "cover", borderRadius: 1 }} />}

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
              <TableCell>Image</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell>{cat.image ? <Box component="img" src={cat.image} alt={cat.name} sx={{ width: 48, height: 48, borderRadius: 1, objectFit: "cover" }} /> : "-"}</TableCell>
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
