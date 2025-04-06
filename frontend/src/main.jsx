import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import '@coreui/coreui/dist/css/coreui.min.css'
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
axios.defaults.baseURL = "http://127.0.0.1:9090";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
