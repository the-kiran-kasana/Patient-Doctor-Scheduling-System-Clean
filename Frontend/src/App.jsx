import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import UpcomingAppointments from "./pages/UpcomingAppointments";
import BookAppointment from "./pages/BookAppointment";
import  FeedbackForm from "./pages/FeedbackForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/AnalyticsDashboard" element={<PrivateRoute> <AnalyticsDashboard /> </PrivateRoute>} />
         <Route path="/Feedback" element={<PrivateRoute> <FeedbackForm /> </PrivateRoute>} />
         <Route path="/upcoming-appointments" element={<PrivateRoute> <UpcomingAppointments /> </PrivateRoute>} />
         <Route path="/BookAppointment" element={<PrivateRoute> <BookAppointment /> </PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;




