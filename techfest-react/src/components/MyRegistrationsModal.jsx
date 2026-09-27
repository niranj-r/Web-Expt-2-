import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const MyRegistrationsModal = ({ isOpen, onClose }) => {
  const { userRegistrations, fetchMyRegistrations, deleteParticipant, updateParticipant, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [editingReg, setEditingReg] = useState(null);
  const [editCollege, setEditCollege] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchMyRegistrations().finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartEdit = (reg) => {
    setEditingReg(reg);
    setEditCollege(reg.college || '');
    setEditPhone(reg.phone || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingReg) return;

    await updateParticipant(editingReg._id || editingReg.id || editingReg.registrationId, {
      college: editCollege,
      phone: editPhone
    });
    setEditingReg(null);
    fetchMyRegistrations();
  };

  const handleCancelReg = async (id) => {
    if (window.confirm('Are you sure you want to cancel this event registration?')) {
      await deleteParticipant(id);
      fetchMyRegistrations();
    }
  };

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '650px',
          padding: '2rem',
          background: 'var(--bg-card, #121212)',
          border: '2px solid var(--border-color, #333)',
          borderRadius: '8px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--text-color, #fff)',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>

        <h2 style={{ marginBottom: '0.2rem', color: 'var(--primary, #00f0ff)' }}>
          MY EVENT REGISTRATIONS
        </h2>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Logged in as <strong>{currentUser?.name || currentUser?.email}</strong> ({currentUser?.email})
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading your registrations...</div>
        ) : userRegistrations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #444', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>You haven't registered for any events yet!</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Browse the Events page and register now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userRegistrations.map((reg) => {
              const regKey = reg._id || reg.registrationId || reg.id;
              const isEditingThis = editingReg && (editingReg._id === reg._id || editingReg.registrationId === reg.registrationId);

              return (
                <div
                  key={regKey}
                  style={{
                    padding: '1.2rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color, #333)',
                    borderRadius: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span
                        style={{
                          background: 'var(--primary, #00f0ff)',
                          color: '#000',
                          padding: '0.2rem 0.5rem',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          borderRadius: '3px'
                        }}
                      >
                        {reg.registrationId || reg.id}
                      </span>
                      <h3 style={{ margin: '0.5rem 0 0.2rem 0', fontSize: '1.2rem' }}>
                        {reg.eventName || (Array.isArray(reg.events) ? reg.events.join(', ') : reg.events)}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#aaa', margin: 0 }}>
                        Registered: {new Date(reg.createdAt || reg.registeredAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      style={{
                        color: reg.status === 'confirmed' ? '#00ffaa' : '#ffaa00',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase'
                      }}
                    >
                      ● {reg.status || 'Confirmed'}
                    </span>
                  </div>

                  {isEditingThis ? (
                    <form onSubmit={handleSaveEdit} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #444' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>College / Inst</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editCollege}
                            onChange={(e) => setEditCollege(e.target.value)}
                            style={{ width: '100%', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Phone</label>
                          <input
                            type="tel"
                            className="form-input"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            style={{ width: '100%', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" className="btn-action" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Save Changes</button>
                        <button type="button" className="btn-action" style={{ background: '#444', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setEditingReg(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                        <span><strong>College:</strong> {reg.college}</span> | <span><strong>Phone:</strong> {reg.phone}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn-link-action"
                          style={{ fontSize: '0.85rem', color: '#00f0ff' }}
                          onClick={() => handleStartEdit(reg)}
                        >
                          Edit Details
                        </button>
                        <button
                          type="button"
                          className="btn-link-action"
                          style={{ fontSize: '0.85rem', color: '#ff4d88' }}
                          onClick={() => handleCancelReg(regKey)}
                        >
                          Cancel Registration
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrationsModal;
