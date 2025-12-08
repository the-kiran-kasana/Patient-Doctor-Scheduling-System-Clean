import React, { useEffect, useState } from "react";
import axios from "axios";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:6060/appointments/my-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:6060/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments((prev) => prev.filter((a) => a._id !== id));
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

      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">
          No appointments found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((item) => (
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
                })}{" "}
                | <strong>Time:</strong> {item.startTime}
              </p>

              <button
                onClick={() => handleCancel(item._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Cancel Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
