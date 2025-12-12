import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  // Fetch User Details
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/auth/getUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.existingUser);
    } catch (err) {
      console.log("Error fetching user", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-12">

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 md:p-12">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">

          {/* Profile Image */}
          <div className="relative group w-40 h-40">
            <img
              src={
                preview ||
                user?.profilePic ||
                "https://i.pinimg.com/736x/21/52/b4/2152b4996e09f21e991780489e9140ce.jpg"
              }
              className="w-40 h-40 rounded-full shadow-xl object-cover border-4 border-indigo-600/80"
            />

            <input
              type="file"
              id="uploadPic"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Upload Button */}
            <label
              htmlFor="uploadPic"
              className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:scale-105 transition"
            >
              <Camera size={20} />
            </label>
          </div>

          {/* User Title Section */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900">
              {user?.username || "User Name"}
            </h2>
            <p className="text-gray-500 mt-1">{user?.email}</p>

            <button className="mt-4 px-6 py-2 font-semibold rounded-xl shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 mb-6" />

        {/* Details Section */}
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Field */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold text-gray-900">{user.username}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{user.email}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">{user.phone || "Not Added"}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold text-gray-900">{user.gender || "Not Added"}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border md:col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold text-gray-900">
                {user.address || "Not Available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border md:col-span-2">
              <p className="text-sm text-gray-600">Account Created On</p>
              <p className="font-semibold text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">Loading...</p>
        )}
      </div>
    </div>
  );
}
