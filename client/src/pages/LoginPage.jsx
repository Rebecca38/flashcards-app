import './AuthPages.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { callServer, saveToken } from '../serverApi.js';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const loginData = await callServer('/login', 'POST', { email, password });
      saveToken(loginData.token);
      navigate('/decks');
    } catch (problem) {
      setError(problem.message);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-side">
        <div className="auth-logo">LearnEasy</div>
        <h1 className="auth-headline">Pick up where you left off.</h1>
        <p className="auth-subtitle">Your decks are waiting.</p>
      </div>

      <div className="auth-form-area">
          <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Welcome back</h2>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" placeholder="learneasy@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button">Log in</button>
            <p className="auth-switch">
            New to LearnEasy? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
      
    </div>
  );
}

export default LoginPage;