// Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import CSS file directly

const Header = () => {
  return (
    <header className="headerContainer"> {/* Use class name directly */}
      <nav className="navBar"> {/* Use class name directly */}
        <ul className="navList"> {/* Use class name directly */}
          <li className="navItem"><Link to="/" className="navLink">Home</Link></li>
          <li className="navItem"><Link to="/about" className="navLink">About</Link></li>
          <li className="navItem"><Link to="/register" className="navLink">Signup</Link></li>
          <li className="navItem"><Link to="/login" className="navLink">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
