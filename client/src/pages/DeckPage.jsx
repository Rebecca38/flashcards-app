import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callServer } from '../serverApi.js';

function DeckPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState('');

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

  if (error) {
    return <p>{error}</p>;
  }

  if (!deck) {
    return <p>Loading...</p>;
  }

  return <h1>{deck.name}</h1>;
}

export default DeckPage;