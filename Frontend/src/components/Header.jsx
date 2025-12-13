import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfileDropdown from "../pages/UserProfileDropdown";

function Header() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUserRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    // 1. Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // 2. Clear React state
    setToken(null);
    setUserRole(null);

    navigate("/login");

    // 4. Finally refresh the page after navigation
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
      <div className="flex justify-between items-center h-24 px-6">

        {/* LOGO */}
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
            <span className="text-blue-600 font-bold text-lg">PDS</span>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            Patient-Doctor Scheduler
          </h1>
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex space-x-8 text-white font-medium">

          {/* Always show */}
          <Link to="/" className="hover:text-yellow-300">Home</Link>

          {/* If NOT logged in → show Login & Signup */}


          {/* PATIENT NAVIGATION */}
          {token && userRole === "patient" && (
            <>
              <Link to="/PatientDashboard" className="hover:text-yellow-300">Dashboard</Link>
              <Link to="/MyAppointments" className="hover:text-yellow-300">My Appointments</Link>
              <Link to="/Feedback" className="hover:text-yellow-300">Feedback</Link>
            </>
          )}

          {/* DOCTOR NAVIGATION */}
          {token && userRole === "doctor" && (
            <>
              <Link to="/DoctorDashboard" className="hover:text-yellow-300">Dashboard</Link>
              <Link to="/upcoming-appointments" className="hover:text-yellow-300">Appointments</Link>
              <Link to="/AnalyticsDashboard" className="hover:text-yellow-300">Analytics</Link>
            </>
          )}

          {/* User Dropdown */}


           <Link to="/about" className="hover:text-yellow-300">About</Link>
           <Link to="/contact" className="hover:text-yellow-300">Contact</Link>

            {!token && (
                       <>
                         <Link to="/login" className="hover:text-yellow-300">Login/Signup</Link>
                       </>
             )}


              {token && userRole === "doctor" &&(
                         <>
                            {token && <UserProfileDropdown />}
                         </>
              )}

               {token &&  userRole === "patient" &&(
                                       <>
                                          {token && <UserProfileDropdown />}
                                       </>
                            )}




        </nav>
      </div>

      <div className="text-center py-4 bg-indigo-700">
        <p className="text-white text-lg font-light">
          Seamlessly manage appointments & healthcare scheduling
        </p>
      </div>
    </header>
  );
}

export default Header;
