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

router.delete('/decks/:id', requireAuth, async (req, res) => {
  const deckId = Number(req.params.id);

  if (!Number.isInteger(deckId)) {
    return res.status(400).json({ error: 'That deck id is not valid.' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM decks WHERE id = $1 AND user_id = $2 RETURNING id',
      [deckId, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Deck not found.' });
    }
    res.json({ deleted: deckId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.get('/decks/:id', requireAuth, async (req, res) => {
  const deckId = Number(req.params.id);

  if (!Number.isInteger(deckId)) {
    return res.status(400).json({ error: 'That deck id is not valid.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name FROM decks WHERE id = $1 AND user_id = $2',
      [deckId, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Deck not found.' });
    }
    const cardsResult = await pool.query(
      'SELECT id, question, answer FROM cards WHERE deck_id = $1 ORDER BY id',
      [deckId]
    );

    res.json({ ...result.rows[0], cards: cardsResult.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/decks/:id/cards', requireAuth, async (req, res) => {
  const deckId = Number(req.params.id);

  if (!Number.isInteger(deckId)) {
    return res.status(400).json({ error: 'That deck id is not valid.' });
  }

  const cards = req.body && req.body.cards;

  if (!Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: 'Please send at least one card.' });
  }
  const cleanCards = [];
  for (const card of cards) {
    const question = card && typeof card.question === 'string' ? card.question.trim() : '';
    const answer = card && typeof card.answer === 'string' ? card.answer.trim() : '';
    if (!question || !answer) {
      return res.status(400).json({ error: 'Every card needs a question and an answer.' });
      
    }
    cleanCards.push({ question, answer });
  }

  try {
    const deck = await pool.query(
      'SELECT id FROM decks WHERE id = $1 AND user_id = $2',
      [deckId, req.userId]
    );
    if (deck.rowCount === 0) {
      return res.status(404).json({ error: 'Deck not found.' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM cards WHERE deck_id = $1', [deckId]);
      for (const card of cleanCards) {
        await client.query(
          'INSERT INTO cards (deck_id, question, answer) VALUES ($1, $2, $3)',
          [deckId, card.question, card.answer]
        );
        
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    res.status(201).json({ saved: cleanCards.length, deckId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;