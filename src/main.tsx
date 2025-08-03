import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
const outerTheme = createTheme({
  palette: {
    primary: {
      main: "#a8a194", // gray gold , bronco
      contrastText: "#ecebe2", //light gray
    },
    secondary: {
      main: "#e0d2b4", // grain brown //lighter than gray gold
      contrastText: "#223745", //Te Papa Green //bluegreen
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: "contained" },
              style: ({ theme }) => ({
                textTransform: "none",
                color: theme.palette.primary.contrastText,
                background: theme.palette.primary.main,
                ":hover": {
                  background: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                },
              }),
            },
            {
              props: { variant: "outlined" },
              style: ({ theme }) => ({
                textTransform: "none",
                ":hover": {
                  background: theme.palette.secondary.main,
                  color: `${theme.palette.secondary.contrastText} !important`,
                },
              }),
            },
          ],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={outerTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
