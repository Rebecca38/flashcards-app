import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { callServer } from '../serverApi.js';
import './ReviewPage.css';

function ReviewPage() {
    const { deckId } = useParams();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadDeck() {
            try {
                const loadedDeck = await callServer(`/decks/${deckId}`);
                setDeck(loadedDeck);
                setCards(loadedDeck.cards);
            } catch (problem) {
                setError(problem.message);
            }
        }
        loadDeck();
    }, [deckId]);

    function handleNext() {
        if (currentIndex === cards.length - 1) {
            setIsFinished(true);
            return;
        }
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
    }

    function handleRestart() {
        setCurrentIndex(0);
        setShowAnswer(false);
        setIsFinished(false);
    }

    function handlePrevious() {
        setCurrentIndex(currentIndex - 1);
        setShowAnswer(false);
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!deck) {
        return <p>Loading...</p>;
    }

    if (cards.length === 0) {
        return (
            <div className="review-page">
                <h1>{deck.name}</h1>
                <p>This deck has no cards yet. Go back and generate some first.</p>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="review-page">
                <h1>{deck.name}</h1>
                <p>You finished this deck. You went through {cards.length} cards.</p>
                <button type="button" onClick={handleRestart}>
                    Restart
                </button>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="review-page">
            <h1>{deck.name}</h1>
            <p className="review-count">
                Card {currentIndex + 1} / {cards.length}
            </p>

            <div className="review-card">
                <p className="review-label">Question</p>
                <h2>{currentCard.question}</h2>

                {showAnswer ? (
                    <>
                        <p className="review-label">Answer</p>
                        <p className="review-answer">{currentCard.answer}</p>
                    </>
                ) : (
                    <button type="button" onClick={() => setShowAnswer(true)}>
                        Show answer
                    </button>
                )}
            </div>

            <div className="review-buttons">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    Previous
                </button>
                <button type="button" onClick={handleNext}>
                    {currentIndex === cards.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
}

export default ReviewPage;