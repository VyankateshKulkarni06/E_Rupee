const mysql = require('mysql2');
const dotenv = require('D:/DBMS_Project/E_Rupee/backend/node_modules/dotenv');
dotenv.config();

const connection = mysql.createConnection({
 
  //  host: 'database-1.cdkkuic48dt1.ap-south-1.rds.amazonaws.com', // Replace with your RDS instance endpoint
  // user: 'admin',               // Replace with your DB username
  // password: 'm!$tyl!ly<>#($)',           // Replace with your DB password
  // database: 'e_rupee',                    // The name of your database
  // port: 3306                              // Default MySQL port

  host: process.env.DB_HOST,     // Use the DB_HOST from the .env file
  user: process.env.DB_USER,     // Use the DB_USER from the .env file
  password: process.env.DB_PASSWORD, // Use the DB_PASSWORD from the .env file
  database: process.env.DB_NAME, // Use the DB_NAME from the .env file
  port: process.env.DB_PORT      // Use the DB_PORT from the .env
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.message);
    return;
  }
  console.log('🟢 Connected to the MySQL database!');
});

const Users = `
  CREATE TABLE IF NOT EXISTS users (
    name VARCHAR(50) NOT NULL,
    user_name VARCHAR(50) PRIMARY KEY NOT NULL,
    email VARCHAR(50) NOT NULL,
    balance DECIMAL(10,2) NOT NULL DEFAULT 100,
    password VARCHAR(255) NOT NULL
  );
`;

const Payment = `
  CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    sender_username VARCHAR(50) NOT NULL,
    receiver_username VARCHAR(50) NOT NULL,
    done_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10,2) NOT NULL,
    status_first ENUM('a', 'p', 'r') NOT NULL,
    status ENUM('done', 'pending', 'failed') NOT NULL,
    type ENUM('extra', 'normal') NOT NULL,
    bal_id INT,
    FOREIGN KEY (sender_username) REFERENCES users(user_name) ON DELETE CASCADE,
    FOREIGN KEY (receiver_username) REFERENCES users(user_name) ON DELETE CASCADE
  );
`;

const ExtraBal= `
  CREATE TABLE IF NOT EXISTS extra_bal (
    bal_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    sender_username VARCHAR(50) NOT NULL,
    receiver_username VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    purpose VARCHAR(50),
    status ENUM('a', 'p', 'r') NOT NULL DEFAULT 'p',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_username) REFERENCES users(user_name) ON DELETE CASCADE,
    FOREIGN KEY (receiver_username) REFERENCES users(user_name) ON DELETE CASCADE
  );
`;

const pending_req = `
  CREATE TABLE IF NOT EXISTS pending_req (
    pending_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    requester_username VARCHAR(50) NOT NULL,
    receiver_username VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    purpose VARCHAR(50),
    status ENUM('a', 'p', 'r') NOT NULL DEFAULT 'p',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    original_sender VARCHAR(50) NOT NULL,
    bal_id INT NOT NULL,
    FOREIGN KEY (requester_username) REFERENCES users(user_name) ON DELETE CASCADE,
    FOREIGN KEY (receiver_username) REFERENCES users(user_name) ON DELETE CASCADE,
    FOREIGN KEY (original_sender) REFERENCES users(user_name) ON DELETE CASCADE,
    FOREIGN KEY (bal_id) REFERENCES extra_bal(bal_id) ON DELETE CASCADE
  );
`;
//apr:approved pending rejected
connection.query(Users, (err, results) => {
  if (err) throw err;
  console.log("✅ Users table ready.");

  connection.query(ExtraBal, (err, results) => {
    if (err) throw err;
    console.log("✅ ExtraBal table ready.");

    connection.query(Payment, (err, results) => {
      if (err) throw err;
      console.log("✅ Payment table created.");

      connection.query("ALTER TABLE payment AUTO_INCREMENT = 1001;", (err) => {
        if (err) throw err;
        console.log("🔢 AUTO_INCREMENT set to start from 1001.");
      });

      connection.query(pending_req, (err, results) => {
        if (err) throw err;
        console.log("✅ Pending table ready.");
      });
    });
  });
});

module.exports=connection;
