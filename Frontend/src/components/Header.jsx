import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfileDropdown from "../pages/UserProfileDropdown";
import { Menu, X } from "lucide-react";

function Header() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUserRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    // 1. Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

     setTimeout(() => {
               window.location.reload();
             }, 100);

    // 2. Clear React state
    setToken(null);
    setUserRole(null);

    navigate("/login");
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">

          {/* TOP BAR */}
          <div className="flex justify-between items-center h-20 md:h-24 px-4 md:px-6">

            {/* LOGO */}
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md">
                <span className="text-blue-600 font-bold text-lg">PDS</span>
              </div>
              <h1 className="text-white text-lg sm:text-xl md:text-3xl font-bold">
                Patient-Doctor Scheduler
              </h1>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex space-x-8 text-white font-medium">
              <Link to="/" className="hover:text-yellow-300">Home</Link>

              {token && userRole === "patient" && (
                <>
                  <Link to="/PatientDashboard" className="hover:text-yellow-300">Dashboard</Link>
                  <Link to="/MyAppointments" className="hover:text-yellow-300">My Appointments</Link>
                  <Link to="/Feedback" className="hover:text-yellow-300">Feedback</Link>
                </>
              )}

              {token && userRole === "doctor" && (
                <>
                  <Link to="/DoctorDashboard" className="hover:text-yellow-300">Dashboard</Link>
                  <Link to="/upcoming-appointments" className="hover:text-yellow-300">Appointments</Link>
                  <Link to="/AnalyticsDashboard" className="hover:text-yellow-300">Analytics</Link>
                </>
              )}

              <Link to="/about" className="hover:text-yellow-300">About</Link>
              <Link to="/contact" className="hover:text-yellow-300">Contact</Link>

              {!token && (
                <Link to="/login" className="hover:text-yellow-300">Login/Signup</Link>
              )}

              {token && <UserProfileDropdown />}
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-white"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* MOBILE MENU */}
          {open && (
            <div className="md:hidden bg-indigo-700 px-5 py-4 space-y-3 text-white font-medium">
              <Link to="/" className="block hover:text-yellow-300">Home</Link>

              {token && userRole === "patient" && (
                <>
                  <Link to="/PatientDashboard" className="block hover:text-yellow-300">Dashboard</Link>
                  <Link to="/MyAppointments" className="block hover:text-yellow-300">My Appointments</Link>
                  <Link to="/Feedback" className="block hover:text-yellow-300">Feedback</Link>
                </>
              )}

              {token && userRole === "doctor" && (
                <>
                  <Link to="/DoctorDashboard" className="block hover:text-yellow-300">Dashboard</Link>
                  <Link to="/upcoming-appointments" className="block hover:text-yellow-300">Appointments</Link>
                  <Link to="/AnalyticsDashboard" className="block hover:text-yellow-300">Analytics</Link>
                </>
              )}

              <Link to="/about" className="block hover:text-yellow-300">About</Link>
              <Link to="/contact" className="block hover:text-yellow-300">Contact</Link>

              {!token && (
                <Link to="/login" className="block hover:text-yellow-300">Login/Signup</Link>
              )}

              {token && <UserProfileDropdown />}
            </div>
          )}

          {/* TAGLINE */}
          <div className="text-center py-2 sm:py-4 bg-indigo-700">
            <p className="text-white text-sm sm:text-lg font-light">
              Seamlessly manage appointments & healthcare scheduling
            </p>
          </div>
        </header>
  );
}

export default Header;
