import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">#</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Chat">Chat</Link></li>
        <li><Link to="/Blog">Blog</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
