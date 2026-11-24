import { Link, useNavigate } from 'react-router-dom';
import { removeToken } from '../serverApi.js';
import './NavBar.css';

function NavBar() {
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    navigate('/login');
  }

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-logo">LearnEasy</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/decks">Your decks</Link>
        <button type="button" onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}

export default NavBar;