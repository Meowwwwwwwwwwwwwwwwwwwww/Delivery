import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AddMenuItem from "./AddMenuItem";
import { MenuProvider } from "./MenuContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MenuProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard/add-item" element={<AddMenuItem />} />
        </Routes>
      </BrowserRouter>
    </MenuProvider>
  </React.StrictMode>
);