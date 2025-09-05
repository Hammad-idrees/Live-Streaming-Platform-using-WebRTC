import React, { useState, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Settings, 
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Zap,
  Signal,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

const StreamControls = ({ 
  isLive = false, 
  onToggleLive, 
  streamStats = {},
  onStatsUpdate 
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('excellent'); // excellent, good, poor, disconnected
  const [streamHealth, setStreamHealth] = useState('healthy'); // healthy, warning, critical
  
  // Mock stream statistics
  const [stats, setStats] = useState({
    viewerCount: 0,
    followers: 0,
    likes: 0,
    messages: 0,
    uptime: '00:00:00',
    bitrate: '6000 kbps',
    fps: '60 FPS',
    resolution: '1920x1080',
    droppedFrames: 0,
    ...streamStats
  });

  // Update stats periodically
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        viewerCount: prev.viewerCount + Math.floor(Math.random() * 10) - 5,
        likes: prev.likes + Math.floor(Math.random() * 3),
        messages: prev.messages + Math.floor(Math.random() * 5),
        droppedFrames: prev.droppedFrames + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleScreenShare = () => {
    setIsScreenShare(!isScreenShare);
  };

  const handleGoLive = () => {
    if (!isLive) {
      setStats(prev => ({
        ...prev,
        viewerCount: 0,
        likes: 0,
        messages: 0,
        uptime: '00:00:00',
        droppedFrames: 0
      }));
    }
    onToggleLive?.(!isLive);
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'excellent':
        return <Signal className="text-green-400" size={16} />;
      case 'good':
        return <Signal className="text-yellow-400" size={16} />;
      case 'poor':
        return <Signal className="text-red-400" size={16} />;
      case 'disconnected':
        return <Wifi className="text-red-400" size={16} />;
      default:
        return <Signal className="text-green-400" size={16} />;
    }
  };

  const getHealthIcon = () => {
    switch (streamHealth) {
      case 'healthy':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-400" size={16} />;
      case 'critical':
        return <XCircle className="text-red-400" size={16} />;
      default:
        return <CheckCircle className="text-green-400" size={16} />;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-dark-900 border-t border-dark-800 p-4 space-y-4">
      {/* Stream Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isLive ? 'bg-live' : 'bg-dark-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isLive ? 'bg-white animate-pulse' : 'bg-dark-500'
            }`}></div>
            <span className="text-white text-sm font-bold">
              {isLive ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
          
          {isLive && (
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Clock size={14} />
              <span>{stats.uptime}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          {getHealthIcon()}
        </div>
      </div>

      {/* Live Statistics */}
      {isLive && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-dark-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-primary-400 mb-1">
              <Eye size={14} />
            </div>
            <div className="text-white font-bold text-lg">{formatNumber(stats.viewerCount)}</div>
            <div className="text-dark-400 text-xs">Viewers</div>
          </div>
          
          <div className="bg-dark-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-pink-400 mb-1">
              <Heart size={14} />
            </div>
            <div className="text-white font-bold text-lg">{formatNumber(stats.likes)}</div>
            <div className="text-dark-400 text-xs">Likes</div>
          </div>
          
          <div className="bg-dark-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <MessageCircle size={14} />
            </div>
            <div className="text-white font-bold text-lg">{formatNumber(stats.messages)}</div>
            <div className="text-dark-400 text-xs">Messages</div>
          </div>
          
          <div className="bg-dark-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <Users size={14} />
            </div>
            <div className="text-white font-bold text-lg">{formatNumber(stats.followers)}</div>
            <div className="text-dark-400 text-xs">Followers</div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-lg transition-all ${
              isVideoOn 
                ? 'bg-dark-700 text-white hover:bg-dark-600' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-lg transition-all ${
              isAudioOn 
                ? 'bg-dark-700 text-white hover:bg-dark-600' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-lg transition-all ${
              isScreenShare 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'bg-dark-700 text-white hover:bg-dark-600'
            }`}
            title={isScreenShare ? 'Stop screen share' : 'Share screen'}
          >
            <Monitor size={20} />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-lg bg-dark-700 text-white hover:bg-dark-600 transition-all"
            title="Stream settings"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Go Live / End Stream Button */}
        <button
          onClick={handleGoLive}
          className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 ${
            isLive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-live hover:bg-red-600 text-white'
          }`}
        >
          {isLive ? (
            <>
              <XCircle size={18} />
              End Stream
            </>
          ) : (
            <>
              <Zap size={18} />
              Go Live
            </>
          )}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-dark-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Stream Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-dark-400 hover:text-white"
            >
              <XCircle size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Technical Stats */}
            <div className="space-y-3">
              <h4 className="text-dark-300 text-sm font-medium">Stream Quality</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-400">Resolution:</span>
                  <span className="text-white">{stats.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Bitrate:</span>
                  <span className="text-white">{stats.bitrate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">FPS:</span>
                  <span className="text-white">{stats.fps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Dropped Frames:</span>
                  <span className={`${stats.droppedFrames > 10 ? 'text-red-400' : 'text-green-400'}`}>
                    {stats.droppedFrames}
                  </span>
                </div>
              </div>
            </div>

            {/* Stream Actions */}
            <div className="space-y-3">
              <h4 className="text-dark-300 text-sm font-medium">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-dark-300 hover:text-white transition-colors flex items-center gap-2">
                  <Share2 size={14} />
                  Share Stream
                </button>
                <button className="w-full text-left text-sm text-dark-300 hover:text-white transition-colors flex items-center gap-2">
                  <TrendingUp size={14} />
                  View Analytics
                </button>
                <button className="w-full text-left text-sm text-dark-300 hover:text-white transition-colors flex items-center gap-2">
                  <MoreHorizontal size={14} />
                  More Options
                </button>
              </div>
            </div>
          </div>

          {/* Stream Health Alerts */}
          {streamHealth !== 'healthy' && (
            <div className={`p-3 rounded-lg border ${
              streamHealth === 'warning' 
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {getHealthIcon()}
                <span className="font-medium text-sm">
                  {streamHealth === 'warning' ? 'Stream Warning' : 'Stream Critical'}
                </span>
              </div>
              <p className="text-xs opacity-90">
                {streamHealth === 'warning' 
                  ? 'Your connection is unstable. Consider lowering quality.'
                  : 'Your stream is experiencing severe issues. Check your connection.'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamControls;