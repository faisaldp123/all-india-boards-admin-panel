"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function RevenueChart({ data }) {

  return (

    <ResponsiveContainer width="100%" height={300}>

      <LineChart data={data}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#1976d2"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  );

}