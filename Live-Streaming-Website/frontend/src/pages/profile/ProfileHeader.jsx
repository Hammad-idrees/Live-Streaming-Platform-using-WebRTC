import React, { useState, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Settings,
  Sparkles,
} from "lucide-react";

const ProfileHeader = ({
  isEditing,
  setIsEditing,
  loading,
  handleSave,
  handleCancel,
  message,
}) => {
  const [messageVisible, setMessageVisible] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(null);

  useEffect(() => {
    if (message.text) {
      setMessageVisible(true);
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const AnimatedButton = ({
    onClick,
    disabled,
    className,
    children,
    variant = "primary",
    isLoading = false,
    hoverKey,
  }) => {
    const baseClasses =
      "relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group";
    const variants = {
      primary:
        "bg-gradient-to-r from-live to-red-500 hover:from-red-500 hover:to-live text-white hover:shadow-lg hover:shadow-live/25",
      secondary: "bg-dark-700 hover:bg-dark-600 text-white hover:shadow-lg",
      success:
        "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25",
      disabled: "bg-dark-700 text-dark-500 cursor-not-allowed",
    };

    const currentVariant = disabled ? "disabled" : variant;

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[currentVariant]} ${className} ${
          !disabled ? "hover:scale-105 active:scale-95" : ""
        }`}
        onMouseEnter={() => setButtonHovered(hoverKey)}
        onMouseLeave={() => setButtonHovered(null)}
      >
        {/* Shimmer effect */}
        {!disabled && (
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}

        {/* Button content */}
        <div className="relative z-10 flex items-center gap-2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            children
          )}
        </div>

        {/* Pulse effect for primary button */}
        {variant === "primary" && buttonHovered === hoverKey && (
          <div className="absolute inset-0 bg-live/20 rounded-lg animate-ping"></div>
        )}
      </button>
    );
  };

  return (
    <div className="relative">
      {/* Enhanced Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] overflow-hidden">
        <div className="w-full h-full animate-glow bg-gradient-to-r from-transparent via-live to-transparent blur-sm opacity-60"></div>
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 pt-4">
        {/* Title with animated icon */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Settings className="text-live w-8 h-8 animate-pulse" />
            <Sparkles className="absolute -top-1 -right-1 text-yellow-400 w-4 h-4 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
            Profile Settings
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <AnimatedButton
              onClick={() => setIsEditing(true)}
              variant="primary"
              hoverKey="edit"
            >
              <Edit3
                size={20}
                className="transition-transform duration-200 group-hover:rotate-12"
              />
              Edit Profile
            </AnimatedButton>
          ) : (
            <div className="flex gap-3 animate-slideIn">
              <AnimatedButton
                onClick={handleCancel}
                variant="secondary"
                hoverKey="cancel"
              >
                <X
                  size={20}
                  className="transition-transform duration-200 group-hover:rotate-90"
                />
                Cancel
              </AnimatedButton>

              <AnimatedButton
                onClick={handleSave}
                disabled={loading}
                variant="success"
                isLoading={loading}
                hoverKey="save"
              >
                {!loading && (
                  <Save
                    size={20}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                )}
                {loading ? "Saving..." : "Save Changes"}
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg flex items-center gap-3 shadow-2xl border backdrop-blur-sm transition-all duration-500 transform ${
            messageVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          } ${
            message.type === "success"
              ? "bg-green-500/90 border-green-400/50 text-white shadow-green-500/25"
              : "bg-red-500/90 border-red-400/50 text-white shadow-red-500/25"
          }`}
        >
          {/* Icon with animation */}
          <div
            className={`transition-transform duration-300 ${
              messageVisible ? "scale-100" : "scale-0"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={20} className="animate-pulse" />
            ) : (
              <AlertCircle size={20} className="animate-bounce" />
            )}
          </div>

          {/* Message text */}
          <span className="font-medium">{message.text}</span>

          {/* Close button */}
          <button
            onClick={() => setMessageVisible(false)}
            className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X size={16} />
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white animate-progressBar"
              style={{ animationDuration: "5s" }}
            ></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes glow {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-progressBar {
          animation: progressBar 5s linear forwards;
        }

        .animate-glow {
          background-size: 200% 100%;
          animation: glow 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfileHeader;
