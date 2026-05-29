import {View, Text, Pressable} from 'react-native';
import {IconAdjustmentsHorizontal} from '@tabler/icons-react-native';

import {TrendPill} from '@/components';
import {portfolio} from '@/core/data';
import {formatCurrency} from '@/core/utils';

interface PortfolioHeaderProps {
  periodChange: number;
  periodChangePct: number;
  isPeriodPositive: boolean;
  activeTimeframe: string;
}

/** Total-value header with the day and period TrendPill rows. */
export const PortfolioHeader = ({
  periodChange,
  periodChangePct,
  isPeriodPositive,
  activeTimeframe,
}: PortfolioHeaderProps) => {
  const isDayPositive = portfolio.dayChangePercent >= 0;

  return (
    <>
      {/* Header */}
      <View className="flex-row items-center justify-between pt-2 pb-8">
        <View>
          <Text className="text-neutral-300">Overview</Text>
          <Text className="text-white text-2xl font-bold">Portfolio</Text>
        </View>

        <Pressable className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800">
          <IconAdjustmentsHorizontal size={20} color="white" />
        </Pressable>
      </View>

      {/* Total Value */}
      <View className="gap-4 items-center">
        <Text className="text-neutral-100 font-light text-xl">Total Value</Text>

        <Text className="text-white text-4xl font-semibold">
          ${formatCurrency(portfolio.totalValue)}
        </Text>

        <View className="flex-row items-center gap-2">
          <TrendPill
            value={portfolio.dayChangePercent}
            gapClassName="gap-2"
            text={`${isDayPositive ? '+' : ''}$${formatCurrency(Math.abs(portfolio.dayChange))} (${isDayPositive ? '+' : ''}${portfolio.dayChangePercent.toFixed(2)}%)`}
          />
          <Text className="text-neutral-500 text-sm">Today</Text>
        </View>
      </View>

      {/* Period change label */}
      <View className="flex-row items-center justify-center gap-2 mt-4">
        <TrendPill
          value={periodChange}
          iconSize={14}
          textClassName="text-xs font-medium"
          gapClassName="gap-2"
          text={`${isPeriodPositive ? '+' : ''}$${formatCurrency(Math.abs(periodChange))} (${isPeriodPositive ? '+' : ''}${periodChangePct.toFixed(2)}%)`}
        />
        <Text className="text-neutral-500 text-xs">· {activeTimeframe}</Text>
      </View>
    </>
  );
};