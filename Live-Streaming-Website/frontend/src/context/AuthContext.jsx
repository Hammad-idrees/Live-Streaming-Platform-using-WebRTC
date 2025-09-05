import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  isAuthenticated as checkAuthStatus, 
  getCurrentUser 
} from '../utils/api';
import { getUserData, setUserData, clearAuthData } from '../utils/api/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Check for existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      
      try {
        // Check if user has valid token
        if (checkAuthStatus()) {
          
          const userData = getUserData();
          if (userData) {
            
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            // Token exists but no user data, clear everything
            clearAuthData();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // No valid token
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // Clear any corrupted auth data
        clearAuthData();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);


  const login = async (credentials) => {
    
    try {
      setLoading(true);
      
      const result = await loginUser(credentials);
      
      if (result.success) {
        
        // Store user data in cookies
        setUserData(result.data.user);
        
        setIsAuthenticated(true);
        setUser(result.data.user);
        
        return { 
          success: true, 
          user: result.data.user,
          message: result.message 
        };
      } else {
        return { 
          success: false, 
          error: result.error 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    
    try {
      setLoading(true);
      
      const result = await registerUser(userData);
      
      if (result.success) {
        return { 
          success: true, 
          user: result.data,
          message: result.message || 'Registration successful! Please log in.' 
        };
      } else {
        return { 
          success: false, 
          error: result.error 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    
    try {
      // Clear API token and cookies
      logoutUser();
      clearAuthData();
      
      // Update state
      setIsAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  };

  const updateUser = (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setUserData(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Failed to update user data' };
    }
  };

  const refreshUser = async () => {
    try {
      // Check if we have a valid token
      if (!checkAuthStatus()) {
        throw new Error('No valid authentication token');
      }

      const currentUserData = getUserData();
      if (currentUserData) {
        setUser(currentUserData);
        return { success: true, user: currentUserData };
      }
      
      throw new Error('No user data found');
    } catch (error) {
      
      // If refresh fails, logout the user
      logout();
      
      return { success: false, error: 'Session expired. Please log in again.' };
    }
  };

  // Auto-refresh user data periodically (optional)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        // Only refresh if token is still valid
        if (checkAuthStatus()) {
          refreshUser();
        } else {
          // Token expired, logout user
          logout();
        }
      }, 15 * 60 * 1000); // Check every 15 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const canAccessStreamer = user?.role === 'streamer';
  const canAccessViewer = user?.role === 'user' || user?.role === 'streamer';

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
    canAccessStreamer,
    canAccessViewer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};