import { useEffect, useState } from 'react';
import './DeckListPage.css';
import { callServer } from '../serverApi.js';
import { Link } from 'react-router-dom';

function DeckListPage() {
  const [decks, setDecks] = useState([]);
  const [error, setError] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDecks() {
      try {
        const loadedDecks = await callServer('/decks');
        setDecks(loadedDecks);
      } catch (problem) {
        setError(problem.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadDecks();
  }, []);

  async function handleAddDeck(event) {
    event.preventDefault();
    setError('');
    try {
      await callServer('/decks', 'POST', { name: newDeckName });
      const updatedDecks = await callServer('/decks');
      setDecks(updatedDecks);
      setNewDeckName('');
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function handleDeleteDeck(deckId) {
    setError('');
    try {
      await callServer(`/decks/${deckId}`, 'DELETE');
      const updatedDecks = await callServer('/decks');
      setDecks(updatedDecks);
    } catch (problem) {
      setError(problem.message);
    }
  }

  return (
    <div className="deck-list-page">
      <h1>Your decks</h1>
      <form onSubmit={handleAddDeck}>
        <label htmlFor="new-deck-name">New deck name</label>
        <div className="new-deck-row">
          <input
            id="new-deck-name"
            type="text"
            placeholder="For example: Web basics"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
          />
          <button type="submit">Add deck</button>
        </div>
      </form>
      {error && <p className="deck-list-error">{error}</p>}
      {!isLoading && !error && decks.length === 0 && (
        <p className="no-decks">
          You have no decks yet. Type a name above and click Add deck to start.
        </p>
      )}
      <ul className="deck-list">
        {decks.map((deck) => (
          <li className="deck-row" key={deck.id}>
            <span className="deck-name">{deck.name}</span>
            <div className="deck-actions">
              <Link to={`/decks/${deck.id}`}>Open</Link>
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDeleteDeck(deck.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeckListPage;