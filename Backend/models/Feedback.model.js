const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, trim: true },
    userId: { type:mongoose.Schema.Types.ObjectId , ref:"User" }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
