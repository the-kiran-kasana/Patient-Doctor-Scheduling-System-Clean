//
// function AnalyticsDashboard() {
//  return (
//     <>
//      <section style={{ textAlign: "center", padding: "1rem", background: "#f4f4f4" }}>
//           <header>
//              <h1>Patient-Doctor Scheduling System</h1>
//             </header>
//           </section>
//     </>
//  )
// }
//
// export default AnalyticsDashboard;
//





import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,PieChart, Pie, Cell,ResponsiveContainer,} from "recharts";

//
// const API_BASE = "http://localhost:6060";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsDashboard() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [cancellations, setCancellations] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {

   axios.get(`${API_BASE}/appointment/analytics/overview`, {
     headers: { Authorization: `Bearer ${token}` },
   })
   .then((res) => { console.log(res.data); setOverview(res.data); })
   .catch((err) => console.error(err));


    // ✅ Fetch Trends
    axios.get(`${API_BASE}/appointment/analytics/trends`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTrends(res.data.trends))
      .catch((err) => console.error(err));

    // ✅ Fetch Provider Performance
    axios
      .get(`${API_BASE}/appointment/analytics/provider-performance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPerformance(res.data.performance))
      .catch((err) => console.error(err));

    // ✅ Fetch Predicted Cancellations
    axios
      .get(`${API_BASE}/appointment/analytics/predict-cancellations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCancellations(res.data.risk))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Analytics Dashboard
      </h1>

      {/* Overview Cards */}
      {overview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
          {Object.entries({
            "Total Appointments": overview.totalAppointments,
            Completed: overview.completed,
            Cancelled: overview.cancelled,
            Upcoming: overview.upcoming,
            Revenue: `₹${overview.totalRevenue}`,
          }).map(([title, value], i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-lg">
              <h2 className="font-semibold text-gray-600">{title}</h2>
              <p className="text-2xl font-bold mt-2 text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading overview...</p>
      )}

      {/* Trends Chart */}
      <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Appointments Trends</h2>
        {trends.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalAppointments" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No trends data available</p>
        )}
      </div>

      {/* Provider Performance */}
      <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Provider Performance</h2>
        {performance.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalAppointments" fill="#6366f1" />
              <Bar dataKey="completed" fill="#10b981" />
              <Bar dataKey="cancelled" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No provider performance data</p>
        )}
      </div>

      {/* Predicted Cancellations */}
      <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Predicted Cancellations Risk</h2>
        {cancellations.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cancellations.map((c, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg shadow ${
                  c.riskScore === "High" ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <h3 className="font-semibold">{c.patient}</h3>
                <p>Status: {c.status}</p>
                <p>
                  Risk:{" "}
                  <span
                    className={c.riskScore === "High" ? "text-red-600" : "text-green-600"}
                  >
                    {c.riskScore}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No predicted cancellations</p>
        )}
      </div>
    </div>

  );
}
