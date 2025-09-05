// utils/api/auth.js
import { apiClient } from "./client";
import {
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  clearAuthData,
} from "./config";

// Register new user
export const registerUser = async (userData) => {
  try {
    const { username, email, password, role = "user", age } = userData;

    // Validate required fields
    if (!username || !email || !password) {
      throw new Error("Username, email, and password are required");
    }

    const response = await apiClient.post("/api/v1/user/register", {
      username,
      email,
      password,
      role,
      age,
    });

    // Extract user from response.data.data
    return {
      success: true,
      data: response.data?.data,
      message: "Registration successful!",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Registration failed",
      details: error.data || {},
    };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;

    // Validate required fields
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const response = await apiClient.post("/api/v1/user/login", {
      email,
      password,
    });

    // Extract token and user from response.data.data
    if (response.data?.data?.token) {
      setAuthToken(response.data.data.token);
    } else {
      console.warn("API: No token in response");
    }
    return {
      success: true,
      data: response.data?.data,
      message: "Login successful!",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Login failed",
      details: error.data || {},
    };
  }
};

// Logout user
export const logoutUser = () => {
  try {
    clearAuthData();
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: "Logout failed",
    };
  }
};

// Check if user is authenticated - using cookies
export const isAuthenticated = () => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  try {
    // Basic token validation (you might want to add expiry check)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;

    return payload.exp > now;
  } catch (error) {
    return false;
  }
};

// Get current user from token
export const getCurrentUser = () => {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
};
