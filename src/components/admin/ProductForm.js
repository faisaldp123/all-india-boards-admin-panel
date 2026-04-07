    "use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import {
  TextField,
  Button,
  Box,
  MenuItem
} from "@mui/material";

export default function ProductForm({ product, onSuccess }) {

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    category: ""
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories")
      .then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async () => {

    const data = new FormData();

    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });

    if (image) {
      data.append("images", image);
    }

    if (product) {
      await API.put(`/products/${product._id}`, data);
    } else {
      await API.post("/products", data);
    }

    onSuccess();

  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap:2 }}>

      <TextField
        label="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <TextField
        label="Brand"
        name="brand"
        value={form.brand}
        onChange={handleChange}
      />

      <TextField
        label="Price"
        name="price"
        value={form.price}
        onChange={handleChange}
      />

      <TextField
        label="Stock"
        name="stock"
        value={form.stock}
        onChange={handleChange}
      />

      <TextField
        select
        label="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        {categories.map(cat => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <Button variant="contained" onClick={submit}>
        Save Product
      </Button>

    </Box>
  );
}