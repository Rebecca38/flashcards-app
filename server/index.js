require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const authRoutes = require('./auth');
const deckRoutes = require('./decks');
const generateRoutes = require('./generate');

const app = express();
const allowedOrigins = ['http://localhost:5173'];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(authRoutes);
app.use(deckRoutes);
app.use(generateRoutes);

app.get('/health', (req, res) => {
  res.send('ok');
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