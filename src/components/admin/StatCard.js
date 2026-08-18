"use client";

import { Paper, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, icon, color }) {
  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "0.2s",
        borderRadius: "10px",
        borderColor: "divider",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
        }
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 0.5, textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.05em" }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: `${color}15`,
          color: color,
          "& svg": {
            fontSize: 24
          }
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}