require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

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