const express = require('express');
const router = express.Router();
const db = require('../db/database');


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Example static check
  if (username === 'admin' && password === '1234') {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc1ODY1Mjk3LCJpYXQiOjE3NDQzMjkyOTcsImp0aSI6IjEzNTc0ZmEzOWNlZjRkNTZiOTdhMjc3ZDE2ZDljOGI0IiwidXNlcl9pZCI6M30.s_xnktiydYDsPTcAhVU-fABbNeoygYC6Z8m8RNHd75o';
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

router.get('/users', (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(200).json(rows);
    });
  });


module.exports = router;
