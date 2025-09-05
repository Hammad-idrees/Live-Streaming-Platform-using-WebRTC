import React from "react";
import useProfile from "./useProfile";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import ProfilePasswordSection from "./ProfilePasswordSection";

const ProfilePage = () => {
  const {
    user,
    isEditing,
    setIsEditing,
    loading,
    message,
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
  } = useProfile();

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          loading={loading}
          handleSave={handleSave}
          handleCancel={handleCancel}
          message={message}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileCard
              user={user}
              isEditing={isEditing}
              handleAvatarClick={handleAvatarClick}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              avatarPreview={avatarPreview}
              getAvatarSrc={getAvatarSrc}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-dark-900 rounded-xl p-6 border border-dark-800">
              <h3 className="text-xl font-bold text-white mb-6">
                Account Information
              </h3>
              <ProfileForm
                isEditing={isEditing}
                formData={formData}
                handleInputChange={handleInputChange}
                user={user}
              />
              <ProfilePasswordSection
                isEditing={isEditing}
                showPasswordFields={showPasswordFields}
                setShowPasswordFields={setShowPasswordFields}
                showCurrentPassword={showCurrentPassword}
                setShowCurrentPassword={setShowCurrentPassword}
                showNewPassword={showNewPassword}
                setShowNewPassword={setShowNewPassword}
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
