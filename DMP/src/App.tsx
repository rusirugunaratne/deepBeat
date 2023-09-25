import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomePage from "./pages/homePage/HomePage";
import Prediction from "./pages/predictionPage/Prediction";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "./Themes/Themes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Prediction />
      </ThemeProvider>
    </>
  );
}

export default App;
