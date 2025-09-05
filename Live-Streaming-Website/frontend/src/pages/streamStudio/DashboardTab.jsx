import React from "react";
import { useNavigate } from "react-router-dom"; // <-- Import this
import {
  Eye,
  Users,
  Clock,
  Gift,
  BarChart3,
  Copy,
  ExternalLink,
  Video,
  ArrowBigDownDash,
} from "lucide-react";
import Button from "../../components/ui/Button";

const DashboardTab = ({
  streamStats,
  analytics,
  setActiveTab,
  setShowStreamKeyModal,
}) => {
  const navigate = useNavigate(); // <-- Add this
  // Safe number parsing
  const followerCount = Number(streamStats.followers);
  const formattedFollowers = isNaN(followerCount)
    ? "0"
    : followerCount.toLocaleString();

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-primary-400 mb-2">
            <Eye size={16} />
            <span className="text-sm font-medium">Current Viewers</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {streamStats.viewerCount}
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Users size={16} />
            <span className="text-sm font-medium">Total Followers</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {formattedFollowers}
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Clock size={16} />
            <span className="text-sm font-medium">Stream Time</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {streamStats.uptime}
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Gift size={16} />
            <span className="text-sm font-medium">This Month</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${analytics.thisWeek.revenue}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="primary"
            icon={<Video />}
            onClick={() => setActiveTab("stream")}
          >
            Stream Setup
          </Button>
          <Button
            variant="ghost"
            icon={<BarChart3 />}
            onClick={() => setActiveTab("analytics")}
          >
            View Analytics
          </Button>
          <Button
            variant="ghost"
            icon={<Copy />}
            onClick={() => setShowStreamKeyModal(true)}
          >
            Stream Key
          </Button>
          <Button variant="ghost" icon={<ExternalLink />}>
            Share Channel
          </Button>
          {/* Add any additional buttons here */}
          <Button
            variant="ghost"
            icon={<ArrowBigDownDash />}
            onClick={() => navigate("/upload-video")} // <-- Use absolute path
          >
            Upload Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
