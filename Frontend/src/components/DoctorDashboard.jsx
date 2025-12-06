import { useState ,useEffect, createContext} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Cog , MessageSquare , CalendarDays ,LayoutDashboard , CalendarCheck, Clock, User, Loader2 , BookX , ClipboardClock} from "lucide-react";
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





  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Patient Name" };

  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const doctorsList = [ "Dr. Aman Shah","Dr. Kavita Rao", "Dr. Riya Sharma","Dr. Arjun Khanna","Dr. Sejal Mehta","Dr. Aman Gupta", "Dr. Manoj Yadav", ];

  const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM","02:30 PM", "03:00 PM", "03:30 PM",];

  const API_BASE = import.meta.env.VITE_API_BASE_URL;







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




const getAppointments = async () => {
  try {
    const response = await axios.get(`${API_BASE}/appointment/getUserAppointments/${userId}`, {  headers: { Authorization: `Bearer ${token}` } });
    if(response.data.appointments.status == "scheduled"){
       setAppointmentData(response.data.appointments || []);
    }else{
       setAppointmentData("No Appointments scheduled");
       setAppointmentHistoryData(response.data.appointments)
    }
  } catch (err) {
    console.log("Something went wrong while fetching Appointments  data:", err);
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
  handleAppointment();
}, []);









  return (

//   <AppointmentContext.Provider value={{ appointments, setAppointments }}>
//         {children}
//       </AppointmentContext.Provider>


    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6">
        <div className="flex flex-col items-center">
         <div className="relative flex flex-col  rounded-full hover:shadow-[0_0_25px_8px_rgba(0,200,255,0.7)] items-center">
           <img  src={preview || "https://i.pinimg.com/736x/3f/c1/08/3fc108d3f911ec7995359558b454bc66.jpg"}  className="rounded-full w-22 h-22 shadow-md object-cover" alt="profile" />
           <input type="file" accept="image/*" onChange={handleImageChange} id="profileUpload"  className="hidden" />
           <label htmlFor="profileUpload" className="absolute bottom-0 right-0 bg-white-500 text-white p-10 rounded-full cursor-pointer shadow-md" >
           </label>
         </div>

         <h2 className="mt-3 text-lg font-semibold">Hello, {userData?.username}</h2>
         <p className="text-lg text-gray-200">{userData?.email}</p>

{/*           <button className="mt-3 bg-red-500 px-4 py-1 rounded hover:bg-red-700"> Logout</button> */}
        </div>



        <nav className="mt-10 space-y-3">

          <div className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded cursor-pointer text-white"><LayoutDashboard size={18}/>Dashboard</div>
          <div className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded cursor-pointer text-white"><CalendarDays size={18}/><span>My Appointments </span></div>
          <div className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded cursor-pointer text-white"><MessageSquare size={18}/><span>My Feedback</span></div>
          <div className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded cursor-pointer text-white"> <Cog size={18} /><span>Setting</span></div>
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
              <Calendar onChange={setCalendarDate} value={calendarDate} tileClassName={tileClassName}/>
              <p className="text-sm mt-2 text-gray-700"> Selected Date: {calendarDate.toDateString()}</p>
          </div>


      </aside>
    </div>





  );
}
