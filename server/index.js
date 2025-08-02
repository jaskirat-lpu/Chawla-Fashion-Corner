require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// User signup (no password hashing)
app.post('/api/signup', (req, res) => {
  console.log('Signup request body:', req.body); // Debug log
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !email || !password) return res.status(400).json({ error: 'All fields required' });
  db.query('INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)', [name, phone, email, password], (err, result) => {
    if (err) {
      console.error('Signup SQL error:', err); // Debug log
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Phone or email already registered' });
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
});

// User login (no password hashing)
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'All fields required' });
  db.query('SELECT * FROM users WHERE phone = ?', [phone], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!results.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = results[0];
    if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone } });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 