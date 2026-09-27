import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { registerUser, loginUser } = useApp();
  const [tab, setTab] = useState(initialTab); // 'login' or 'register'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    college: '',
    department: 'cs',
    year: '1',
    role: 'user'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await loginUser(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regData.name || !regData.email || !regData.password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }
    if (regData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await registerUser(regData);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div
        className="modal-content auth-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          padding: '2rem',
          background: 'var(--bg-card, #121212)',
          border: '2px solid var(--border-color, #333)',
          borderRadius: '8px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
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

        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color, #333)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'login' ? '3px solid var(--primary, #00f0ff)' : 'none',
              color: tab === 'login' ? 'var(--primary, #00f0ff)' : 'var(--text-secondary, #aaa)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            LOGIN
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'register' ? '3px solid var(--primary, #00f0ff)' : 'none',
              color: tab === 'register' ? 'var(--primary, #00f0ff)' : 'var(--text-secondary, #aaa)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            USER SIGN UP
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 0, 85, 0.15)',
              borderLeft: '4px solid #ff0055',
              color: '#ff4d88',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              borderRadius: '4px'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="your.email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password *</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="register-button"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading ? 'LOGGING IN...' : 'LOG IN TO PORTAL'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="John Doe"
                value={regData.name}
                onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="john@example.com"
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Password * (min 6 chars)</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="9876543210"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>College / Inst.</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="MBCET"
                  value={regData.college}
                  onChange={(e) => setRegData({ ...regData, college: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Department</label>
                <select
                  className="form-input"
                  value={regData.department}
                  onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="cs">Computer Science</option>
                  <option value="it">Info Tech</option>
                  <option value="ee">Electrical</option>
                  <option value="me">Mechanical</option>
                  <option value="des">Design</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Year</label>
                <select
                  className="form-input"
                  value={regData.year}
                  onChange={(e) => setRegData({ ...regData, year: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="register-button"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT & LOG IN'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
