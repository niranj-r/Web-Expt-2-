import React from 'react';
import { useApp } from '../context/AppContext';

const Navbar = ({ onOpenMyRegistrations }) => {
  const { currentPage, setCurrentPage, visitorName, setVisitorName, currentUser, userRegistrations } = useApp();

  const handleSetVisitorName = () => {
    const input = prompt('Please enter your name:', visitorName);
    if (input !== null) {
      setVisitorName(input.trim());
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'registration', label: 'Registration' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
    { id: 'auth', label: currentUser ? 'My Account' : 'Login / Sign Up' }
  ];

  return (
    <>
      {/* Top Welcome Preference Banner */}
      <div className="top-welcome-banner">
        <div>
          <span>
            {currentUser ? (
              <>Signed in as <strong>{currentUser.name}</strong> ({currentUser.role})</>
            ) : visitorName ? (
              <>Welcome back, <strong>{visitorName}</strong>!</>
            ) : (
              <>Welcome to <strong>Hash'26 TechFest Portal</strong>!</>
            )}
          </span>
          {!currentUser && (
            <button
              type="button"
              className="btn-link-action"
              onClick={handleSetVisitorName}
            >
              {visitorName ? 'Change Name' : 'Set Name'}
            </button>
          )}
        </div>
        <div>
          <small>Oct 15 - 18, 2026 | MBCET Campus</small>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="main-navigation">
        <div className="container">
          <a
            href="#home"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('home');
            }}
          >
            <img src="/images/logo.svg" alt="Hash'26 Logo" width="120" height="30" />
          </a>

          <div className="nav-right-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <nav>
              <ul className="nav-menu">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`nav-item-btn ${currentPage === item.id ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {currentUser && onOpenMyRegistrations && (
              <button
                type="button"
                className="btn-action"
                onClick={onOpenMyRegistrations}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.85rem',
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  borderColor: 'var(--primary, #00f0ff)',
                  color: 'var(--primary, #00f0ff)'
                }}
              >
                My Registrations ({userRegistrations.length})
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
