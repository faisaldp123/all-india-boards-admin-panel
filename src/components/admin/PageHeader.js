"use client";

import { Box, Typography } from "@mui/material";

export default function PageHeader({ title, description, action }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: { xs: 3, md: 4 },
      }}
    >
      <Box>
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ width: { xs: "100%", sm: "auto" } }}>{action}</Box>}
    </Box>
  );
}
