// worker/notificationWorker.js
require("dotenv").config();
const { connectRabbit } = require("../config/RabbitMQ"); // Ensure correct file name (capitalization)
const { reminderQueue } = require("../config/scheduler");
const nodemailer = require("nodemailer");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

// ✅ Connect MongoDB
const DB = process.env.MONGODB_URL_LOCAL || "mongodb://127.0.0.1:27017/Patient-Doctor-Scheduling-System";
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Worker connected to MongoDB"))
  .catch((err) => console.error("❌ Worker MongoDB connection error:", err));

// ✅ Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

// ✅ Main Worker Function
async function start() {
  const channel = await connectRabbit();
  if (!channel) {
    console.error("❌ RabbitMQ channel not available");
    process.exit(1);
  }

  console.log("🐇 Worker is waiting for RabbitMQ messages...");

  // Consume messages from notifications queue
  channel.consume(
    "notifications",
    async (msg) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        console.log("📩 Worker received message:", payload.type, payload);

        // Optional: check if user has disabled notifications
        const user = await userModel.findById(payload.userId);
        if (user && user.notificationPreferences && !user.notificationPreferences.enabled) {
          console.log("🔕 User disabled notifications, skipping...");
          channel.ack(msg);
          return;
        }

        // Define email content
        let subject, html;
        if (payload.type === "confirmation") {
          subject = "Appointment Confirmation - Patient-Doctor Scheduling System";
          html = `
            <p>Dear ${payload.username},</p>
            <p>You have successfully booked your <b>${payload.appointmentType}</b> appointment.</p>
            <p><b>Appointment Date:</b> ${new Date(payload.BookDate).toLocaleString()}</p>
            <p>Thank you for using Patient-Doctor Scheduling System!</p>
          `;
        } else if (payload.type === "reminder") {
          subject = "Appointment Reminder - Patient-Doctor Scheduling System";
          html = `
            <p>Dear ${payload.username},</p>
            <p>This is a reminder for your upcoming <b>${payload.appointmentType}</b> appointment.</p>
            <p><b>Appointment Date:</b> ${new Date(payload.BookDate).toLocaleString()}</p>
            <p>If you need to reschedule, please login to your account.</p>
          `;
        } else {
          subject = payload.subject || "Notification";
          html = payload.html || `<pre>${JSON.stringify(payload, null, 2)}</pre>`;
        }

        // Send email
        const info = await transporter.sendMail({
          from: `"Patient-Doctor App" <${process.env.GOOGLE_APP_EMAIL}>`,
          to: payload.email,
          subject,
          html,
        });

        console.log("📧 Email sent successfully:", info.messageId);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Worker processing error:", err.message);
        channel.nack(msg, false, false); // discard message
      }
    },
    { noAck: false }
  );

  // Process Bull reminderQueue (optional)
  reminderQueue.process(async (job) => {
    try {
      const payload = job.data;

      const user = await userModel.findById(payload.userId);
      if (user && user.notificationPreferences && !user.notificationPreferences.enabled) {
        console.log("🔕 User disabled notifications - skipping reminder");
        return Promise.resolve();
      }

      // Publish reminder to RabbitMQ
      await channel.sendToQueue(
        "notifications",
        Buffer.from(
          JSON.stringify({
            ...payload,
            type: "reminder",
          })
        ),
        { persistent: true }
      );

      console.log("⏰ Scheduled reminder sent to RabbitMQ for:", payload.email);
      return Promise.resolve();
    } catch (err) {
      console.error("❌ Reminder job processing error:", err);
      throw err;
    }
  });

  reminderQueue.on("failed", (job, err) => {
    console.error("⚠️ Reminder job failed:", job.id, err);
  });
}

start().catch((err) => console.error("❌ Worker start error:", err));
