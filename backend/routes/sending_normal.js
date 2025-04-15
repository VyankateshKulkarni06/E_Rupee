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
    const { receiver, amount, password, type="normal", purpose=null } = req.body;
    const sender = req.user.user_name;
  
    if (!receiver || !amount || !password)
      return res.status(400).json({ message: "All fields are required." });
  
    db.query("SELECT * FROM users WHERE user_name = ?", [sender], async (err, results) => {
      if (err || results.length === 0)
        return res.status(400).json({ message: "Sender not found." });
  
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ message: "Incorrect password." });
  
      if (parseFloat(user.balance) < parseFloat(amount)) {
        return res.status(400).json({ message: "❌ Insufficient balance." });
      }
  
      db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: "Transaction start error." });
  
        const newSenderBalance = parseFloat(user.balance) - parseFloat(amount);
        const updateSender = "UPDATE users SET balance = ? WHERE user_name = ?";
        db.query(updateSender, [newSenderBalance, sender], err => {
          if (err)
            return db.rollback(() =>
              res.status(500).json({ message: "Error updating sender balance." })
            );
  
          // Check if transaction is of type "extra"
          if (type !== "extra") {
            // Only update receiver's balance for non-extra transaction types
            const updateReceiver = "UPDATE users SET balance = balance + ? WHERE user_name = ?";
            db.query(updateReceiver, [amount, receiver], handleReceiverUpdate);
          } else {
            // Skip receiver balance update for "extra" type
            handleReceiverUpdate(null);
          }
  
          function handleReceiverUpdate(err) {
            if (err)
              return db.rollback(() =>
                res.status(500).json({ message: "Error updating receiver balance." })
              );
  
            const insertPayment = `
              INSERT INTO payment (sender_username, receiver_username, done_at, amount, approved, status, type)
              VALUES (?, ?, NOW(), ?, 'a', 'done', ?)
            `;
            db.query(insertPayment, [sender, receiver, amount, type], err => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ message: "Error recording payment." })
                );
  
              // Handle extra_bal insert/update
              if (type === "extra") {
                const checkExtra = `
                  SELECT * FROM extra_bal
                  WHERE sender_username = ? AND receiver_username = ? AND purpose = ?
                `;
                db.query(checkExtra, [sender, receiver, purpose], (err, results) => {
                  if (err)
                    return db.rollback(() =>
                      res.status(500).json({ message: "Error checking extra_bal." })
                    );
  
                  if (results.length > 0) {
                    const existingAmount = parseFloat(results[0].amount);
                    const newAmount = existingAmount + parseFloat(amount);
  
                    const updateExtra = `
                      UPDATE extra_bal
                      SET amount = ?
                      WHERE sender_username = ? AND receiver_username = ? AND purpose = ?
                    `;
                    db.query(updateExtra, [newAmount, sender, receiver, purpose], err => {
                      if (err)
                        return db.rollback(() =>
                          res.status(500).json({ message: "Error updating extra_bal." })
                        );
  
                      db.commit(err => {
                        if (err)
                          return db.rollback(() =>
                            res.status(500).json({ message: "Commit failed." })
                          );
                        return res.status(200).json({
                          message: "✅ Transaction successful (extra updated)."
                        });
                      });
                    });
  
                  } else {
                    const insertExtra = `
                      INSERT INTO extra_bal (sender_username, receiver_username, amount, purpose)
                      VALUES (?, ?, ?, ?)
                    `;
                    db.query(insertExtra, [sender, receiver, amount, purpose], err => {
                      if (err)
                        return db.rollback(() =>
                          res.status(500).json({ message: "Error inserting into extra_bal." })
                        );
  
                      db.commit(err => {
                        if (err)
                          return db.rollback(() =>
                            res.status(500).json({ message: "Commit failed." })
                          );
                        return res.status(200).json({
                          message: "✅ Transaction successful (extra inserted)."
                        });
                      });
                    });
                  }
                });
  
              } else {
                // Normal type transaction
                db.commit(err => {
                  if (err)
                    return db.rollback(() =>
                      res.status(500).json({ message: "Commit failed." })
                    );
                  return res.status(200).json({ message: "✅ Transaction successful." });
                });
              }
            });
          }
        });
      });
    });
  });
  
  // Route for requesting permission to use extra balance for a transaction
