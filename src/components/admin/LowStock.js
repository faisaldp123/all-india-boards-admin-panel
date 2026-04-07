"use client";

import { Paper, List, ListItem, ListItemText } from "@mui/material";

export default function LowStock({ products }) {

  return (

    <Paper sx={{ p:2 }}>

      <h3>Low Stock Products</h3>

      <List>

        {products.map(product => (

          <ListItem key={product._id}>

            <ListItemText
              primary={product.name}
              secondary={`Stock: ${product.stock}`}
            />

          </ListItem>

        ))}

      </List>

    </Paper>

  );

}