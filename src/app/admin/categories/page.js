"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import API from "@/lib/api";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";

const emptyForm = { name: "", image: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchCategories = async () => {
    try { setCategories((await API.get("/categories")).data); } catch { setError("Could not load categories"); }
  };
  useEffect(() => { if (!localStorage.getItem("adminToken")) router.push("/login"); }, [router]);
  useEffect(() => { fetchCategories(); }, []);

  const close = () => { setOpen(false); setEditingId(null); setForm(emptyForm); setFile(null); setError(""); };
  const uploadImage = async () => {
    if (!file) return form.image;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) throw new Error("Cloudinary upload settings are missing");
    const data = new FormData();
    data.append("file", file); data.append("upload_preset", preset);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: data });
    const result = await response.json();
    if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Image upload failed");
    return result.secure_url;
  };
  const save = async () => {
    if (!form.name.trim()) return setError("Category name is required");
    try {
      setLoading(true); setError("");
      const image = await uploadImage();
      const payload = { name: form.name.trim(), image, slug: slugify(form.name.trim(), { lower: true, strict: true }) };
      if (editingId) await API.put(`/categories/${editingId}`, payload); else await API.post("/categories", payload);
      close(); await fetchCategories();
    } catch (err) { setError(err.response?.data?.message || err.message || "Could not save category"); }
    finally { setLoading(false); }
  };
  const edit = (category) => { setEditingId(category._id); setForm({ name: category.name || "", image: category.image || "" }); setFile(null); setError(""); setOpen(true); };
  const remove = async (id) => { if (window.confirm("Delete this category?")) { await API.delete(`/categories/${id}`); fetchCategories(); } };
  const preview = file ? URL.createObjectURL(file) : form.image;

  return <Box sx={{ p: 3 }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Categories Dashboard</Typography>
    <Button variant="contained" onClick={() => setOpen(true)}>Add Category</Button>
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm"><DialogTitle>{editingId ? "Update Category" : "Add Category"}</DialogTitle><DialogContent>
      <TextField fullWidth label="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ mt: 2 }} />
      <Button component="label" variant="outlined" sx={{ mt: 2 }}>{file ? "Change image" : "Upload category image"}<input hidden type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></Button>
      {preview && <Box component="img" src={preview} alt="Category preview" sx={{ display: "block", mt: 2, width: 120, height: 80, objectFit: "cover", borderRadius: 1 }} />}
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
    </DialogContent><DialogActions><Button onClick={close}>Cancel</Button><Button variant="contained" onClick={save} disabled={loading}>{loading ? <CircularProgress size={20} /> : editingId ? "Update" : "Save"}</Button></DialogActions></Dialog>
    <Paper sx={{ mt: 3 }}><Table><TableHead><TableRow><TableCell>Image</TableCell><TableCell>Category Name</TableCell><TableCell>Slug</TableCell><TableCell>Action</TableCell></TableRow></TableHead><TableBody>
      {categories.length ? categories.map((cat) => <TableRow key={cat._id}><TableCell>{cat.image ? <Box component="img" src={cat.image} alt={cat.name} sx={{ width: 48, height: 48, borderRadius: 1, objectFit: "cover" }} /> : "-"}</TableCell><TableCell>{cat.name}</TableCell><TableCell>{cat.slug || "-"}</TableCell><TableCell><Button onClick={() => edit(cat)}>Edit</Button><Button color="error" onClick={() => remove(cat._id)}>Delete</Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={4} align="center">No categories found</TableCell></TableRow>}
    </TableBody></Table></Paper>
  </Box>;
}
