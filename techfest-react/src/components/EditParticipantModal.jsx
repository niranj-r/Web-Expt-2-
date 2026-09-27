import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const EditParticipantModal = ({ participant, onClose }) => {
  const { updateParticipant } = useApp();
  
  const [formData, setFormData] = useState({
    fullName: participant.fullName || '',
    email: participant.email || '',
    phone: participant.phone || '',
    college: participant.college || '',
    department: participant.department || 'cs',
    year: participant.year || '1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateParticipant(participant.id, formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', padding: '25px' }}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 style="margin-bottom: 15px;">Edit Participant ({participant.id})</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-field-group">
            <label>Full Name</label>
            <input type="text" name="fullName" className="form-input" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="input-field-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-field-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="input-field-group">
            <label>College / University</label>
            <input type="text" name="college" className="form-input" value={formData.college} onChange={handleChange} required />
          </div>

          <div className="form-row-2">
            <div className="input-field-group">
              <label>Department</label>
              <select name="department" className="form-input" value={formData.department} onChange={handleChange}>
                <option value="cs">Computer Science</option>
                <option value="it">Information Technology</option>
                <option value="ee">Electrical Engineering</option>
                <option value="me">Mechanical Engineering</option>
                <option value="des">Design</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="input-field-group">
              <label>Year of Study</label>
              <select name="year" className="form-input" value={formData.year} onChange={handleChange}>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="register-button" style={{ background: '#666', borderColor: '#666', padding: '8px 16px' }} onClick={onClose}>Cancel</button>
            <button type="submit" className="register-button" style={{ padding: '8px 16px' }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditParticipantModal;
