const express = require("express");
const { google } = require("googleapis");
const redis = require("../config/redis");
const nodemailer = require("nodemailer");
const { connectRabbit } = require("../config/RabbitMQ");
const { reminderQueue } = require("../config/scheduler");
const { oauth2Client } = require("../config/googleCalendar");
const authMiddleware = require("../middleware/auth.middleware");
const userModel = require("../models/user.model");
const AppointmentModel = require("../models/Appointment.model");
const AppointmentRoutes = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});







AppointmentRoutes.post("/Book_Appointment", authMiddleware(["doctor", "patient"]), async (req, res) => {
  try {
        const userId = req.user;
        const appointmentData = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
           return res.status(404).json({ message: "User not found" });
        }

        const newAppointment = await AppointmentModel.create({...appointmentData,userId, BookDate: appointmentData.BookDate || new Date(), });



       // ✅ Set credentials for Google Calendar API
        if (!user.googleTokens || !user.googleTokens.access_token) {
          return res.status(400).json({ message: "Please connect Google Calendar first!" });
        }
        oauth2Client.setCredentials(user.googleTokens);
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const event = {
          summary: `Appointment with Dr. ${appointmentData.doctorName}`,
          description: appointmentData.reason || "Appointment scheduled",
          start: { dateTime: appointmentData.startTime, timeZone: "Asia/Kolkata" },
          end: { dateTime: appointmentData.endTime, timeZone: "Asia/Kolkata" },
        };
        const result = await calendar.events.insert({calendarId: "primary",resource: event, });
        await AppointmentModel.updateOne({ _id: newAppointment._id },{ googleEventId: result.data.id });



        // ✅ Queue Confirmation Message
        const channel = await connectRabbit();
        const confirmationPayload = {
          type: "confirmation",
          userId: user._id,
          email: user.email,
          username: user.username,
          appointmentId: newAppointment._id,
          appointmentType: newAppointment.AppointmentTypes,
          createdAt: new Date(),
        };

        await channel.sendToQueue("notifications", Buffer.from(JSON.stringify(confirmationPayload)), {
          persistent: true,
        });

    // ✅ Schedule Reminder
    if (user.notificationPreferences && user.notificationPreferences.enabled) {
      const minutesBefore = user.notificationPreferences.minutesBefore || 60;
      const BookDate = new Date(newAppointment.BookDate);
      const reminderTime = new Date(BookDate.getTime() - minutesBefore * 60 * 1000);
      const now = new Date();

      if (reminderTime > now) {
        await reminderQueue.add(
          {
            type: "reminder",
            userId: user._id,
            email: user.email,
            username: user.username,
            appointmentId: newAppointment._id,
            appointmentType: newAppointment.AppointmentTypes,
            BookDate,
          },
          { delay: reminderTime.getTime() - now.getTime(), attempts: 3, backoff: 60000 }
        );
      } else {
        await channel.sendToQueue(
          "notifications",
          Buffer.from(
            JSON.stringify({
              type: "reminder",
              userId: user._id,
              email: user.email,
              username: user.username,
              appointmentId: newAppointment._id,
              appointmentType: newAppointment.AppointmentTypes,
              BookDate,
            })
          ),
          { persistent: true }
        );
      }
    }

    // ✅ Send success response
    res.status(200).json({ message: "Appointment booked successfully and added to Google Calendar!", appointment: newAppointment,   eventLink: result.data.htmlLink,  });
  } catch (err) {
    console.error("❌ Error in booking appointment:", err);
    res.status(500).json({ msg: "Something went wrong while booking appointment" });
  }
});











AppointmentRoutes.get("/showAppointment", authMiddleware(["doctor"]), async (req, res) => {
  try {
    const appointments = await AppointmentModel.find().sort({ BookDate: 1 });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ msg: "No appointments found" });
    }

    res.status(200).json({ message: "Appointments fetched successfully", appointments });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong while fetching appointments" });
  }
});

