import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_BASE_URL;

//   let userToken = localStorage.getItem("token");
//   let decode = jwtDecode(userToken);
//   let role = decode.role;
//
//   localStorage.setItem("role" , role);





  const API_BASE = "http://localhost:6060";
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");


    try {


      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

navigate("/PatientDashboard");
//         if (role === "doctor") {
//             navigate("/DoctorDashboard");
//           } else if (role === "patient") {
//             navigate("/PatientDashboard");
//           } else {
//             navigate("/"); // safety fallback
//           }

      } else {
        setError(data.msg || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-md">
            <span className="text-white text-xl font-bold">PDS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Patient-Doctor Scheduler</h1>
          <p className="text-gray-500 mt-1 text-sm">Login to manage your appointments</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
          >
            Login
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <p className="text-gray-500 text-sm text-center mt-3">
            Don't have an account?{" "}
            <Link to="/Register" className="text-blue-600 underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}



