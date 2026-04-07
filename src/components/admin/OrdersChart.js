"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function OrdersChart({ data }) {

  return (

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={data}>

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="orders"
          fill="#4caf50"
        />

      </BarChart>

    </ResponsiveContainer>

  );

}