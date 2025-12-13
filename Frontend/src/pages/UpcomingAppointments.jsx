import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE}/showAppointment`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(res.data.appointments);
        setFilteredAppointments(res.data.appointments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // ✅ Search & Filter Logic
  useEffect(() => {
    let data = [...appointments];

    // Search filtering
    if (searchTerm.trim() !== "") {
      data = data.filter((a) =>
        (a.username || a.userId?.username || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.appointmentTypes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (statusFilter !== "") {
      data = data.filter(
        (a) => a.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredAppointments(data);
  }, [searchTerm, statusFilter, appointments]);

  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

  return (
    <div className="max-w-7xl mx-auto p-8 grid gap-6">

      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
        Appointments List
      </h1>

      {/* ✅ FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-md">

        {/* Search */}
        <div className="relative w-full md:w-2/3">
          <input
            type="text"
            placeholder="Search patient / doctor / type / status..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
        </div>

        {/* Status Filter */}
        <select
          className="w-full md:w-1/3 py-2 px-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="scheduled">Pending</option>
        </select>

      </div>

      {/* ✅ NO DATA */}
      {filteredAppointments.length === 0 && (
        <p className="text-center text-gray-500">No matching appointments found.</p>
      )}

      {/* ✅ TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-full text-sm">

          <thead>
            <tr className="bg-blue-50 text-blue-900 text-left">
              <th className="p-4">#</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Type</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Time</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((a, index) => (
              <tr key={a._id} className="border-b hover:bg-blue-50 transition">

                <td className="p-4 font-semibold text-gray-700">{index + 1}</td>

                <td className="p-4 font-medium text-gray-800">
                  {a.username || a.userId?.username || "N/A"}
                </td>

                <td className="p-4 text-gray-700">{a.doctorName}</td>

                <td className="p-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                    {a.appointmentTypes}
                  </span>
                </td>

                <td className="p-4 text-gray-600">N/A</td>

                <td className="p-4 font-medium text-gray-700">{a.startTime}</td>

                <td className="p-4 text-gray-600">
                  {new Date(a.BookDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        a.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : a.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {a.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
