import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Default Route - Redirect based on auth status */}
        <Route 
          path="/" 
          element={
            token ? (
              userRole === "ADMIN" ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Public Routes - Redirect if already logged in */}
        <Route 
          path="/login" 
          element={
            !token ? <Login /> : <Navigate to={userRole === "ADMIN" ? "/admin" : "/home"} replace />
          } 
        />
        <Route 
          path="/register" 
          element={
            !token ? <Register /> : <Navigate to={userRole === "ADMIN" ? "/admin" : "/home"} replace />
          } 
        />

        {/* User Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole="USER">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mybooks"
          element={
            <ProtectedRoute requiredRole="USER">
              <MyBooks />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;