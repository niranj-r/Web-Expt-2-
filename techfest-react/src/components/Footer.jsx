import React from 'react';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { setCurrentPage, isOrganizerLoggedIn } = useApp();

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
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  style={{ color: 'var(--highlight)', fontWeight: 'bold' }}
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
