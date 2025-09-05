import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import AuthPage from "./pages/auth/AuthPage";
import Dashboard from "./pages/dashboard/Dashboard";
import StreamView from "./pages/streamView/StreamView";
import StreamStudio from "./pages/streamStudio/StreamStudio";
import Playlists from "./pages/playlists/Playlists";
import PlaylistDetails from "./pages/playlists/PlaylistDetails";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import Live from "./pages/live/Live";
import UploadVideo from "./pages/streamStudio/UploadVideo";
import Library from "./pages/library/Library";

// Layouts
import Layout from "./components/layout/Layout";
import StudioLayout from "./components/layout/StudioLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Context for global state
import { AuthProvider, useAuth } from "./context/AuthContext";
import Browse from "./pages/browse/Browse";
import Following from "./pages/following/following";
import ProfilePage from "./pages/profile/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminStreams from "./pages/admin/Streams";
import AdminReports from "./pages/admin/Reports";
import AdminCategories from "./pages/admin/Categories";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import Trending from "./pages/discover/Trending";
import RecentlyWatched from "./pages/discover/RecentlyWatched";
import Liked from "./pages/discover/Liked";
import Saved from "./pages/discover/Saved";

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-live border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-white text-lg font-semibold">StreamVibe</div>
      <div className="text-dark-400 text-sm">Loading...</div>
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading, user, canAccessStreamer } = useAuth();
  const [currentView, setCurrentView] = useState("home");

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  // Public Route Component (redirect to dashboard if already authenticated)
  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  // Streamer-only Protected Route
  const StreamerRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    if (!canAccessStreamer) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  // Admin Route Protection
  const AdminRoute = ({ children }) => {
    return isAuthenticated && user?.isAdmin ? (
      children
    ) : (
      <Navigate to="/dashboard" replace />
    );
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Regular Layout */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Layout currentView={currentView} onViewChange={setCurrentView}>
              <Dashboard
                currentView={currentView}
                onViewChange={setCurrentView}
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stream/:streamId"
        element={
          <ProtectedRoute>
            <Layout currentView="stream" onViewChange={setCurrentView}>
              <StreamView />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <Layout currentView="browse" onViewChange={setCurrentView}>
              <Browse />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/following"
        element={
          <ProtectedRoute>
            <Layout currentView="following" onViewChange={setCurrentView}>
              <Following />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trending"
        element={
          <ProtectedRoute>
            <Layout currentView="trending" onViewChange={setCurrentView}>
              <Trending />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recently-watched"
        element={
          <ProtectedRoute>
            <Layout
              currentView="recently-watched"
              onViewChange={setCurrentView}
            >
              <RecentlyWatched />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/liked"
        element={
          <ProtectedRoute>
            <Layout currentView="liked" onViewChange={setCurrentView}>
              <Liked />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <Layout currentView="saved" onViewChange={setCurrentView}>
              <Saved />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <Layout currentView="playlists" onViewChange={setCurrentView}>
              <Playlists />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/playlists/:id"
        element={
          <ProtectedRoute>
            <Layout currentView="playlists" onViewChange={setCurrentView}>
              <PlaylistDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Layout currentView="library" onViewChange={setCurrentView}>
              <Library />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/live"
        element={
          <ProtectedRoute>
            <Layout currentView="live" onViewChange={setCurrentView}>
              <Live />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-video"
        element={
          <ProtectedRoute>
            <Layout currentView="upload-video" onViewChange={setCurrentView}>
              <UploadVideo />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/"
        element={
          <ProtectedRoute>
            <Layout currentView="profile" onViewChange={setCurrentView}>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout currentView="settings" onViewChange={setCurrentView}>
              <div className="p-6">
                <h1 className="text-white text-2xl">Settings</h1>
                <div className="mt-6 space-y-4">
                  <div className="bg-dark-800 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      Account Information
                    </h3>
                    <p className="text-dark-400 text-sm">
                      Username: {user?.username}
                    </p>
                    <p className="text-dark-400 text-sm">
                      Email: {user?.email}
                    </p>
                    <p className="text-dark-400 text-sm">Role: {user?.role}</p>
                  </div>
                  <div className="bg-dark-800 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      More Settings
                    </h3>
                    <p className="text-dark-400 text-sm">
                      Additional settings coming soon...
                    </p>
                  </div>
                </div>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Studio Route with Studio Layout (No Header/Sidebar) */}
      <Route
        path="/studio"
        element={
          <StreamerRoute>
            <StudioLayout>
              <StreamStudio />
            </StudioLayout>
          </StreamerRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          // <AdminRoute>
          <AdminLayout>
            <Routes>
              <Route path="" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="streams" element={<AdminStreams />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </AdminLayout>
          // </AdminRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout currentView="notifications" onViewChange={setCurrentView}>
              <NotificationsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirect root to appropriate page */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout currentView="404" onViewChange={setCurrentView}>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                  <p className="text-dark-400 text-xl mb-8">Page not found</p>
                  <div className="space-x-4">
                    <button
                      onClick={() => window.history.back()}
                      className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={() => (window.location.href = "/dashboard")}
                      className="bg-live hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
