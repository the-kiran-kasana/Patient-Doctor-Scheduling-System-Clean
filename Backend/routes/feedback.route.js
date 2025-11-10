// routes/FeedbackRoutes.js
const express = require("express");
const FeedbackModel = require("../models/Feedback.model");
const authMiddleware = require("../middleware/auth.middleware");

const FeedbackRoutes = express.Router();

// ✅ Submit feedback
FeedbackRoutes.post("/", authMiddleware(["patient"]), async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, review } = req.body;
    const patientId = req.user;

    const feedback = await FeedbackModel.create({ patientId, doctorId, appointmentId, rating, review });
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit feedback", error: err.message });
  }
});

// ✅ Get feedback for a doctor
FeedbackRoutes.get("/doctor/:doctorId", authMiddleware(["doctor", "admin"]), async (req, res) => {
  try {
    const { doctorId } = req.params;
    const feedbacks = await FeedbackModel.find({ doctorId }).populate("patientId", "username email").sort({ createdAt: -1 });
    
    // Average rating
    const avgRating =
      feedbacks.reduce((acc, f) => acc + f.rating, 0) / (feedbacks.length || 1);

    res.status(200).json({ feedbacks, avgRating: avgRating.toFixed(1) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feedback", error: err.message });
  }
});

module.exports = { FeedbackRoutes };
