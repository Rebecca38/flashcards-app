import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DeckListPage from './pages/DeckListPage.jsx';
import DeckPage from './pages/DeckPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';

function LearnEasy() {
  return (
    <Routes>
      <Route path="/" element={<h1>Learn with Flashcards</h1>} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/decks" element={<DeckListPage />} />
      <Route path="/decks/:deckId" element={<DeckPage />} />
      <Route path="/decks/:deckId/review" element={<ReviewPage />} />
    </Routes>
  );
}

export default LearnEasy;