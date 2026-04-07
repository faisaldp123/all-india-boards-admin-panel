"use client";

import { Paper, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, icon, color }) {

  return (

    <Paper
      sx={{
        p:3,
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        borderLeft:`6px solid ${color}`,
        transition:"0.3s",
        "&:hover":{
          transform:"translateY(-4px)",
          boxShadow:4
        }
      }}
    >

      <Box>

        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>

        <Typography variant="h4">
          {value}
        </Typography>

      </Box>

      <Box sx={{ fontSize:40, color }}>
        {icon}
      </Box>

    </Paper>

  );

}