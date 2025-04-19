const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./formData.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      fullName TEXT,
      role TEXT,
      country TEXT,
      expo TEXT,
      description TEXT
    )
  `);
});

module.exports = db;
