import { useState ,useEffect, createContext} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Cog , MessageSquare , CalendarDays ,LayoutDashboard ,ChartNoAxesColumn, CalendarCheck, Clock, User, Loader2 , BookX , ClipboardClock} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
export const AppointmentContext = createContext();




export default function DoctorDashboard() {
  const [appointmentType, setAppointmentType] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [userData, setUserData] = useState(null);
  const [fetchAppointment, setFetchAppointment] = useState([]);
  const [todayAppointment, setTodayAppointment] = useState([]);
  const [totalAppointment , setTotalAppointment] = useState(0);
  const [pendingAppointment , setPendingAppointment] = useState(0);
  const [cancelledAppointment , setCancelledAppointment] = useState(0);
  const [completedAppointment , setCompletedAppointment] = useState(0);
  const [appointmentData, setAppointmentData] = useState([]);
  const [appointmentHistoryData, setAppointmentHistoryData] = useState("No Appointments history");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highlightDates, setHighlightDates] = useState([]);







  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Patient Name" };

  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const doctorsList = [ "Dr. Aman Shah","Dr. Kavita Rao", "Dr. Riya Sharma","Dr. Arjun Khanna","Dr. Sejal Mehta","Dr. Aman Gupta", "Dr. Manoj Yadav", ];

  const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM","02:30 PM", "03:00 PM", "03:30 PM",];

  const API_BASE = import.meta.env.VITE_API_BASE_URL;



const formatDate = (date) => {
  return date.toLocaleDateString("en-CA"); // gives "YYYY-MM-DD" in LOCAL timezone
};




const handleAppointment = async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/appointment/showAppointment`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const appointments = response.data.appointments;

//     setFetchAppointment(appointments);
    setTotalAppointment(appointments.length);

    const result = appointments.reduce(
      (acc, apt) => {
        if (apt.status === "scheduled") acc.pending++;
        else if (apt.status === "completed") acc.completed++;
        else acc.cancelled++;
        return acc;
      },
      { pending: 0, completed: 0, cancelled: 0 }
    );

    const upComing = appointments.filter(appt => ["scheduled"].includes(appt.status))
    setFetchAppointment(upComing);

    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = appointments.filter(appt =>  appt.BookDate.split("T")[0] === today);
    setTodayAppointment(todayAppointments);


    setPendingAppointment(result.pending);
    setCompletedAppointment(result.completed);
    setCancelledAppointment(result.cancelled);

  } catch (err) {
    console.log("error when fetching appointment", err);
    alert("Failed to fetch appointment!");
  }
};




const handleUserData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/auth/getUser/${userId}`, {  headers: { Authorization: `Bearer ${token}` } });
    setUserData(response.data.existingUser);

  } catch (err) {
    console.log("Something went wrong while fetching user data:", err);
  }
};



// Convert any date to YYYY-MM-DD (no timezone issues)
const toYMD = (inputDate) => {
  const d = new Date(inputDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};


const getAppointments = async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/appointment/getUserAppointments/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const allAppointments = response.data.appointments || [];

    // Highlight only upcoming scheduled appointments
    const upcoming = allAppointments
      .filter(a => a.status === "scheduled")
      .map(a => toYMD(a.BookDate));  // Convert to YYYY-MM-DD

    console.log("Highlight dates =>", upcoming);

    setHighlightDates(upcoming);
    setAppointmentData(allAppointments);

  } catch (err) {
    console.log("Error fetching appointments:", err);
  }
};


const tileClassName = ({ date, view }) => {
  if (view === "month") {
    const formatted = toYMD(date);

    if (highlightDates.includes(formatted)) {
      return "highlight-appointment-date";
    }
  }
  return null;
};

