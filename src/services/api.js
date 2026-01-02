import axios from "axios";

// Create axios instance with base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getProfile: () => API.get("/auth/profile"),
  updateProfile: (data) => API.put("/auth/profile", data),
  forgotPassword: (email) => API.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    API.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => API.get(`/auth/verify-email/${token}`),
  sendVerification: () => API.post("/auth/send-verification"),
};

// Project API
export const projectAPI = {
  getAll: (params) => API.get("/projects", { params }),
  getOne: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post("/projects", data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
  addMember: (id, userId, role) =>
    API.put(`/projects/${id}/add-member`, { userId, role }),
  removeMember: (id, userId) =>
    API.put(`/projects/${id}/remove-member`, { userId }),
  archive: (id) => API.put(`/projects/${id}/archive`),
  getStats: (id) => API.get(`/projects/${id}/stats`),
};

// Task API
export const taskAPI = {
  getAll: (params) => API.get("/tasks", { params }),
  getOne: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post("/tasks", data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
  assign: (id, userId) =>
    API.put(`/tasks/${id}/assign`, { assignedTo: userId }),
  updateStatus: (id, status) => API.put(`/tasks/${id}/status`, { status }),
};

// Team API
export const teamAPI = {
  getAll: (params) => API.get("/teams", { params }),
  getOne: (id) => API.get(`/teams/${id}`),
  create: (data) => API.post("/teams", data),
  update: (id, data) => API.put(`/teams/${id}`, data),
  delete: (id) => API.delete(`/teams/${id}`),
  addMember: (id, userId) => API.put(`/teams/${id}/add-member`, { userId }),
  removeMember: (id, userId) =>
    API.put(`/teams/${id}/remove-member`, { userId }),
};

// User API
export const userAPI = {
  getAll: (params) => API.get("/users", { params }),
  search: (query) => API.get("/users/search", { params: { query } }),
  getOne: (id) => API.get(`/users/${id}`),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
  activate: (id) => API.put(`/users/${id}/activate`),
  deactivate: (id) => API.put(`/users/${id}/deactivate`),
};

// Notification API
export const notificationAPI = {
  getAll: (params) => API.get("/notifications", { params }),
  getUnreadCount: () => API.get("/notifications/unread-count"),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put("/notifications/read-all"),
  delete: (id) => API.delete(`/notifications/${id}`),
};

// Comment API
export const commentAPI = {
  getAll: (entityType, entityId) =>
    API.get(`/comments/${entityType}/${entityId}`),
  create: (data) => API.post("/comments", data),
  update: (id, data) => API.put(`/comments/${id}`, data),
  delete: (id) => API.delete(`/comments/${id}`),
};

// Time Tracking API
export const timeTrackingAPI = {
  getAll: (params) => API.get("/time-tracking", { params }),
  getRunning: () => API.get("/time-tracking/running"),
  getTimesheet: (params) => API.get("/time-tracking/timesheet", { params }),
  start: (data) => API.post("/time-tracking/start", data),
  stop: (id) => API.put(`/time-tracking/${id}/stop`),
  createManual: (data) => API.post("/time-tracking/manual", data),
  update: (id, data) => API.put(`/time-tracking/${id}`, data),
  delete: (id) => API.delete(`/time-tracking/${id}`),
};

// Activity Log API
export const activityLogAPI = {
  getAll: (params) => API.get("/activity-logs", { params }),
  getByEntity: (entityType, entityId, params) =>
    API.get(`/activity-logs/${entityType}/${entityId}`, { params }),
};

// File API
export const fileAPI = {
  upload: (formData) =>
    API.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: (params) => API.get("/files", { params }),
  getByEntity: (entityType, entityId) =>
    API.get(`/files/entity/${entityType}/${entityId}`),
  getOne: (id) => API.get(`/files/${id}`),
  download: (id) => API.get(`/files/${id}/download`, { responseType: "blob" }),
  update: (id, data) => API.put(`/files/${id}`, data),
  delete: (id) => API.delete(`/files/${id}`),
};

// Admin API
export const adminAPI = {
  getStats: () => API.get("/admin/stats"),
  getAllUsers: (params) => API.get("/admin/users", { params }),
  getAllProjects: (params) => API.get("/admin/projects", { params }),
  getAllTasks: (params) => API.get("/admin/tasks", { params }),
};

export default API;
