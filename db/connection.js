const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vyankatesh',
  database: 'E_Rupee'
});

const Users = `
  CREATE TABLE IF NOT EXISTS users (
    name VARCHAR(50) not null,
    user_name VARCHAR(50) PRIMARY KEY not null,
    email VARCHAR(50) not null,
    balance DECIMAL(10,2) not null default 100,
    password VARCHAR(255) not null
  );
`;

const Payment = `
  CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY  NOT NULL,
    sender_username VARCHAR(50) NOT NULL,
    receiver_username VARCHAR(50) NOT NULL,
    done_at DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    approved ENUM('a', 'p', 'r') NOT NULL,
    status ENUM('done', 'pending', 'failed') NOT NULL,
    type ENUM('extra', 'normal') NOT NULL,
    FOREIGN KEY (sender_username) REFERENCES users(user_name) ON DELETE CASCADE,
    FOREIGN KEY (receiver_username) REFERENCES users(user_name) ON DELETE CASCADE
  );
`;

const ExtraBal = `
  CREATE TABLE IF NOT EXISTS extra_bal (
    bal_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    sender_username VARCHAR(50) NOT NULL,
    receiver_username VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    purpose VARCHAR(50),
    FOREIGN KEY (sender_username) REFERENCES users(user_name) ON DELETE CASCADE,
    FOREIGN KEY (receiver_username) REFERENCES users(user_name) ON DELETE CASCADE
  );
`;


//apr:approved pending rejected
connection.query(Users, (err, results) => {
  if (err) throw err;
  console.log("✅ Users table ready.");
});
connection.query(ExtraBal, (err, results) => {
  if (err) throw err;
  console.log("✅ ExtraBal table ready.");
});

connection.query(Payment, (err, results) => {
  if (err) throw err;
  console.log("✅ Payment table created.");

  // Set starting AUTO_INCREMENT value
  connection.query("ALTER TABLE payment AUTO_INCREMENT = 1001;", (err) => {
    if (err) throw err;
    console.log("🔢 AUTO_INCREMENT set to start from 1001.");
  });
});

module.exports=connection;
