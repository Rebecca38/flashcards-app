const express = require('express');
const requireAuth = require('./requireAuth');
const { buildPrompt } = require('./prompt');
const { parseCards } = require('./parseCards');

const router = express.Router();

const MAX_WORDS = 1000;
const AI_TIMEOUT_MS = 90000;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';

router.post('/generate', requireAuth, async (req, res) => {
  const notes = typeof req.body.notes === 'string' ? req.body.notes.trim() : '';

  if (!notes) {
    return res.status(400).json({ error: 'Please paste some notes first.' });
  }

  const wordCount = notes.split(/\s+/).length;
  if (wordCount > MAX_WORDS) {
    return res.status(400).json({
      error: `Your notes are too long. Please keep them under ${MAX_WORDS} words.`,
    });
  }

  try {
    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(notes) }] }],
        generationConfig: {
          thinkingConfig: { thinkingLevel: 'low' },
        },
      }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Gemini error:', data.error && data.error.message);

      if (geminiResponse.status === 429) {
        return res.status(429).json({
          error: 'The free AI limit has been reached for now. Please wait a minute and try again.',
        });
      }

      return res.status(502).json({ error: 'The AI could not make cards right now. Please try again.' });
    }

    const rawText = data.candidates[0].content.parts[0].text;

    let cards;
    try {
      cards = parseCards(rawText);
    } catch (parseError) {
      console.error('Could not read the AI reply:', parseError.message);
      return res.status(502).json({
        error: 'The AI sent back a reply we could not read. Please try again.',
      });
    }

  } catch (err) {
    console.error(err.message);

    const aiTooSlowOrOffline =
      err.name === 'TimeoutError' || err.name === 'AbortError' || err.message === 'fetch failed';

    if (aiTooSlowOrOffline) {
      return res.status(504).json({
        error: 'The AI is taking too long, or the internet connection failed. Please try again.',
      });
    }

    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;