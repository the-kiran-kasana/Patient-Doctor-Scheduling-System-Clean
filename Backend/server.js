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

connectRabbit();

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
  credentials: true,
}));


cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const result = await AppointmentModel.updateMany(
      { endTime: { $lt: now }, status: { $nin: ["cancelled", "completed"] } },
      { $set: { status: "cancelled" } }
    );
    console.log(`Updated ${result.modifiedCount} expired appointments.`);
  } catch (err) {
    console.error("Cron job error:", err);
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
