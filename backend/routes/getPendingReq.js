const router = require("express").Router();
const userVerification=require("../middleware/login_middleware");
const db=require(".././../db/connection");

router.get("/",userVerification, async (req, res) => {
  const user_name=req.user.user_name;
  console.log(user_name);
  const userQuery = `SELECT * FROM pending_req WHERE original_sender= ?`;
  db.query(userQuery, [user_name], async (err, userResults) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    
    res.status(200).json({userResults});
}
  )}
);

module.exports=router;
