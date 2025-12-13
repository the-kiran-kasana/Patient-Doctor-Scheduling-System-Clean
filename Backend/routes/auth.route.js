const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userModel = require("../models/user.model");
require("dotenv").config();
const authRoutes = express.Router();
const saltRounds = 10;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});



authRoutes.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    await userModel.create({ username, email, password: hash, role });

    const registerLink = `http://localhost:6060/auth/verify?email=${email}`;
    await transporter.sendMail({
      from: `"Patient-Doctor App" <${process.env.GOOGLE_APP_EMAIL}>`,
      to: email,
      subject: "Successful Registration - Patient-Doctor Scheduling System",
      html: `
        <p>Dear ${username},</p>
        <p>You have successfully registered on the <b>Patient-Doctor Scheduling System</b>.</p>
        <p>Click the link below to verify your email:</p>
        <a href="${registerLink}" target="_blank">Verify Email</a>
      `,
    });

    res.status(200).json({ msg: "Signup successful. Verification email sent.", verifyLink: registerLink,});
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong during signup" });
  }
});


authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role ,  username: user.username},
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );


    res.status(200).json({ msg: "Login successful", token, user, });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong during login" });
  }
});



authRoutes.get("/verify", async (req, res) => {
  const { email } = req.query;
  res.send(`<h3>Email ${email} verified successfully!</h3>`);
});



authRoutes.get("/getUser/:id" , async (req ,res) => {
     try{
        let id = req.params.id;
        const existingUser = await userModel.findById(id);
        if (!existingUser) {
           return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ msg: " successful" , existingUser});
     }
     catch(err){
         res.status(500).json({ msg: "Something went wrong during fetch user data" });
     }
})


authRoutes.get("/getUser" , async (req ,res) => {
     try{
        let id = req.params.id;
        const existingUser = await userModel.findById(id);
        if (!existingUser) {
           return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ msg: " successful" , existingUser});
     }
     catch(err){
         res.status(500).json({ msg: "Something went wrong during fetch user data" });
     }
})

module.exports = { authRoutes };
