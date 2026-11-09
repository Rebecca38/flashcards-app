import './AuthPages.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { callServer, saveToken } from '../serverApi.js';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await callServer('/signup', 'POST', { email, password });
      const loginData = await callServer('/login', 'POST', { email, password });
      saveToken(loginData.token);
    } catch (problem) {
      setError(problem.message);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-side">
        <div className="auth-logo">LearnEasy</div>
        <h1 className="auth-headline">Turn your notes into flashcards.</h1>
        <div className="sample-card">
            <p className="card-label">QUESTION</p>
            <p className="card-question">What does HTML stand for?</p>
            <p className="card-label">ANSWER</p>
            <p className="card-answer">HyperText Markup Language.</p>
       </div>
      </div>

      <div className="auth-form-area">
          <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Create your account</h2>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" placeholder="learneasy@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button">Sign up</button>
            <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
      
    </div>
  );
}

export default SignupPage;