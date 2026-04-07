"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

export default function DataTable({ columns, rows }) {

  return (
    <Table>

      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col}>
              {col}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            {row.map((cell, i) => (
              <TableCell key={i}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>

    </Table>
  );
}