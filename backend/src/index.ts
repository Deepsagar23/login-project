import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const app = express();
const PORT = 3000;

// Temporary OTP storage
let otpStore: any = {};

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/loginDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// ✅ EMAIL FUNCTION
const sendOTPEmail = async (email: string, otp: number) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thatideepsagar25@gmail.com",
      pass: "kxft mjdw rxrh ktex"
    }
  });

  await transporter.sendMail({
    from: "thatideepsagar25@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`
  });
};

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ REGISTER (UPDATED WITH HASHING)
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Enter email & password" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.json({ message: "User already exists" });
  }

  // 🔐 HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ email, password: hashedPassword });

  return res.json({ message: "User registered successfully ✅" });
});

// ✅ LOGIN + SEND OTP (UPDATED WITH HASH CHECK)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Enter email & password" });
  }

  const user: any = await User.findOne({ email: username });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🔐 COMPARE HASHED PASSWORD
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[username] = {
    otp,
    expiry: Date.now() + 5 * 60 * 1000
  };

  try {
    await sendOTPEmail(username, otp);
    return res.json({ message: "OTP sent to your email 📧" });
  } catch (error) {
    console.log("EMAIL ERROR:", error);
    return res.status(500).json({ message: "Error sending email" });
  }
});

// ✅ VERIFY OTP
app.post("/verify-otp", (req, res) => {
  const { username, token } = req.body;

  const record = otpStore[username];

  if (!record) {
    return res.status(400).json({ message: "No OTP found" });
  }

  if (record.expiry < Date.now()) {
    return res.status(401).json({ message: "OTP expired" });
  }

  if (record.otp != token) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  return res.json({ message: "MFA Authenticated ✅" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});