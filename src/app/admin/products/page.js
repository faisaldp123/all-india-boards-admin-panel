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
    boardNumber: "",
    compatibleBrand: "",
    screenSize: "",
    resolution: "",
    panelType: "",
    ports: "",
    metaTitle: "",
    metaDescription: "",
    siteUrl: "",
  });

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/login");
    }
  }, []);

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

    if (!images.length) return urls;

    for (let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append("file", images[i]);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (!data.secure_url) {
          throw new Error("Cloudinary upload failed");
        }

        urls.push(data.secure_url);
      } catch (err) {
        console.error("Cloudinary Error:", err);
        throw err;
      }
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
        price: newProduct.price,
        stock: newProduct.stock,
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
          ogImage: imageUrls[0],
          siteUrl: newProduct.siteUrl,
        },
      };

      await API.post("/products", payload);

      // RESET
      setNewProduct({
        name: "",
        description: "",
        brand: "",
        modelNumber: "",
        price: "",
        stock: "",
        category: "",
        boardNumber: "",
        compatibleBrand: "",
        screenSize: "",
        resolution: "",
        panelType: "",
        ports: "",
        metaTitle: "",
        metaDescription: "",
        siteUrl: "",
      });

      setImages([]);
      setOpen(false);
      fetchProducts();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
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

            <Grid item xs={6}>
              <TextField fullWidth label="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Model Number"
                value={newProduct.modelNumber}
                onChange={(e) => setNewProduct({ ...newProduct, modelNumber: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField select fullWidth label="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField type="number" fullWidth label="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField type="number" fullWidth label="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </Grid>

            {/* ERROR */}
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            {/* IMAGE */}
            <Grid item xs={12}>
              <input type="file" multiple onChange={(e) => setImages(e.target.files)} />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={addProduct}
            disabled={loading}
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
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}