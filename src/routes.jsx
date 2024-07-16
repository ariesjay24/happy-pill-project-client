import React from "react";
import Home from "./views/Home/Home";
import Gallery from "./views/Gallery/Gallery";
import Services from "./views/Services/Services";
import Bookings from "./views/Bookings/Bookings";
import Contact from "./views/Contact/Contact";
import Login from "./views/Login/Login";
import Signup from "./views/Signup/Signup";
import Faq from "./views/Faq/Faq";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";
import PaymentSuccess from "./views/PaymentSuccess/PaymentSuccess";
import PaymentFailed from "./views/PaymentFailed/PaymentFailed";

const routes = [
  {
    path: "/fa",
    element: <Faq />,
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
    element: <Bookings />,
    protected: true,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup isAdmin={false} />,
  },
  {
    path: "/register-admin",
    element: <Signup isAdmin={true} />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    protected: true,
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment/failed",
    element: <PaymentFailed />,
  },
  {
    path: "*",
    element: <Home />,
  },
  {
    path: "/Faq",
    element: <Faq />,
  },
];

export default routes;
