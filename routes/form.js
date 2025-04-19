const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.post('/submit', (req, res) => {
  const { phone, fullName, role, country, expo, description } = req.body;

  const query = `
    INSERT INTO users (phone, fullName, role, country, expo, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [phone, fullName, role, country, expo, description], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ message: 'Form saved', id: this.lastID });
  });
});

module.exports = router;
