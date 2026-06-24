import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header glass-panel">
      <div className="header-brand">
        <Link to="/">
          <h1>atmosphera</h1>
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/" className="nav-link">home</Link>
        <Link to="/history" className="nav-link">history</Link>
        <Link to="/about" className="nav-link">about</Link>
      </nav>
    </header>
  );
}
