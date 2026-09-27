import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_PARTICIPANTS = [
  {
    id: "REG-1001",
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "9876543210",
    dob: "2003-05-14",
    gender: "male",
    college: "MBCET Trivandrum",
    department: "cs",
    year: "3",
    events: ["Hack The Grid", "Algorithmic Art"],
    message: "Excited for the hackathon!",
    registeredAt: new Date(Date.now() - 86400000 * 2).toLocaleString()
  },
  {
    id: "REG-1002",
    fullName: "Priya Sharma",
    email: "priya.s@example.com",
    phone: "9812345678",
    dob: "2004-09-21",
    gender: "female",
    college: "CET Trivandrum",
    department: "it",
    year: "2",
    events: ["Capture The Flag", "Design Sprint"],
    message: "Looking forward to security CTF.",
    registeredAt: new Date(Date.now() - 86400000).toLocaleString()
  }
];

const INITIAL_TASKS = [
  { id: 1, text: "Verify event stage AV equipment setup", completed: true, createdAt: new Date().toLocaleDateString() },
  { id: 2, text: "Confirm CTF server hosting credentials", completed: false, createdAt: new Date().toLocaleDateString() },
  { id: 3, text: "Distribute participant identity badges", completed: false, createdAt: new Date().toLocaleDateString() }
];

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem('hash26VisitorName') || '');
  
  const [isOrganizerLoggedIn, setIsOrganizerLoggedIn] = useState(() => {
    return localStorage.getItem('hash26OrganizerLoggedIn') === 'true';
  });

  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem('hash26Participants');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PARTICIPANTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('hash26Tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TASKS;
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('hash26Participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('hash26Tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('hash26VisitorName', visitorName);
  }, [visitorName]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loginOrganizer = (username, password) => {
    if (username.trim().toLowerCase() === 'organizer' && password.trim() === 'techfest2026') {
      setIsOrganizerLoggedIn(true);
      localStorage.setItem('hash26OrganizerLoggedIn', 'true');
      showToast('Organizer Login Successful!');
      return true;
    }
    return false;
  };

  const logoutOrganizer = () => {
    setIsOrganizerLoggedIn(false);
    localStorage.removeItem('hash26OrganizerLoggedIn');
    showToast('Organizer session ended.');
  };

  const addParticipant = (data) => {
    const newEntry = {
      ...data,
      id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredAt: new Date().toLocaleString()
    };
    setParticipants(prev => [newEntry, ...prev]);
    showToast(`Registration Successful! Registration ID: ${newEntry.id}`);
    return newEntry;
  };

  const updateParticipant = (id, updatedData) => {
    setParticipants(prev => prev.map(p => (String(p.id) === String(id) ? { ...p, ...updatedData } : p)));
    showToast(`Participant ${id} updated.`);
  };

  const deleteParticipant = (id) => {
    setParticipants(prev => prev.filter(p => String(p.id) !== String(id)));
    showToast(`Participant ${id} removed.`);
  };

  const addTask = (text) => {
    if (!text.trim()) return;
    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toLocaleDateString()
    };
    setTasks(prev => [newTask, ...prev]);
    showToast("Task added.");
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast("Task deleted.");
  };

  const clearCompletedTasks = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        visitorName,
        setVisitorName,
        isOrganizerLoggedIn,
        loginOrganizer,
        logoutOrganizer,
        participants,
        addParticipant,
        updateParticipant,
        deleteParticipant,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        clearCompletedTasks,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
