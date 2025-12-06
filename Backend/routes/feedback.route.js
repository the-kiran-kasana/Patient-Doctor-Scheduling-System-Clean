const express = require("express");
const FeedbackModel = require("../models/Feedback.model");
const authMiddleware = require("../middleware/auth.middleware");

const FeedbackRoutes = express.Router();

// ✅ Submit Feedback
FeedbackRoutes.post("/review", authMiddleware(["patient"]), async (req, res) => {
  try {
    const { rating, review } = req.body;

    const feedback = await FeedbackModel.create({
      rating,
      review,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to submit feedback",
      error: err.message,
    });
  }
});


// ✅ Get all feedback + Avg Rating
FeedbackRoutes.get("/doctor", async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 });

    const avg =
      feedbacks.reduce((acc, item) => acc + item.rating, 0) /
      (feedbacks.length || 1);

    res.status(200).json({
      feedbacks,
      avgRating: avg.toFixed(1),
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch feedbacks",
      error: err.message,
    });
  }
});

module.exports = { FeedbackRoutes };
