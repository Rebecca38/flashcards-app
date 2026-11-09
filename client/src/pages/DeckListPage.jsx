import { useEffect, useState } from 'react';
import { callServer } from '../serverApi.js';

function DeckListPage() {
  const [decks, setDecks] = useState([]);
  const [error, setError] = useState('');
  const [newDeckName, setNewDeckName] = useState('');

  useEffect(() => {
    async function loadDecks() {
      try {
        const loadedDecks = await callServer('/decks');
        setDecks(loadedDecks);
      } catch (problem) {
        setError(problem.message);
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

  return (
    <div>
      <h1>Your decks</h1>
        <form onSubmit={handleAddDeck}>
        <label htmlFor="new-deck-name">New deck name</label>
        <input
          id="new-deck-name"
          type="text"
          placeholder="For example: Web basics"
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
        />
        <button type="submit">Add deck</button>
      </form>
      {error && <p>{error}</p>}
      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>{deck.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DeckListPage;