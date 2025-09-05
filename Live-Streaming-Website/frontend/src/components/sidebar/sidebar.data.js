import {
  Home,
  Compass,
  Users,
  PlayCircle,
  Video,
  Heart,
  Clock,
  Bookmark,
  TrendingUp,
  Gamepad2,
  Music,
  Palette,
  ChefHat,
  Monitor,
  Dumbbell,
  GraduationCap,
  ListMusic,
  Plane,
} from "lucide-react";

export const navigation = [
  { name: "Home", icon: Home, id: "home", badge: null },
  { name: "Browse", icon: Compass, id: "browse", badge: null },
  { name: "Following", icon: Users, id: "following", badge: "Live" },
  { name: "Live", icon: Video, id: "live", badge: "Live" },
  { name: "Library", icon: PlayCircle, id: "library", badge: null },
  { name: "Playlists", icon: ListMusic, id: "playlists", badge: null },
];

export const discover = [
  { name: "Trending", icon: TrendingUp, id: "trending" },
  { name: "Recently Watched", icon: Clock, id: "recent" },
  { name: "Liked Streams", icon: Heart, id: "liked" },
  { name: "Saved", icon: Bookmark, id: "saved" },
];

export const categories = [
  {
    name: "Gaming",
    icon: Gamepad2,
    count: "12.5K",
    viewers: "2.4M",
    color: "text-blue-400",
  },
  {
    name: "Music",
    icon: Music,
    count: "3.2K",
    viewers: "892K",
    color: "text-purple-400",
  },
  {
    name: "Art",
    icon: Palette,
    count: "1.8K",
    viewers: "445K",
    color: "text-pink-400",
  },
  {
    name: "Cooking",
    icon: ChefHat,
    count: "947",
    viewers: "234K",
    color: "text-orange-400",
  },
  {
    name: "Tech",
    icon: Monitor,
    count: "2.1K",
    viewers: "567K",
    color: "text-green-400",
  },
  {
    name: "Fitness",
    icon: Dumbbell,
    count: "876",
    viewers: "189K",
    color: "text-red-400",
  },
  {
    name: "Education",
    icon: GraduationCap,
    count: "654",
    viewers: "123K",
    color: "text-yellow-400",
  },
  {
    name: "Travel",
    icon: Plane,
    count: "432",
    viewers: "98K",
    color: "text-cyan-400",
  },
];

export const followedStreamers = [
  {
    name: "GamerPro2024",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    isLive: true,
    category: "Gaming",
    viewers: "12.5K",
  },
  {
    name: "ChefAnna",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isLive: true,
    category: "Cooking",
    viewers: "8.9K",
  },
  {
    name: "ArtistMaya",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    isLive: false,
    lastSeen: "2h ago",
  },
  {
    name: "DJBeatMaster",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    isLive: true,
    category: "Music",
    viewers: "15.2K",
  },
  {
    name: "FitCoach",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    isLive: false,
    lastSeen: "5h ago",
  },
];
