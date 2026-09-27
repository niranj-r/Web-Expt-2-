import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ContactPage = () => {
  const { showToast } = useApp();

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!contactForm.name.trim()) newErrors.name = 'Name is required.';
    if (!contactForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!contactForm.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!contactForm.message.trim()) newErrors.message = 'Message cannot be empty.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    showToast(`Thank you, ${contactForm.name}! Your message has been sent successfully.`);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setErrors({});
  };

  return (
    <main>
      <section className="contact-hero-header">
        <div className="container">
          <h1>CONNECT<br />WITH US</h1>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '60px' }}>
        <div className="contact-layout">
          
          {/* Office Details Box */}
          <div className="office-details-box">
            <div className="contact-information-group">
              <h3>FESTIVAL LOCATION</h3>
              <p className="large-text">
                MBCET Campus<br />
                Block B, Main Auditorium<br />
                Brutalist Tech Way<br />
                Trivandrum, KL 695015
              </p>
            </div>

            <div className="contact-information-group">
              <h3>GET IN TOUCH</h3>
              <p>
                Email: <a href="mailto:info@hash26.edu">info@hash26.edu</a><br />
                Phone: <a href="tel:+919876543210">+91 98765 43210</a>
              </p>
            </div>

            <div className="contact-information-group">
              <h3>COORDINATORS</h3>
              <p>
                Sponsorships: Sam River (<a href="mailto:sponsor@hash26.edu">sponsor@hash26.edu</a>)<br />
                Logistics: Morgan Casey (<a href="mailto:logistics@hash26.edu">logistics@hash26.edu</a>)
              </p>
            </div>

            <div className="contact-information-group">
              <h3>FOLLOW US</h3>
              <div className="social-media-links">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TWITTER</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
              </div>
            </div>
          </div>

          {/* Feedback Form Box */}
          <div className="message-form-box">
            <h2>SEND FEEDBACK</h2>
            <form onSubmit={handleSubmit} novalidate>
              <div className="input-field-group">
                <label htmlFor="contact-name">Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="input-field-group">
                <label htmlFor="contact-email">Email *</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="name@example.com"
                  value={contactForm.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="input-field-group">
                <label htmlFor="contact-subject">Subject *</label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  className={`form-input ${errors.subject ? 'is-invalid' : ''}`}
                  placeholder="Inquiry Subject"
                  value={contactForm.subject}
                  onChange={handleChange}
                />
                {errors.subject && <span className="field-error">{errors.subject}</span>}
              </div>

              <div className="input-field-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className={`form-input ${errors.message ? 'is-invalid' : ''}`}
                  placeholder="Write your message here..."
                  rows="5"
                  value={contactForm.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              <button type="submit" className="register-button submit-message-button">
                SEND MESSAGE →
              </button>
            </form>
          </div>

        </div>

        {/* Location Map Frame */}
        <div className="location-map-frame">
          <div className="location-map-title">📍 FESTIVAL LOCATION - MBCET CAMPUS, TRIVANDRUM</div>
          <div className="location-map-wrapper">
            <iframe
              title="MBCET Location Map"
              src="https://maps.google.com/maps?q=MBCET+Trivandrum&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
