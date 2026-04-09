const express = require('express');
const router = express.Router();
const { login } = require('../auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const token = login(username, password);
  if (!token) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token });
});

module.exports = router;
