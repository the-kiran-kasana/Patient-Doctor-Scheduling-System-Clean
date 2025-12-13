const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURL =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URL_CLOUD
        : process.env.MONGODB_URL_LOCAL;

    await mongoose.connect(mongoURL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

module.exports = { connectDB };
