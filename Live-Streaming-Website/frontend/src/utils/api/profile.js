// utils/api/profile.js
import { apiClient } from "./client";
import { apiConfig, getAuthToken } from "./config";

// Update user profile
export const updateProfile = async (formData) => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/api/v1/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData, // FormData object for file uploads
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: "Profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
};

// Get user profile
export const getUserProfile = async (userId = null) => {
  try {
    const endpoint = userId
      ? `/api/v1/user/profile/${userId}`
      : "/api/v1/user/profile";
    const response = await apiClient.get(`${apiConfig.baseURL}${endpoint}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch profile",
    };
  }
};

// Upload avatar specifically
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${apiConfig.baseURL}/api/v1/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to upload avatar");
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: "Avatar updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to upload avatar",
    };
  }
};

// Change password
export const changePassword = async (passwords) => {
  try {
    const formData = new FormData();
    formData.append("currentPassword", passwords.currentPassword);
    formData.append("password", passwords.newPassword);

    const response = await fetch(`${apiConfig.baseURL}/api/v1/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to change password");
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: "Password changed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to change password",
    };
  }
};

// Upgrade to streamer
export const upgradeToStreamer = async () => {
  try {
    const response = await fetch(
      `${apiConfig.baseURL}/api/v1/user/upgrade-to-streamer`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to upgrade");
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
