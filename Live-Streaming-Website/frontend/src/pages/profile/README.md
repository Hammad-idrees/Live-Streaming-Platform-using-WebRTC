# Profile Page

This directory contains all code related to the user profile experience.

## Structure

- **Profile.jsx**: Main entry point for the profile page. Handles layout and composes all subcomponents.
- **useProfile.js**: Custom React hook containing all state and logic for the profile page.
- **ProfileCard.jsx**: UI for the profile card (avatar, badges, stats, bio).
- **ProfileHeader.jsx**: UI for the profile page header (edit/save/cancel, messages).
- **ProfileForm.jsx**: UI for the profile form (username, email, age, bio, etc.).
- **ProfilePasswordSection.jsx**: UI for the password change section.

## Purpose

This modular structure makes it easy to maintain, test, and extend the profile page. Each major UI and logic section is separated for clarity and reusability.