const handleUpdateStatus = async (appointmentId, newStatus) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.patch(
      `${API_BASE}/appointment/update/${appointmentId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Updated appointment:", res.data.updatedAppointment);

    // Refresh appointment list after update
    getAppointments(); // your function to fetch appointments
  } catch (err) {
    console.error("Error updating appointment status:", err);
  }
};



const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPreview(URL.createObjectURL(file)); // show preview
  }
};





useEffect(() => {
  getAppointments()
  handleUserData();
  handleAppointment();
}, []);









  return (


    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white/80 backdrop-blur-md shadow-xl text-white flex flex-col p-6">
        <div className="flex flex-col items-center">
        <div className="relative group flex flex-col items-center">

          {/* Profile Image */}
          <img
            src={
              preview ||
              "https://i.pinimg.com/736x/e6/7d/27/e67d27d145deb0aab8adf86a955562b5.jpg"
            }
            alt="profile"
            className="w-25 h-25 rounded-full object-cover shadow-md
                       transition-all duration-300 group-hover:shadow-[0_0_25px_8px_rgba(0,200,255,0.6)]"
          />

          {/* Hidden Input */}
          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Upload Button */}
          <label
            htmlFor="profileUpload"
            className="absolute bottom-0 right-0 bg-pink-200 text-white
                       p-1 rounded-full cursor-pointer shadow-md hover:bg-indigo-700
                       transition duration-200 flex items-center justify-center"
          >
            {/* Camera Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h2l2-3h10l2 3h2v13H3V7zm9 3a4 4 0 110 8 4 4 0 010-8z"
              />
            </svg>
          </label>

        </div>


         <h2 className="mt-3 text-lg text-gray-900 font-semibold">Hello, {userData?.username}</h2>
         <p className="  text-gray-900 text-gray-200">{userData?.email}</p>

{/*           <button className="mt-3 bg-red-500 px-4 py-1 rounded hover:bg-red-700"> Logout</button> */}
        </div>



        <nav className="mt-10 space-y-3">

          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded cursor-pointer text-gray-900"><LayoutDashboard size={18}/><Link to="/DoctorDashboard" className="hover:text-yellow-300">Dashboard</Link></div>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded cursor-pointer text-gray-900"><CalendarDays size={18}/><span><Link to="/upcoming-appointments" className="hover:text-yellow-300">Appointments</Link> </span></div>
         <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded cursor-pointer text-gray-900"><ChartNoAxesColumn size={18}/><span><Link to="/AnalyticsDashboard" className="hover:text-yellow-300">Analytic</Link></span></div>
        </nav>


      </aside>






   {/* MIDDLE SECTION */}
  <main className="flex-1 p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-100 min-h-screen">

    {/* ===== Today Appointment ===== */}
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100">

      <h2 className="mb-6 text-2xl font-bold text-center text-blue-800 tracking-wide">
        Today Appointments
      </h2>

      {todayAppointment && todayAppointment.length > 0 ? (
        todayAppointment.map((h, id) => (
          <div
            key={id}
            className="p-4 mb-4 rounded-xl border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white shadow-sm hover:shadow-md transition"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg text-gray-800">
                {h.userId?.username}
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {h.appointmentTypes}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-1">{h.reason}</p>

            {/* Bottom Row */}
            <div className="flex justify-between items-center mt-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                {h.status}
              </span>



           <button className="text-red-700 border px-3 py-1 rounded"onClick={() => handleUpdateStatus(h._id, "cancel")}> Cancel </button>
           <button className="text-green-700 border px-3 py-1 rounded" onClick={() => handleUpdateStatus(h._id, "completed")} > Complete</button>


              <span className="text-sm font-semibold text-gray-700">
                {h.startTime}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No appointments today</p>
      )}
    </div>

    {/* ===== Upcoming Appointment ===== */}
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100">

      <h2 className="mb-6 text-2xl font-bold text-center text-purple-800 tracking-wide">
        Upcoming Appointments
      </h2>

      {fetchAppointment && fetchAppointment.length > 0 ? (
        fetchAppointment.map((h, id) => (
          <div
            key={id}
            className="p-4 mb-4 rounded-xl border-l-4 border-purple-600 bg-gradient-to-r from-purple-50 to-white shadow-sm hover:shadow-md transition"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg text-gray-800">
                {h.userId?.username}
              </h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {h.appointmentTypes}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-1">
              {h.reason}
            </p>

            {/* Date & Status */}
            <div className="flex justify-between items-center mt-3">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full capitalize">
                {h.status}
              </span>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">
                  {h.startTime}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(h.BookDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No upcoming appointments</p>
      )}
    </div>

  </main>









      {/* RIGHT SECTION */}
      <aside className="w-[380px] p-10 space-y-6">


        <h2 className="font-bold  text-2xl text-center text-blue-800">Appointment Details</h2>
        <hr />



       <div className="bg-white shadow-lg rounded-2xl p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
         <div className="flex items-center justify-center text-blue-900"> <CalendarDays size={32} /> </div>
         <div className="w-[2px] h-12 bg-gray-300"></div>
         <div>
           <h2 className="text-base font-semibold text-gray-700"> Total Appointments</h2>
           <p className="text-2xl font-bold text-blue-800">{totalAppointment}</p>
         </div>
       </div>



        <div className="bg-white shadow-lg rounded-2xl p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
           <div className="flex items-center justify-center text-blue-900"><ClipboardClock size={32}/></div>
           <div className="w-[2px] h-12 bg-gray-300"></div>
            <div>
              <h2 className="font-semibold  text-gray-700 text-base">Pending Appointments</h2>
              <p className="text-2xl font-blod text-yellow-500">{pendingAppointment}</p>
            </div>
        </div>


        <div className="bg-white shadow-lg rounded-2xl p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-center text-blue-900"><CalendarCheck size={32}/></div>
          <div className="w-[2px] h-12 bg-gray-300"></div>
          <div>
             <h2 className="font-semibold  text-gray-700  text-base">Complete Appointments</h2>
             <p className="text-2xl font-bold text-green-600">{completedAppointment}</p>
          </div>
         </div>


        <div className="bg-white shadow-lg rounded-2xl p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-center text-blue-900"><BookX size={32}/></div>
          <div className="w-[2px] h-12 bg-gray-300"></div>
          <div>
             <h2 className="font-semibold  text-gray-700  text-base">Cancelled Appointments</h2>
             <p className="text-2xl font-bold text-red-600">{completedAppointment}</p>
          </div>
        </div>




          <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="font-bold text-lg text-blue-900 mb-2">Calendar</h2>
              <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
                tileClassName={tileClassName}
              />

{/*               <Calendar onChange={setCalendarDate} value={calendarDate} tileClassName={tileClassName}/> */}
              <p className="text-sm mt-2 text-gray-700"> Selected Date: {calendarDate.toDateString()}</p>
          </div>


      </aside>
    </div>





  );
}
