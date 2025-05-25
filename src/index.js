// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Signup from "./Signup";
import CodeHistory from "./CodeHistory";
const root = ReactDOM.createRoot(document.getElementById("root"));

// Check user authentication
const isAuthenticated = !!localStorage.getItem("username");

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={isAuthenticated ? <App /> : <Navigate to="/login" />} />
        <Route path="/history" element={isAuthenticated ? <CodeHistory /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>

    </Router>
  </React.StrictMode>
);
