"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
} from "@mui/material";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    brand: "",
    modelNumber: "",
    price: "",
    stock: "",
    category: "",

    // specs
    boardNumber: "",
    compatibleBrand: "",
    screenSize: "",
    resolution: "",
    panelType: "",
    ports: "",

    // seo
    metaTitle: "",
    metaDescription: "",
    siteUrl: "",
  });

  // 🔐 Protect Route
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/login");
  }, [router]);

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ================= CLOUDINARY =================
  const uploadImagesToCloudinary = async () => {
    const urls = [];

    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        throw new Error(data.error?.message);
      }

      urls.push(data.secure_url);
    }

    return urls;
  };

  // ================= ADD PRODUCT =================
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      setError("Name, Price and Category are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const imageUrls = await uploadImagesToCloudinary();

      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        brand: newProduct.brand,
        modelNumber: newProduct.modelNumber,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        category: newProduct.category,
        images: imageUrls,

        specifications: {
          boardNumber: newProduct.boardNumber,
          compatibleBrand: newProduct.compatibleBrand,
          screenSize: newProduct.screenSize,
          resolution: newProduct.resolution,
          panelType: newProduct.panelType,
          ports: newProduct.ports,
        },

        seo: {
          metaTitle: newProduct.metaTitle,
          metaDescription: newProduct.metaDescription,
          ogImage: imageUrls[0] || "",
          siteUrl: newProduct.siteUrl,
        },
      };

      await API.post("/products", payload);

      setOpen(false);
      setImages([]);
      fetchProducts();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Products Dashboard
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Product
      </Button>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Product</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {/* BASIC */}
            <Grid item xs={6}>
              <TextField fullWidth label="Name"
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField select fullWidth label="Category"
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Brand"
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Model Number"
                onChange={(e) => setNewProduct({ ...newProduct, modelNumber: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField type="number" fullWidth label="Price"
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField type="number" fullWidth label="Stock"
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField multiline rows={2} fullWidth label="Description"
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files))} />
            </Grid>

            <Divider sx={{ my: 2, width: "100%" }} />

            {/* SPECIFICATIONS */}
            <Typography variant="h6">Specifications</Typography>

            {["boardNumber","compatibleBrand","screenSize","resolution","panelType","ports"].map((field) => (
              <Grid item xs={6} key={field}>
                <TextField fullWidth label={field}
                  onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
                />
              </Grid>
            ))}

            <Divider sx={{ my: 2, width: "100%" }} />

            {/* SEO */}
            <Typography variant="h6">SEO</Typography>

            <Grid item xs={6}>
              <TextField fullWidth label="Meta Title"
                onChange={(e) => setNewProduct({ ...newProduct, metaTitle: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Site URL"
                onChange={(e) => setNewProduct({ ...newProduct, siteUrl: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField multiline rows={2} fullWidth label="Meta Description"
                onChange={(e) => setNewProduct({ ...newProduct, metaDescription: e.target.value })}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={addProduct} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TABLE */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => deleteProduct(p._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}