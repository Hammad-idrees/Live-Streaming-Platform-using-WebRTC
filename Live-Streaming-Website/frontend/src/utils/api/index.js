// utils/api/index.js
// Main API exports - single point of entry for all API functions

// Auth API functions
export {
  registerUser,
  loginUser,
  logoutUser,
  isAuthenticated,
  getCurrentUser,
} from "./auth";

// API client and error handling
export { apiClient, ApiError } from "./client";

// Configuration utilities
export {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getAuthHeaders,
} from "./config";

// add more API modules here as your app grows
// export * from './users';
// export * from './streams';
// export * from './chat';
// etc.
