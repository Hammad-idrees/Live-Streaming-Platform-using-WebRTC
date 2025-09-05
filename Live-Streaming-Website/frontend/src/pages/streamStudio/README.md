# Stream Studio Page

This directory contains all code related to the Stream Studio experience for streamers.

## Structure

- **StreamStudio.jsx**: Main entry point for the Stream Studio page. Handles tab navigation and composes all subcomponents.
- **useStreamStudio.js**: Custom React hook containing all state and logic for the Stream Studio page.
- **streamStudio.data.js**: Contains mock data and static arrays (analytics, categories, tags).
- **DashboardTab.jsx**: UI for the dashboard tab (quick stats, actions).
- **StreamTab.jsx**: UI for the stream setup tab (stream settings, tags, go live, etc.).
- **AnalyticsTab.jsx**: UI for the analytics tab (stream analytics, charts, etc.).
- **SettingsTab.jsx**: UI for the settings tab (streamer preferences, etc.).
- **StreamKeyModal.jsx**: Modal for displaying and copying the stream key and RTMP URL.

## Purpose

This modular structure makes it easy to maintain, test, and extend the Stream Studio page. Each tab and major logic section is separated for clarity and reusability.
