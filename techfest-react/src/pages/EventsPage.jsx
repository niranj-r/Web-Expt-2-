import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EVENTS_DATA } from '../data/eventsData';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EventsPage = ({ onSelectEvent }) => {
  const { setCurrentPage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // API State for Requirement #6
  const [apiEvents, setApiEvents] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchPublicApiEvents = async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=4');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const transformed = data.map((item, idx) => ({
        id: `api-${item.id}`,
        title: item.title.slice(0, 30).toUpperCase(),
        category: "global",
        categoryLabel: "Global Tech Keynote",
        date: `October ${15 + idx}, 2026`,
        time: "03:00 PM UTC",
        location: "Virtual Stage Alpha",
        description: item.body.slice(0, 100) + "...",
        fullDetails: item.body,
        tags: ["GlobalAPI", "Keynote", "LiveStream"],
        price: "Free Pass",
        image: `/images/event${(idx % 5) + 1}.${(idx % 5 + 1) > 3 ? 'webp' : 'jpg'}`
      }));

      setApiEvents(transformed);
    } catch (err) {
      console.error("API fetch error:", err);
      setApiError("Could not connect to external Tech Events API. Please check your internet connection.");
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicApiEvents();
  }, []);

  const filteredEvents = EVENTS_DATA.filter(event => {
    const matchesSearch = (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main>

      <section className="page-section-secondary">
        <div className="container">

          {/* Event Categories & Definitions Grid */}
          {/*<div className="events-layout-grid">
            <div>
              <div className="event-list-box">
                <h2>EVENT CATEGORIES</h2>
                <ol className="brutalist-list">
                  <li>01. Hackathons & Competitions</li>
                  <li>02. Design & UX Workshops</li>
                  <li>03. Robotics & AI Symposiums</li>
                  <li>04. Cyber Security CTF</li>
                </ol>

                <h2 className="spaced-title" style={{ marginTop: '30px' }}>SUB EVENTS</h2>
                <ul className="brutalist-list">
                  <li><strong>Coding Events</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li><span style={{ color: 'var(--highlight)' }}>▸</span> Algorithmic Art</li>
                      <li><span style={{ color: 'var(--highlight)' }}>▸</span> Competitive Programming</li>
                      <li><span style={{ color: 'var(--highlight)' }}>▸</span> Web3 DApp Building</li>
                    </ul>
                  </li>
                  <li style={{ marginTop: '15px' }}><strong>Design Events</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li><span style={{ color: 'var(--highlight)' }}>▸</span> UI/UX Hackathon</li>
                      <li><span style={{ color: 'var(--highlight)' }}>▸</span> Brand Identity Design</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className="event-list-box">
                <h2>EVENT DEFINITIONS</h2>
                <dl className="definition-list">
                  <dt style={{ color: 'var(--highlight)', fontWeight: 'bold', fontSize: '18px', marginTop: '15px' }}>ALGORITHMIC ART</dt>
                  <dd style={{ marginLeft: 0, marginBottom: '20px' }}>
                    Create visually stunning graphics and animations using code. Judged on creativity and code efficiency.
                  </dd>

                  <dt style={{ color: 'var(--highlight)', fontWeight: 'bold', fontSize: '18px' }}>HACK THE GRID</dt>
                  <dd style={{ marginLeft: 0, marginBottom: '20px' }}>
                    A grueling 24-hour hackathon where teams build solutions to predefined problem statements provided by sponsors.
                  </dd>

                  <dt style={{ color: 'var(--highlight)', fontWeight: 'bold', fontSize: '18px' }}>CAPTURE THE FLAG</dt>
                  <dd style={{ marginLeft: 0, marginBottom: '20px' }}>
                    Cybersecurity event focusing on finding vulnerabilities in specially designed web applications and network configurations.
                  </dd>

                  <dt style={{ color: 'var(--highlight)', fontWeight: 'bold', fontSize: '18px' }}>DESIGN SPRINT</dt>
                  <dd style={{ marginLeft: 0, marginBottom: '20px' }}>
                    A rapid 6-hour sprint to solve a user experience problem from wireframing to high-fidelity prototyping.
                  </dd>
                </dl>
              </div>

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button
              type="button"
              className="register-button"
              style={{ background: 'var(--highlight)', borderColor: 'var(--highlight)', color: 'white', padding: '12px 30px' }}
              onClick={() => setCurrentPage('registration')}
            >
              REGISTER →
            </button>
          </div>
        </div>
      </div>*/}

          {/* Search and Category Filter Bar for Events */}
          <div className="react-filter-controls-box" style={{ marginTop: '60px' }}>
            <div className="input-field-group" style={{ marginBottom: 0, flex: 1 }}>
              <input
                type="search"
                className="form-input"
                placeholder="🔍 Search events by name, keyword, or tag..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-btn-group">
              <button
                type="button"
                className={`gallery-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Events ({EVENTS_DATA.length})
              </button>
              <button
                type="button"
                className={`gallery-filter-btn ${selectedCategory === 'hackathons' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('hackathons')}
              >
                Hackathons
              </button>
              <button
                type="button"
                className={`gallery-filter-btn ${selectedCategory === 'cyber' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('cyber')}
              >
                Cyber Security
              </button>
              <button
                type="button"
                className={`gallery-filter-btn ${selectedCategory === 'design' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('design')}
              >
                Design & UX
              </button>
              <button
                type="button"
                className={`gallery-filter-btn ${selectedCategory === 'robotics' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('robotics')}
              >
                Robotics & AI
              </button>
            </div>
          </div>

          {/* Local Events Grid */}
          <h2 style={{ marginBottom: '20px' }}>FESTIVAL COMPETITIONS & WORKSHOPS</h2>

          {filteredEvents.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: '#777', fontStyle: 'italic' }}>
              No events match your search query "{searchTerm}".
            </p>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
              ))}
            </div>
          )}

          {/* Requirement #6: Live Public API Event Fetching Section */}
          <div className="api-fetch-section" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '3px dashed var(--highlight)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
              <h2>🌐 LIVE EXTERNAL TECH KEYNOTES (API FETCH)</h2>
              <button type="button" className="btn-action" onClick={fetchPublicApiEvents}>
                🔄 Refresh API Data
              </button>
            </div>

            {apiLoading && <LoadingSpinner message="Fetching live keynote announcements from public API..." />}

            {apiError && <ErrorMessage error={apiError} onRetry={fetchPublicApiEvents} />}

            {!apiLoading && !apiError && (
              <div className="events-grid">
                {apiEvents.map(event => (
                  <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
                ))}
              </div>
            )}
          </div>

          {/* MASTER SCHEDULE TABLE SECTION */}
          <h2 className="schedule-heading" style={{ fontSize: '3rem', marginTop: '60px', marginBottom: '10px' }}>MASTER SCHEDULE</h2>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '900', color: 'var(--dark-primary)', marginBottom: '25px', textTransform: 'uppercase' }}>
            DAY 1 - OCTOBER 15, 2026
          </div>

          <div className="schedule-wrapper">
            <table className="master-schedule-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>TIME</th>
                  <th style={{ width: '28%' }}>TRACK A (CODE)</th>
                  <th style={{ width: '28%' }}>TRACK B (DESIGN)</th>
                  <th style={{ width: '29%' }}>TRACK C (ROBOTICS)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>09:00 AM</td>
                  <td colSpan="3" className="opening-ceremony" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Opening Ceremony & Keynote (Main Auditorium)
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>10:30 AM</td>
                  <td>Algorithmic Art Setup</td>
                  <td>Design Sprint Briefing</td>
                  <td>Bot Wars Inspection</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>11:30 AM</td>
                  <td rowSpan="2" style={{ verticalAlign: 'middle', fontWeight: '500' }}>Competitive Programming (Round 1)</td>
                  <td>Wireframing Workshop</td>
                  <td rowSpan="2" style={{ verticalAlign: 'middle', fontWeight: '500' }}>Line Follower Qualifier</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>12:30 PM</td>
                  <td>Prototyping Session</td>
                </tr>
                <tr>
                  <td className="lunch-break" style={{ background: 'var(--highlight)', color: 'white', fontWeight: 'bold' }}>01:30 PM</td>
                  <td colSpan="3" className="lunch-break" style={{ background: 'var(--highlight)', color: 'white', textAlign: 'center', fontWeight: '900', letterSpacing: '1px' }}>
                    COMMON LUNCH BREAK
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>02:30 PM</td>
                  <td>Web3 DApp Building</td>
                  <td>UI/UX Hackathon Start</td>
                  <td>Drone Racing Heats</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>04:30 PM</td>
                  <td>Cyber Security CTF</td>
                  <td>Design Review</td>
                  <td>Bot Wars Finals</td>
                </tr>
                <tr style={{ background: 'var(--bg-secondary)', fontWeight: 'bold' }}>
                  <td>06:00 PM</td>
                  <td colSpan="3" style={{ fontWeight: 'bold' }}>
                    Day 1 Closing Remarks and Networking Session
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ORGANIZING COMMITTEE SECTION */}
          <h2 className="committee-heading" style={{ fontSize: '3rem', marginTop: '60px', marginBottom: '25px' }}>ORGANIZING COMMITTEE</h2>
          <div className="organizing-committee">
            <div className="committee-member-card">
              <h4>ALEX MERCER</h4>
              <p>Festival Director</p>
            </div>
            <div className="committee-member-card">
              <h4>JORDAN LEE</h4>
              <p>Technical Lead</p>
            </div>
            <div className="committee-member-card">
              <h4>TAYLOR SWIFT</h4>
              <p>Design Head</p>
            </div>
            <div className="committee-member-card">
              <h4>SAM RIVER</h4>
              <p>Sponsorship Coordinator</p>
            </div>
            <div className="committee-member-card">
              <h4>MORGAN CASEY</h4>
              <p>Logistics Head</p>
            </div>
          </div>

        </div>
      </section >
    </main >
  );
};

export default EventsPage;
