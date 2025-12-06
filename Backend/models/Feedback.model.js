const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, trim: true },
    patientId: { type: String },  // optional
    doctorId: { type: String },   // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
