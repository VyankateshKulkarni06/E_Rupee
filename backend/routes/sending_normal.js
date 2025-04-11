const router = require("express").Router();
const db = require("../../db/connection");
const bcrypt = require("bcrypt");
const saltRounds = 7;
const userVerification=require("../middleware/login_middleware");




router.get("/check-user",userVerification, (req, res) => {
    const { username } = req.body;
  
    const query = `SELECT * FROM users WHERE user_name = ?`;
  
    db.query(query, [username], (err, results) => {
      if (err) return res.status(500).json({ message: "DB error." });
  
      if (results.length === 0) {
        return res.status(404).json({ exists: false, message: "❌ User not found" });
      }
  
      // Send user name back
      const user = results[0];
      return res.status(200).json({
        exists: true,
        message: "✅ User exists",
        name: user.name, 
      });
    });
  });


  router.post("/transfer", userVerification, async (req, res) => {
    const { receiver, amount, password, type = "normal", purpose = null } = req.body;
    const sender_username = req.user.user_name;
    const receiver_username = receiver;
  
    if (!receiver || !amount || !password)
      return res.status(400).json({ message: "All fields are required." });

    db.query("SELECT * FROM users WHERE user_name = ?", [sender_username], async (err, results) => {
      if (err || results.length === 0) {
        console.error("Sender lookup error:", err);
        return res.status(400).json({ message: "Sender not found." });
      }
  
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: "Incorrect password." });
  
 
      if (parseFloat(user.balance) < parseFloat(amount)) {
        return res.status(400).json({ message: "❌ Insufficient balance." });
      }
  
      db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: "Transaction start error." });
  
        const newSenderBalance = parseFloat(user.balance) - parseFloat(amount);
        const updateSender = "UPDATE users SET balance = ? WHERE user_name = ?";
        db.query(updateSender, [newSenderBalance, sender_username], err => {
          if (err) return db.rollback(() => res.status(500).json({ message: "Error updating sender balance." }));
  
          const updateReceiver = "UPDATE users SET balance = balance + ? WHERE user_name = ?";
          db.query(updateReceiver, [amount, receiver_username], err => {
            if (err) return db.rollback(() => res.status(500).json({ message: "Error updating receiver balance." }));
  
            const insertPayment = `
              INSERT INTO payment (sender_username, receiver_username, done_at, amount, approved, status, type)
              VALUES (?, ?, NOW(), ?, 'a', 'done', ?)
            `;
            db.query(insertPayment, [sender_username, receiver_username, amount, type], err => {
              if (err) return db.rollback(() => res.status(500).json({ message: "Error recording payment." }));
  
              if (type === "extra") {
                const insertExtra = `
                  INSERT INTO extra_bal (sender_username, receiver_username, amount, purpose)
                  VALUES (?, ?, ?, ?)
                `;
                db.query(insertExtra, [sender_username, receiver_username, amount, purpose], err => {
                  if (err) return db.rollback(() => res.status(500).json({ message: "Error in extra_bal." }));
  
                  db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ message: "Commit failed." }));
                    return res.status(200).json({ message: "✅ Transaction successful (extra)." });
                  });
                });
              } else {
                db.commit(err => {
                  if (err) return db.rollback(() => res.status(500).json({ message: "Commit failed." }));
                  return res.status(200).json({ message: "✅ Transaction successful." });
                });
              }
            });
          });
        });
      });
    });
  });
  

  module.exports=router;
  

 