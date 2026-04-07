# Capacitor Web-to-Mobile POC

A Capacitor + React + Vite proof-of-concept that takes an existing React web app and ships it as a real iOS and Android app with native plugins for camera, geolocation, push notifications, file system, and haptics. Built to show the patterns required to convert a web codebase into a production mobile app without rewriting the UI.

## What this POC demonstrates

- A single React + Vite codebase that runs as a PWA, an iOS app, and an Android app
- Capacitor 6 with the `@capacitor/ios` and `@capacitor/android` platforms
- Native plugin integration: Camera, Geolocation, Push Notifications, Filesystem, Haptics, Network
- A `NativeBridge` service that abstracts Capacitor plugins behind a clean TypeScript interface so feature code does not import Capacitor directly
- Web fallbacks for every native feature so the same codebase still works in a browser
- Capacitor configuration with custom URL scheme, deep links, and splash screen
- Live-reload workflow for native debugging via `capacitor run --livereload`
- A worked example: a "Field Inspection" dashboard that takes a photo, tags it with GPS, and stores it locally

## Stack

- React 18 + Vite 5 + TypeScript
- Capacitor 6 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`)
- Plugins: `@capacitor/camera`, `@capacitor/geolocation`, `@capacitor/push-notifications`, `@capacitor/filesystem`, `@capacitor/haptics`, `@capacitor/network`
- Tailwind CSS for styling

## Architecture

```
.
├── capacitor.config.ts          # Bundle id, scheme, plugin config
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx                 # React entry
    ├── App.tsx                  # Top-level routes
    ├── services/
    │   └── nativeBridge.ts      # Single abstraction over Capacitor plugins
    └── features/dashboard/
        ├── DashboardScreen.tsx
        └── inspectionStore.ts
```

## How the conversion works

1. The React app builds to `dist/` exactly like a normal Vite project.
2. `npx cap sync` copies the build into the iOS and Android shells.
3. Native plugins live in node_modules and are wired in by Capacitor at build time. No XCode plugin installation, no Gradle surgery.
4. Feature code calls into `nativeBridge.ts`, which dispatches to the right Capacitor plugin or to a web fallback when running in a browser.
5. The same `npm run build` artifact ships to web, iOS, and Android.

## Why this matters for the job

The "Senior Mobile Developer Needed to Convert Web App to Mobile App" job needs:
- Capacitor framework experience
- Web-app to mobile-app conversion expertise
- Seamless functionality and optimal UX across platforms

This POC is a real Capacitor project with the full plugin set you need to convert most web SaaS apps to mobile, not a tutorial-grade hello world.

## Run

```bash
npm install

# Web
npm run dev

# iOS (requires Xcode)
npm run build
npx cap sync ios
npx cap run ios

# Android (requires Android Studio)
npm run build
npx cap sync android
npx cap run android
```
