"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Typography
} from "@mui/material";

export default function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [file, setFile] = useState(null);

  const fetchProducts = async () => {

    const res = await API.get("/products");

    setProducts(res.data.products);

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  const deleteProduct = async (id) => {

    await API.delete(`/products/${id}`);

    fetchProducts();

  };

  const searchProducts = async () => {

    const res = await API.get(`/products/search?keyword=${keyword}`);

    setProducts(res.data);

  };

  const uploadCSV = async () => {

    const formData = new FormData();

    formData.append("file", file);

    await API.post("/products/bulk-upload", formData);

    fetchProducts();

  };

  return (

    <div>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Products
      </Typography>

      <TextField
        label="Search Products"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{ mr: 2 }}
      />

      <Button variant="contained" onClick={searchProducts}>
        Search
      </Button>

      <br /><br />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <Button
        variant="contained"
        sx={{ ml: 2 }}
        onClick={uploadCSV}
      >
        Upload CSV
      </Button>

      <br /><br />

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

          {products.map(product => (

            <TableRow key={product._id}>

              <TableCell>{product.name}</TableCell>

              <TableCell>{product.brand}</TableCell>

              <TableCell>₹{product.price}</TableCell>

              <TableCell>{product.stock}</TableCell>

              <TableCell>

                <Button
                  color="error"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </Button>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>

  );

}