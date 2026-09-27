import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem('hash26VisitorName') || '');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('techfest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('techfest_token') || '');

  const [isOrganizerLoggedIn, setIsOrganizerLoggedIn] = useState(() => {
    return localStorage.getItem('hash26OrganizerLoggedIn') === 'true';
  });

  // Data Collections (MongoDB backed)
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch initial data from API
  const fetchEvents = useCallback(async (category = '') => {
    try {
      const data = await apiService.getEvents(category);
      setEvents(data);
    } catch (err) {
      console.warn('Backend API fetch events error, using fallback:', err.message);
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    try {
      const data = await apiService.getRegistrations();
      setParticipants(data);
    } catch (err) {
      console.warn('Backend API fetch registrations error:', err.message);
    }
  }, []);

  const fetchMyRegistrations = useCallback(async () => {
    if (!token && !currentUser) return [];
    try {
      const data = await apiService.getMyRegistrations();
      setUserRegistrations(data);
      return data;
    } catch (err) {
      console.warn('Fetch my registrations error:', err.message);
      return [];
    }
  }, [token, currentUser]);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await apiService.getTasks();
      setTasks(data);
    } catch (err) {
      console.warn('Fetch tasks error:', err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
    fetchTasks();
    if (token) {
      apiService.getCurrentUser()
        .then(user => {
          if (user) {
            setCurrentUser(user);
            localStorage.setItem('techfest_user', JSON.stringify(user));
            if (user.role === 'organizer' || user.role === 'admin') {
              setIsOrganizerLoggedIn(true);
              localStorage.setItem('hash26OrganizerLoggedIn', 'true');
            }
          }
        })
        .catch(() => {
          // Token expired or invalid
          setToken('');
          setCurrentUser(null);
          localStorage.removeItem('techfest_token');
          localStorage.removeItem('techfest_user');
        });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchMyRegistrations();
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hash26VisitorName', visitorName);
  }, [visitorName]);

  // Auth Functions
  const registerUser = async (userData) => {
    try {
      const res = await apiService.register(userData);
      const user = res.data;
      setCurrentUser(user);
      setToken(user.token);
      localStorage.setItem('techfest_token', user.token);
      localStorage.setItem('techfest_user', JSON.stringify(user));
      setVisitorName(user.name);

      if (user.role === 'organizer' || user.role === 'admin') {
        setIsOrganizerLoggedIn(true);
        localStorage.setItem('hash26OrganizerLoggedIn', 'true');
      }

      showToast(`Welcome, ${user.name}! Account created successfully.`);
      return { success: true, user };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await apiService.login({ email, password });
      const user = res.data;
      setCurrentUser(user);
      setToken(user.token);
      localStorage.setItem('techfest_token', user.token);
      localStorage.setItem('techfest_user', JSON.stringify(user));
      setVisitorName(user.name);

      if (user.role === 'organizer' || user.role === 'admin') {
        setIsOrganizerLoggedIn(true);
        localStorage.setItem('hash26OrganizerLoggedIn', 'true');
      }

      showToast(`Welcome back, ${user.name}!`);
      return { success: true, user };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setToken('');
    setIsOrganizerLoggedIn(false);
    localStorage.removeItem('techfest_token');
    localStorage.removeItem('techfest_user');
    localStorage.removeItem('hash26OrganizerLoggedIn');
    showToast('Logged out successfully.');
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

  // Participant / Event Registration CRUD
  const addParticipant = async (data) => {
    try {
      const res = await apiService.createRegistration(data);
      showToast(res.message || 'Registration Successful!');
      fetchRegistrations();
      fetchEvents();
      fetchMyRegistrations();
      return res.data;
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
      throw error;
    }
  };

  const updateParticipant = async (id, updatedData) => {
    try {
      const resData = await apiService.updateRegistration(id, updatedData);
      showToast(`Registration ${id} updated.`);
      fetchRegistrations();
      fetchMyRegistrations();
      return resData;
    } catch (error) {
      showToast(error.message || 'Update failed.', 'error');
    }
  };

  const deleteParticipant = async (id) => {
    try {
      await apiService.deleteRegistration(id);
      showToast(`Registration ${id} removed.`);
      fetchRegistrations();
      fetchMyRegistrations();
    } catch (error) {
      showToast(error.message || 'Delete failed.', 'error');
    }
  };

  // Task CRUD
  const addTask = async (text) => {
    if (!text.trim()) return;
    try {
      await apiService.createTask(text);
      fetchTasks();
      showToast('Task added.');
    } catch (error) {
      showToast(error.message || 'Failed to add task.', 'error');
    }
  };

  const toggleTask = async (id) => {
    try {
      await apiService.toggleTask(id);
      fetchTasks();
    } catch (error) {
      showToast(error.message || 'Failed to update task.', 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiService.deleteTask(id);
      fetchTasks();
      showToast('Task deleted.');
    } catch (error) {
      showToast(error.message || 'Failed to delete task.', 'error');
    }
  };

  const clearCompletedTasks = async () => {
    try {
      await fetch('/api/tasks/completed', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTasks();
      showToast('Completed tasks cleared.');
    } catch (error) {
      showToast('Failed to clear completed tasks.', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        visitorName,
        setVisitorName,
        currentUser,
        token,
        registerUser,
        loginUser,
        logoutUser,
        isOrganizerLoggedIn,
        loginOrganizer,
        logoutOrganizer,
        events,
        fetchEvents,
        participants,
        userRegistrations,
        fetchRegistrations,
        fetchMyRegistrations,
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
