const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'carterfriends.db');

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'carterfriends-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

app.use(express.static(path.join(__dirname)));

app.get('/api/auth/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  res.json({ user: req.session.user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const safeName = (name || email.split('@')[0]).trim();
  const safeEmail = email.toLowerCase().trim();

  db.get('SELECT id FROM users WHERE email = ?', [safeEmail], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (row) return res.status(409).json({ message: 'User already exists' });

bcrypt.hash(password, 10, (hashErr, hash) => {
        if (hashErr) {
          return res.status(500).json({ message: 'Could not secure password' });
        }

        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [safeName, safeEmail, hash],
          function (insertErr) {
            if (insertErr) return res.status(500).json({ message: 'Could not create user' });

            req.session.user = {
              id: this.lastID,
              name: safeName,
              email: safeEmail
            };

            res.status(201).json({ user: req.session.user });
          }
        );
      });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const safeEmail = email.toLowerCase().trim();

  db.get(
    'SELECT id, name, email, password FROM users WHERE email = ?',
    [safeEmail],
    (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      bcrypt.compare(password, user.password, (compareErr, match) => {
        if (compareErr || !match) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        req.session.user = { id: user.id, name: user.name, email: user.email };
        res.json({ user: req.session.user });
      });
    }
  );
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CarterFriends server running at http://localhost:${PORT}`);
});
