"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, createContext } from "react";

export const ColorModeContext = createContext();

export default function CustomThemeProvider({ children }) {

  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#111111",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#666666",
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "light" ? "#f9fafb" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#111111" : "#ffffff",
        secondary: mode === "light" ? "#555555" : "#aaaaaa",
      },
      divider: mode === "light" ? "#e5e7eb" : "#2d2d2d",
    },
    typography: {
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontWeight: 700,
        letterSpacing: "-0.01em",
      },
      h6: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      subtitle1: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "#1a1a1a",
            color: mode === "light" ? "#111111" : "#ffffff",
            boxShadow: "none",
            borderBottom: `1px solid ${mode === "light" ? "#e5e7eb" : "#2d2d2d"}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#ffffff" : "#1a1a1a",
            borderRight: `1px solid ${mode === "light" ? "#e5e7eb" : "#2d2d2d"}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            borderRadius: "12px",
            border: `1px solid ${mode === "light" ? "#e5e7eb" : "#2d2d2d"}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            padding: "8px 16px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
          contained: {
            backgroundColor: "#111111",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#222222",
            },
          },
          outlined: {
            borderColor: mode === "light" ? "#e5e7eb" : "#2d2d2d",
            color: mode === "light" ? "#111111" : "#ffffff",
            "&:hover": {
              backgroundColor: mode === "light" ? "#f9fafb" : "#222222",
              borderColor: mode === "light" ? "#d1d5db" : "#444444",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            backgroundColor: mode === "light" ? "#fdf2f8" : "#1f1f1f",
            color: mode === "light" ? "#6b2148" : "#d1d5db",
            borderBottom: `1px solid ${mode === "light" ? "#e5e7eb" : "#2d2d2d"}`,
          },
          root: {
            padding: "14px 16px",
            borderBottom: `1px solid ${mode === "light" ? "#e5e7eb" : "#2d2d2d"}`,
          },
        },
      },
      MuiTable: {
        styleOverrides: { root: { minWidth: 680 } },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&.MuiTableRow-hover:hover, &:has(td):hover": {
              backgroundColor: mode === "light" ? "#fff1f7" : "#252025",
            },
          },
        },
      },
    },
  });

  return (

    <ColorModeContext.Provider value={{ toggleTheme }}>

      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>

    </ColorModeContext.Provider>

  );

}
