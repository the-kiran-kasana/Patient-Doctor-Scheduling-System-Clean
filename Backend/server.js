const express = require("express");
const { connectDB } = require("./config/db");
const { connectRabbit, closeRabbit } = require("./config/RabbitMQ");
const { authRoutes } = require("./routes/auth.route");
const { FeedbackRoutes } = require("./routes/feedback.route");
const { AppointmentRoutes } = require("./routes/appointment.route");
const CalendarRoutes = require("./routes/googleAuth.routes");
const redis = require("./config/redis");
const session = require("express-session");
const cors = require("cors");
const AppointmentModel = require("./models/Appointment.model");
const cron = require("node-cron");

require("dotenv").config();
const authMiddleware = require("./middleware/auth.middleware");
const app = express();
const PORT = process.env.PORT || 6060;
//
//const authMiddleware = require("./middleware/auth.middleware");
//app.use("/appointments", authMiddleware(["doctor", "patient"]), AppointmentRoutes);


app.use(cors());
connectDB();

//connectRabbit();

app.use(express.json());


app.use(
  session({
    secret: "calendar_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/feedback", FeedbackRoutes);
app.use("/appointment", AppointmentRoutes);
app.use("/calendar", CalendarRoutes);


app.use(cors({
  origin: "http://localhost:5173", // or the port your frontend runs on
//  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));



cron.schedule("*/45 * * * *", async () => {
  try {
    const now = new Date();

    // 1️⃣ Get all scheduled appointments
    const appointments = await AppointmentModel.find({
      status: "scheduled"
    });

    const expiredAppointmentIds = [];

    appointments.forEach((appt) => {
      // 2️⃣ Extract date (yyyy-mm-dd)
      const bookDate = new Date(appt.BookDate);
      const dateStr = bookDate.toISOString().split("T")[0];

      // 3️⃣ Combine date + startTime
      const appointmentDateTime = new Date(`${dateStr} ${appt.startTime}`);

      // 4️⃣ If appointment time passed → cancel
      if (appointmentDateTime < now) {
        expiredAppointmentIds.push(appt._id);
      }
    });

    // 5️⃣ Update expired appointments
    if (expiredAppointmentIds.length > 0) {
      const result = await AppointmentModel.updateMany(
        { _id: { $in: expiredAppointmentIds } },
        { $set: { status: "cancelled" } }
      );

      console.log(
        `⏰ Cron Job: Cancelled ${result.modifiedCount} expired appointments`
      );
    } else {
      console.log("⏰ Cron Job: No expired appointments");
    }

  } catch (err) {
    console.error("❌ Cron Job Error:", err);
  }
});




// ✅ Default Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to Appointment System API" });
});

//// ✅ 404 Route
//app.use((req, res) => {
//  res.status(404).json({ msg: "404 Not Found" });
//});


app.get("/analytics", authMiddleware, async (req, res) => {
  res.json({ message: "Welcome to analytics", user: req.user });
});



// ✅ Server Start
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
