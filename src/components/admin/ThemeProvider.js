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
      mode
    }
  });

  return (

    <ColorModeContext.Provider value={{ toggleTheme }}>

      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>

    </ColorModeContext.Provider>

  );

}