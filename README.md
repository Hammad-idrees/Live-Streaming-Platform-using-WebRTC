# 🎥 StreamVibe - Peer-to-Peer Live Streaming Platform

<div align="center">

**A comprehensive live streaming platform built with modern web technologies, featuring real-time video streaming, social interactions, and AI-powered content moderation.**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.1.1-blue)](https://reactjs.org/)

[Features](#-features) • [Installation](#-quick-start) • [API Documentation](#-api-documentation) • [Screenshots](#-screenshots) • [Contributing](#-contributing)

</div>


---

## 📸 Screenshots

### Dashboard

![Dashboard](https://github.com/user-attachments/assets/e693806b-d7e9-4468-ac4b-852d7858ebf2)

### Live Streaming

![Live Streaming](https://github.com/user-attachments/assets/997e0a90-5de3-4710-b165-a2ddc8520979)

### Stream Studio

![Stream Studio](https://github.com/user-attachments/assets/a107696c-98b3-4403-8e1a-cbd04d3af03d)

### Browse Page

![Browse](https://github.com/user-attachments/assets/06e42f99-cad2-47fc-b728-8a26cb2e0fbe)

### Stream View

![Stream View](https://github.com/user-attachments/assets/e693806b-d7e9-4468-ac4b-852d7858ebf2)

### Admin Dashboard

![Admin Dashboard](https://github.com/user-attachments/assets/60704605-97bd-4c50-941f-4548a7f0e226)

### Profile Page

![Profile](https://github.com/user-attachments/assets/f183c113-c733-4aa4-ac1b-16c93dc01cd5)

### Library

![Library](https://github.com/user-attachments/assets/13977f0a-cb51-4e9e-86ab-9ef820e17842)

### Playlists

![Playlists](https://github.com/user-attachments/assets/ca533538-f623-4760-82dc-379efe9ba6c2)

### Analytics

![Analytics](https://github.com/user-attachments/assets/064185ef-7284-4806-a16f-b18a8f4cf6db)

### Settings

![Settings](https://github.com/user-attachments/assets/5f81cb50-8f9a-4796-b353-03a5d10c713f)


---

## ✨ Features

### 🎬 Live Streaming

- **Real-time streaming** with RTMP ingestion and HLS output
- **WebRTC integration** for low-latency peer-to-peer connections
- **Multi-quality streaming** with automatic transcoding (360p, 720p, 1080p)
- **Stream recording** and VOD (Video on Demand) playback
- **Live chat** with real-time messaging and emoji support
- **Stream analytics** with viewer count and engagement metrics
- **Drawing canvas** for interactive stream annotations

### 👥 User Management

- **JWT-based authentication** with secure token refresh
- **OAuth support** for social login (Google, GitHub, etc.)
- **User profiles** with customizable avatars and bio
- **Follow/Unfollow system** for content creators
- **Role-based access control** (Admin, Moderator, Streamer, User)
- **Password recovery** and account management
- **User upgrade system** (Viewer → Streamer)

### 🎵 Content Management

- **Playlist creation** and management
- **Video upload** with automatic processing and validation
- **Content categorization** (Gaming, Music, Art, Education, etc.)
- **Thumbnail generation** and video metadata extraction
- **Search and discovery** functionality with filters
- **Like/Save/Recently Watched** features
- **Content recommendations** based on viewing history

### 🤖 AI & Moderation

- **AI-powered content detection** using YOLO v8 models
- **Real-time content moderation** and filtering
- **Automated reporting system** for inappropriate content
- **Chat moderation** with keyword filtering and auto-ban
- **Frame-by-frame analysis** for stream quality monitoring
- **NSFW content detection** and automatic flagging

### 📊 Analytics & Insights

- **Real-time viewer analytics** and engagement metrics
- **Stream performance monitoring** (bitrate, latency, quality)
- **User behavior tracking** and heatmaps
- **Revenue analytics** for content creators
- **Platform-wide statistics** for administrators
- **Exportable reports** in CSV/JSON format

### 🎨 User Interface

- **Modern, responsive design** with dark theme
- **Smooth animations** using Framer Motion
- **Real-time notifications** via Pusher
- **Keyboard shortcuts** for power users
- **Accessibility features** (WCAG 2.1 compliant)
- **Mobile-responsive** layout

---

## 🛠️ Tech Stack

### Backend

| Technology     | Purpose                 | Version   |
| -------------- | ----------------------- | --------- |
| **Node.js**    | Runtime environment     | v16+      |
| **Express.js** | Web framework           | ^4.18.2   |
| **MongoDB**    | Database                | Latest    |
| **Mongoose**   | ODM                     | ^7.6.1    |
| **Redis**      | Caching & sessions      | ^5.6.0    |
| **Socket.io**  | Real-time communication | ^4.8.1    |
| **FFmpeg**     | Video processing        | Latest    |
| **AWS S3**     | Cloud storage           | ^2.1481.0 |
| **JWT**        | Authentication          | ^9.0.2    |
| **Python**     | AI/ML services          | 3.8+      |
| **Pusher**     | Real-time notifications | ^5.2.0    |
| **Mediasoup**  | WebRTC SFU              | ^3.16.4   |

### Frontend

| Technology           | Purpose        | Version  |
| -------------------- | -------------- | -------- |
| **React**            | UI framework   | ^19.1.1  |
| **React Router**     | Navigation     | ^7.6.3   |
| **Tailwind CSS**     | Styling        | ^3.4.17  |
| **Framer Motion**    | Animations     | ^12.23.6 |
| **Socket.io Client** | Real-time      | ^4.8.1   |
| **HLS.js**           | Video playback | ^1.6.7   |
| **Axios**            | HTTP client    | ^1.10.0  |
| **React Player**     | Media player   | ^3.0.0   |
| **Pusher JS**        | Notifications  | ^8.4.0   |

### Infrastructure

- **Docker** - Containerization
- **Nginx** - Reverse proxy & load balancing
- **PM2** - Process management
- **AWS** - Cloud services (S3, CloudFront)
- **GitHub Actions** - CI/CD pipeline

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0+) - [Download](https://www.mongodb.com/try/download/community)
- **Redis** (v6.0+) - [Download](https://redis.io/download)
- **FFmpeg** - [Download](https://ffmpeg.org/download.html)
- **Python** (3.8+) - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/downloads)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/streamvibe.git
cd streamvibe
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=7000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/streamvibe
REDIS_URI=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket_name

# RTMP Server
RTMP_HOST=localhost
RTMP_PORT=1935
RTMP_APP=live

# FFmpeg Configuration
FFMPEG_PATH=ffmpeg
FFMPEG_THREADS=4

# Pusher Configuration (for notifications)
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=us2

# Python Service (AI/ML)
PYTHON_SERVICE_URL=http://localhost:5000

# CORS
CORS_ORIGIN=http://localhost:3000
```

Start the backend server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

#### 3. Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
```

Create a `.env` file in the `frontend` directory (optional):

```env
REACT_APP_API_URL=http://localhost:7000
REACT_APP_PUSHER_KEY=your_pusher_key
REACT_APP_PUSHER_CLUSTER=us2
```

Start the frontend development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

#### 4. Python Service Setup (AI/ML)

```bash
cd backend/python
pip install -r requirements.txt
python detector.py
```

#### 5. Initialize Database

```bash
cd backend
npm run db:migrate
```

#### 6. Create Admin User (Optional)

```bash
cd backend
node scripts/create-admin.js
```

### Verify Installation

1. Backend should be running on `http://localhost:7000`
2. Frontend should be running on `http://localhost:3000`
3. MongoDB should be running and accessible
4. Redis should be running and accessible
5. FFmpeg should be installed and in PATH

---

## 🏗️ Project Structure

```
streamvibe/
├── backend/
│   ├── config/              # Configuration files
│   │   ├── aws.js          # AWS S3 configuration
│   │   ├── database.js      # MongoDB connection
│   │   ├── env.js           # Environment variables
│   │   ├── ffmpeg.js        # FFmpeg configuration
│   │   ├── rtcConfig.js     # WebRTC configuration
│   │   └── rtmp.js          # RTMP server config
│   ├── constants/           # Application constants
│   │   └── categories.js   # Stream categories
│   ├── controllers/         # Route controllers
│   │   ├── admin.controller.js
│   │   ├── analytics.controller.js
│   │   ├── chat.controller.js
│   │   ├── stream.controller.js
│   │   ├── user.controller.js
│   │   └── ...
│   ├── jobs/                # Scheduled jobs
│   │   ├── archive.js       # Stream archiving
│   │   ├── cleanup.js       # Cleanup tasks
│   │   └── notifications.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── errorHandler.js  # Error handling
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── roleCheck.js     # Role-based access
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Stream.js
│   │   ├── Chat.js
│   │   └── ...
│   ├── routes/              # API routes
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── stream.routes.js
│   │   │       ├── user.routes.js
│   │   │       └── ...
│   │   └── index.js
│   ├── services/            # Business logic
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── chat/
│   │   └── stream/
│   ├── utils/               # Utility functions
│   │   ├── ffmpegRecorder.js
│   │   ├── hls.js
│   │   ├── transcoder.js
│   │   └── ...
│   ├── python/              # Python AI/ML service
│   │   ├── detector.py
│   │   └── requirements.txt
│   ├── scripts/             # Utility scripts
│   │   ├── create-admin.js
│   │   ├── db-migrate.js
│   │   └── ...
│   ├── server.js            # Main server file
│   ├── signaling-server.js  # WebRTC signaling
│   └── rtmp-server.js       # RTMP server
│
├── frontend/
│   ├── public/              # Static assets
│   │   ├── images/
│   │   ├── logo.png
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── chat/
│   │   │   ├── header/
│   │   │   ├── layout/
│   │   │   ├── sidebar/
│   │   │   └── videoPlayer/
│   │   ├── pages/           # Page components
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── streamStudio/
│   │   │   └── ...
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Global styles
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
│
└── README.md
```

---

## 🔧 API Documentation

### Base URL

```
http://localhost:7000/api/v1
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication

| Method | Endpoint                    | Description              | Auth Required |
| ------ | --------------------------- | ------------------------ | ------------- |
| `POST` | `/user/register`            | Register a new user      | No            |
| `POST` | `/user/login`               | User login               | No            |
| `GET`  | `/user/profile`             | Get user profile         | Yes           |
| `PUT`  | `/user/profile`             | Update user profile      | Yes           |
| `POST` | `/user/upgrade-to-streamer` | Upgrade to streamer role | Yes           |

**Example Request:**

```bash
POST /api/v1/user/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "age": 25
}
```

#### Streams

| Method | Endpoint              | Description            | Auth Required  |
| ------ | --------------------- | ---------------------- | -------------- |
| `GET`  | `/stream/live`        | Get all live streams   | No             |
| `POST` | `/stream/start`       | Start a new stream     | Yes (Streamer) |
| `POST` | `/stream/stop`        | Stop current stream    | Yes (Streamer) |
| `GET`  | `/stream/:streamKey`  | Get stream information | No             |
| `POST` | `/stream/like/:id`    | Like a stream          | Yes            |
| `POST` | `/stream/dislike/:id` | Dislike a stream       | Yes            |
| `GET`  | `/stream/liked`       | Get liked streams      | Yes            |

**Example Request:**

```bash
POST /api/v1/stream/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Awesome Stream",
  "description": "Gaming stream",
  "category": "Gaming",
  "isPublic": true
}
```

#### Viewers

| Method | Endpoint                  | Description      | Auth Required |
| ------ | ------------------------- | ---------------- | ------------- |
| `POST` | `/viewer/join/:streamId`  | Join a stream    | Yes           |
| `POST` | `/viewer/leave/:streamId` | Leave a stream   | Yes           |
| `GET`  | `/viewer/count/:streamId` | Get viewer count | No            |

#### Chat

| Method | Endpoint                   | Description       | Auth Required |
| ------ | -------------------------- | ----------------- | ------------- |
| `POST` | `/chat/message`            | Send chat message | Yes           |
| `GET`  | `/chat/messages/:streamId` | Get chat messages | No            |

#### VOD (Video on Demand)

| Method | Endpoint                | Description          | Auth Required |
| ------ | ----------------------- | -------------------- | ------------- |
| `GET`  | `/vod`                  | List all VODs        | No            |
| `GET`  | `/vod/saved`            | Get saved VODs       | Yes           |
| `GET`  | `/vod/liked`            | Get liked VODs       | Yes           |
| `GET`  | `/vod/recently-watched` | Get recently watched | Yes           |
| `POST` | `/vod/:id/like`         | Like a VOD           | Yes           |
| `POST` | `/vod/:id/save`         | Save a VOD           | Yes           |

#### Playlists

| Method   | Endpoint                   | Description          | Auth Required |
| -------- | -------------------------- | -------------------- | ------------- |
| `GET`    | `/playlist`                | Get user playlists   | Yes           |
| `POST`   | `/playlist`                | Create playlist      | Yes           |
| `GET`    | `/playlist/:id`            | Get playlist details | Yes           |
| `PUT`    | `/playlist/:id`            | Update playlist      | Yes           |
| `DELETE` | `/playlist/:id`            | Delete playlist      | Yes           |
| `POST`   | `/playlist/:id/vod/:vodId` | Add VOD to playlist  | Yes           |

#### Comments

| Method   | Endpoint             | Description    | Auth Required |
| -------- | -------------------- | -------------- | ------------- |
| `GET`    | `/comment/:streamId` | Get comments   | No            |
| `POST`   | `/comment/:streamId` | Add comment    | Yes           |
| `PUT`    | `/comment/:id`       | Update comment | Yes           |
| `DELETE` | `/comment/:id`       | Delete comment | Yes           |

#### Follow

| Method   | Endpoint            | Description        | Auth Required |
| -------- | ------------------- | ------------------ | ------------- |
| `POST`   | `/follow/:userId`   | Follow a user      | Yes           |
| `DELETE` | `/follow/:userId`   | Unfollow a user    | Yes           |
| `GET`    | `/follow/following` | Get following list | Yes           |
| `GET`    | `/follow/followers` | Get followers list | Yes           |

#### Search

| Method | Endpoint  | Description               | Auth Required |
| ------ | --------- | ------------------------- | ------------- |
| `GET`  | `/search` | Search streams/VODs/users | No            |

**Query Parameters:**

- `q` - Search query
- `type` - Type of search (streams, vods, users)
- `category` - Filter by category
- `limit` - Results limit
- `page` - Page number

#### Upload

| Method | Endpoint         | Description       | Auth Required  |
| ------ | ---------------- | ----------------- | -------------- |
| `POST` | `/upload/video`  | Upload video file | Yes (Streamer) |
| `POST` | `/upload/avatar` | Upload avatar     | Yes            |

#### Admin

| Method   | Endpoint             | Description           | Auth Required |
| -------- | -------------------- | --------------------- | ------------- |
| `GET`    | `/admin/dashboard`   | Admin dashboard stats | Yes (Admin)   |
| `GET`    | `/admin/users`       | Get all users         | Yes (Admin)   |
| `PUT`    | `/admin/users/:id`   | Update user           | Yes (Admin)   |
| `DELETE` | `/admin/users/:id`   | Delete user           | Yes (Admin)   |
| `GET`    | `/admin/streams`     | Get all streams       | Yes (Admin)   |
| `GET`    | `/admin/reports`     | Get reports           | Yes (Admin)   |
| `PUT`    | `/admin/reports/:id` | Resolve report        | Yes (Admin)   |

#### Analytics

| Method | Endpoint                      | Description        | Auth Required |
| ------ | ----------------------------- | ------------------ | ------------- |
| `GET`  | `/analytics/stream/:streamId` | Stream analytics   | Yes           |
| `GET`  | `/analytics/platform`         | Platform analytics | Yes (Admin)   |
| `GET`  | `/analytics/user`             | User analytics     | Yes           |

#### Constants

| Method | Endpoint                | Description    | Auth Required |
| ------ | ----------------------- | -------------- | ------------- |
| `GET`  | `/constants/categories` | Get categories | No            |

### Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "data": null
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---


---

## 📱 Usage Guide

### For Viewers

1. **Browse Live Streams**

   - Visit the homepage to see all live streams
   - Filter by category (Gaming, Music, Art, etc.)
   - Search for specific streams or creators

2. **Watch Streams**

   - Click on any stream to start watching
   - Engage in live chat with other viewers
   - Like, comment, and share streams

3. **Follow Creators**

   - Click the follow button on a creator's profile
   - Get notified when they go live
   - Access followed streams from the sidebar

4. **Create Playlists**

   - Save your favorite VODs to playlists
   - Organize content by theme or category
   - Share playlists with friends

5. **Manage Library**
   - View your saved, liked, and recently watched content
   - Create custom collections
   - Track your viewing history

### For Streamers

1. **Set Up Your Stream**

   - Navigate to the Studio page
   - Configure stream settings (title, category, quality)
   - Set up your stream key

2. **Start Streaming**

   - Use OBS Studio or similar software
   - Connect to RTMP server: `rtmp://your-server:1935/live`
   - Enter your stream key
   - Click "Go Live" in the studio

3. **Monitor Your Stream**

   - View real-time analytics (viewer count, engagement)
   - Interact with viewers through chat
   - Use drawing canvas for annotations

4. **Manage Content**

   - Upload VODs for later viewing
   - Organize content into playlists
   - Track performance metrics

5. **Upgrade Features**
   - Access advanced analytics
   - Enable multi-quality streaming
   - Get priority support

### For Administrators

1. **Monitor Platform**

   - Access admin dashboard for platform-wide stats
   - Monitor active streams and users
   - Track system performance

2. **Manage Users**

   - View all user accounts
   - Promote users to streamer/admin roles
   - Suspend or delete accounts if needed

3. **Moderate Content**

   - Review reported content
   - Take action on violations
   - Manage stream categories

4. **Analytics & Reports**
   - View platform-wide analytics
   - Generate reports
   - Export data for analysis


## 🙏 Acknowledgments

We would like to thank the following projects and communities:

- **[FFmpeg](https://ffmpeg.org/)** - For video processing capabilities
- **[Socket.io](https://socket.io/)** - For real-time communication
- **[React](https://reactjs.org/)** - For the amazing framework
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[MongoDB](https://www.mongodb.com/)** - For the flexible database solution
- **[Express.js](https://expressjs.com/)** - For the robust web framework
- **[Mediasoup](https://mediasoup.org/)** - For WebRTC SFU capabilities
- **[YOLO](https://github.com/ultralytics/ultralytics)** - For AI content detection


