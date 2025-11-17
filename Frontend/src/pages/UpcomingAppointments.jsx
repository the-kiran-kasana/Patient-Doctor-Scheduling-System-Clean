import { useEffect, useState } from "react";
import axios from "axios";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
//   const API_BASE = "http://localhost:6060/appointments";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE}/upcoming`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data.appointments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Upcoming Appointments</h1>
      {appointments.length === 0 && <p className="text-center text-gray-500">No upcoming appointments.</p>}

      <div className="grid gap-4">
        {appointments.map((a) => (
          <div key={a._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-blue-900">{a.doctorName}</p>
              <p className="text-gray-600">{new Date(a.startTime).toLocaleString()}</p>
            </div>
            <p className="text-gray-700 mb-2">{a.reason || "No description provided."}</p>
            <p className="text-gray-500 text-sm">Status: {a.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
