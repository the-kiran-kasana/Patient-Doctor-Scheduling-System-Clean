import { useState } from "react";
import axios from "axios";

export default function BookAppointment() {
  const [doctorName, setDoctorName] = useState("Dr. Riya Sharma");
  const [reason, setReason] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [service, setService] = useState("General Consultation");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

const API_BASE = import.meta.env.VITE_API_BASE_URL;



  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/Book_Appointment`, { doctorName, reason, startTime, endTime, AppointmentTypes: service, },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setMessage("✅ Appointment booked successfully!");
      }
    } catch (err) {
      setMessage("❌ Failed to book appointment. Please try again.");
    }
  };







  return (

    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
{/*       <section className="bg-blue-900 text-white text-center py-6 shadow-md"> */}
{/*         <h1 className="text-3xl font-bold tracking-wide"> Book Your Appointment </h1> */}
{/*         <p className="text-sm text-blue-100 mt-1">  Connect with top doctors & manage your health easily. </p> */}
{/*       </section> */}





      {/* Booking Card */}
      <main className="flex-1 flex justify-center items-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
            Appointment Details
          </h2>

          <form onSubmit={handleBook} className="flex flex-col gap-4">
            {/* Doctor Selection */}
            <div>
              <label className="font-medium text-gray-700">Select Doctor</label>
              <select
                className="border rounded w-full p-2 mt-1"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              >
                <option>Dr. Riya Sharma (Cardiologist)</option>
                <option>Dr. Aman Gupta (Dentist)</option>
                <option>Dr. Sneha Patel (Dermatologist)</option>
                <option>Dr. Rahul Verma (General Physician)</option>
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="font-medium text-gray-700">Service Type</label>
              <select
                className="border rounded w-full p-2 mt-1"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option>General Consultation</option>
                <option>Dental Checkup</option>
                <option>Skin Treatment</option>
                <option>Heart Checkup</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="font-medium text-gray-700">Reason / Symptoms</label>
              <textarea
                className="border rounded w-full p-2 mt-1 resize-none"
                rows={3}
                placeholder="Describe your symptoms or reason for appointment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  className="border rounded w-full p-2 mt-1"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  className="border rounded w-full p-2 mt-1"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="bg-blue-900 text-white py-2 rounded-xl mt-4 hover:bg-blue-700 transition-all" > Book Appointment </button>

            {message && (
              <p className={`mt-3 text-center font-medium ${ message.includes("✅") ? "text-green-600" : "text-red-500" }`} > {message} </p>
            )}
          </form>
        </div>
      </main>


{/*       <footer className="bg-blue-900 text-white text-center py-4 mt-auto"> */}
{/*         <p className="text-sm"> © {new Date().getFullYear()} MediConnect — All Rights Reserved </p> */}
{/*         <p className="text-xs text-blue-200 mt-1">  Powered by Patient-Doctor Scheduling System </p> */}
{/*       </footer> */}
    </div>
  );
}