AppointmentRoutes.post("/sendNotification", async (req, res) => {
  try {
    const { email, message } = req.body;
    const channel = await connectRabbit();
    const data = { type: "manual", email, message, time: new Date() };

    await channel.sendToQueue("notifications", Buffer.from(JSON.stringify(data)), { persistent: true });
    console.log("📨 Message sent to queue:", data);
    res.send("Message queued successfully!");
  } catch (err) {
    console.error("❌ sendNotification error:", err);
    res.status(500).json({ msg: "Failed to queue notification" });
  }
});



AppointmentRoutes.get("/analytics/overview", authMiddleware(["doctor","admin"]), async (req, res) => {
    try {
      const totalAppointments = await AppointmentModel.countDocuments();
      const completed = await AppointmentModel.countDocuments({ status: "completed" });
      const cancelled = await AppointmentModel.countDocuments({ status: "cancelled" });
      const upcoming = await AppointmentModel.countDocuments({ status: "scheduled" });
      const totalRevenue = completed * 500;

      res.status(200).json({ totalAppointments,completed, cancelled,upcoming, noShowRate: ((cancelled / totalAppointments) * 100).toFixed(2) + "%", totalRevenue, });
    } catch (err) {
      res.status(500).json({ msg: "Failed to fetch overview analytics", error: err.message });
    }
  }
);




AppointmentRoutes.get("/analytics/trends", authMiddleware(["doctor", "admin"]), async (req, res) => {
  try {
    const trends = await AppointmentModel.aggregate([ {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$BookDate" } },
          totalAppointments: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({ message: "Appointment trends fetched", trends });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching appointment trends", error: err.message });
  }
});







AppointmentRoutes.get("/analytics/provider-performance", authMiddleware(["doctor" , "admin"]), async (req, res) => {
  try {
    const performance = await AppointmentModel.aggregate([
      {
        $group: {
          _id: "$doctorName",
          totalAppointments: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          avgWaitTime: { $avg: "$waitTime" },
        },
      },
    ]);

    res.status(200).json({ message: "Provider performance fetched", performance });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching provider performance", error: err.message });
  }
});





AppointmentRoutes.get("/analytics/predict-cancellations", authMiddleware(["admin" , "doctor" ]), async (req, res) => {
  try {
    const data = await AppointmentModel.find({}, "patientName status createdAt");
    const risk = data.map((a) => {
      const daysSinceBooking = (new Date() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24);
      const riskScore = daysSinceBooking > 7 && a.status === "scheduled" ? "High" : "Low";
      return { patient: a.patientName, status: a.status, riskScore };
    });

    res.status(200).json({ message: "Predicted cancellation risk", risk });
  } catch (err) {
    res.status(500).json({ msg: "Error predicting cancellations", error: err.message });
  }
});



AppointmentRoutes.put( "/update-expired", authMiddleware(["admin", "doctor"]),  async (req, res) => {
    try {
      const now = new Date();

      // Update appointments where endTime < now AND status is not already cancelled or completed
      const result = await AppointmentModel.updateMany(
        {
          endTime: { $lt: now },
          status: { $nin: ["cancelled", "completed"] },
        },
        { $set: { status: "cancelled" } }
      );

      res.status(200).json({ message: "Expired appointments updated successfully", modifiedCount: result.modifiedCount, });
    } catch (err) {
      console.error("Error updating expired appointments:", err);
      res.status(500).json({ msg: "Failed to update expired appointments", error: err.message });
    }
  }
);





AppointmentRoutes.get(
  "/upcoming",
  authMiddleware(["doctor", "patient"]),
  async (req, res) => {
    try {
      const userId = req.user;

      // Find upcoming appointments for this user (doctor or patient)
      const now = new Date();
      const appointments = await AppointmentModel.find({
        userId, // Filter by current user
        startTime: { $gte: now }, // Only upcoming appointments
      }).sort({ startTime: 1 }); // Sort by soonest first

      res.status(200).json({ appointments });
    } catch (err) {
      console.error("Error fetching upcoming appointments:", err);
      res.status(500).json({ msg: "Failed to fetch upcoming appointments", error: err.message });
    }
  }
);


module.exports = { AppointmentRoutes };
