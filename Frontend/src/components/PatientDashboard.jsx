import { useState ,useEffect} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Cog , MessageSquare , CalendarDays ,LayoutDashboard , CalendarCheck, Clock, User, Loader2} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";




export default function PatientDashboard() {
  const [appointmentType, setAppointmentType] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [userData, setUserData] = useState(null);
  const [appointmentData, setAppointmentData] = useState([]);
  const [appointmentHistoryData, setAppointmentHistoryData] = useState("No Appointments history");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);





  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Patient Name" };

  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const doctorsList = [ "Dr. Aman Shah","Dr. Kavita Rao", "Dr. Riya Sharma","Dr. Arjun Khanna","Dr. Sejal Mehta","Dr. Aman Gupta", "Dr. Manoj Yadav", ];

  const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM","02:30 PM", "03:00 PM", "03:30 PM",];

  const API_BASE = import.meta.env.VITE_API_BASE_URL;





  // BOOK APPOINTMENT
  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/appointment/Book_Appointment`,{ appointmentTypes: appointmentType, doctorName: doctor, reason: symptoms, BookDate: date, startTime: selectedSlot, },
         { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment Booked Successfully!");
    } catch (err) {
      console.log("error when bookings" , err);
      alert("Failed to book appointment!");
    }
  };


const handleUserData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/auth/getUser/${userId}`, {  headers: { Authorization: `Bearer ${token}` } });
    setUserData(response.data.existingUser);
    console.log("Successfully fetched user data:", response.data);

  } catch (err) {
    console.log("Something went wrong while fetching user data:", err);
  }
};



const getAppointments = async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/appointment/getSpecificUserAppointments/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const appts = response.data.appointments || [];

    if (appts.length === 0) {
      setAppointmentData("No Appointments found");
      setAppointmentHistoryData([]);
      return;
    }

    // Filter scheduled appointments
    const scheduled = appts.filter(a => a.status === "scheduled");

    if (scheduled.length > 0) {
      setAppointmentData(scheduled);
      console.log("Scheduled appointments:", scheduled);
    } else {
      setAppointmentData("No Appointments scheduled");
      setAppointmentHistoryData(appts);
      console.log("All are history:", appts);
    }

  } catch (err) {
    console.log("Something went wrong while fetching Appointments data:", err);
  }
};







const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPreview(URL.createObjectURL(file)); // show preview
  }
};


const tileClassName = ({ date, view }) => {
//   if (view === "month") {
//     const formatted = date.toISOString().split("T")[0];
//
//     const isBooked = appointmentData.some((appt) => appt.BookDate === formatted);
//
//     console.log(isBooked)
//
//     //return isBooked ? "bg-blue-300 rounded-lg text-white font-bold" : "";
//   }
};



useEffect(() => {
  getAppointments()
  handleUserData();
}, []);



  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white/80 backdrop-blur-md shadow-xl text-white flex flex-col p-6">
        <div className="flex flex-col items-center">
         <div className="relative flex flex-col  rounded-full hover:shadow-[0_0_25px_8px_rgba(0,200,255,0.7)] items-center">
           <img  src={preview || "https://i.pinimg.com/736x/e6/7d/27/e67d27d145deb0aab8adf86a955562b5.jpg"}  className="rounded-full w-22 h-22 shadow-md object-cover" alt="profile" />
           <input type="file" accept="image/*" onChange={handleImageChange} id="profileUpload"  className="hidden" />
           <label htmlFor="profileUpload" className="absolute bottom-0 right-0 bg-white-500 text-white p-10 rounded-full cursor-pointer " >
           </label>
         </div>

         <h2 className="mt-3 text-lg text-gray-900 font-semibold">Hello, {userData?.username}</h2>
         <p className="  text-gray-900 text-gray-200">{userData?.email}</p>

{/*           <button className="mt-3 bg-red-500 px-4 py-1 rounded hover:bg-red-700"> Logout</button> */}
        </div>




        <nav className="mt-10 space-y-3">

          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded cursor-pointer text-gray-900"><LayoutDashboard size={18}/><Link to="/PatientDashboard" className="hover:text-yellow-300">Dashboard</Link></div>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded cursor-pointer text-gray-900"><CalendarDays size={18}/><span><Link to="/MyAppointments" className="hover:text-yellow-300">My Appointments </Link></span></div>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded cursor-pointer text-gray-900"><MessageSquare size={18}/><span><Link to="/Feedback" className="hover:text-yellow-300">My Feedback</Link></span></div>
{/*           <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded cursor-pointer text-gray-900"> <Cog size={18} /><span>Setting</span></div> */}
        </nav>


      </aside>



      {/* MIDDLE SECTION */}
      <main className="flex-1 px-10 py-8">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-5"> Book Appointment </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg max-w-full">
          <form className="space-y-4" onSubmit={handleBook}>

            {/* Appointment Type */}
            <div>
              <label className="font-semibold text-gray-700">Select Appointment Type</label>
              <select  className="w-full border p-2 rounded mt-1" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} >
                <option value="">Select appointment type</option>
                <option>in-person</option>
                <option>telemedicine</option>
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="font-semibold text-gray-700">Choose Doctor</label>
              <select
                className="w-full border p-2 rounded mt-1"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              >
                <option value="">Select Doctor</option>
                {doctorsList.map((doc) => (
                  <option key={doc}>{doc}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="font-semibold text-gray-700">Select Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded mt-1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="font-semibold text-gray-700">Select Time Slot</label>

              <div className="grid grid-cols-3 gap-3 mt-2">
                {slots.map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setSelectedSlot(time)}
                    className={`p-2 rounded border ${
                      selectedSlot === time ? "bg-blue-700 text-white" : "bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
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
      <aside className="w-[380px] p-10 space-y-6">

        {/* My Appointments */}
        <h2 className="font-bold  text-2xl text-center text-blue-800">Appointment Details</h2>
        <hr />
       <div className="bg-white shadow-md rounded-xl p-4">
         <h2 className="font-bold text-lg text-blue-900 mb-3">My Appointments</h2>

         {Array.isArray(appointmentData) && appointmentData.length > 0 ? (
           appointmentData.map((appt) => (
             <div
               key={appt._id}
               className="p-3 border-l-4 border-blue-700 bg-blue-50 mb-2 rounded"
             >
               <h3 className="font-semibold">
                 {appt.doctorName} ({appt.appointmentTypes})
               </h3>

               <p className="text-sm text-gray-600">
                 {appt.BookDate
                   ? new Date(appt.BookDate).toLocaleDateString("en-GB", {
                       day: "2-digit",
                       month: "short",
                       year: "numeric",
                     })
                   : "No Date"}{" "}
                 {appt.startTime}
               </p>

               <p className="text-sm text-gray-600">{appt.reason}</p>
               <p className="text-sm text-gray-600 font-semibold text-green-600">
                 {appt.status}
               </p>
             </div>
           ))
         ) : (
           <p className="text-gray-500 text-center">No Appointments Scheduled</p>
         )}
       </div>





        {/* Calendar */}

          <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="font-bold text-lg text-blue-900 mb-2">Calendar</h2>
              <Calendar onChange={setCalendarDate} value={calendarDate} tileClassName={tileClassName}/>
              <p className="text-sm mt-2 text-gray-700"> Selected Date: {calendarDate.toDateString()}</p>
          </div>

      </aside>
    </div>





  );
}
