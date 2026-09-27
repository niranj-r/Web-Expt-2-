import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AuthPage = () => {
  const { registerUser, loginUser, currentUser, logoutUser, setCurrentPage, userRegistrations, showToast } = useApp();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  
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
      setCurrentPage('home');
    } else {
      setErrorMsg(res.message || 'Login failed. Please check your credentials.');
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
      setCurrentPage('home');
    } else {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <main>
      <section className="registration-header">
        <div className="container">
          <h1>ACCOUNT PORTAL</h1>
          <p>Login or create your Hash'26 account to manage event registrations.</p>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '60px', maxWidth: '600px' }}>
        {currentUser ? (
          <div
            style={{
              padding: '2.5rem',
              background: 'var(--bg-card, #121212)',
              border: '2px solid var(--primary, #00f0ff)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary, #00f0ff)',
                color: '#000',
                fontSize: '2rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary, #00f0ff)' }}>
              Welcome, {currentUser.name}!
            </h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
              <strong>Email:</strong> {currentUser.email} | <strong>Role:</strong> {currentUser.role}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="register-button"
                onClick={() => setCurrentPage('registration')}
              >
                BROWSE & REGISTER EVENTS
              </button>
              <button
                type="button"
                className="btn-action danger"
                onClick={logoutUser}
                style={{ border: '1px solid #ff4d88', color: '#ff4d88', background: 'none' }}
              >
                LOGOUT
              </button>
            </div>
          </div>
        ) : (
          <div
            className="auth-box-container"
            style={{
              padding: '2rem',
              background: 'var(--bg-card, #121212)',
              border: '2px solid var(--border-color, #333)',
              borderRadius: '8px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.4)'
            }}
          >
            {/* Tab Headers */}
            <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color, #333)', marginBottom: '1.5rem' }}>
              <button
                type="button"
                className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
                onClick={() => { setTab('login'); setErrorMsg(''); }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
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
                  padding: '0.85rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === 'register' ? '3px solid var(--primary, #00f0ff)' : 'none',
                  color: tab === 'register' ? 'var(--primary, #00f0ff)' : 'var(--text-secondary, #aaa)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                CREATE ACCOUNT
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(255, 0, 85, 0.15)',
                  borderLeft: '4px solid #ff0055',
                  color: '#ff4d88',
                  marginBottom: '1.2rem',
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
                <div className="input-field-group">
                  <label htmlFor="loginEmail">Email Address *</label>
                  <input
                    type="email"
                    id="loginEmail"
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="input-field-group">
                  <label htmlFor="loginPassword">Password *</label>
                  <input
                    type="password"
                    id="loginPassword"
                    required
                    className="form-input"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
                  <span>Demo User: <strong>alex.johnson@example.com</strong> / <strong>password123</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="register-button submit-registration"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {loading ? 'LOGGING IN...' : 'LOG IN TO PORTAL'}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                <div className="input-field-group">
                  <label htmlFor="regName">Full Name *</label>
                  <input
                    type="text"
                    id="regName"
                    required
                    className="form-input"
                    placeholder="John Doe"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  />
                </div>

                <div className="input-field-group">
                  <label htmlFor="regEmail">Email Address *</label>
                  <input
                    type="email"
                    id="regEmail"
                    required
                    className="form-input"
                    placeholder="john@example.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  />
                </div>

                <div className="input-field-group">
                  <label htmlFor="regPassword">Password * (min 6 characters)</label>
                  <input
                    type="password"
                    id="regPassword"
                    required
                    className="form-input"
                    placeholder="••••••••"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="input-field-group">
                    <label htmlFor="regPhone">Phone Number</label>
                    <input
                      type="tel"
                      id="regPhone"
                      className="form-input"
                      placeholder="9876543210"
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="regCollege">College / Institution</label>
                    <input
                      type="text"
                      id="regCollege"
                      className="form-input"
                      placeholder="MBCET Campus"
                      value={regData.college}
                      onChange={(e) => setRegData({ ...regData, college: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="input-field-group">
                    <label htmlFor="regDept">Department</label>
                    <select
                      id="regDept"
                      className="form-input"
                      value={regData.department}
                      onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                    >
                      <option value="cs">Computer Science</option>
                      <option value="it">Information Technology</option>
                      <option value="ee">Electrical Engineering</option>
                      <option value="me">Mechanical Engineering</option>
                      <option value="des">Design</option>
                    </select>
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="regYear">Year of Study</label>
                    <select
                      id="regYear"
                      className="form-input"
                      value={regData.year}
                      onChange={(e) => setRegData({ ...regData, year: e.target.value })}
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
                  className="register-button submit-registration"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT & LOG IN'}
                </button>
              </form>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default AuthPage;
