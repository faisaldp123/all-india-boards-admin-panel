"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function ReviewsPage() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {

    API.get("/reviews")
      .then(res => setReviews(res.data));

  }, []);

  return (
    <div>

      <h2>Reviews</h2>

      {reviews.map(review => (
        <p key={review._id}>
          {review.comment}
        </p>
      ))}

    </div>
  );
}