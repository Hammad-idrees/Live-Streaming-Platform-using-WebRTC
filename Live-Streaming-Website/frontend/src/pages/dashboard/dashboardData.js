import {
  Play,
  TrendingUp,
  Users,
  Clock,
  Gamepad2,
  Music,
  Palette,
  ChefHat,
  Monitor,
  Dumbbell,
} from "lucide-react";

export const liveStreams = [
  {
    id: 1,
    title: "Epic Gaming Session - Ranked Gameplay! 🎮",
    streamer: "ProGamer2024",
    category: "Gaming",
    viewers: 12547,
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    duration: "2:45:33",
    tags: ["AI", "Tech", "Education"],
    isLive: true,
  },
  {
    id: 8,
    title: "Travel Vlog - Exploring Tokyo Streets 🗾",
    streamer: "WorldExplorer",
    category: "Travel",
    viewers: 7234,
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    duration: "3:15:42",
    tags: ["Travel", "Japan", "Culture"],
    isLive: true,
  },
];

export const categories = [
  {
    name: "Gaming",
    icon: Gamepad2,
    count: "12.5K live",
    viewers: "2.4M viewers",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    name: "Music",
    icon: Music,
    count: "3.2K live",
    viewers: "892K viewers",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    name: "Art",
    icon: Palette,
    count: "1.8K live",
    viewers: "445K viewers",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
  {
    name: "Cooking",
    icon: ChefHat,
    count: "947 live",
    viewers: "234K viewers",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    name: "Tech",
    icon: Monitor,
    count: "2.1K live",
    viewers: "567K viewers",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    name: "Fitness",
    icon: Dumbbell,
    count: "876 live",
    viewers: "189K viewers",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
];

export const quickStats = [
  { label: "Live Streams", value: "47.2K", icon: Play, color: "text-live" },
  {
    label: "Total Viewers",
    value: "8.9M",
    icon: Users,
    color: "text-primary-400",
  },
  {
    label: "Peak Today",
    value: "12.4M",
    icon: TrendingUp,
    color: "text-green-400",
  },
  {
    label: "Avg. Duration",
    value: "3.2h",
    icon: Clock,
    color: "text-yellow-400",
  },
];
