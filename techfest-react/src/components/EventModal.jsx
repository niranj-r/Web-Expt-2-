import React from 'react';
import { useApp } from '../context/AppContext';

const EventModal = ({ event, onClose }) => {
  const { setCurrentPage } = useApp();

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box event-modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <span className="modal-badge">{event.categoryLabel}</span>
        <h2>{event.title}</h2>
        
        <p className="modal-meta">
          <strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time}
        </p>
        <p className="modal-meta">
          <strong>Location:</strong> {event.location} | <strong>Fee:</strong> {event.price}
        </p>

        {event.image && (
          <img src={event.image} alt={event.title} style={{ width: '100%', height: '220px', objectFit: 'cover', margin: '15px 0' }} />
        )}

        <div className="modal-body-text">
          <h4>About Event</h4>
          <p>{event.fullDetails || event.description}</p>
        </div>

        <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <button type="button" className="register-button" style={{ background: '#666', borderColor: '#666', padding: '8px 16px' }} onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="register-button"
            style={{ padding: '8px 16px' }}
            onClick={() => {
              onClose();
              setCurrentPage('registration');
            }}
          >
            Register For Event →
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
