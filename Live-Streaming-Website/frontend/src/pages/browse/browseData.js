import {
  Grid3X3,
  Gamepad2,
  Music,
  Palette,
  ChefHat,
  Monitor,
  Dumbbell,
  GraduationCap,
  Plane,
} from "lucide-react";

export const categories = [
  {
    id: "all",
    name: "All Categories",
    icon: Grid3X3,
    color: "text-white",
    count: "47.2K",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    color: "text-blue-400",
    count: "12.5K",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "text-purple-400",
    count: "3.2K",
  },
  {
    id: "art",
    name: "Art",
    icon: Palette,
    color: "text-pink-400",
    count: "1.8K",
  },
  {
    id: "cooking",
    name: "Cooking",
    icon: ChefHat,
    color: "text-orange-400",
    count: "947",
  },
  {
    id: "tech",
    name: "Technology",
    icon: Monitor,
    color: "text-green-400",
    count: "2.1K",
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: Dumbbell,
    color: "text-red-400",
    count: "876",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    color: "text-yellow-400",
    count: "654",
  },
  {
    id: "travel",
    name: "Travel",
    icon: Plane,
    color: "text-cyan-400",
    count: "432",
  },
];

export const allStreams = [
  {
    id: 1,
    title: "Epic Gaming Session - Ranked Gameplay! 🎮",
    streamer: "ProGamer2024",
    category: "Gaming",
    viewers: 12547,
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=338&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "3:42:15",
    tags: ["FPS", "Competitive", "Ranked"],
    isLive: true,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Cooking Masterclass - Italian Cuisine 🍝",
    streamer: "ChefAnna",
    category: "Cooking",
    viewers: 8932,
    thumbnail:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=338&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "1:25:30",
    tags: ["Cooking", "Tutorial", "Live"],
    isLive: true,
    startTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Electronic Music Production Live 🎵",
    streamer: "DJBeatMaster",
    category: "Music",
    viewers: 15208,
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=338&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "2:18:45",
    tags: ["Electronic", "Live Music", "DJ"],
    isLive: true,
    startTime: new Date(Date.now() - 2.3 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "Digital Art Creation - Character Design 🎨",
    streamer: "ArtistMaya",
    category: "Art",
    viewers: 6754,
    thumbnail:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=338&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "4:12:08",
    tags: ["Digital Art", "Character", "Tutorial"],
    isLive: true,
    startTime: new Date(Date.now() - 4.2 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: "Morning Workout - Full Body Training 💪",
    streamer: "FitCoach",
    category: "Fitness",
    viewers: 9876,
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=338&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "1:30:12",
    tags: ["Fitness", "Workout", "Health"],
    isLive: true,
    startTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: 6,
    title: "Tech Talk - Latest in AI & Machine Learning 🤖",
    streamer: "TechGuru",
    category: "Technology",
    viewers: 4567,
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=338&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "2:45:33",
    tags: ["AI", "Tech", "Education"],
    isLive: true,
    startTime: new Date(Date.now() - 2.8 * 60 * 60 * 1000),
  },
];
