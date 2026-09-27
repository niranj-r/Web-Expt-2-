import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EditParticipantModal from '../components/EditParticipantModal';

const deptMap = {
  cs: 'Computer Science',
  it: 'Information Technology',
  ee: 'Electrical Engineering',
  me: 'Mechanical Engineering',
  des: 'Design',
  other: 'Other'
};

const ParticipantsPage = () => {
  const {
    participants,
    deleteParticipant,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
    setCurrentPage
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [taskInputText, setTaskInputText] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');

  // Search filter logic
  const filteredParticipants = participants.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const dept = (deptMap[p.department] || p.department || '').toLowerCase();
    const eventsStr = Array.isArray(p.events) ? p.events.join(' ').toLowerCase() : '';
    return (
      (p.fullName && p.fullName.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.phone && p.phone.includes(term)) ||
      (p.college && p.college.toLowerCase().includes(term)) ||
      dept.includes(term) ||
      eventsStr.includes(term) ||
      String(p.id).toLowerCase().includes(term)
    );
  });

  // Task filtering
  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (taskInputText.trim()) {
      addTask(taskInputText);
      setTaskInputText('');
    }
  };

  return (
    <main>
      <section className="registration-header">
        <div className="container">
          <h1>PARTICIPANTS DIRECTORY</h1>
          <p>Search, manage, and view all registered Hash'26 participants & task dashboard.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          
          <div className="react-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
            
            {/* Left: Participants Directory */}
            <div className="dashboard-section" style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid var(--highlight)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>Registered Participants ({filteredParticipants.length})</h2>
                <button type="button" className="register-button" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => setCurrentPage('registration')}>
                  + Add New
                </button>
              </div>

              <div className="input-field-group">
                <input
                  type="search"
                  className="form-input"
                  placeholder="🔍 Search participants by name, email, phone, college, or event..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="participant-table-wrapper" style={{ overflowX: 'auto', marginTop: '15px' }}>
                <table className="participant-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>College</th>
                      <th>Dept</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#777' }}>
                          No participants match your query.
                        </td>
                      </tr>
                    ) : (
                      filteredParticipants.map(p => (
                        <tr key={p.id}>
                          <td><small><strong>{p.id}</strong></small></td>
                          <td><strong>{p.fullName}</strong></td>
                          <td>{p.email}</td>
                          <td>{p.phone}</td>
                          <td>{p.college}</td>
                          <td>{deptMap[p.department] || p.department} ({p.year}Y)</td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              className="btn-table-action btn-table-edit"
                              onClick={() => setEditingParticipant(p)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn-table-action btn-table-delete"
                              onClick={() => {
                                if (confirm(`Remove participant ${p.fullName} (${p.id})?`)) {
                                  deleteParticipant(p.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Organizer Task Manager */}
            <div className="dashboard-section" style={{ background: 'white', padding: '30px', borderRadius: '8px', borderTop: '4px solid var(--highlight)' }}>
              <h2>Organizer Task Manager</h2>

              <form onSubmit={handleAddTaskSubmit} className="task-input-group" style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter a new organizer task..."
                  value={taskInputText}
                  onChange={e => setTaskInputText(e.target.value)}
                />
                <button type="submit" className="register-button" style={{ padding: '10px 16px', fontSize: '13px' }}>
                  Add
                </button>
              </form>

              {/* Task Filters */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  className={`btn-task-filter ${taskFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setTaskFilter('all')}
                >
                  All ({tasks.length})
                </button>
                <button
                  type="button"
                  className={`btn-task-filter ${taskFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setTaskFilter('pending')}
                >
                  Pending ({tasks.filter(t => !t.completed).length})
                </button>
                <button
                  type="button"
                  className={`btn-task-filter ${taskFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setTaskFilter('completed')}
                >
                  Completed ({tasks.filter(t => t.completed).length})
                </button>
                {tasks.some(t => t.completed) && (
                  <button
                    type="button"
                    className="btn-task-filter"
                    style={{ background: '#dc3545', color: 'white', marginLeft: 'auto' }}
                    onClick={clearCompletedTasks}
                  >
                    Clear Completed
                  </button>
                )}
              </div>

              {/* Task List */}
              <div className="tasks-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                {filteredTasks.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#777', fontStyle: 'italic' }}>
                    No tasks found.
                  </p>
                ) : (
                  filteredTasks.map(task => (
                    <div
                      key={task.id}
                      className="task-item"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        marginBottom: '8px',
                        background: '#f9f9f9',
                        borderLeft: `4px solid ${task.completed ? '#28a745' : 'var(--highlight, #ED4B00)'}`,
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#888' : '#222', fontSize: '14px', fontWeight: '500' }}>
                          {task.text}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Edit Modal */}
      {editingParticipant && (
        <EditParticipantModal
          participant={editingParticipant}
          onClose={() => setEditingParticipant(null)}
        />
      )}
    </main>
  );
};

export default ParticipantsPage;
