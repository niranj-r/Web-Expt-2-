import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const ValidationRules = {
  fullName: {
    regex: /^[A-Za-z\s]{2,50}$/,
    message: "Full name must contain only letters and spaces (2-50 characters)."
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Please enter a valid email address (e.g. user@domain.com)."
  },
  phone: {
    regex: /^(\+91[\-\s]?)?[6-9]\d{9}$/,
    message: "Enter a valid 10-digit phone number (e.g. 9876543210 or +91 9876543210)."
  },
  college: {
    regex: /^.{3,100}$/,
    message: "College/University name must be at least 3 characters long."
  }
};

const RegistrationPage = ({ onOpenAuth }) => {
  const { addParticipant, participants, setCurrentPage, currentUser } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '2004-01-01',
    gender: 'other',
    college: '',
    department: 'cs',
    year: '3',
    events: ['Hack The Grid'],
    message: '',
    terms: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.name || prev.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        college: currentUser.college || prev.college,
        department: currentUser.department || prev.department,
        year: currentUser.year || prev.year
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'events') {
      const updatedEvents = checked
        ? [...formData.events, value]
        : formData.events.filter(ev => ev !== value);
      
      setFormData(prev => ({ ...prev, events: updatedEvents }));
      if (updatedEvents.length > 0) {
        setErrors(prev => ({ ...prev, events: null }));
      }
    } else if (type === 'checkbox' && name === 'terms') {
      setFormData(prev => ({ ...prev, terms: checked }));
      if (checked) {
        setErrors(prev => ({ ...prev, terms: null }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        validateSingleField(name, value);
      }
    }
  };

  const validateSingleField = (name, value) => {
    let errorMsg = null;

    if (ValidationRules[name]) {
      if (!value || !value.trim()) {
        errorMsg = 'This field is required.';
      } else if (!ValidationRules[name].regex.test(value.trim())) {
        errorMsg = ValidationRules[name].message;
      }
    } else if (name === 'dob') {
      if (!value) {
        errorMsg = 'Please select your date of birth.';
      } else {
        const birthDate = new Date(value);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (isNaN(birthDate.getTime()) || age < 12 || age > 100) {
          errorMsg = 'Please enter a realistic date of birth (ages 12-100).';
        }
      }
    } else if (name === 'department' || name === 'year') {
      if (!value) errorMsg = 'Please select an option.';
    } else if (name === 'gender') {
      if (!value) errorMsg = 'Please select your gender.';
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateSingleField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    Object.keys(ValidationRules).forEach(field => {
      const val = formData[field];
      if (!val || !val.trim()) {
        newErrors[field] = 'This field is required.';
      } else if (!ValidationRules[field].regex.test(val.trim())) {
        newErrors[field] = ValidationRules[field].message;
      }
    });

    if (!formData.dob) newErrors.dob = 'Please select your date of birth.';
    if (!formData.gender) newErrors.gender = 'Please select your gender.';
    if (!formData.department) newErrors.department = 'Please select a department.';
    if (!formData.year) newErrors.year = 'Please select your year of study.';
    if (formData.events.length === 0) newErrors.events = 'Please select at least one event.';
    if (!formData.terms) newErrors.terms = 'You must agree to the Terms & Conditions.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    await addParticipant(formData);

    setFormData({
      fullName: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      dob: '2004-01-01',
      gender: 'other',
      college: currentUser?.college || '',
      department: currentUser?.department || 'cs',
      year: currentUser?.year || '3',
      events: [],
      message: '',
      terms: true
    });
    setErrors({});
  };

  return (
    <main>
      <section className="registration-header">
        <div className="container">
          <h1>REGISTER NOW</h1>
          <p>Join the brutalist revolution at Hash'26 TechFest.</p>

          {!currentUser && (
            <div style={{ marginTop: '1rem', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--primary, #00f0ff)', padding: '0.75rem 1rem', borderRadius: '6px', display: 'inline-block' }}>
              <span>Already have an account? </span>
              <button
                type="button"
                className="btn-link-action"
                style={{ color: 'var(--primary, #00f0ff)', fontWeight: 'bold', fontSize: '0.95rem' }}
                onClick={onOpenAuth}
              >
                Log In to autofill your details →
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '60px' }}>
        <form className="registration-form" onSubmit={handleSubmit} noValidate>
          
          {/* Full Name */}
          <div className="input-field-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`form-input ${errors.fullName ? 'is-invalid' : formData.fullName ? 'is-valid' : ''}`}
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          {/* Email & Phone */}
          <div className="form-row-2">
            <div className="input-field-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? 'is-invalid' : formData.email ? 'is-valid' : ''}`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="input-field-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-input ${errors.phone ? 'is-invalid' : formData.phone ? 'is-valid' : ''}`}
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          {/* DOB & Gender */}
          <div className="form-row-2">
            <div className="input-field-group">
              <label htmlFor="dob">Date of Birth *</label>
              <input
                type="date"
                id="dob"
                name="dob"
                className={`form-input ${errors.dob ? 'is-invalid' : formData.dob ? 'is-valid' : ''}`}
                value={formData.dob}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {errors.dob && <span className="field-error">{errors.dob}</span>}
            </div>

            <div className="input-field-group">
              <label>Gender *</label>
              <div className="selection-group">
                {['male', 'female', 'other'].map(g => (
                  <label key={g} className="selection-label">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleInputChange}
                    />{' '}
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
              {errors.gender && <span className="field-error">{errors.gender}</span>}
            </div>
          </div>

          {/* College */}
          <div className="input-field-group">
            <label htmlFor="college">College / University Name *</label>
            <input
              type="text"
              id="college"
              name="college"
              className={`form-input ${errors.college ? 'is-invalid' : formData.college ? 'is-valid' : ''}`}
              placeholder="e.g. State University"
              value={formData.college}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {errors.college && <span className="field-error">{errors.college}</span>}
          </div>

          {/* Department & Year */}
          <div className="form-row-2">
            <div className="input-field-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                className={`form-input ${errors.department ? 'is-invalid' : formData.department ? 'is-valid' : ''}`}
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Department</option>
                <option value="cs">Computer Science</option>
                <option value="it">Information Technology</option>
                <option value="ee">Electrical Engineering</option>
                <option value="me">Mechanical Engineering</option>
                <option value="des">Design</option>
                <option value="other">Other</option>
              </select>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>

            <div className="input-field-group">
              <label htmlFor="year">Year of Study *</label>
              <select
                id="year"
                name="year"
                className={`form-input ${errors.year ? 'is-invalid' : formData.year ? 'is-valid' : ''}`}
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
              {errors.year && <span className="field-error">{errors.year}</span>}
            </div>
          </div>

          {/* Events Checkboxes */}
          <div className="input-field-group">
            <label>Events to Participate In *</label>
            <div className="selection-group">
              {['Algorithmic Art', 'Hack The Grid', 'Capture The Flag', 'Design Sprint'].map(evtName => (
                <label key={evtName} className="selection-label">
                  <input
                    type="checkbox"
                    name="events"
                    value={evtName}
                    checked={formData.events.includes(evtName)}
                    onChange={handleInputChange}
                  />{' '}
                  {evtName}
                </label>
              ))}
            </div>
            {errors.events && <span className="field-error">{errors.events}</span>}
          </div>

          {/* Message */}
          <div className="input-field-group">
            <label htmlFor="message">Message / Motivation (Optional)</label>
            <textarea
              id="message"
              name="message"
              className="form-input"
              placeholder="Why do you want to participate?"
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Terms */}
          <div className="terms-agreement-box">
            <label className="selection-label">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
              />{' '}
              <span>I agree to the Terms and Conditions and Code of Conduct of Hash'26. *</span>
            </label>
            {errors.terms && <span className="field-error">{errors.terms}</span>}
          </div>

          <button type="submit" className="register-button submit-registration">
            CONFIRM REGISTRATION
          </button>
        </form>

        {/* Registered Participants Preview Section */}
        <section className="registered-participants-section" style={{ marginTop: '40px' }}>
          <h2>
            Registered Participants
            <span className="stat-counter">Total: {participants.length}</span>
          </h2>

          {participants.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No participants registered yet.</p>
          ) : (
            <div>
              {participants.slice(0, 5).map(p => (
                <div key={p._id || p.registrationId || p.id} className="participant-card">
                  <div className="participant-info">
                    <h4>{p.fullName} <small>({p.registrationId || p.id})</small></h4>
                    <p><strong>Email:</strong> {p.email} | <strong>Phone:</strong> {p.phone}</p>
                    <p><strong>College:</strong> {p.college} | <strong>Events:</strong> {Array.isArray(p.events) ? p.events.join(', ') : p.eventName || p.events}</p>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button type="button" className="btn-action" onClick={() => setCurrentPage('participants')}>
                  View Full Directory ({participants.length}) →
                </button>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default RegistrationPage;
