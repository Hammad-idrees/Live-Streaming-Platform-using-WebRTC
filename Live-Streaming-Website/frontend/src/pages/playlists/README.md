# Playlists Page

This directory contains the Playlists page for users to manage their video playlists.

## Features

- Fetch and display all playlists for the logged-in user (`GET /api/v1/playlist/my`).
- Create a new playlist (`POST /api/v1/playlist/create`).
- View playlist details and all videos in a playlist (`GET /api/v1/playlist/:id`).
- Remove videos from a playlist.

## API Integration

All API calls are handled via `src/utils/api/playlist.js`, which uses the shared `apiClient` for authentication and error handling.

## Modularization Plan

- `Playlists.jsx`: Main page, lists playlists, handles creation.
- `PlaylistDetails.jsx`: View/edit a single playlist, display all videos with title, thumbnail, and remove option.
- `usePlaylists.js`: Custom hook for playlist state and logic.
- (Planned) `playlist.data.js`: For mock/test data if needed.

## Notes

- All endpoints require authentication (token sent via cookies or Authorization header).
- UI uses Tailwind CSS for styling.
- Playlist details page uses populated video data from the backend, showing title, thumbnail, and description for each video.
