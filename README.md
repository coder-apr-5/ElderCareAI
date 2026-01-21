# ElderNest AI

A comprehensive elder care monitoring platform featuring a dual-app architecture.

## Structure

This is a monorepo managed by NPM Workspaces.

- **packages/elder-app**: A simplified, accessible tablet application for elders.
- **packages/family-dashboard**: A data-rich dashboard for family members and caregivers.
- **packages/shared**: Shared utilities, types, and constants.

## Tech Stack

- **Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State/Data**: React Query, Firebase
- **Routing**: React Router v6

## Getting Started

1. **Install Dependencies**
   Run the following in the root directory:
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in `packages/elder-app` and `packages/family-dashboard` with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

3. **Run Development Servers**
   To run the Elder App:
   ```bash
   npm run dev:elder
   ```

   To run the Family Dashboard:
   ```bash
   npm run dev:family
   ```

## Design System

### Elder App
- Large touch targets (>80px)
- High contrast (AAA)
- Simplified navigation
- Warm, calming colors

### Family Dashboard
- Information dense
- Data visualization
- Professional aesthetics
