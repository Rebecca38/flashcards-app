import { Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DeckListPage from './pages/DeckListPage.jsx';
import DeckPage from './pages/DeckPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import HomePage from './pages/HomePage.jsx';
import { getToken } from './serverApi.js';
import NavBar from './pages/NavBar.jsx';

// Only logged-in people may see the deck pages.
function RequireLogin({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

// Logged-in people skip the home, sign up and login pages.
function GuestOnly({ children }) {
  if (getToken()) {
    return <Navigate to="/decks" replace />;
  }
  return children;
}

function LearnEasy() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
      <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/decks" element={<RequireLogin><DeckListPage /></RequireLogin>} />
      <Route path="/decks/:deckId" element={<RequireLogin><DeckPage /></RequireLogin>} />
      <Route path="/decks/:deckId/review" element={<RequireLogin><ReviewPage /></RequireLogin>} />
    </Routes>
  );
}

export default LearnEasy;