const express = require("express");
const router = express.Router();
const db = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../secret");
const saltRounds = 7;
const { send_otp, verify_otp } = require("../controllers/otp_email");

router.post("/register-step1", async (req, res) => {
  const { name, user_name, email } = req.body;

  if (!name || !user_name || !email) {
    return res.status(400).json({ message: "Name, username and email are required." });
  }

  const checkQuery = `SELECT * FROM users WHERE user_name = ? OR email = ?`;
  db.query(checkQuery, [user_name, email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (results.length > 0) {
      return res.status(400).json({ message: "Username or email already exists." });
    }

    // Send OTP to email
    await send_otp(email);
    res.status(200).json({
      message: "✅ OTP sent to email. Please verify and proceed.",
      name, user_name, email
    });
  });
});

// Register Step 2: User verifies OTP and submits password
router.post("/register-step2", async (req, res) => {
  const { name, user_name, email, otp, password } = req.body;

  if (!name || !user_name || !email || !otp || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const valid = verify_otp(email, otp);
  if (!valid) return res.status(401).json({ message: "Invalid or expired OTP." });

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const insertQuery = `INSERT INTO users (name, user_name, email, password) VALUES (?, ?, ?, ?)`;

  db.query(insertQuery, [name, user_name, email, hashedPassword], (err) => {
    if (err) return res.status(500).json({ message: "Error creating user." });

    const token = jwt.sign({ user_name, email }, secret, { expiresIn: "2h" });
    res.status(200).json({ message: "✅ Registration successful!", token });
    
  });
  
});

// Login Step 1: User submits username and email
router.post("/login-step1", (req, res) => {
  const { user_name, email } = req.body;

  if (!user_name || !email) {
    return res.status(400).json({ message: "Username and email are required." });
  }

  const query = `SELECT * FROM users WHERE user_name = ? AND email = ?`;
  db.query(query, [user_name, email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "User not found or email mismatch." });
    }

    // Send OTP to email
    await send_otp(email);
    res.status(200).json({ message: "✅ OTP sent. Proceed to password entry.", email, user_name });
  });
});

// Login Step 2: User verifies OTP and enters password
router.post("/login-step2", async (req, res) => {
  const { user_name, email, otp, password } = req.body;

  if (!user_name || !email || !otp || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const valid = verify_otp(email, otp);
  if (!valid) return res.status(401).json({ message: "Invalid or expired OTP." });

  const query = `SELECT * FROM users WHERE user_name = ? AND email = ?`;
  db.query(query, [user_name, email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password." });

    const token = jwt.sign({ user_name, email }, secret, { expiresIn: "2h" });
    res.status(200).json({ message: "✅ Login successful!", token });
  });
});

module.exports = router;
