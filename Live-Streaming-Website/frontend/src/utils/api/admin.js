import { apiClient } from './client';

export const fetchAllUsers = () => apiClient.get('/api/v1/admin/users');

export const promoteToStreamer = (userId) =>
  apiClient.put(`/api/v1/admin/users/${userId}/promote`);

export const demoteToUser = (userId) =>
  apiClient.put(`/api/v1/admin/users/${userId}/demote`);

export const promoteToAdmin = (userId) =>
  apiClient.put(`/api/v1/admin/users/${userId}/promote-to-admin`);

export const fetchAllStreams = () => apiClient.get('/api/v1/admin/streams');

export const fetchAllReports = () => apiClient.get('/api/v1/admin/reports');
export const resolveReport = (reportId) => apiClient.put(`/api/v1/admin/reports/${reportId}/resolve`);

// Categories
export const fetchAllCategories = () => apiClient.get('/api/v1/admin/categories');
export const addCategory = (data) => apiClient.post('/api/v1/admin/categories', data);
export const updateCategory = (id, data) => apiClient.put(`/api/v1/admin/categories/${id}`, data);
export const deleteCategory = (id) => apiClient.delete(`/api/v1/admin/categories/${id}`);

// Analytics
export const fetchAnalyticsSummary = () => apiClient.get('/api/v1/admin/analytics/summary');

// Settings
export const fetchSettings = () => apiClient.get('/api/v1/admin/settings');
export const updateSettings = (data) => apiClient.put('/api/v1/admin/settings', data); 