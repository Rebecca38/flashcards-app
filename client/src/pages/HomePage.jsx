import './HomePage.css';
import { Link } from 'react-router-dom';
import NavBar from './NavBar.jsx';
import { getToken } from '../serverApi.js';

function HomePage() {
  const isLoggedIn = Boolean(getToken());

  return (
    <div className="home-page">
      {isLoggedIn ? (
        <NavBar />
      ) : (
        <header className="home-header">
          <div className="auth-logo">LearnEasy</div>
          <div className="home-header-buttons">
            <Link to="/login" className="home-button home-button-outline">Log in</Link>
            <Link to="/signup" className="home-button">Sign up</Link>
          </div>
        </header>
      )}

      <main className="home-hero">
        <div className="home-hero-text">
          <h1 className="auth-headline">Notes in.<br />Flashcards out.</h1>
          <p className="auth-subtitle">
            Paste your study notes and LearnEasy turns them into flashcards for you. Then you just study.
          </p>
          <div className="home-hero-buttons">
            {isLoggedIn ? (
              <Link to="/decks" className="home-button">Go to your decks</Link>
            ) : (
              <>
                <Link to="/signup" className="home-button">Get started</Link>
                <Link to="/login" className="home-button home-button-outline">Log in</Link>
              </>
            )}
          </div>
        </div>

        <div className="home-hero-card">
          <div className="home-notes-bubble">
            HTML is the language that builds web pages.<br />
            CSS controls how they look...
          </div>
          <svg className="home-arrow" width="26" height="40" viewBox="0 0 26 40" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="13" y1="4" x2="13" y2="34" />
            <polyline points="3,24 13,35 23,24" />
          </svg>
          <svg className="home-sparkle" width="60" height="50" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="6" y1="22" x2="10" y2="6" />
            <line x1="24" y1="30" x2="36" y2="16" />
            <line x1="42" y1="44" x2="56" y2="36" />
          </svg>
          <div className="sample-card">
            <p className="card-label">QUESTION</p>
            <p className="card-question">What does CSS control?</p>
            <p className="card-label">ANSWER</p>
            <p className="card-answer">How a web page looks.</p>
          </div>
        </div>
      </main>
      <section className="home-steps">
        <div className="home-step">
          <div className="home-step-number">1</div>
          <h3>Paste your notes</h3>
          <p>Drop them into a deck.</p>
        </div>
        <div className="home-step">
          <div className="home-step-number">2</div>
          <h3>Generate cards</h3>
          <p>The AI writes the questions and answers.</p>
        </div>
        <div className="home-step">
          <div className="home-step-number">3</div>
          <h3>Study</h3>
          <p>Check them over and learn.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;