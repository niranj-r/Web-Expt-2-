import React from 'react';

const EventCard = ({ event, onSelect }) => {
  return (
    <article className="event-feature-card react-event-card">
      <div>
        <div className="card-badge">{event.categoryLabel}</div>
        <h3>{event.title}</h3>
        <p className="event-time-loc">📅 {event.date} | 📍 {event.location}</p>
        <p>{event.description}</p>
        
        {event.image && (
          <img src={event.image} alt={event.title} className="event-feature-img" />
        )}

        <div className="tag-cloud">
          {event.tags && event.tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">#{tag}</span>
          ))}
        </div>
      </div>

      <div className="card-actions" style={{ marginTop: '15px' }}>
        <button
          type="button"
          className="register-button btn-event-details"
          onClick={() => onSelect(event)}
        >
          View Event Details →
        </button>
      </div>
    </article>
  );
};

export default EventCard;
