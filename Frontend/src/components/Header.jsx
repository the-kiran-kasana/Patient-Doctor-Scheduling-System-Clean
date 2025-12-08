import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "doctor" or "patient"

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
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


        <nav className="hidden md:flex space-x-8 text-white font-medium">

          <Link to="/" className="hover:text-yellow-300 transition-colors"> Home </Link>

          {token && userRole === "patient" && (
            <>
              <Link to="/PatientDashboard" className="hover:text-yellow-300 transition-colors" > Dashboard</Link>
              <Link to="/MyAppointments" className="hover:text-yellow-300 transition-colors" > My Appointments </Link>
              <Link  to="/Feedback" className="hover:text-yellow-300 transition-colors"  > Feedback</Link>
            </>
          )}


          {token && userRole === "doctor" && (
            <>
              <Link  to="/DoctorDashboard"  className="hover:text-yellow-300 transition-colors" > Dashboard </Link>
              <Link to="/upcoming-appointments" className="text-white-600 hover:text-yellow-300 transition-colors">Appointments</Link>
              <Link to="/AnalyticsDashboard" className="hover:text-yellow-300 transition-colors" >  Analytics </Link>
            </>
          )}

          {/* ✅ LOGOUT */}
          {token && (
            <button onClick={handleLogout}className="bg-red-500 px-4 py-1 rounded-md hover:bg-red-600 transition" > Logout </button>
          )}
        </nav>

        {/* MOBILE */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">  ☰
          </button>
        </div>
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



























// import React from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
//
//
// function Header() {
//
//    const token = localStorage.getItem("token");
//    const userRole = localStorage.getItem("role");
//
//    console.log(token)
//    console.log(userRole)
//
//
//
//   return (
//
//     <header className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
//       <div className="flex justify-between items-center h-24 px-6">
//         {/* Logo */}
//         <div className="flex items-center space-x-3">
//           <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
//             <span className="text-blue-600 font-bold text-lg">PDS</span>
//           </div>
//           <h1 className="text-white text-3xl font-bold tracking-wide"> Patient-Doctor Scheduler </h1>
//         </div>
//
//
//         <nav className="hidden md:flex space-x-8 text-white font-medium">
//             <Link to="/" className="text-white-600 hover:text-yellow-300 transition-colors">Home</Link>
//             <Link to="/PatientDashboard" className="text-white-600 hover:text-yellow-300 transition-colors">Dashboard</Link>
//             <Link to="/upcoming-appointments" className="text-white-600 hover:text-yellow-300 transition-colors">Appointments</Link>
//             <Link to="/AnalyticsDashboard" className="text-white-600 hover:text-yellow-300 transition-colors">Analytics</Link>
//             <Link to="/Feedback" className="text-white-600 hover:text-yellow-300 transition-colors">Review</Link>
//             <Link to="/DoctorDashboard" className="text-white-600 hover:text-yellow-300 transition-colors">DoctorDashboard</Link>
//
// {/*       <a href="/profile" className="hover:text-yellow-300 transition-colors duration-200"> <Link to="/BookAppointment" className="text-white-600 hover:text-yellow-300 transition-colors">Profile</Link> </a> */}
// {/*       */}
//         </nav>
//
//
//
//
//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <button className="text-white focus:outline-none">
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </div>
//       </div>
//
//       {/* Optional subtitle */}
//       <div className="text-center py-4 bg-indigo-700">
//         <p className="text-white text-lg font-light">
//           Seamlessly manage appointments, track patient visits, and optimize healthcare scheduling
//         </p>
//       </div>
//     </header>
//   );
// }
//
//
//
//
// export default Header;
