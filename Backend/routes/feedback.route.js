const express = require("express");
const FeedbackModel = require("../models/Feedback.model");
const authMiddleware = require("../middleware/auth.middleware");

const FeedbackRoutes = express.Router();

// ------------------------------------------------------
// POST Feedback (Only Patient)
// ------------------------------------------------------
FeedbackRoutes.post("/review", authMiddleware(["patient"]), async (req, res) => {
  try {
    const { rating, review } = req.body;
    const patientId = req.user._id; // user from token


    const feedback = await FeedbackModel.create({
      rating,
      review
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to submit feedback", error: err.message });
  }
});

// ------------------------------------------------------
// GET: Logged-in User's own feedback only
// ------------------------------------------------------
FeedbackRoutes.get("/my", authMiddleware(["patient"]), async (req, res) => {


  try {
//    const patientId = req.user._id; // get from token

    const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 }).populate("userId", "username  email").lean();

    res.status(200).json({ feedbacks });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch feedbacks", error: err.message });
  }
});

module.exports = { FeedbackRoutes };
