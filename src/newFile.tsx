import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material";
import { outerTheme } from "./main.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={outerTheme}>
      <App />
    </ThemeProvider>
    //{" "}
  </StrictMode>
);
