const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const { connectDB } = require("./config/db");
const authMiddleware = require("./middleware/auth.middleware");

const { authRoutes } = require("./routes/auth.route");
const { FeedbackRoutes } = require("./routes/feedback.route");
const { AppointmentRoutes } = require("./routes/appointment.route");
// const CalendarRoutes = require("./routes/googleAuth.routes"); // enable only if needed

const AppointmentModel = require("./models/Appointment.model");

const app = express();
const PORT = process.env.PORT || 6060;

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json());

app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? "*" // allow frontend domain later
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY || "calendar_secret",
    resave: false,
    saveUninitialized: true,
  })
);

/* -------------------- DATABASE -------------------- */

connectDB();

/* -------------------- ROUTES -------------------- */

app.use("/auth", authRoutes);
app.use("/feedback", FeedbackRoutes);
app.use("/appointment", AppointmentRoutes);
// app.use("/calendar", CalendarRoutes); // uncomment only if Google OAuth is configured

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to Appointment System API" });
});

app.get("/analytics", authMiddleware, async (req, res) => {
  res.json({ message: "Welcome to analytics", user: req.user });
});

/* -------------------- CRON JOB -------------------- */

cron.schedule("*/45 * * * *", async () => {
  try {
    const now = new Date();

    const appointments = await AppointmentModel.find({
      status: "scheduled",
    });

    const expiredIds = [];

    appointments.forEach((appt) => {
      const bookDate = new Date(appt.BookDate);
      const dateStr = bookDate.toISOString().split("T")[0];
      const appointmentDateTime = new Date(`${dateStr} ${appt.startTime}`);

      if (appointmentDateTime < now) {
        expiredIds.push(appt._id);
      }
    });

    if (expiredIds.length > 0) {
      const result = await AppointmentModel.updateMany(
        { _id: { $in: expiredIds } },
        { $set: { status: "cancelled" } }
      );

      console.log(`⏰ Cron: Cancelled ${result.modifiedCount} appointments`);
    }
  } catch (err) {
    console.error("❌ Cron Job Error:", err.message);
  }
});

/* -------------------- SERVER -------------------- */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
