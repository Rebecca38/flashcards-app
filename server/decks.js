const express = require('express');
const { pool } = require('./db');
const requireAuth = require('./requireAuth');

const router = express.Router();

router.get('/decks', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM decks WHERE user_id = $1 ORDER BY id DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/decks', requireAuth, async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';

  if (!name) {
    return res.status(400).json({ error: 'Please give your deck a name.' });
  }
  if (name.length > 100) {
    return res.status(400).json({ error: 'Deck name must be 100 characters or less.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO decks (name, user_id) VALUES ($1, $2) RETURNING id, name',
      [name, req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;