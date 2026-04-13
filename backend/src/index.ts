import express from "express";
import speakeasy from "speakeasy";
import mongoose from "mongoose";
import cors from "cors"; // ✅ ADD THIS

const app = express();
const PORT = 3000;

// Temporary secret (for demo)
let tempSecret: any;

// ✅ Enable CORS (VERY IMPORTANT)
app.use(cors());

// ✅ Enable JSON parsing
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/loginDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    tempSecret = speakeasy.generateSecret();

    const token = speakeasy.totp({
      secret: tempSecret.base32,
      encoding: "base32",
    });

    console.log("OTP:", token);

    return res.json({ message: "OTP sent to user" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// ✅ Verify OTP
app.post("/verify-otp", (req, res) => {
  const { token } = req.body;

  const verified = speakeasy.totp.verify({
    secret: tempSecret.base32,
    encoding: "base32",
    token,
    window: 2,
  });

  if (verified) {
    return res.json({ message: "MFA login successful" });
  }

  return res.status(401).json({ message: "Invalid OTP" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});