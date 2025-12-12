import { useState, useEffect, useRef } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";


  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}  className="flex items-center gap-2 bg-white-100 rounded-lg shadow-sm hover:bg-white-200 cursor-pointer" >
        <div className="w-8 h-8 rounded-full bg-blue-100 text-pink-500 flex items-center justify-center font-bold">
          {username.charAt(0).toUpperCase()}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg--900 shadow-lg border rounded-lg z-20">
          <ul className="py-2">
            <li
              onClick={() => navigate("/ProfilePage")}
              className="flex items-center gap-3 px-4 py-2 text-black-600 cursor-pointer hover:bg-pink-600"
            >
              <User size={18} />
              Profile
            </li>

            <li  onClick={() => navigate("/settings")} className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-pink-600" >
              <Settings size={18} />  Settings  </li>

            <li  onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 cursor-pointer text-red-600 hover:bg-red-50"  >
              <LogOut size={18} />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
