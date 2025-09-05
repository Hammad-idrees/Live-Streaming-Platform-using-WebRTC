export const streamData = {
  id: "1",
  title: "Epic Gaming Marathon - Ranked Gameplay! 🎮 Road to Diamond",
  description:
    "Join me as I climb the ranks in competitive gameplay! Today we're pushing for Diamond rank with some intense matches. Drop a follow if you enjoy the content!",
  streamer: {
    id: "gamer123",
    username: "ProGamer2024",
    displayName: "ProGamer2024",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face&q=80",
    isVerified: true,
    isPremium: true,
    followers: 156789,
    location: "Los Angeles, CA",
    joinedDate: "2019-03-15",
    bio: "Professional esports player and content creator. Streaming daily ranked gameplay and tutorials!",
    socialLinks: {
      twitter: "@progamer2024",
      discord: "ProGamer#1234",
      youtube: "@progamer2024",
    },
  },
  category: "Gaming",
  tags: ["FPS", "Competitive", "Ranked", "Tutorial"],
  viewerCount: 12547,
  startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  isLive: true,
  streamUrl: "https://example.com/stream.m3u8",
  thumbnail:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop&crop=center&q=80",
  language: "English",
  mature: false,
};

export const recommendedStreams = [
  {
    id: 2,
    title: "Cooking Masterclass - Italian Cuisine 🍝",
    streamer: "ChefAnna",
    category: "Lifestyle",
    viewers: 8932,
    thumbnail:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "1:25:30",
    tags: ["Cooking", "Tutorial", "Live"],
    isLive: true,
  },
  {
    id: 3,
    title: "Electronic Music Production Live 🎵",
    streamer: "DJBeatMaster",
    category: "Music",
    viewers: 15208,
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "2:18:45",
    tags: ["Electronic", "Live Music", "DJ"],
    isLive: true,
  },
  {
    id: 4,
    title: "Digital Art Creation - Character Design 🎨",
    streamer: "ArtistMaya",
    category: "Creative",
    viewers: 6754,
    thumbnail:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=225&fit=crop&crop=center&q=80",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face&q=80",
    duration: "4:12:08",
    tags: ["Digital Art", "Character", "Tutorial"],
    isLive: true,
  },
];
