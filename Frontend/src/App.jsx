import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Contact from "./components/Contact";
import About from "./components/About";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import UpcomingAppointments from "./pages/UpcomingAppointments";
import UserProfileDropdown from "./pages/UserProfileDropdown";
import BookAppointment from "./pages/BookAppointment";
import FeedbackForm from "./pages/FeedbackForm";
import Unauthorized from "./pages/Unauthorized";
import ProfilePage from "./pages/ProfilePage";
import MyAppointments from "./pages/MyAppointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ FIX: allow route when allowedRoles is not provided
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/Unauthorized" replace />;
  }

  return children;
}

function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Unauthorized" element={<Unauthorized />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
        <Route path="/Register" element={<Register />} />

        <Route
          path="/AnalyticsDashboard"
          element={
            <PrivateRoute allowedRoles={["doctor"]}>
              <AnalyticsDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/Feedback"
          element={
            <PrivateRoute allowedRoles={["patient"]}>
              <FeedbackForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/upcoming-appointments"
          element={
            <PrivateRoute allowedRoles={["doctor"]}>
              <UpcomingAppointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/PatientDashboard"
          element={
            <PrivateRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/MyAppointments"
          element={
            <PrivateRoute allowedRoles={["patient"]}>
              <MyAppointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/DoctorDashboard"
          element={
            <PrivateRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/BookAppointment"
          element={
            <PrivateRoute allowedRoles={["patient"]}>
              <BookAppointment />
            </PrivateRoute>
          }
        />

        <Route
          path="/UserProfileDropdown"
          element={
            <PrivateRoute>
              <UserProfileDropdown />
            </PrivateRoute>
          }
        />

        <Route
          path="/ProfilePage"
          element={
            <PrivateRoute allowedRoles={["patient", "doctor"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
