require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const authRoutes = require('./auth');
const requireAuth = require('./requireAuth');
const deckRoutes = require('./decks');

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(deckRoutes);

app.get('/health', (req, res) => {
  res.send('ok');
});

app.get('/me', requireAuth, (req, res) => {
  res.json({ userId: req.userId });
});

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Could not set up the database:', err.message);
    process.exit(1);
  });