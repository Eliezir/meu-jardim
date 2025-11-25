# Minimal Template

This is a [React Native](https://reactnative.dev/) project built with [Expo](https://expo.dev/) and [React Native Reusables](https://reactnativereusables.com).

It was initialized using the following command:

```bash
npx @react-native-reusables/cli@latest init -t meu-jardim
```

## Getting Started

To run the development server:

```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
```

This will start the Expo Dev Server. Open the app in:

- **iOS**: press `i` to launch in the iOS simulator _(Mac only)_
- **Android**: press `a` to launch in the Android emulator
- **Web**: press `w` to run in a browser

You can also scan the QR code using the [Expo Go](https://expo.dev/go) app on your device. This project fully supports running in Expo Go for quick testing on physical devices.

## Project Structure

```
app/
 ├─ _layout.tsx                # wraps AppProviders + Animation gate
 └─ (tabs)/                    # tab routes: home, umidity, time, zones, forecast
src/
 ├─ components/FeatureCard.tsx # shared UI for navigation cards
 ├─ hooks/useFeatureIcon.ts    # shared hooks/utilities
 ├─ providers/AppProviders.tsx # QueryClient + Firebase bootstrap
 ├─ services/firebase/         # Firebase config & handles
 └─ features/
     └─ <feature>/
         ├─ api/queries.ts     # TanStack Query hooks hitting Firestore
         ├─ components/        # UI specific to the feature
         ├─ hooks/             # thin wrappers around queries
         └─ types.ts           # co-located TypeScript contracts
```

Each tab screen imports presentation components and hooks from `src/features/<feature>` so UI and data contracts remain modular and testable.

## Data & Providers

- `AppProviders` instantiates a shared `QueryClient`, registers focus tracking, and ensures Firebase initializes once.
- Screens consume data through TanStack Query hooks so caching, refetching, and optimistic updates stay consistent.
- Shared components (e.g., `FeatureCard`) live under `src/components` to avoid circular dependencies with feature modules.

## Firebase Setup

1. Create a Firebase project and enable Firestore.
2. Add the following environment variables (e.g., in `.env` or your terminal session). Expo exposes any `EXPO_PUBLIC_*` variable:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

3. Populate the Firestore collections referenced by each feature (`home_highlights`, `umidity_metrics`, `time_windows`, `garden_zones`, `forecast_days`).

If collections are empty, the UI falls back to sensible demo data so new environments still render correctly.

## Adding Feature Modules

When introducing a new surface area:

1. Create `src/features/<feature>/{api,components,hooks,types}`.
2. Start with a query in `api/queries.ts` that reads or writes Firestore using helpers from `src/services/firebase/config`.
3. Wrap the query with a hook in `hooks/` so screens never import API modules directly.
4. Build UI primitives inside `components/` and connect them inside the relevant `app/(tabs)` screen.

This keeps routing, presentation, and data layers loosely coupled while following Expo Router conventions.

## Project Features

- ⚛️ Built with [Expo Router](https://expo.dev/router)
- 🎨 Styled with [Tailwind CSS](https://tailwindcss.com/) via [Nativewind](https://www.nativewind.dev/)
- 📦 UI powered by [React Native Reusables](https://github.com/founded-labs/react-native-reusables)
- 🚀 New Architecture enabled
- 🔥 Edge to Edge enabled
- 📱 Runs on iOS, Android, and Web

## Learn More

To dive deeper into the technologies used:

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Nativewind Docs](https://www.nativewind.dev/)
- [React Native Reusables](https://reactnativereusables.com)

## Deploy with EAS

The easiest way to deploy your app is with [Expo Application Services (EAS)](https://expo.dev/eas).

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Updates](https://docs.expo.dev/eas-update/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)

---

If you enjoy using React Native Reusables, please consider giving it a ⭐ on [GitHub](https://github.com/founded-labs/react-native-reusables). Your support means a lot!
