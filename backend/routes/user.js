const router = require("express").Router();
const db = require("../../db/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../../db/secret");
const saltRounds = 7;


router.post("/register", async (req, res) => {
  const { name, user_name, email, password } = req.body;

  if (!name || !user_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const selectQuery = `SELECT * FROM users WHERE user_name = ?`;

    db.query(selectQuery, [user_name], async (err, results) => {
      if (err) {
        console.log(results);
        console.log(err);
        return res.status(500).json({ message: "Database error." });
      }

      if (results.length !== 0) {
        return res.status(400).json({ message: "Username is already taken." });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const insertQuery = `
        INSERT INTO users (name, user_name, email, password)
        VALUES (?, ?, ?, ?)
      `;

      db.query(insertQuery, [name, user_name, email, hashedPassword], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error inserting user." });
        }

        res.status(201).json({ message: "✅ User registered successfully." });
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/login", async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const selectQuery = `SELECT * FROM users WHERE user_name = ?`;

    db.query(selectQuery, [user_name], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error." });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "User not found." });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password." });
      }

      const token = jwt.sign(
        { user_name: user.user_name, email: user.email },
        secret,
        { expiresIn: "2h" } 
      );

      res.status(200).json({
        message: "✅ Login successful!",
        token
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
