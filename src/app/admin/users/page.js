"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function UsersPage() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    API.get("/users")
      .then(res => setUsers(res.data));

  }, []);

  return (
    <div>

      <h2>Users</h2>

      {users.map(user => (
        <p key={user._id}>{user.email}</p>
      ))}

    </div>
  );
}