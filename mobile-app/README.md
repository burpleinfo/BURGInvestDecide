# BURG RideSafe — Mobile App

Expo + React Native app using Expo Router (file-based routing).

## Prerequisites

- Node.js: **>= 18.9.1** (recommended: Node 20+ LTS)
- npm (comes with Node)
- (Optional) Android Studio + Android SDK (for Android emulator/USB device)
- (Optional) Xcode (macOS only, for iOS simulator)

## Install

From this folder (`mobile-app/`):

```bash
npm install
```

## Run (development)

Start Metro/Expo dev server:

```bash
npm start
```

Or equivalently:

```bash
npx expo start
```

Then:

- Android: `npm run android`
- iOS (macOS only): `npm run ios`
- Web: `npm run web`

## Lint

```bash
npm run lint
```

## Android on Windows (common setup issues)

If `npm run android` fails because `adb`/Android SDK can’t be found, run:

```bash
npm run check:android
```

This repo includes `scripts/check-android-env.js`, which prints what it detects and what’s missing.

Typical minimal fix for USB device/emulator launch on Windows:

1. Ensure `adb.exe` exists at:
   `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe`
   - If you don’t have it, download Google **platform-tools** (`platform-tools-latest-windows.zip`) and extract into `%LOCALAPPDATA%\Android\Sdk`.
2. Set environment variables (User scope is fine):
   - `ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk`
   - `ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\Sdk`
3. Add to PATH:
   - `%LOCALAPPDATA%\Android\Sdk\platform-tools`

After changing env vars, restart your terminal/VS Code.

## Project structure (quick map)

- `app/` — Screens and navigation (Expo Router)
  - `app/_layout.tsx` — Root stack (includes `modal`)
  - `app/(tabs)/_layout.tsx` — Tab navigator (Home + Explore)
  - `app/(tabs)/index.tsx` — Home tab screen
  - `app/(tabs)/explore.tsx` — Explore tab screen
  - `app/modal.tsx` — Modal screen
- `components/` — Reusable UI components
- `hooks/` — App hooks (`useColorScheme`, `useThemeColor`, etc.)
- `constants/` — Theme tokens, constants
- `assets/` — Images/icons

## Repo hygiene (what’s generated)

- `node_modules/` is created by `npm install`
- `.expo/` is local Expo state/cache (safe to delete if needed)
- `dist/`, `web-build/` are generated web outputs
- `android/` and `ios/` are generated only if you run a prebuild workflow
- Local environment files should be kept out of git (see `.gitignore`, e.g. `.env*.local`)

## Notes

- This app enables Expo Router and typed routes (`experiments.typedRoutes=true` in `app.json`).
- If Metro gets into a weird state, clear cache:

```bash
npx expo start -c
```

## EAS builds (optional)

This project includes `eas.json` build profiles:

- Development client (internal): `development`
- Internal preview: `preview`
- Store-ready: `production`

If you use EAS:

```bash
npx eas build --profile development --platform android
```

## Required environment variables for token saving

To let the Android build save FCM tokens, provide a reachable backend URL at build time.

Example `.env` values:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-backend-domain.com
EXPO_PUBLIC_SERVER_URL=https://your-backend-domain.com
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

If `EXPO_PUBLIC_API_BASE_URL` is missing, the app now fails fast instead of trying `localhost` on a device.

## Reset starter scaffold (destructive)

```bash
npm run reset-project
```

This script may **move or delete** multiple directories (depending on your prompt answer):

- `app/`
- `components/`
- `hooks/`
- `constants/`
- `scripts/`

It then recreates a blank `app/` with a minimal `index.tsx` + `_layout.tsx`. Only run this if you intentionally want to reset the project scaffold.
