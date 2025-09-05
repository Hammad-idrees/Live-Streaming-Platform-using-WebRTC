# 🎥 StreamVibe - Peer-to-Peer Live Streaming Platform

A comprehensive live streaming platform built with modern web technologies, featuring real-time video streaming, social interactions, and AI-powered content moderation.

## ✨ Features

### 🎬 Live Streaming

- **Real-time streaming** with RTMP ingestion and HLS output
- **WebRTC integration** for low-latency peer-to-peer connections
- **Multi-quality streaming** with automatic transcoding
- **Stream recording** and VOD (Video on Demand) playback
- **Live chat** with real-time messaging

### 👥 User Management

- **JWT-based authentication** with OAuth support
- **User profiles** with customizable avatars
- **Follow/Unfollow system** for content creators
- **Role-based access control** (Admin, Moderator, User)
- **Password recovery** and account management

### 🎵 Content Management

- **Playlist creation** and management
- **Video upload** with automatic processing
- **Content categorization** (Gaming, Music, Art, etc.)
- **Thumbnail generation** and video metadata
- **Search and discovery** functionality

### 🤖 AI & Moderation

- **AI-powered content detection** using YOLO models
- **Real-time content moderation** and filtering
- **Automated reporting system** for inappropriate content
- **Chat moderation** with keyword filtering

### 📊 Analytics & Insights

- **Real-time viewer analytics** and engagement metrics
- **Stream performance monitoring**
- **User behavior tracking**
- **Revenue analytics** for content creators

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Redis** for caching and session management
- **Socket.io** for real-time communication
- **FFmpeg** for video processing and transcoding
- **AWS S3** for cloud storage
- **JWT** for authentication
- **Python** service for AI/ML operations

### Frontend

- **React 19** with modern hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router v7** for navigation
- **Socket.io Client** for real-time features
- **HLS.js** for video playback
- **Axios** for API communication

### Infrastructure

- **Docker** containerization support
- **Nginx** for reverse proxy
- **PM2** for process management
- **AWS** cloud services integration

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- FFmpeg
- Python 3.8+
- AWS Account (for S3 storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/streamvibe.git
   cd streamvibe
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Python Service Setup**
   ```bash
   cd backend/python
   pip install -r requirements.txt
   python detector.py
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/streamvibe
REDIS_URI=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name

# RTMP
RTMP_HOST=localhost
RTMP_PORT=1935

# FFmpeg
FFMPEG_PATH=ffmpeg
```

## 📱 Usage

### For Viewers

1. **Browse live streams** on the homepage
2. **Search and filter** content by category
3. **Follow your favorite creators**
4. **Engage in live chat** during streams
5. **Create playlists** of your favorite content

### For Streamers

1. **Set up your stream** in the studio
2. **Configure stream settings** (quality, category, etc.)
3. **Start streaming** using OBS or similar software
4. **Monitor analytics** and viewer engagement
5. **Manage your content library**


streamvibe/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── python/          # AI/ML services
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── package.json
└── README.md
```


---

**Built with ❤️ by the StreamVibe Team**
