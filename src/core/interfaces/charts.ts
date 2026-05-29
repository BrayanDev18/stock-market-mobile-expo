/**
 * A single point in a line/area chart series.
 *
 * `value` is the only required field; `label` and `date` are optional and used
 * by screens that surface axis labels or tooltips (e.g. the stock detail
 * screen, which carries the real historical `date`).
 */
export interface ChartPointProps {
  value: number;
  label?: string;
  date?: string;
}
