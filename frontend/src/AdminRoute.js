import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" or "user"

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "admin") {
    alert("Access denied: Admins only");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
