import React, { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Link,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ProfileForm = ({ isEditing, formData, handleInputChange, user }) => {
  const [focusedField, setFocusedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // Clear validation errors on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Validate in real-time
    if (name === "email" && value && !validateEmail(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Invalid email format",
      }));
    } else if (name === "website" && value && !validateUrl(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        website: "Invalid URL format",
      }));
    } else if (name === "age" && value && (value < 13 || value > 120)) {
      setValidationErrors((prev) => ({
        ...prev,
        age: "Age must be between 13 and 120",
      }));
    }

    handleInputChange(e);
  };

  const getFieldStatus = (fieldName, value) => {
    if (!value) return null;
    if (validationErrors[fieldName]) return "error";
    if (fieldName === "email" && validateEmail(value)) return "valid";
    if (fieldName === "website" && validateUrl(value)) return "valid";
    if (fieldName === "age" && value >= 13 && value <= 120) return "valid";
    return null;
  };

  const FormField = ({
    icon: Icon,
    label,
    name,
    type = "text",
    placeholder,
    children,
    showCounter = false,
    maxLength,
    rows,
    min,
    max,
  }) => {
    const fieldStatus = getFieldStatus(name, formData[name]);
    const isFocused = focusedField === name;

    return (
      <div className="group">
        <label className="block text-dark-300 text-sm font-medium mb-2 transition-all duration-200 group-hover:text-white">
          <Icon
            size={16}
            className="inline mr-2 transition-transform duration-200 group-hover:scale-110"
          />
          {label}
        </label>
        {isEditing ? (
          <div className="relative">
            {type === "textarea" ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleFieldChange}
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                rows={rows}
                maxLength={maxLength}
                className={`w-full bg-dark-800 border-2 rounded-lg px-4 py-3 text-white placeholder-dark-400 transition-all duration-300 resize-none ${
                  isFocused
                    ? "border-live shadow-lg shadow-live/25 bg-dark-700 transform scale-[1.02]"
                    : fieldStatus === "error"
                    ? "border-red-500 bg-red-500/10"
                    : fieldStatus === "valid"
                    ? "border-green-500 bg-green-500/10"
                    : "border-dark-600 hover:border-dark-500"
                }`}
                placeholder={placeholder}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleFieldChange}
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                min={min}
                max={max}
                className={`w-full bg-dark-800 border-2 rounded-lg px-4 py-3 pr-12 text-white placeholder-dark-400 transition-all duration-300 ${
                  isFocused
                    ? "border-live shadow-lg shadow-live/25 bg-dark-700 transform scale-[1.02]"
                    : fieldStatus === "error"
                    ? "border-red-500 bg-red-500/10"
                    : fieldStatus === "valid"
                    ? "border-green-500 bg-green-500/10"
                    : "border-dark-600 hover:border-dark-500"
                }`}
                placeholder={placeholder}
              />
            )}

            {/* Status Icon */}
            {fieldStatus && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {fieldStatus === "valid" ? (
                  <CheckCircle className="text-green-500 w-5 h-5 animate-pulse" />
                ) : (
                  <AlertCircle className="text-red-500 w-5 h-5 animate-pulse" />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-white transition-all duration-200 hover:bg-dark-700 hover:border-dark-500 min-h-[48px] flex items-center">
            {name === "website" && formData[name] ? (
              <a
                href={formData[name]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-live hover:text-red-400 transition-colors hover:underline"
              >
                {formData[name]}
              </a>
            ) : (
              <span className={formData[name] ? "text-white" : "text-dark-400"}>
                {formData[name] || user?.[name] || "Not set"}
              </span>
            )}
          </div>
        )}

        {/* Error Message */}
        {validationErrors[name] && (
          <p className="text-red-400 text-xs mt-1 animate-slideIn flex items-center gap-1">
            <AlertCircle size={12} />
            {validationErrors[name]}
          </p>
        )}

        {/* Character Counter */}
        {showCounter && isEditing && (
          <div className="text-right text-xs text-dark-400 mt-1 transition-colors duration-200">
            <span
              className={
                formData[name]?.length >= maxLength * 0.9
                  ? "text-yellow-400"
                  : ""
              }
            >
              {formData[name]?.length || 0}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <FormField
        icon={User}
        label="Username"
        name="username"
        placeholder="Enter your username"
      />

      <FormField
        icon={Mail}
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
      />

      <FormField
        icon={Calendar}
        label="Age"
        name="age"
        type="number"
        min="13"
        max="120"
        placeholder="Enter your age"
      />

      <FormField
        icon={User}
        label="Bio"
        name="bio"
        type="textarea"
        rows="4"
        maxLength="200"
        showCounter={true}
        placeholder="Tell us about yourself..."
      />

      <FormField
        icon={MapPin}
        label="Location"
        name="location"
        placeholder="City, Country"
      />

      <FormField
        icon={Link}
        label="Website"
        name="website"
        type="url"
        placeholder="https://your-website.com"
      />

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfileForm;
