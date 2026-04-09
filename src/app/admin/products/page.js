"use client";

import { useEffect, useState } from "react";
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
} from "@mui/material";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);

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

  // ================= FETCH =================
  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products);
  };

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ================= CLOUDINARY =================
  const uploadImagesToCloudinary = async () => {
    const urls = [];

    for (let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append("file", images[i]);
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
      urls.push(data.secure_url);
    }

    return urls;
  };

  // ================= ADD PRODUCT =================
  const addProduct = async () => {
    try {
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

      // reset form
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
      console.log(err);
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

            <Grid item xs={6}>
              <TextField fullWidth label="Name"
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
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
              <TextField select fullWidth label="Category"
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
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
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

            {/* SEO */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">SEO Settings</Typography>
            </Grid>

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
              <TextField fullWidth multiline rows={2} label="Meta Description"
                onChange={(e) => setNewProduct({ ...newProduct, metaDescription: e.target.value })}
              />
            </Grid>

            {/* IMAGE */}
            <Grid item xs={12}>
              <input type="file" multiple onChange={(e) => setImages(e.target.files)} />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addProduct}>Save</Button>
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