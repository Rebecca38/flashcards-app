import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callServer } from '../serverApi.js';

const MAX_WORDS = 1000;

function DeckPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [cards, setCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    async function loadDeck() {
      try {
        const loadedDeck = await callServer(`/decks/${deckId}`);
        setDeck(loadedDeck);
      } catch (problem) {
        setError(problem.message);
      }
    }
    loadDeck();
  }, [deckId]);

  const trimmedNotes = notes.trim();
  const wordCount = trimmedNotes === '' ? 0 : trimmedNotes.split(/\s+/).length;

    async function handleGenerate() {
    setGenerateError('');

    if (notes.trim() === '') {
      setGenerateError('Paste your notes first.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await callServer('/generate', 'POST', { notes });
      setCards(result.cards);
    } catch (problem) {
      setGenerateError(problem.message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCardChange(index, field, newValue) {
    setCards(
      cards.map((card, cardIndex) => {
        if (cardIndex === index) {
          return { ...card, [field]: newValue };
        }
        return card;
      })
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!deck) {
    return <p>Loading...</p>;
  }

    return (
    <div>
      <h1>{deck.name}</h1>

      <label htmlFor="notes-box">Paste your notes</label>
      <br />
      <textarea
        id="notes-box"
        rows="10"
        cols="60"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Paste your study notes here..."
      />
      <p>
        {wordCount} / {MAX_WORDS} words
      </p>

      <button type="button" onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate cards'}
      </button>

      {generateError && (
        <div>
          <p>{generateError}</p>
          <button type="button" onClick={handleGenerate} disabled={isGenerating}>
            Retry
          </button>
        </div>
     )}
     
      {cards.length > 0 && (
        <div>
          <h2>Cards</h2>
          {cards.map((card, index) => (
            <div key={index}>
              <label>Question</label><br />
            <input
              type="text"
              size="60"
              value={card.question}
              onChange={(event) => handleCardChange(index, 'question', event.target.value)}
            /><br />
            <label>Answer</label><br />
            <input
              type="text"
              size="60"
              value={card.answer}
              onChange={(event) => handleCardChange(index, 'answer', event.target.value)}
/>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default DeckPage;