const API_BASE_URL = '/api';

const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const authToken = token || localStorage.getItem('techfest_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const apiService = {
  // Auth API
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('techfest_token');
    if (!token) return null;
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(token)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.data;
  },

  // Events API
  async getEvents(category = '') {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE_URL}/events${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch events');
    return data.data;
  },

  async getEventById(id) {
    const res = await fetch(`${API_BASE_URL}/events/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch event');
    return data.data;
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create event');
    return data.data;
  },

  // Registrations API
  async getRegistrations() {
    const res = await fetch(`${API_BASE_URL}/registrations`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch registrations');
    return data.data;
  },

  async getMyRegistrations() {
    const res = await fetch(`${API_BASE_URL}/registrations/my-registrations`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user registrations');
    return data.data;
  },

  async createRegistration(registrationData) {
    const res = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(registrationData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Event registration failed');
    return data;
  },

  async updateRegistration(id, registrationData) {
    const res = await fetch(`${API_BASE_URL}/registrations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(registrationData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update registration');
    return data.data;
  },

  async deleteRegistration(id) {
    const res = await fetch(`${API_BASE_URL}/registrations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete registration');
    return data;
  },

  // Tasks API
  async getTasks() {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data.data;
  },

  async createTask(text) {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create task');
    return data.data;
  },

  async toggleTask(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PUT',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle task');
    return data.data;
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
  }
};
