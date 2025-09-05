import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiConfig } from "../../utils/api/config";
import { updateProfile } from "../../utils/api/profile";

export default function useProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    age: user?.age || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      age: user?.age || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/png") {
        setMessage({ type: "error", text: "Only PNG images are allowed" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image must be less than 5MB" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setMessage({
            type: "error",
            text: "Current password is required to change password",
          });
          setLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: "error", text: "New passwords do not match" });
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setMessage({
            type: "error",
            text: "New password must be at least 6 characters",
          });
          setLoading(false);
          return;
        }
      }
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("age", formData.age || 18);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("website", formData.website);
      if (formData.newPassword) {
        formDataToSend.append("currentPassword", formData.currentPassword);
        formDataToSend.append("password", formData.newPassword);
      }
      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile);
      }
      const result = await updateProfile(formDataToSend);
      if (result.success) {
        updateUser(result.data);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        setAvatarPreview(null);
        setSelectedFile(null);
        setShowPasswordFields(false);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null);
    setSelectedFile(null);
    setShowPasswordFields(false);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      age: user?.age || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setMessage({ type: "", text: "" });
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar && user.avatar !== "") {
      if (user.avatar.startsWith("/uploads")) {
        const bust = user.updatedAt
          ? `?t=${new Date(user.updatedAt).getTime()}`
          : `?t=${Date.now()}`;
        return `${apiConfig.baseURL}${user.avatar}${bust}`;
      }
      return user.avatar;
    }
    return "/images/profile/avatar.svg";
  };

  return {
    user,
    isEditing,
    setIsEditing,
    loading,
    message,
    setMessage,
    showPasswordFields,
    setShowPasswordFields,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    fileInputRef,
    formData,
    setFormData,
    avatarPreview,
    setAvatarPreview,
    selectedFile,
    setSelectedFile,
    handleInputChange,
    handleAvatarClick,
    handleFileChange,
    handleSave,
    handleCancel,
    getAvatarSrc,
  };
}
