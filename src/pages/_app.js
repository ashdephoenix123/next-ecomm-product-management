import "@/styles/globals.css";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00790f",
    },
    secondary: {
      main: "#0d2329",
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
