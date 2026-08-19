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
  const [existingImages, setExistingImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const emptyProduct = {
    name: "", description: "", brand: "", modelNumber: "", price: "", stock: "", category: "",
    boardNumber: "", compatibleBrand: "", screenSize: "", resolution: "", panelType: "", ports: "",
    metaTitle: "", metaDescription: "", siteUrl: "", isNewArrival: false, isBestSeller: false,
  };

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

  if (!images || images.length === 0) return urls;

  const files = images.slice(0, 5);

  for (const file of files) {
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

      const uploadedImageUrls = await uploadImagesToCloudinary();
      // Keep saved images when editing unless the admin selects replacements.
      const imageUrls = uploadedImageUrls.length ? uploadedImageUrls : existingImages;

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
        isNewArrival: Boolean(newProduct.isNewArrival),
        isBestSeller: Boolean(newProduct.isBestSeller),
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
      } else {
        await API.post("/products", payload);
      }

      setOpen(false);
      setEditingId(null);
      setImages([]);
      setExistingImages([]);
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

  const editProduct = (product) => {
    setEditingId(product._id);
    setNewProduct({
      ...emptyProduct,
      name: product.name || "", description: product.description || "", brand: product.brand || "",
      modelNumber: product.modelNumber || "", price: product.price || "", stock: product.stock || "",
      category: product.category?._id || product.category || "", ...(product.specifications || {}), ...(product.seo || {}),
    });
    setImages([]);
    setExistingImages(Array.isArray(product.images) ? product.images.filter(Boolean) : []);
    setOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Products Dashboard
      </Typography>

      <Button variant="contained" onClick={() => { setEditingId(null); setNewProduct(emptyProduct); setImages([]); setExistingImages([]); setOpen(true); }}>
        Add Product
      </Button>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? "Update Product" : "Add Product"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {/* BASIC */}
            <Grid item xs={6}>
              <TextField fullWidth label="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
  select
  fullWidth
  label="Category"
  value={newProduct.category || ""}   // ✅ ADD THIS
  onChange={(e) =>
    setNewProduct({ ...newProduct, category: e.target.value })
  }
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

            <Grid item xs={12}>
              <TextField multiline rows={2} fullWidth label="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImages(files);
  }}
/>
            </Grid>
<Grid item xs={12}>
  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
    {existingImages.map((url, i) => (
      <img key={`saved-${i}`} src={url} alt="Current product" width={70} height={70} style={{ borderRadius: 8, objectFit: "cover", border: "1px solid #ddd" }} />
    ))}
    {images.map((file, i) => (
      <img
        key={i}
        src={URL.createObjectURL(file)}
        alt="preview"
        width={70}
        height={70}
        style={{
          borderRadius: 8,
          objectFit: "cover",
          border: "1px solid #ddd"
        }}
      />
    ))}
  </Box>
</Grid>

            <Divider sx={{ my: 2, width: "100%" }} />

            {/* SPECIFICATIONS */}
            <Typography variant="h6">Specifications</Typography>

            {["boardNumber","compatibleBrand","screenSize","resolution","panelType","ports"].map((field) => (
              <Grid item xs={6} key={field}>
                <TextField fullWidth label={field}
                  value={newProduct[field] || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
                />
              </Grid>
            ))}

            <Divider sx={{ my: 2, width: "100%" }} />

            {/* SEO */}
            <Typography variant="h6">SEO</Typography>

            <Grid item xs={6}>
              <TextField fullWidth label="Meta Title"
                value={newProduct.metaTitle}
                onChange={(e) => setNewProduct({ ...newProduct, metaTitle: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Site URL"
                value={newProduct.siteUrl}
                onChange={(e) => setNewProduct({ ...newProduct, siteUrl: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField multiline rows={2} fullWidth label="Meta Description"
                value={newProduct.metaDescription}
                onChange={(e) => setNewProduct({ ...newProduct, metaDescription: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
              <label><input type="checkbox" checked={newProduct.isNewArrival} onChange={(e) => setNewProduct({ ...newProduct, isNewArrival: e.target.checked })} /> New arrival</label>
              <label><input type="checkbox" checked={newProduct.isBestSeller} onChange={(e) => setNewProduct({ ...newProduct, isBestSeller: e.target.checked })} /> Best seller</label>
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
            {loading ? <CircularProgress size={20} /> : editingId ? "Update Product" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TABLE */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.images?.[0] ? <img src={p.images[0]} alt={p.name} width={48} height={48} style={{ borderRadius: 8, objectFit: "cover" }} /> : "-"}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.category?.name || "-"}</TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <Button onClick={() => editProduct(p)}>Edit</Button>
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
