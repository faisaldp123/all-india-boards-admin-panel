"use client";

import { Paper, List, ListItem, ListItemText, Typography, Chip, Box } from "@mui/material";

export default function LowStock({ products }) {

  return (

    <Paper sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
      <Typography variant="h6">Low stock products</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Items that may need replenishment</Typography>

      <List>

        {products.map(product => (

          <ListItem key={product._id} disableGutters secondaryAction={<Chip label={`${product.stock} left`} size="small" color="warning" />}>

            <ListItemText
              primary={product.name}
              secondary={`Stock: ${product.stock}`}
            />

          </ListItem>

        ))}

      </List>

      {!products.length && <Box sx={{ py: 3, textAlign: "center", color: "text.secondary", fontSize: "0.875rem" }}>All inventory levels look healthy.</Box>}

    </Paper>

  );

}
