import './HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="auth-logo">LearnEasy</div>
        <div className="home-header-buttons">
          <Link to="/login" className="home-button home-button-outline">Log in</Link>
          <Link to="/signup" className="home-button">Sign up</Link>
        </div>
      </header>

      <main className="home-hero">
        <div className="home-hero-text">
          <h1 className="auth-headline">Notes in.<br />Flashcards out.</h1>
          <p className="auth-subtitle">
            Paste your study notes and LearnEasy turns them into flashcards for you. Then you just study.
          </p>
          <div className="home-hero-buttons">
            <Link to="/signup" className="home-button">Get started</Link>
            <Link to="/login" className="home-button home-button-outline">Log in</Link>
          </div>
        </div>

        <div className="home-hero-card">
          <div className="sample-card">
            <p className="card-label">QUESTION</p>
            <p className="card-question">What does CSS control?</p>
            <p className="card-label">ANSWER</p>
            <p className="card-answer">How a web page looks.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;