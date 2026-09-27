import React from 'react';
import { useApp } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';

const Footer = ({ onOpenMyRegistrations }) => {
  const { setCurrentPage, isOrganizerLoggedIn, currentUser, logoutUser } = useApp();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-layout">
          <div className="footer-brand">
            <h2>HASH'26</h2>
            <p>
              The definitive experimental technology festival.<br />
              Build. Break. Create.<br />
              Hosted by CSE department of MBCET.
            </p>
            
            {/* Theme Toggle in Footer as requested */}
            <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #aaa)' }}>Theme:</span>
              <ThemeToggle />
            </div>
          </div>

          <nav className="footer-links">
            <ul>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setCurrentPage('home')}>Home</button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setCurrentPage('events')}>Events</button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setCurrentPage('registration')}>Register</button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setCurrentPage('gallery')}>Gallery</button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => setCurrentPage('contact')}>Contact</button>
              </li>

              {/* Login / Account button placed in Footer */}
              <li>
                {currentUser ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.3rem' }}>
                    <button
                      type="button"
                      className="footer-link-btn"
                      style={{ color: 'var(--primary, #00f0ff)', fontWeight: 'bold' }}
                      onClick={() => setCurrentPage('auth')}
                    >
                      👤 Account: {currentUser.name}
                    </button>
                    {onOpenMyRegistrations && (
                      <button
                        type="button"
                        className="footer-link-btn"
                        style={{ fontSize: '0.85rem', color: '#00ffaa' }}
                        onClick={onOpenMyRegistrations}
                      >
                        📋 My Registrations
                      </button>
                    )}
                    <button
                      type="button"
                      className="footer-link-btn"
                      style={{ fontSize: '0.85rem', color: '#ff4d88' }}
                      onClick={logoutUser}
                    >
                      🚪 Logout
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="footer-link-btn"
                    style={{ color: 'var(--primary, #00f0ff)', fontWeight: 'bold' }}
                    onClick={() => setCurrentPage('auth')}
                  >
                    🔑 Login / Sign Up
                  </button>
                )}
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  style={{ color: 'var(--highlight, #ff0055)', fontWeight: 'bold', marginTop: '0.5rem' }}
                  onClick={() => setCurrentPage('organizer')}
                >
                  🔒 {isOrganizerLoggedIn ? 'Organizer Dashboard' : 'Organizer Login'}
                </button>
              </li>
            </ul>
          </nav>

          <div className="footer-contact">
            <h3>LOCATION</h3>
            <p>
              B Block<br />
              MBCET<br />
              Trivandrum.
            </p>
          </div>
        </div>

        <div className="footer-legal">
          &copy; 2026 Hash'26 Organizing Committee. Designed & Developed by NJAI (React SPA Edition)
        </div>
      </div>
    </footer>
  );
};

export default Footer;
