import React, { useState, useEffect } from "react";
import { Play, Eye, Heart, Share, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import { useAuth } from "../../context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentStream, setCurrentStream] = useState(0);
  const [viewerCount, setViewerCount] = useState(2847);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [signupCredentials, setSignupCredentials] = useState(null); // Store EXACT signup credentials

  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();

  // High-quality streaming data with better images
  const liveStreams = [
    {
      title: "Epic Gaming Marathon - 24H Stream! 🎮",
      streamer: "GamerPro2024",
      category: "Gaming",
      viewers: 15420,
      thumbnail:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&h=900&fit=crop&crop=center&q=90",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      chat: [
        {
          user: "ViewerX23",
          color: "purple-400",
          message: "This is absolutely incredible! 🔥",
        },
        {
          user: "StreamFan",
          color: "blue-400",
          message: "Just hit the follow button!",
        },
        {
          user: "GamerGirl99",
          color: "green-400",
          message: "How did you learn this? 😱",
        },
      ],
    },
    {
      title: "Cooking Masterclass - Italian Cuisine ❤️",
      streamer: "ChefAnna",
      category: "Lifestyle",
      viewers: 8932,
      thumbnail:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop&crop=center&q=90",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      chat: [
        {
          user: "FoodieMike",
          color: "yellow-400",
          message: "This looks delicious! 🍝",
        },
        {
          user: "ChefFan",
          color: "red-400",
          message: "Can you share the recipe?",
        },
        {
          user: "AnnaLover",
          color: "pink-400",
          message: "Best cooking stream!",
        },
      ],
    },
    {
      title: "Late Night Beats & Electronic Vibes 🎵",
      streamer: "DJMixMaster",
      category: "Music",
      viewers: 12108,
      thumbnail:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=1600&h=900&fit=crop&crop=center&q=90",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
      chat: [
        {
          user: "NightOwl",
          color: "indigo-400",
          message: "These beats are fire! 🔥",
        },
        { user: "ElectroFan", color: "blue-300", message: "Love the vibe!" },
        {
          user: "MusicLover",
          color: "purple-300",
          message: "Where can I find this track?",
        },
      ],
    },
    {
      title: "Art Stream - Digital Painting Session 🎨",
      streamer: "ArtistMaya",
      category: "Creative",
      viewers: 6754,
      thumbnail:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=1600&h=900&fit=crop&crop=center&q=90",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      chat: [
        { user: "ArtFan", color: "pink-400", message: "Amazing technique!" },
        {
          user: "PainterGuy",
          color: "green-300",
          message: "What brush are you using?",
        },
        {
          user: "MayaSupporter",
          color: "yellow-300",
          message: "So inspiring!",
        },
      ],
    },
  ];

  // Image loading logic: keep previous image until new one is loaded
  const [imageLoaded, setImageLoaded] = useState(true);
  const [pendingStream, setPendingStream] = useState(null);
  const [displayedStream, setDisplayedStream] = useState(0);

  // Fallback image URL
  const fallbackImage =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&h=900&fit=crop&crop=center&q=90";
  const [imgSrc, setImgSrc] = useState(liveStreams[0].thumbnail);

  useEffect(() => {
    if (currentStream !== displayedStream) {
      setImageLoaded(false);
      setPendingStream(currentStream);
    }
  }, [currentStream, displayedStream]);

  useEffect(() => {
    setImgSrc(liveStreams[currentStream].thumbnail);
  }, [currentStream, liveStreams]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (pendingStream !== null) {
      setDisplayedStream(pendingStream);
      setPendingStream(null);
    }
  };

  // Auto-rotate streams every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStream((prev) => (prev + 1) % liveStreams.length);
      setViewerCount((prev) => prev + Math.floor(Math.random() * 20) - 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignupSuccess = async (userData) => {
    const result = await signup(userData);

    if (result.success) {
      const exactCredentials = {
        email: userData.email,
        password: userData.password,
        username: userData.username,
      };

      setSignupCredentials(exactCredentials);

      setSuccessMessage(
        `Welcome to StreamVibe, ${userData.username}! Your account has been created. Please sign in with your email: ${userData.email}`
      );
      setShowSuccessMessage(true);
      setIsLogin(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    }

    return result;
  };

  // Handle successful login
  const handleLoginSuccess = async (credentials) => {
    const result = await login(credentials);

    if (result.success) {
      setSuccessMessage(`Welcome back, ${result.user.username}!`);
      setShowSuccessMessage(true);

      // Clear stored signup credentials on successful login
      setSignupCredentials(null);

      // Redirect to dashboard after brief delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      // Enhanced error handling for signup-login flow
      if (signupCredentials && credentials.email === signupCredentials.email) {
        // You could add a "Try Again" button here that prefills the exact signup credentials
        setSuccessMessage(
          `Login failed. Please make sure you're using the correct password for ${credentials.email}`
        );
        setShowSuccessMessage(true);
      }
    }

    return result;
  };

  const currentStreamData = liveStreams[displayedStream];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Side - Live Stream Preview */}
      <div className="flex-1 relative overflow-hidden">
        {/* Stream Video */}
        <div className="absolute inset-0">
          <img
            src={imgSrc}
            alt="Live Stream"
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={() => {
              setImgSrc(fallbackImage);
              setImageLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40"></div>
        </div>

        {/* Stream Overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-between p-8 transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-live px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>
              <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Eye size={16} className="text-white" />
                <span className="text-white text-sm font-semibold">
                  {viewerCount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-black/50 backdrop-blur-sm p-3 rounded-full hover:bg-black/70 transition-all hover:scale-110">
                <Heart size={20} className="text-white" />
              </button>
              <button className="bg-black/50 backdrop-blur-sm p-3 rounded-full hover:bg-black/70 transition-all hover:scale-110">
                <Share size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={currentStreamData.avatar}
                alt={currentStreamData.streamer}
                className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
              />
              <div>
                <h3 className="text-white font-bold text-lg">
                  {currentStreamData.streamer}
                </h3>
                <span className="inline-block bg-primary-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentStreamData.category}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-white text-2xl font-bold mb-4 leading-tight">
                {currentStreamData.title}
              </h2>
            </div>

            {/* Chat Preview */}
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 space-y-3 max-w-xs w-full overflow-auto">
              <h4 className="text-white font-semibold text-sm mb-2">
                Live Chat
              </h4>
              <div className="space-y-2">
                {currentStreamData.chat.map((msg, idx) => (
                  <div className="flex items-start gap-2 text-sm" key={idx}>
                    <span className={`text-${msg.color} font-medium`}>
                      {msg.user}:
                    </span>
                    <span className="text-white">{msg.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stream Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex gap-2 bg-black/60 rounded-full px-4 py-2 shadow-lg max-w-xs overflow-x-auto">
            {liveStreams.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStream(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStream
                    ? "bg-live w-8"
                    : "bg-white/40 w-2 hover:w-4"
                }`}
                style={{ minWidth: "0.5rem" }}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Panel */}
      <div className="w-96 bg-dark-900 border-l border-dark-800 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-streaming rounded-xl flex items-center justify-center shadow-glow">
              <div className="w-8 h-8 bg-live rounded-lg flex items-center justify-center">
                <Play size={16} className="text-white fill-current" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">StreamVibe</h1>
              <p className="text-dark-400 text-sm">Join the revolution</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-live text-xl font-bold">847K</div>
              <div className="text-dark-400 text-xs font-medium">Creators</div>
            </div>
            <div>
              <div className="text-live text-xl font-bold">12.4M</div>
              <div className="text-dark-400 text-xs font-medium">Viewers</div>
            </div>
            <div>
              <div className="text-live text-xl font-bold">24/7</div>
              <div className="text-dark-400 text-xs font-medium">Live</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="m-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Global Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-live border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-white font-semibold">Processing...</div>
            </div>
          </div>
        )}

        {/* Auth Form Container */}
        <div className="flex-1 p-6">
          {isLogin ? (
            <Login
              onSwitchToSignup={() => setIsLogin(false)}
              onLoginSuccess={handleLoginSuccess}
              prefillEmail={signupCredentials?.email} // Prefill exact email from signup
              signupCredentials={signupCredentials} // Pass full credentials for debugging
            />
          ) : (
            <Signup
              onSwitchToLogin={() => setIsLogin(true)}
              onSignupSuccess={handleSignupSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
