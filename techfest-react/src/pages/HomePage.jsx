import React from 'react';
import { useApp } from '../context/AppContext';
import { EVENTS_DATA } from '../data/eventsData';
import EventCard from '../components/EventCard';

const HomePage = ({ onSelectEvent }) => {
  const { setCurrentPage, participants } = useApp();
  const featuredEvents = EVENTS_DATA.slice(0, 3);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-header">
        <div className="hero-text-content">
          <div className="hero-date-text">October 15-18, 2026</div>
          <div className="host-info">Hosted by CSE Department of MBCET</div>
          <h1 className="hero-headline">HASH'26</h1>
          <div className="hero-theme-statement">
            BUILD. BREAK. CREATE.
          </div>
          <div>
            <button
              type="button"
              className="register-button"
              onClick={() => setCurrentPage('registration')}
            >
              Register Now →
            </button>
          </div>
          <div className="scroll-down-hint">Scroll</div>
        </div>
        <img src="/images/hero.webp" alt="Abstract geometric design representing technology" className="hero-cover" />
      </section>

      {/* Marquee Banner */}
      <aside className="marquee-banner">
        <div className="marquee-text">
          +++ REGISTRATION CLOSES IN 5 DAYS +++ EARLY BIRD TICKETS SOLD OUT *** NEW HACKATHON TRACK ANNOUNCED +++ KEYNOTE SPEAKER: NIRANJ R +++ REGISTRATION CLOSES IN 5 DAYS +++
        </div>
      </aside>

      {/* About Section */}
      <section className="page-section-secondary">
        <div className="container">
          <div className="about-grid">
            <div>
              <h2>WELCOME TO THE FUTURE</h2>
            </div>
            <div>
              <p>
                Hash'26 is an experimental digital exhibition and festival celebrating the intersection of
                technology, design, and brutalist engineering. We strip away the unnecessary and focus on raw innovation.
              </p>
              <p>
                Join us for 4 days of immersive coding, design workshops, and intense competitions.
              </p>
              <button
                type="button"
                className="register-button"
                onClick={() => setCurrentPage('events')}
              >
                Explore All Events
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="react-stats-bar">
            <div className="stat-card">
              <div className="stat-value">4</div>
              <div className="stat-label">Days of Events</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{EVENTS_DATA.length}+</div>
              <div className="stat-label">Competitions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{participants.length}</div>
              <div className="stat-label">Registered Participants</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">₹1.5L</div>
              <div className="stat-label">Prize Pool</div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Highlights Section */}
      <section className="page-section-dark">
        <div className="container">
          <h2 className="events-preview-title">EVENT HIGHLIGHTS</h2>

          <div className="events-grid">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
            ))}
          </div>

          <div className="view-all-events" style={{ marginTop: '40px', textAlign: 'center' }}>
            <button
              type="button"
              className="register-button"
              onClick={() => setCurrentPage('events')}
            >
              View All Events ({EVENTS_DATA.length})
            </button>
          </div>
        </div>
      </section>

      {/* Sponsor Showcase */}
      <section className="sponsor-banner">
        <div className="sponsor-track">
          <img src="/images/sponsor1.svg" alt="Sponsor 1" />
          <img src="/images/sponsor2.svg" alt="Sponsor 2" />
          <img src="/images/sponsor3.svg" alt="Sponsor 3" />
          <img src="/images/sponsor4.svg" alt="Sponsor 4" />
          <img src="/images/sponsor5.webp" alt="Sponsor 5" />
          <img src="/images/sponsor6.svg" alt="Sponsor 6" />
          <img src="/images/sponsor7.svg" alt="Sponsor 7" />
          <img src="/images/sponsor8.svg" alt="Sponsor 8" />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
