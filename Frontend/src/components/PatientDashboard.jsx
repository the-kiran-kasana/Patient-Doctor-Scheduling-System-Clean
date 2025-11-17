import { useState } from "react";
import axios from "axios";

export default function PatientDashboard() {
  const [specialty, setSpecialty] = useState("");
  const [Appointment, setAppointment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Patient Name" };


  const doctorsList = {
    "General Physician": ["Dr. Aman Shah", "Dr. Kavita Rao"],
    Cardiologist: ["Dr. Riya Sharma", "Dr. Arjun Khanna"],
    Dermatologist: ["Dr. Sejal Mehta"],
    Dentist: ["Dr. Aman Gupta"],
    Orthopedic: ["Dr. Manoj Yadav"],
  };

  // TIME SLOTS
  const slots = [
    "09:00 AM", "09:30 AM", "10:00 AM",
    "10:30 AM", "11:00 AM", "02:00 PM",
    "02:30 PM", "03:00 PM", "03:30 PM",
  ];

  // API Base
  const API_BASE = import.meta.env.VITE_API_BASE_URL;




  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/appointments/Book_Appointment`, { appointmentTypes, doctorName,reason, date,startTime,endTime,},
      { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment Booked Successfully!");
    } catch (err) {
      alert("Failed to book appointment!");
    }
  };






  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6">
        <div className="flex flex-col items-center">
          <img src="https://i.pinimg.com/736x/3f/c1/08/3fc108d3f911ec7995359558b454bc66.jpg" className="rounded-full w-15 h-15 flex items-center justify-center shadow-md"/>
          <h2 className="mt-3 text-lg font-semibold">{user.name}</h2>

          <button className="mt-3 bg-red-500 px-4 py-1 rounded hover:bg-red-700"> Logout </button>
        </div>

        <nav className="mt-10 space-y-3">
          <div className="bg-blue-700 px-4 py-2 rounded cursor-pointer">Book Appointment</div>
          <div className="bg-blue-700 px-4 py-2 rounded cursor-pointer">My Appointments</div>
          <div className="bg-blue-700 px-4 py-2 rounded cursor-pointer">My Feedback</div>
        </nav>
      </aside>





      {/* MIDDLE SECTION */}
      <main className="flex-1 px-10 py-8">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-5">Book Appointment</h1>

        <div className="bg-white p-6 rounded-xl shadow-lg max-w-full">

          <form className="space-y-4" onSubmit={handleBook}>
            {/* SPECIALTY */}
{/*             <div> */}
{/*               <label className="font-semibold text-gray-700">Choose Specialty</label> */}
{/*               <select className="w-full border p-2 rounded mt-1" value={specialty} onChange={(e) => setSpecialty(e.target.value)}> */}
{/*                 <option value="">Select Specialty</option> */}
{/*                 <option>General Physician</option> */}
{/*                 <option>Cardiologist</option> */}
{/*                 <option>Dermatologist</option> */}
{/*                 <option>Dentist</option> */}
{/*                 <option>Orthopedic</option> */}
{/*               </select> */}
{/*             </div> */}


            <div>
                <label className="font-semibold text-gray-700">Select Appointment Type</label>
                <select className="w-full border p-2 rounded mt-1" value={Appointment} onChange={(e)=> setAppointment(e.target.value)}>
                    <option value="">select appointment type</option>
                    <option>In-Person</option>
                    <option>Telemedicine</option>
                </select>
            </div>


            {/* DOCTOR */}
            <div>
              <label className="font-semibold text-gray-700">Choose Doctor</label>
              <select className="w-full border p-2 rounded mt-1" value={doctor} onChange={(e) => setDoctor(e.target.value)} >
                <option value="">Select Doctor</option>
                {specialty &&
                  doctorsList[specialty]?.map((doc) => (
                    <option key={doc}>{doc}</option>
                  ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="font-semibold text-gray-700">Select Date</label>
              <input type="date" className="w-full border p-2 rounded mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            {/* TIME SLOTS */}
            <div>
              <label className="font-semibold text-gray-700">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {slots.map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setSelectedSlot(time)}
                    className={`p-2 rounded border ${
                      selectedSlot === time
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* SYMPTOMS */}
            <div>
              <label className="font-semibold text-gray-700">Symptoms (optional)</label>
              <textarea
                className="w-full border p-2 rounded mt-1"
                rows="3"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </main>

      {/* RIGHT SECTION */}
      <aside className="w-[380px] p-6 space-y-6">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="font-bold text-lg text-blue-900 mb-3">My Appointments</h2>

          <div className="p-3 border-l-4 border-blue-700 bg-blue-50 mb-2 rounded">
            <h3 className="font-semibold">Dr. Riya Sharma</h3>
            <p className="text-sm text-gray-600">20 Nov 2025 • 10:00 AM</p>
          </div>

          <div className="p-3 border-l-4 border-blue-700 bg-blue-50 rounded">
            <h3 className="font-semibold">Dr. Aman Gupta</h3>
            <p className="text-sm text-gray-600">22 Nov 2025 • 3:30 PM</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="font-bold text-lg text-blue-900">Doctor Profile Popup</h2>
          <p className="text-gray-600 text-sm mt-1">Will open when selecting doctor</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="font-bold text-lg text-blue-900">Appointment History</h2>
          <p className="text-sm text-gray-500 mt-2">No history available.</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="font-bold text-lg text-blue-900 mb-2">Calendar</h2>
          <div className="bg-gray-200 h-48 rounded flex items-center justify-center text-gray-500">
            Calendar UI Here
          </div>
        </div>
      </aside>
    </div>
  );
}
