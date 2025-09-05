// utils/api/config.js
import { setCookie, getCookie, deleteCookie } from "../cookies";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://172.17.180.64:7001";

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Cookie names
const AUTH_TOKEN_COOKIE = "authToken";
const USER_DATA_COOKIE = "userData";

// Get token from cookies
export const getAuthToken = () => {
  const token = getCookie(AUTH_TOKEN_COOKIE);
  return token;
};

// Set token to cookies
export const setAuthToken = (token) => {
  setCookie(AUTH_TOKEN_COOKIE, token, {
    expires: 7, // 7 days
    secure: window.location.protocol === "https:",
    sameSite: "Strict",
  });
};

// Remove token from cookies
export const removeAuthToken = () => {
  deleteCookie(AUTH_TOKEN_COOKIE);
};

// Get user data from cookies
export const getUserData = () => {
  const userData = getCookie(USER_DATA_COOKIE);

  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      return null;
    }
  }

  return null;
};

// Set user data to cookies
export const setUserData = (user) => {
  setCookie(USER_DATA_COOKIE, JSON.stringify(user), {
    expires: 7, // 7 days
    secure: window.location.protocol === "https:",
    sameSite: "Strict",
  });
};

// Remove user data from cookies
export const removeUserData = () => {
  deleteCookie(USER_DATA_COOKIE);
};

// Add auth header if token exists
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Clear all auth data
export const clearAuthData = () => {
  removeAuthToken();
  removeUserData();
};
