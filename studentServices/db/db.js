const mysql = require("mysql2");

//pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// check if db exists
const initialConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

initialConnection.query("CREATE DATABASE IF NOT EXISTS student_db", (err) => {
  if (err) throw err;
  console.log("Database student_db is ready");

  // tables
  const gradesTable = `
    CREATE TABLE IF NOT EXISTS grades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      grade_name VARCHAR(50) UNIQUE NOT NULL
    )`;
  db.query(gradesTable, (err) => {
    if (err) {
      console.error("Error creating 'grades' table:", err);
      throw err;
    }
    console.log("Grades table is ready");

    db.query(
      `INSERT IGNORE INTO grades (grade_name) VALUES ('A'), ('B'), ('C'), ('D'), ('F')`
    );
  });

  const studentsTable = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      age TINYINT UNSIGNED,
      grade_id INT,
      photo VARCHAR(255),
      admin_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE SET NULL
    )`;
  db.query(studentsTable, (err) => {
    if (err) throw err;
    console.log("Table students is ready");
  });
});

module.exports = db;
