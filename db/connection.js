const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: 'vyankatesh',
  database: 'E_Rupee'   
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection error:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL as ID', connection.threadId);
});
