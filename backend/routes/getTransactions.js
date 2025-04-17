const router = require("express").Router();
const db = require("../connection");
const userVerification=require("../middleware/login_middleware");
router.get("/",userVerification, async (req, res) => {
  const user_name= req.user.user_name;



  try {
    const userQuery = `SELECT * FROM payment WHERE sender_username = ? OR receiver_username = ?`;
    db.query(userQuery, [user_name, user_name], async (err, userResults) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error." });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ message: "No transactions found." });
      }
      console.log(userResults);
      res.status(200).json({ userResults });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
