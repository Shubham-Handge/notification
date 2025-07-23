// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>My App</div>
      <ul style={styles.navLinks}>
        <li><Link to="/user" style={styles.link}>User</Link></li>
        <li><Link to="/admin" style={styles.link}>Admin</Link></li>
        {currentUser ? (
          <li>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </li>
        ) : (
          <li>
            <Link to="/login" style={styles.link}>Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#333',
    color: '#fff',
  },
  logo: {
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  button: {
    background: 'red',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
};

export default Header;
