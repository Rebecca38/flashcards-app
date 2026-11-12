function parseCards(rawText) {
  if (typeof rawText !== 'string' || rawText.trim() === '') {
    throw new Error('The AI reply was empty.');
  }

  const start = rawText.indexOf('[');
  const end = rawText.lastIndexOf(']');

  if (start === -1 || end === -1 || end < start) {
    throw new Error('The AI reply did not contain a list of cards.');
  }

  const jsonText = rawText.slice(start, end + 1);

  let cards;
  try {
    cards = JSON.parse(jsonText);
  } catch (err) {
    throw new Error('The AI reply was not valid JSON.');
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    throw new Error('The AI reply had no cards in it.');
  }

  const cleanCards = [];

  for (const card of cards) {
    const question = card && typeof card.question === 'string' ? card.question.trim() : '';
    const answer = card && typeof card.answer === 'string' ? card.answer.trim() : '';

    if (!question || !answer) {
      throw new Error('One of the cards was missing its question or answer.');
    }

    cleanCards.push({ question, answer });
  }

  return cleanCards;
}

module.exports = { parseCards };