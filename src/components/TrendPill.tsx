import {View, Text} from 'react-native';
import {IconTrendingUp3, IconTrendingDown3} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';

interface TrendPillProps {
  /** Drives both the up/down icon and the green/red text color. */
  value: number;
  /** Displayed text. Defaults to `${Math.abs(value).toFixed(2)}%`. */
  text?: string;
  iconSize?: number;
  /** Tailwind classes for the text (default `text-sm font-medium`). */
  textClassName?: string;
  /** Gap between icon and text (default `gap-1.5`). */
  gapClassName?: string;
}

/**
 * Inline "trend" indicator: an up/down arrow plus a colored value, used across
 * portfolio cards, watchlist rows, market movers and the stock screen.
 */
export const TrendPill = ({
  value,
  text,
  iconSize = 16,
  textClassName = 'text-sm font-medium',
  gapClassName = 'gap-1.5',
}: TrendPillProps) => {
  const isPositive = value >= 0;

  return (
    <View className={`flex-row items-center ${gapClassName}`}>
      {isPositive ? (
        <IconTrendingUp3 color={Colors.up} size={iconSize} />
      ) : (
        <IconTrendingDown3 color={Colors.down} size={iconSize} />
      )}
      <Text
        className={`${textClassName} ${isPositive ? 'text-green-400' : 'text-red-400'}`}
      >
        {text ?? `${Math.abs(value).toFixed(2)}%`}
      </Text>
    </View>
  );
};
