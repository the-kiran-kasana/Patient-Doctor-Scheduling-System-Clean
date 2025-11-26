import { useState ,useEffect} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Cog , MessageSquare , CalendarDays ,LayoutDashboard , CalendarCheck, Clock, User, Loader2} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";




export default function DoctorDashboard() {
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
    const response = await axios.get(`${API_BASE}/appointment/getUserAppointments/${userId}`, {  headers: { Authorization: `Bearer ${token}` } });
    if(response.data.appointments.status == "scheduled"){
       setAppointmentData(response.data.appointments || []);
       console.log("Successfully fetched Appointments  data:", response.data.appointments);
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
}, []);









  return (
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
          <div className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded cursor-pointer text-white"><CalendarDays size={18}/><spam>My Appointments </spam></div>
          <div className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded cursor-pointer text-white"><MessageSquare size={18}/><span>My Feedback</span></div>
          <div className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded cursor-pointer text-white"> <Cog size={18} /><span>Setting</span></div>
        </nav>


      </aside>





      {/* MIDDLE SECTION */}
      <main className="flex-1 px-10 py-8 gap-10 grid grid-cols-2">
{/*         <h1 className="text-3xl font-bold text-blue-800  text-center mb-5"> Book Appointment </h1> */}

        <div className="bg-white p-6 rounded-xl shadow-lg font-bold text-2xl text-center text-blue-800  max-w-full">Upcoming Appointment</div>

        <div className="bg-white p-6 rounded-xl shadow-lg  max-w-full"></div>
      </main>
















      {/* RIGHT SECTION */}
      <aside className="w-[380px] p-10 space-y-6">


        <h2 className="font-bold  text-2xl text-center text-blue-800">Appointment Details</h2>
        <hr />
        <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="font-bold text-lg text-blue-900 mb-3">Pending Appointments</h2>
              <p className="text-sm text-gray-600">{appointmentData?.status}</p>
        </div>


        <div className="bg-white shadow-md rounded-xl p-4">
                      <h2 className="font-bold text-lg text-blue-900 mb-3">Completed Appointments</h2>
                      <div className="p-3 border-l-4 border-blue-700 bg-blue-50 mb-2 rounded">
                      <p className="text-sm text-gray-600">{appointmentData?.status}</p>
                      </div>
         </div>


         <div className="bg-white shadow-md rounded-xl p-4">
                              <h2 className="font-bold text-lg text-blue-900 mb-3">Cancelled Appointments</h2>
                              <p className="text-sm text-gray-600">{appointmentData?.status}</p>
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
