import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7c3aed",
    },
    secondary: {
      main: "#ff5f6d",
    },
    background: {
      default: "#050114",
      paper: "rgba(10, 8, 22, 0.85)",
    },
  },
  typography: {
    fontFamily: "Space Grotesk, Plus Jakarta Sans, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(10, 8, 22, 0.85)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
