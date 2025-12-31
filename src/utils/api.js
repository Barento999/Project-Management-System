import axios from 'axios';

// Create an instance of axios with default config
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (name, email, password) => API.post('/auth/register', { name, email, password }),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
};

// User API calls
export const userAPI = {
  getUsers: () => API.get('/users'),
  getUser: (id) => API.get(`/users/${id}`),
  updateUser: (id, userData) => API.put(`/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/users/${id}`),
  getMyTeams: () => API.get('/users/my-teams'),
  getMyProjects: () => API.get('/users/my-projects'),
  getMyTasks: () => API.get('/users/my-tasks'),
};

// Team API calls
export const teamAPI = {
  getTeams: () => API.get('/teams'),
  getTeam: (id) => API.get(`/teams/${id}`),
  createTeam: (teamData) => API.post('/teams', teamData),
  updateTeam: (id, teamData) => API.put(`/teams/${id}`, teamData),
  deleteTeam: (id) => API.delete(`/teams/${id}`),
  addMember: (id, userId) => API.put(`/teams/${id}/add-member`, { userId }),
  removeMember: (id, userId) => API.put(`/teams/${id}/remove-member`, { userId }),
};

// Project API calls
export const projectAPI = {
  getProjects: () => API.get('/projects'),
  getProject: (id) => API.get(`/projects/${id}`),
  createProject: (projectData) => API.post('/projects', projectData),
  updateProject: (id, projectData) => API.put(`/projects/${id}`, projectData),
  deleteProject: (id) => API.delete(`/projects/${id}`),
  addMember: (id, userId) => API.put(`/projects/${id}/add-member`, { userId }),
  removeMember: (id, userId) => API.put(`/projects/${id}/remove-member`, { userId }),
};

// Task API calls
export const taskAPI = {
  getTasks: () => API.get('/tasks'),
  getTask: (id) => API.get(`/tasks/${id}`),
  createTask: (taskData) => API.post('/tasks', taskData),
  updateTask: (id, taskData) => API.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  getTasksByProject: (projectId) => API.get(`/tasks/project/${projectId}`),
  getTasksByStatus: (status) => API.get(`/tasks/status/${status}`),
};

// Admin API calls
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getAllUsers: (page = 1, limit = 10, search = '') =>
    API.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`),
  getAllTeams: (page = 1, limit = 10, search = '') =>
    API.get(`/admin/teams?page=${page}&limit=${limit}&search=${search}`),
  getAllProjects: (page = 1, limit = 10, search = '') =>
    API.get(`/admin/projects?page=${page}&limit=${limit}&search=${search}`),
  getAllTasks: (page = 1, limit = 10, search = '') =>
    API.get(`/admin/tasks?page=${page}&limit=${limit}&search=${search}`),
  updateUser: (id, userData) => API.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getRecentActivity: () => API.get('/admin/activity'),
};

// Calendar API calls
export const calendarAPI = {
  getEvents: () => API.get('/calendar/events'),
  createEvent: (eventData) => API.post('/calendar/events', eventData),
  updateEvent: (id, eventData) => API.put(`/calendar/events/${id}`, eventData),
  deleteEvent: (id) => API.delete(`/calendar/events/${id}`),
};

// Documents API calls
export const documentAPI = {
  getDocuments: () => API.get('/documents'),
  getMyDocuments: () => API.get('/documents/my'),
  getSharedDocuments: () => API.get('/documents/shared'),
  createDocument: (docData) => API.post('/documents', docData),
  updateDocument: (id, docData) => API.put(`/documents/${id}`, docData),
  deleteDocument: (id) => API.delete(`/documents/${id}`),
  downloadDocument: (id) => API.get(`/documents/${id}/download`),
};

// Messages API calls
export const messageAPI = {
  getMessages: () => API.get('/messages'),
  getSentMessages: () => API.get('/messages/sent'),
  getInbox: () => API.get('/messages/inbox'),
  createMessage: (msgData) => API.post('/messages', msgData),
  updateMessage: (id, msgData) => API.put(`/messages/${id}`, msgData),
  deleteMessage: (id) => API.delete(`/messages/${id}`),
  markAsRead: (id) => API.put(`/messages/${id}/read`),
};

export default API;