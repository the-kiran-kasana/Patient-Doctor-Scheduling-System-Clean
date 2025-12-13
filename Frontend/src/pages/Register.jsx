import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState("");
  const [verify , setVerify] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
         alert("Signup successful! Please check your email to verify.");

         const verifySignup = await axios.get(`${API_BASE}/auth/verify?email=${email}`);
         setVerify(verifySignup.data);

         navigate("/login");
      } else {
        setError(data.msg || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-md">
            <span className="text-white text-xl font-bold">PDS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Patient-Doctor Scheduler</h1>
          <p className="text-gray-500 mt-1 text-sm">Create your account to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <select
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
          >
            Signup
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <p className="text-gray-500 text-sm text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
