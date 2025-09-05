// src/components/UploadVideo.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthToken } from "../../utils/api/config"; // ✅ Ensure this path is correct

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BASE_URL; // 🔁 Replace with your backend URL
  // const API_BASE_URL = "http://localhost:7000";
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/constants/categories`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
          }
        );
        setCategories(res.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch categories:", error.message);
        setStatus("Could not load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !category) {
      setStatus("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("video", file);

    try {
      setStatus("Uploading…");
      setIsUploading(true);
      setUploadProgress(0);

      const token = getAuthToken();
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/upload/video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setStatus("✅ Upload successful! 🎉");
      setIsUploading(false);
      setUploadProgress(100);
      console.log("Response:", res.data);
    } catch (err) {
      console.error("❌ Upload failed:", err.response?.data || err.message);
      setStatus("Upload failed. See console for details.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getStatusColor = () => {
    if (status.includes("✅")) return "text-green-400";
    if (status.includes("❌") || status.includes("failed"))
      return "text-red-400";
    if (status.includes("Uploading")) return "text-blue-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Upload Video
          </h1>
          <p className="text-gray-400">
            "Share your content with the world: Let your voice be heard"
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="flex items-center text-white font-medium">
                <span className="text-blue-400 mr-2">📝</span>
                Title *
              </label>
              <input
                type="text"
                className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
                placeholder="Enter video title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="flex items-center text-white font-medium">
                <span className="text-green-400 mr-2">📄</span>
                Description
              </label>
              <textarea
                className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-all duration-200 resize-none"
                rows="4"
                placeholder="Describe your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="flex items-center text-white font-medium">
                <span className="text-purple-400 mr-2">🏷️</span>
                Category *
              </label>
              <select
                className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-200"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading categories...</option>
                )}
              </select>
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <label className="flex items-center text-white font-medium">
                <span className="text-orange-400 mr-2">🎬</span>
                Video File *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-blue-400 bg-blue-900/20"
                    : file
                    ? "border-green-400 bg-green-900/20"
                    : "border-gray-600 hover:border-gray-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileSelect}
                  required
                />

                {file ? (
                  <div className="space-y-3">
                    <div className="text-6xl">✅</div>
                    <div>
                      <p className="text-green-400 font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-6xl text-gray-500">📁</div>
                    <div>
                      <p className="text-white font-medium">
                        {isDragging
                          ? "Drop your video here"
                          : "Click to select or drag and drop"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        MP4, MOV, AVI, and other video formats
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Upload Progress</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 transform ${
                isUploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Upload Video</span>
                </div>
              )}
            </button>
          </form>

          {/* Status Message */}
          {status && (
            <div className="px-8 pb-8">
              <div
                className={`p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-center ${getStatusColor()}`}
              >
                <p className="font-medium">{status}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
