const express = require("express");
const CalendarRoutes = express.Router();
const { oauth2Client, getAuthURL, getToken } = require("../config/googleCalendar");
const userModel = require("../models/user.model");
// authMiddleware temporarily removed for testing
// const authMiddleware = require("../middleware/auth.middleware");


// Step 1: Start Google OAuth (works directly in browser)
CalendarRoutes.get("/auth/google", async (req, res) => {
  try {
    // For testing, manually pass userId as query param (in real use → from JWT)
    const userId = req.query.userId || "replace_with_your_test_userId";

    // Include userId in "state" so we can retrieve it after redirect
    const authUrl = `${getAuthURL()}&state=${userId}`;
    console.log("Redirecting to:", authUrl);

    res.redirect(authUrl);
  } catch (err) {
    console.error("Error initiating Google OAuth:", err);
    res.status(500).json({ msg: "Error initiating Google OAuth" });
  }
});


// Step 2: Handle Google callback after login
CalendarRoutes.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const userId = req.query.state;

    if (!code) {
      return res.status(400).json({ msg: "Authorization code missing" });
    }

    // Exchange code for tokens
    const tokens = await getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("✅ Access Token:", tokens.access_token);
    console.log("✅ Refresh Token:", tokens.refresh_token);

    // Save tokens to your user in DB
    await userModel.updateOne({ _id: userId }, { googleTokens: tokens });

    res.send(`<h3>✅ Google Calendar connected successfully! You can now sync appointments.</h3>`);
  } catch (err) {
    console.error("❌ Error in Google OAuth callback:", err);
    res.status(500).json({ msg: "Failed to connect Google Calendar" });
  }
});







module.exports = CalendarRoutes;
