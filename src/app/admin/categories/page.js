"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function CategoriesPage() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {

    API.get("/categories")
      .then(res => setCategories(res.data));

  }, []);

  return (
    <div>

      <h2>Categories</h2>

      {categories.map(cat => (
        <p key={cat._id}>{cat.name}</p>
      ))}

    </div>
  );
}