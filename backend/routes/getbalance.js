const router = require("express").Router();
const db = require("../../db/connection");
const bcrypt = require("bcrypt");
const userVerification = require("../middleware/login_middleware");

router.post("/", userVerification, async (req, res) => {
  const { password } = req.body;
  const user_name = req.user.user_name; // From the verified token

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  try {

    const userQuery = `SELECT balance FROM users WHERE user_name = ?`;
    db.query(userQuery, [user_name], async (err, userResults) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error." });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      const user = userResults[0];
     
      // const extraBalQuery = `
      //   SELECT sender_username, amount, purpose
      //   FROM extra_bal
      //   WHERE receiver_username = ?
      // `;
      // db.query(extraBalQuery, [user_name], (err, extraResults) => {
      //   if (err) {
      //     console.error("ExtraBal DB Error:", err);
      //     return res.status(500).json({ message: "Error fetching extra balance." });
      //   }

  
        res.status(200).json({
          user_name,
          balance: user.balance,
        });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
