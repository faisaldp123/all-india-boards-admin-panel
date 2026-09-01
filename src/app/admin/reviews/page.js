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
  TableContainer,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import { DeleteOutline, ThumbUpOutlined } from "@mui/icons-material";
import PageHeader from "@/components/admin/PageHeader";

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
    <Box>
      <PageHeader title="Reviews" description="Moderate product feedback and customer engagement." />

      <Paper>
        <TableContainer><Table>
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
                <TableCell><Chip label={`${r.rating}/5`} size="small" color="warning" variant="outlined" /></TableCell>
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
        </Table></TableContainer>
      </Paper>
    </Box>
  );
}
