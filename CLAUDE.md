# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuantiX — a stock market mobile app built with **Expo 56**, **React Native 0.85**, and **React 19**. File-based routing via expo-router. Targets iOS, Android, and Web.

## Commands

- **Install:** `bun install`
- **Start dev server:** `bun start`
- **iOS:** `bun ios` · **Android:** `bun android` · **Web:** `bun web`
- **Lint:** `bun run lint` (expo lint / ESLint)

No test runner is configured.

### Native build gotchas

- **Bun does not run postinstall scripts by default.** After `bun install`, `@shopify/react-native-skia` needs its prebuilt binaries downloaded manually or pod install will fail with `Skia prebuilt binaries not found`:
  ```bash
  node node_modules/@shopify/react-native-skia/scripts/install-libs.js
  ```
  (Or add Skia to `trustedDependencies` in `package.json`.)
- `expo-camera` and Skia are native modules — after adding/updating them, **rebuild the dev client** (`bun ios` / `bun android`). Plain Expo Go won't work.
- When adding a new Expo config-plugin (e.g. `expo-camera` in `app.json`), an already-prebuilt `ios/` or `android/` folder will NOT automatically pick up the changes. Either run `bunx expo prebuild` or hand-edit the native config (e.g. add `NSCameraUsageDescription` to `ios/*/Info.plist`).

## Architecture

### Routing (expo-router, file-based)

Root `src/app/_layout.tsx` wraps a `Stack` in `GestureHandlerRootView` (required by `react-native-reanimated-modal`). Route groups:

- **`src/app/index.tsx`** — Welcome screen (not in a tab group). Animated 3-slide carousel showcasing app features; CTAs call `navigate('home')` from `@/core/constants`.
- **`src/app/(root)/`** — Tab group. `_layout.tsx` renders `NativeTabs` with 5 tabs: `home`, `market`, `search`, `portfolio`, `profile`.
- **`src/app/stock/[symbol].tsx`** — Dynamic stock detail screen (outside tabs, pushes full-screen).
- **`src/app/transaction/[id].tsx`** — Dynamic transaction detail screen.
- **`src/app/actions/`** — Modal-style full-screen flows pushed from home's quick-action row: `deposit`, `deposit-confirm`, `withdraw`, `withdraw-confirm`, `transfer`, `scan`.
- **`src/app/(auth)/`** — Empty group reserved for auth routes (no files yet).

Navigation uses the centralized route helpers in `src/core/constants/ScreenRoutes.ts` rather than literal path strings: `router.push(ScreenRoutes.deposit)` for static screens, `router.push(DynamicRoutes.stock(symbol))` / `DynamicRoutes.transaction(id)` for parameterized ones, and the `navigate('home')` convenience for static pushes.

### Directory layout (`src/`) — feature-modular

```
app/          expo-router routes ONLY. Each route file is the real screen, kept
              THIN (target ≤100 lines) and composed from feature components.
              Layouts (_layout.tsx, (root)/_layout.tsx) live here too.
core/         App-wide, cross-cutting modules, each with an index.ts barrel:
  constants/    ScreenRoutes/DynamicRoutes + Colors tokens
  data/         Mock data (stocks, payment methods…)
  interfaces/   Shared TypeScript types (all `*Props`)
  utils/        formatCurrency, chart-helpers (seeded PRNG), cssInterop bridge
components/   GLOBAL UI used by 2+ features: ActionHeader, HeaderIconButton,
              GradientButton, TrendPill (+ GlassIconButton). Via `@/components`.
screens/      One folder PER FEATURE, owning that feature's private pieces:
  <feature>/components/   section + presentational components only used here
  <feature>/hooks/        feature-only hooks (e.g. actions/hooks/useAmountInput)
  <feature>/chart.ts …    feature-only builders/constants
```

**The rule:** a component/hook lives in `screens/<feature>/` while only that feature
uses it; the moment a second feature needs it, promote it to `@/components` (UI) or
`@/core` (logic/data). Screens (in `app/`) compose: they import global UI from
`@/components`, cross-cutting from `@/core/...`, and their own sections from
`@/screens/<feature>/components`. Even a sub-100-line screen should still extract its
distinct sections into `screens/<feature>/components`.

Assets live in `assets/` (images, tab icons, splash). Path alias `@/*` → `./src/*`
(plus `@/assets/*`) is defined in `tsconfig.json`; avoid relative `../..` paths.

### Styling — NativeWind + custom tokens

- **Tailwind config** in `tailwind.config.js` defines the dark-first palette used everywhere:
  - `surface` `#0A0A0A`, `surface-elevated` `#111111`, `surface-light` `#161616`, `surface-card` `#1C1C1C`, `surface-border` `#2A2A2A`
  - `accent` `#22c55e`, `accent-dim` `#16a34a`, `muted` `#6b7280`
- **Up/down colors** are `#4ade80` (green-400) and `#f87171` (red-400) — used consistently across charts, trend arrows, and status pills. For JS-side usage (icon `color` props, chart configs, `LinearGradient colors`) import the centralized tokens from `@/core/constants` — `Colors.up`/`Colors.down`/`Colors.accent`/`Colors.accentDim`/`Colors.accentLight`, `trendAlpha.up(a)`/`trendAlpha.down(a)` for translucent fills, and `Gradients.accent`/`Gradients.disabled` for gradient tuples. These mirror the Tailwind tokens in `src/core/constants/Colors.ts`; keep both in sync. Prefer Tailwind classNames (`bg-surface-card`) for styling and the `Colors` tokens only where classNames don't apply.
- `src/core/utils/cssInterop.ts` registers `expo-linear-gradient` with NativeWind via `cssInterop` — this is imported from `src/app/_layout.tsx` and must stay imported or `LinearGradient className=` will break.
- `global.css` is imported at the app root for NativeWind.

### Charts — deterministic synthetic data pattern

Three chart libraries are in use, deliberately:

1. **`react-native-gifted-charts`** — main library for `LineChart` (stock detail, portfolio, market hero, welcome preview cards, sparklines in market rows/cards) and `BarChart` (volume in stock detail, sector bars in market).
2. **`@shopify/react-native-skia`** — used for the animated background glow effect on the welcome screen (`BackgroundEffect` in `src/app/index.tsx`).
3. **`react-native-svg`** — used inline for small SVG sparklines and crosshairs in the welcome screen's mock phone previews.

Because the mock dataset only has real historical data for AAPL, most charts use a shared pattern: a **seeded PRNG** (`mulberry32` + a string hash) to generate deterministic, trend-aware synthetic data so charts never flicker on re-render. The PRNG primitives `mulberry32`, `seedFromString` (and a generic `buildSeededSeries`) live in **`src/core/utils/chart-helpers.ts`** (exported from the `@/core/utils` barrel) — import them rather than re-defining per file. The bespoke series builders that shape the data per feature (`buildTrendSeries` in `screens/market/charts.ts`, `buildChartData` in `screens/stock/chart.ts`, `buildPortfolioSeries` in `screens/portfolio/chart.ts`) stay in their feature folder since each has screen-specific logic, but they all consume the shared primitives. For the stock detail screen, AAPL specifically reads `historicalDataAAPL` from `@/core/data` and skips the PRNG path.

### Data layer

All mock data lives in `src/core/data/` (`mock-stocks.ts`, `mock-payment-methods.ts`) and is re-exported from `src/core/data/index.ts`. Interfaces mirror this in `src/core/interfaces/`. Consumers should always import from the barrel:

```ts
import {stocks, portfolio, paymentMethods, historicalDataAAPL} from '@/core/data';
import type {StockProps, PaymentMethodProps} from '@/core/interfaces';
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
