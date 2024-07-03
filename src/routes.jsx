// src/routes.jsx
import React from "react";
import { Navigate } from "react-router-dom"; // Add this import
import Home from "./views/Home/Home";
import Gallery from "./views/Gallery/Gallery";
import Services from "./views/Services/Services";
import Bookings from "./views/Bookings/Bookings";
import Contact from "./views/Contact/Contact";
import Login from "./views/Login/Login";
import Signup from "./views/Signup/Signup";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";
import ProtectedRoute from "./views/ProtectedRoute/ProtectedRoute";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/bookings",
    element: (
      <ProtectedRoute role="Client">
        <Bookings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup isAdmin={false} />, // Regular signup
  },
  {
    path: "/register-admin",
    element: <Signup isAdmin={true} />, // Admin signup
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="Admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" />, // Redirect any unknown routes to home
  },
];

export default routes;
