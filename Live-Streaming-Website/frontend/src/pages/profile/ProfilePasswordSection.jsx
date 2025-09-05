import React, { useState } from "react";
import { Eye, EyeOff, Lock, Shield, CheckCircle } from "lucide-react";

const ProfilePasswordSection = ({
  isEditing,
  showPasswordFields,
  setShowPasswordFields,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  formData,
  handleInputChange,
}) => {
  const [focusedField, setFocusedField] = useState(null);

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Very Weak", color: "bg-red-500" },
      { strength: 2, label: "Weak", color: "bg-orange-500" },
      { strength: 3, label: "Fair", color: "bg-yellow-500" },
      { strength: 4, label: "Good", color: "bg-blue-500" },
      { strength: 5, label: "Strong", color: "bg-green-500" },
    ];

    return levels[strength];
  };

  const passwordMatch =
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  const strengthInfo = getPasswordStrength(formData.newPassword);

  return (
    isEditing && (
      <div className="pt-6 border-t border-dark-800 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="text-live w-5 h-5" />
            <h4 className="text-lg font-semibold text-white">
              Security Settings
            </h4>
          </div>
          <button
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="group relative overflow-hidden bg-gradient-to-r from-live to-red-500 hover:from-red-500 hover:to-live text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-live/25 hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative flex items-center gap-2 text-sm font-medium">
              <Lock size={16} />
              {showPasswordFields ? "Cancel" : "Change Password"}
            </span>
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showPasswordFields ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-6 pb-4">
            {/* Current Password */}
            <div className="group">
              <label className="block text-dark-300 text-sm font-medium mb-2 transition-colors group-hover:text-white">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("current")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-dark-800 border-2 rounded-lg px-4 py-3 pr-12 text-white placeholder-dark-400 transition-all duration-300 ${
                    focusedField === "current"
                      ? "border-live shadow-lg shadow-live/25 bg-dark-700"
                      : "border-dark-600 hover:border-dark-500"
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-live transition-all duration-200 hover:scale-110"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="group">
              <label className="block text-dark-300 text-sm font-medium mb-2 transition-colors group-hover:text-white">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("new")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-dark-800 border-2 rounded-lg px-4 py-3 pr-12 text-white placeholder-dark-400 transition-all duration-300 ${
                    focusedField === "new"
                      ? "border-live shadow-lg shadow-live/25 bg-dark-700"
                      : "border-dark-600 hover:border-dark-500"
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-live transition-all duration-200 hover:scale-110"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-300">
                      Password Strength
                    </span>
                    <span
                      className={`text-xs font-medium ${strengthInfo.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    >
                      {strengthInfo.label}
                    </span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${strengthInfo.color} transition-all duration-500 ease-out`}
                      style={{ width: `${(strengthInfo.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label className="block text-dark-300 text-sm font-medium mb-2 transition-colors group-hover:text-white">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("confirm")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-dark-800 border-2 rounded-lg px-4 py-3 pr-12 text-white placeholder-dark-400 transition-all duration-300 ${
                    focusedField === "confirm"
                      ? "border-live shadow-lg shadow-live/25 bg-dark-700"
                      : formData.confirmPassword && passwordMatch
                      ? "border-green-500 bg-green-500/10"
                      : formData.confirmPassword && !passwordMatch
                      ? "border-red-500 bg-red-500/10"
                      : "border-dark-600 hover:border-dark-500"
                  }`}
                  placeholder="Confirm new password"
                />
                {formData.confirmPassword && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {passwordMatch ? (
                      <CheckCircle className="text-green-500 w-5 h-5 animate-pulse" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formData.confirmPassword && !passwordMatch && (
                <p className="text-red-400 text-xs mt-1 animate-fadeIn">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>
    )
  );
};

export default ProfilePasswordSection;
