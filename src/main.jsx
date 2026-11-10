import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./globals.css";

// Google Fonts is loaded non-blocking (media="print" in index.html); apply it now.
document.getElementById("gfonts")?.setAttribute("media", "all");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
