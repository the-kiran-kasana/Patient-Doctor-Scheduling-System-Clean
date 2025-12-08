import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function MyAppointments() {
  const [userAppointments, setUserAppointments] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  useEffect(() => {
    if (!userId || !token) return;

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/appointment/getUserAppointments/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("API RESPONSE =>", res.data.appointments);

        // ✅ Force data into array
       const appointments = Array.isArray(res.data.appointments)
         ? res.data.appointments
         : [res.data.appointments];

       setUserAppointments(appointments.filter(Boolean));
 // remove null/undefined
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setUserAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [API_BASE, token, userId]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Remove deleted appointment from UI
      setUserAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Appointments
      </h1>

      {userAppointments.length === 0 ? (
        <p className="text-center text-gray-600">
          No appointments found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAppointments.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-xl shadow-md border"
            >
              <h2 className="font-bold text-lg mb-2 text-blue-600">
                {item.doctorName}
              </h2>

              <p className="text-sm text-gray-700 mb-1">
                <strong>Reason:</strong> {item.reason}
              </p>

              <p className="text-sm text-gray-700 mb-1">
                <strong>Type:</strong> {item.appointmentTypes}
              </p>

              <p className="text-sm text-gray-700 mb-3">
                <strong>Date:</strong>{" "}
                {new Date(item.BookDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                {" | "}
                <strong>Time:</strong> {item.startTime}
              </p>

{/*               <button */}
{/*                 onClick={() => handleCancel(item._id)} */}
{/*                 className="bg-red-500 text-white px-1  gap-1 rounded-md hover:bg-red-600 transition" */}
{/*               > */}
{/*                 Cancel */}
{/*               </button> */}


               <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold
                                    ${
                                      item.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : item.status === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  {item.status}
                                </span>



            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
