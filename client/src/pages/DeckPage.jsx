import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callServer } from '../serverApi.js';
import { Link } from 'react-router-dom';
import './DeckPage.css';
import PageHeader from './PageHeader.jsx';

const MAX_WORDS = 1000;

function DeckPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [cards, setCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveFailed, setSaveFailed] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    async function loadDeck() {
      try {
        const loadedDeck = await callServer(`/decks/${deckId}`);
        setDeck(loadedDeck);
        setCards(loadedDeck.cards);
        setSavedCount(loadedDeck.cards.length);
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

  async function handleSave() {
    setIsSaving(true);
    setSaveMessage('');
    setSaveFailed(false);
    try {
      await callServer(`/decks/${deckId}/cards`, 'POST', { cards });
      setSaveMessage('Deck saved.');
      setSavedCount(cards.length);
    } catch (problem) {
      console.error(problem.message);
      setSaveMessage('Could not save your deck. Please try again.');
      setSaveFailed(true);
    } finally {
      setIsSaving(false);
    }
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!deck) {
    return <p>Loading...</p>;
  }

  return (
    <div className="deck-page">
      <PageHeader
        eyebrow="Deck"
        title={deck.name}
        badge={`${cards.length} ${cards.length === 1 ? 'card' : 'cards'}`}
        actions={
          savedCount > 0 && (
            <Link to={`/decks/${deckId}/review`} className="start-review-button">
              Start review
            </Link>
          )
        }
      />

      <label htmlFor="notes-box">Paste your notes</label>
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
            <div className="card-box" key={index}>
              <span className="card-number">{index + 1}</span>
              <div className="card-fields">
                <div className="card-field">
                  <textarea
                    rows="3"
                    aria-label="Question"
                    value={card.question}
                    onChange={(event) => handleCardChange(index, 'question', event.target.value)}
                  />
                  <span className="card-field-label">Question</span>
                </div>
                <div className="card-field">
                  <textarea
                    rows="3"
                    aria-label="Answer"
                    value={card.answer}
                    onChange={(event) => handleCardChange(index, 'answer', event.target.value)}
                  />
                  <span className="card-field-label">Answer</span>
                </div>
              </div>
            </div>
          ))}
          <div className="save-bar">
            <button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save deck'}
            </button>
            {saveMessage && <p>{saveMessage}</p>}
            {saveFailed && (
              <button type="button" onClick={handleSave} disabled={isSaving}>
                Retry
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default DeckPage;