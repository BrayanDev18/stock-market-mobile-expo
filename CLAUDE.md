# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuantiX — a stock market mobile app built with **Expo 55**, **React Native 0.83**, and **React 19**. File-based routing via expo-router. Targets iOS, Android, and Web.

## Commands

- **Install:** `bun install`
- **Start dev server:** `bun start`
- **iOS:** `bun ios` · **Android:** `bun android` · **Web:** `bun web`
- **Lint:** `bun run lint` (expo lint / ESLint)

No test runner is configured.

### Native build gotchas

- **Bun does not run postinstall scripts by default.** After `bun install`, `@shopify/react-native-skia` needs its prebuilt binaries downloaded manually or pod install will fail with `Skia prebuilt binaries not found`:
  ```bash
  node node_modules/@shopify/react-native-skia/scripts/install-skia.mjs
  ```
  (Or add Skia to `trustedDependencies` in `package.json`.)
- `expo-camera` and Skia are native modules — after adding/updating them, **rebuild the dev client** (`bun ios` / `bun android`). Plain Expo Go won't work.
- When adding a new Expo config-plugin (e.g. `expo-camera` in `app.json`), an already-prebuilt `ios/` or `android/` folder will NOT automatically pick up the changes. Either run `bunx expo prebuild` or hand-edit the native config (e.g. add `NSCameraUsageDescription` to `ios/*/Info.plist`).

## Architecture

### Routing (expo-router, file-based)

Root `src/app/_layout.tsx` wraps a `Stack` in `GestureHandlerRootView` (required by `react-native-reanimated-modal`). Route groups:

- **`src/app/index.tsx`** — Welcome screen (not in a tab group). Animated 3-slide carousel showcasing app features; CTAs call `navigate('home')` from `@/constants/ScreenRoutes`.
- **`src/app/(root)/`** — Tab group. Custom floating blur `FloatingTabBar` in `_layout.tsx` uses Reanimated spring to animate an active-tab mask. 5 tabs: `home`, `market`, `search`, `portfolio`, `profile`.
- **`src/app/stock/[symbol].tsx`** — Dynamic stock detail screen (outside tabs, pushes full-screen).
- **`src/app/transaction/[id].tsx`** — Dynamic transaction detail screen.
- **`src/app/actions/`** — Modal-style full-screen flows pushed from home's quick-action row: `deposit`, `deposit-confirm`, `withdraw`, `withdraw-confirm`, `transfer`, `scan`.
- **`src/app/(auth)/`** — Empty group reserved for auth routes (no files yet).

Navigation between all screens is via `router.push('/path')`. The root `Stack` in `src/app/_layout.tsx` renders every non-tab screen over the floating tab bar.

### Directory layout (`src/`)

```
app/          Routes and layouts (expo-router)
components/   Reusable components + shared index barrel
constants/    ScreenRoutes helper + barrel
data/         Mock data exports (stocks, payment methods) — all via index.ts
interfaces/   TypeScript types — all via index.ts
utils/        formatCurrency, cssInterop (NativeWind ↔ LinearGradient bridge)
```

Assets live in `assets/` (images, tab icons, splash). Path alias `@/*` → `./src/*` is defined in both `tsconfig.json` and expected in all imports (avoid relative `../..` paths).

### Styling — NativeWind + custom tokens

- **Tailwind config** in `tailwind.config.js` defines the dark-first palette used everywhere:
  - `surface` `#0A0A0A`, `surface-elevated` `#111111`, `surface-light` `#161616`, `surface-card` `#1C1C1C`, `surface-border` `#2A2A2A`
  - `accent` `#22c55e`, `accent-dim` `#16a34a`, `muted` `#6b7280`
- **Up/down colors** are inlined as `#4ade80` (green-400) and `#f87171` (red-400) — used consistently across charts, trend arrows, and status pills.
- `src/utils/cssInterop.ts` registers `expo-linear-gradient` with NativeWind via `cssInterop` — this is imported from `src/app/_layout.tsx` and must stay imported or `LinearGradient className=` will break.
- `global.css` is imported at the app root for NativeWind.

### Charts — deterministic synthetic data pattern

Three chart libraries are in use, deliberately:

1. **`react-native-gifted-charts`** — main library for `LineChart` (stock detail, portfolio, market hero, welcome preview cards, sparklines in market rows/cards) and `BarChart` (volume in stock detail, sector bars in market).
2. **`@shopify/react-native-skia`** — used for the animated background glow effect on the welcome screen (`BackgroundEffect` in `src/app/index.tsx`).
3. **`react-native-svg`** — used inline for small SVG sparklines and crosshairs in the welcome screen's mock phone previews.

Because the mock dataset only has real historical data for AAPL, most charts use a shared pattern: a **seeded PRNG** (`mulberry32` + a string hash) to generate deterministic, trend-aware synthetic data so charts never flicker on re-render. Look for `mulberry32`, `seedFromString`, and `buildTrendSeries` / `buildChartData` / `buildPortfolioSeries` in `stock/[symbol].tsx`, `market.tsx`, and `portfolio.tsx` — same pattern, duplicated intentionally per file (not abstracted). For the stock detail screen, AAPL specifically reads `historicalDataAAPL` from `@/data` and skips the PRNG path.

### Data layer

All mock data lives in `src/data/` (`mock-stocks.ts`, `mock-payment-methods.ts`) and is re-exported from `src/data/index.ts`. Interfaces mirror this in `src/interfaces/`. Consumers should always import from the barrel:

```ts
import {stocks, portfolio, paymentMethods, historicalDataAAPL} from '@/data';
import type {StockProps, PaymentMethodProps} from '@/interfaces';
```

### Modals — react-native-reanimated-modal

Used in deposit and withdraw screens for the payment-method bottom sheet. The standard pattern:

```tsx
<Modal
  visible={showMethods}
  onHide={() => setShowMethods(false)}
  animation={{type: 'slide', direction: {start: 'down', end: 'down'}}}
  swipe={{enabled: true, directions: ['down'], threshold: 80}}
  backdrop={{enabled: true, color: 'black', opacity: 0.7}}
  style={{justifyContent: 'flex-end', margin: 0}}
  statusBarTranslucent
>
```

**Requires `GestureHandlerRootView` at the root** — already wired in `src/app/_layout.tsx`.

### Camera (scan-to-pay)

`src/app/actions/scan.tsx` uses `expo-camera`'s `CameraView` + `useCameraPermissions`. Key points:

- The permission prompt string comes from the `expo-camera` plugin config in `app.json`. When running on a prebuilt `ios/` folder, also ensure `NSCameraUsageDescription` exists in `ios/*/Info.plist`.
- Camera is paused via `AppState` listener when the app backgrounds.
- `onBarcodeScanned` is guarded by a `useRef` flag to prevent duplicate fires; setting `onBarcodeScanned={undefined}` after a scan stops the continuous callback stream.

## Conventions

- **Interface naming — strict rule:** Every interface ends with the `Props` suffix (e.g. `StockProps`, `PaymentMethodProps`, `MenuRowProps`). This applies to data shapes too, not just React component props. User-enforced.
- **Platform-specific files:** Use `.web.ts` / `.web.tsx` suffixes for web variants (Metro auto-resolves).
- **Typed routes:** Enabled via `experiments.typedRoutes` in `app.json` — expo-router generates types for all routes.
- **React Compiler:** Enabled via `experiments.reactCompiler`.
- **Strict TypeScript:** `strict: true` in tsconfig — do not add `any` silently.
