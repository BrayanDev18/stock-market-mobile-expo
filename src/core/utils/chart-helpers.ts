/**
 * Deterministic synthetic chart-data helpers.
 *
 * Shared by the stock detail, market, portfolio and welcome screens so charts
 * generate stable, trend-aware data that never flickers on re-render.
 * Previously this PRNG was copy-pasted into each of those files.
 */

/** Seeded PRNG — returns a function producing deterministic floats in [0, 1). */
export const mulberry32 = (seed: number) => {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Stable 32-bit hash of a string, used to seed {@link mulberry32}. */
export const seedFromString = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
};

interface SeededSeriesProps {
  /** Starting value of the series. */
  base?: number;
  /** Per-step drift applied before noise (positive = upward trend). */
  trend?: number;
  /** Noise amplitude as a fraction of `base` (default 0.03 = ±3%). */
  volatility?: number;
  /** Optional lower clamp so values never dip below this floor. */
  floor?: number;
}

/**
 * Build a deterministic, trend-aware numeric series from a string seed.
 * Returns `count` values; callers map these into their chart point shape.
 */
export const buildSeededSeries = (
  seed: string,
  count: number,
  {base = 100, trend = 0, volatility = 0.03, floor}: SeededSeriesProps = {},
): number[] => {
  const rng = mulberry32(seedFromString(seed));
  const series: number[] = [];
  let value = base;
  for (let i = 0; i < count; i++) {
    const noise = (rng() - 0.5) * base * volatility;
    value = value + trend + noise;
    series.push(floor !== undefined ? Math.max(value, floor) : value);
  }
  return series;
};
