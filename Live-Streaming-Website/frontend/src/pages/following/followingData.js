export const followedStreamers = [
  {
    id: 1,
    username: "ProGamer2024",
    displayName: "ProGamer2024",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face&q=80",
    isLive: true,
    followers: 156789,
    followedDate: "2023-06-15",
    notifications: true,
    stream: {
      title: "Epic Gaming Session - Ranked Gameplay! 🎮",
      category: "Gaming",
      viewers: 12547,
      thumbnail:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=338&fit=crop&crop=center&q=80",
      duration: "2:18:45",
      tags: ["Electronic", "Live Music", "DJ"],
      startTime: new Date(Date.now() - 2.3 * 60 * 60 * 1000),
    },
  },
  {
    id: 5,
    username: "FitCoach",
    displayName: "Fitness Coach",
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=80&h=80&fit=crop&crop=face&q=80",
    isLive: false,
    followers: 67890,
    followedDate: "2023-07-12",
    notifications: true,
    lastStream: {
      title: "Morning Workout - Full Body Training",
      ago: "5 hours ago",
      duration: "1:30:12",
    },
  },
  {
    id: 6,
    username: "TechGuru",
    displayName: "Tech Guru",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&q=80",
    isLive: false,
    followers: 123456,
    followedDate: "2023-04-18",
    notifications: false,
    lastStream: {
      title: "Tech Talk - Latest in AI & Machine Learning",
      ago: "1 day ago",
      duration: "2:45:33",
    },
  },
];