router.post("/permission_extra_bal", userVerification, async (req, res) => {
  const { payment_id, receiver_username, amount, purpose } = req.body;
  const middleman_username = req.user.user_name; // Get middleman's username from JWT token
  
  // Validate input
  if (!payment_id || !receiver_username || !amount) {
    return res.status(400).json({ message: "Payment ID, receiver username, and amount are required." });
  }

  try {
    // First, fetch the original payment to get the bal_id and verify middleman is the intended receiver
    db.query(
      "SELECT * FROM payment WHERE payment_id = ? AND type = 'extra'",
      [payment_id],
      (err, paymentResults) => {
        if (err) return res.status(500).json({ message: "Error fetching payment details." });
        
        if (paymentResults.length === 0) {
          return res.status(404).json({ message: "Payment not found or not an extra type payment." });
        }
        
        const payment = paymentResults[0];
        const bal_id = payment.bal_id;
        
        // Check if the middleman is the intended receiver of the original extra balance
        if (payment.receiver_username !== middleman_username) {
          return res.status(403).json({ 
            message: "You are not authorized to use this extra balance." 
          });
        }
        
        // Now fetch the extra_bal record to get more details and check availability
        db.query(
          "SELECT * FROM extra_bal WHERE bal_id = ?",
          [bal_id],
          (err, extraBalResults) => {
            if (err) return res.status(500).json({ message: "Error fetching extra balance details." });
            
            if (extraBalResults.length === 0) {
              return res.status(404).json({ message: "Extra balance record not found." });
            }
            
            const extraBal = extraBalResults[0];
            
            // Check if there's enough balance and status is not already approved or rejected
            if (extraBal.status !== 'p') {
              return res.status(400).json({ 
                message: "This extra balance is not available for transactions." 
              });
            }
            
            if (parseFloat(extraBal.amount) < parseFloat(amount)) {
              return res.status(400).json({ 
                message: "Insufficient extra balance." 
              });
            }
            
            // Get the original sender of the extra balance
            const original_sender = extraBal.sender_username;
            
            // Now create a pending request that will need approval from the original sender
            db.beginTransaction(err => {
              if (err) return res.status(500).json({ message: "Transaction start error." });
              
              const insertPendingReq = `
                INSERT INTO pending_req (
                  requester_username, 
                  receiver_username, 
                  amount, 
                  purpose, 
                  status,
                  original_sender,
                  bal_id
                ) VALUES (?, ?, ?, ?, 'p', ?, ?)
              `;
              
              db.query(
                insertPendingReq, 
                [middleman_username, receiver_username, amount, purpose, original_sender, bal_id], 
                (err, result) => {
                  if (err) {
                    return db.rollback(() => 
                      res.status(500).json({ message: "Error creating pending request." })
                    );
                  }
                  
                  const pending_id = result.insertId;
                  
                  db.commit(err => {
                    if (err) {
                      return db.rollback(() => 
                        res.status(500).json({ message: "Commit failed." })
                      );
                    }
                    
                    return res.status(200).json({ 
                      message: "✅ Permission request created successfully.",
                      pending_id: pending_id,
                      status: "pending",
                      info: "The original sender must approve this transaction."
                    });
                  });
                }
              );
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error processing request." });
  }
});

// Route for the original sender to approve or reject the pending request
router.put("/pending_request", userVerification, async (req, res) => {
  const { pending_id } = req.body;
  const { status } = req.body; // status should be 'a' for approve or 'r' for reject
  const username = req.user.user_name; // Get username from JWT token
  
  if (!pending_id || !status || !['a', 'r'].includes(status)) {
    return res.status(400).json({ message: "Valid pending ID and status (a/r) are required." });
  }
  
  try {
    // First, fetch the pending request to verify ownership
    db.query(
      "SELECT * FROM pending_req WHERE pending_id = ?",
      [pending_id],
      (err, pendingResults) => {
        if (err) return res.status(500).json({ message: "Error fetching pending request." });
        
        if (pendingResults.length === 0) {
          return res.status(404).json({ message: "Pending request not found." });
        }
        
        const pendingReq = pendingResults[0];
        
        // Verify the current user is the original sender
        if (pendingReq.original_sender !== username) {
          return res.status(403).json({ 
            message: "You are not authorized to approve/reject this request." 
          });
        }
        
        // Start transaction for updating status
        db.beginTransaction(err => {
          if (err) return res.status(500).json({ message: "Transaction start error." });
          
          // Update the pending request status
          db.query(
            "UPDATE pending_req SET status = ? WHERE pending_id = ?",
            [status, pending_id],
            (err) => {
              if (err) {
                return db.rollback(() => 
                  res.status(500).json({ message: "Error updating pending request status." })
                );
              }
              
              // If approved, process the transaction
              if (status === 'a') {
                // Get the extra_bal record
                db.query(
                  "SELECT * FROM extra_bal WHERE bal_id = ?",
                  [pendingReq.bal_id],
                  (err, extraBalResults) => {
                    if (err) {
                      return db.rollback(() => 
                        res.status(500).json({ message: "Error fetching extra balance." })
                      );
                    }
                    
                    if (extraBalResults.length === 0) {
                      return db.rollback(() => 
                        res.status(404).json({ message: "Extra balance record not found." })
                      );
                    }
                    
                    const extraBal = extraBalResults[0];
                    
                    // Check if there is still enough balance
                    if (parseFloat(extraBal.amount) < parseFloat(pendingReq.amount)) {
                      return db.rollback(() => 
                        res.status(400).json({ message: "Insufficient extra balance." })
                      );
                    }
                    
                    // Update the extra_bal amount
                    const newAmount = parseFloat(extraBal.amount) - parseFloat(pendingReq.amount);
                    const updateExtraBal = newAmount > 0 
                      ? "UPDATE extra_bal SET amount = ? WHERE bal_id = ?"
                      : "UPDATE extra_bal SET amount = ?, status = 'a' WHERE bal_id = ?";
                    
                    db.query(updateExtraBal, [newAmount, pendingReq.bal_id], (err) => {
                      if (err) {
                        return db.rollback(() => 
                          res.status(500).json({ message: "Error updating extra balance." })
                        );
                      }
                      
                      // Create a payment record for this transaction
                      const insertPayment = `
                        INSERT INTO payment (
                          sender_username, 
                          receiver_username, 
                          done_at, 
                          amount, 
                          status_first, 
                          status, 
                          type,
                          bal_id
                        ) VALUES (?, ?, NOW(), ?, 'a', 'done', 'normal', ?)
                      `;
                      
                      db.query(
                        insertPayment, 
                        [
                          pendingReq.requester_username, 
                          pendingReq.receiver_username, 
                          pendingReq.amount, 
                          pendingReq.bal_id
                        ], 
                        (err) => {
                          if (err) {
                            return db.rollback(() => 
                              res.status(500).json({ message: "Error recording payment." })
                            );
                          }
                          
                          // Update receiver's balance
                          db.query(
                            "UPDATE users SET balance = balance + ? WHERE user_name = ?",
                            [pendingReq.amount, pendingReq.receiver_username],
                            (err) => {
                              if (err) {
                                return db.rollback(() => 
                                  res.status(500).json({ message: "Error updating receiver balance." })
                                );
                              }
                              
                              // Commit the transaction
                              db.commit(err => {
                                if (err) {
                                  return db.rollback(() => 
                                    res.status(500).json({ message: "Commit failed." })
                                  );
                                }
                                
                                return res.status(200).json({ 
                                  message: "✅ Transaction approved and processed successfully." 
                                });
                              });
                            }
                          );
                        }
                      );
                    });
                  }
                );
              } else {
                // If rejected, just commit the status update
                db.commit(err => {
                  if (err) {
                    return db.rollback(() => 
                      res.status(500).json({ message: "Commit failed." })
                    );
                  }
                  
                  return res.status(200).json({ 
                    message: "Transaction request rejected." 
                  });
                });
              }
            }
          );
        });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error processing request." });
  }
});

  module.exports=router;
  

 