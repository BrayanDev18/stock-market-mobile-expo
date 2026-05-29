import {router} from 'expo-router';
import type {Href} from 'expo-router';

/**
 * Static app routes. Use with {@link navigate} or `router.push(ScreenRoutes.x)`
 * instead of scattering literal path strings across screens.
 */
export const ScreenRoutes = {
  welcome: '/',
  home: '/home',
  market: '/market',
  search: '/search',
  portfolio: '/portfolio',
  profile: '/profile',
  deposit: '/actions/deposit',
  depositConfirm: '/actions/deposit-confirm',
  withdraw: '/actions/withdraw',
  withdrawConfirm: '/actions/withdraw-confirm',
  transfer: '/actions/transfer',
  scan: '/actions/scan',
} as const;

/** Builders for dynamic routes that take a path parameter. */
export const DynamicRoutes = {
  stock: (symbol: string) => `/stock/${symbol}` as Href,
  transaction: (id: string) => `/transaction/${id}` as Href,
} as const;

/** Type-safe push to a static screen — avoids typos in path strings. */
export const navigate = (screen: keyof typeof ScreenRoutes) => {
  router.push(ScreenRoutes[screen]);
};