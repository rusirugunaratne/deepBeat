import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import HomePage from "./pages/homePage/HomePage.tsx";
import App from "./App.tsx";
import Prediction from "./pages/predictionPage/Prediction.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
