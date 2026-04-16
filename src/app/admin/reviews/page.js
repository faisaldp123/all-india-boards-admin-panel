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
  Button,
} from "@mui/material";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await API.get("/reviews");
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const likeReview = async (id) => {
    await API.post(`/reviews/like/${id}`);
    fetchReviews();
  };

  const deleteReview = async (id) => {
    await API.delete(`/reviews/${id}`);
    fetchReviews();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Reviews</Typography>

      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.userId?.name}</TableCell>
                <TableCell>{r.productId?.name}</TableCell>
                <TableCell>{r.rating}</TableCell>
                <TableCell>{r.comment}</TableCell>
                <TableCell>{r.likes}</TableCell>

                <TableCell>
                  <Button onClick={() => likeReview(r._id)}>
                    👍 Like
                  </Button>

                  <Button color="error" onClick={() => deleteReview(r._id)}>
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