import {useMemo, useState} from 'react';
import {View, Text, ScrollView, Pressable, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from 'expo-router';
import {LineChart} from 'react-native-gifted-charts';
import {Image} from 'expo-image';
import {
  IconAdjustmentsHorizontal,
  IconTrendingUp3,
  IconTrendingDown3,
  IconArrowDownRight,
  IconArrowUpRight,
} from '@tabler/icons-react-native';

import {portfolio, stocks} from '@/data';
import {formatCurrency} from '@/utils';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 180;

type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

interface TimeframeOptionProps {
  id: Timeframe;
  label: string;
}

const TIMEFRAMES: TimeframeOptionProps[] = [
  {id: '1D', label: '1D'},
  {id: '1W', label: '1W'},
  {id: '1M', label: '1M'},
  {id: '3M', label: '3M'},
  {id: '1Y', label: '1Y'},
  {id: 'ALL', label: 'ALL'},
];

// Seeded PRNG so charts stay stable across renders
const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const seedFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

interface ChartPointProps {
  value: number;
}

/**
 * Builds a deterministic portfolio line per timeframe.
 *
 * - 1D → 24 points (hourly-ish) with very tight range
 * - 1W → 7 sessions
 * - 1M → 30 sessions
 * - 3M → 66 sessions
 * - 1Y → 52 weeks
 * - ALL → 80 points
 *
 * The line always ends at `portfolio.totalValue`, and the starting value is
 * derived from `portfolio.dayChangePercent` (for 1D) or a broader drift for
 * longer timeframes, so the curve visually matches the displayed %.
 */
const TIMEFRAME_CONFIG: Record<
  Timeframe,
  {count: number; driftPct: number; volPct: number}
> = {
  '1D': {count: 24, driftPct: 0.011, volPct: 0.004},
  '1W': {count: 7, driftPct: 0.025, volPct: 0.009},
  '1M': {count: 30, driftPct: 0.045, volPct: 0.012},
  '3M': {count: 66, driftPct: 0.08, volPct: 0.016},
  '1Y': {count: 52, driftPct: 0.165, volPct: 0.022},
  'ALL': {count: 80, driftPct: 0.26, volPct: 0.028},
};

const buildPortfolioSeries = (
  tf: Timeframe,
  endValue: number,
): ChartPointProps[] => {
  const {count, driftPct, volPct} = TIMEFRAME_CONFIG[tf];
  const rand = mulberry32(seedFromString(`portfolio-${tf}`));

  const startValue = endValue * (1 - driftPct);
  const volatility = endValue * volPct;

  const points: ChartPointProps[] = [];
  let value = startValue;

  for (let i = 0; i < count - 1; i++) {
    const progress = i / (count - 1);
    const target = startValue + (endValue - startValue) * progress;
    const jitter = (rand() - 0.5) * volatility;
    value = target + jitter;
    points.push({value: parseFloat(value.toFixed(2))});
  }
  points.push({value: endValue});

  return points;
};

const stockMap = new Map(stocks.map((s) => [s.symbol, s]));

const PortfolioScreen = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1M');

  const chartData = useMemo(
    () => buildPortfolioSeries(activeTimeframe, portfolio.totalValue),
    [activeTimeframe],
  );

  const chartStart = chartData[0].value;
  const chartEnd = chartData[chartData.length - 1].value;
  const periodChange = chartEnd - chartStart;
  const periodChangePct = (periodChange / chartStart) * 100;
  const isPeriodPositive = periodChange >= 0;

  const lineColor = isPeriodPositive ? '#4ade80' : '#f87171';
  const startFillColor = isPeriodPositive
    ? 'rgba(74, 222, 128, 0.35)'
    : 'rgba(248, 113, 113, 0.35)';
  const endFillColor = isPeriodPositive
    ? 'rgba(74, 222, 128, 0)'
    : 'rgba(248, 113, 113, 0)';

  const values = chartData.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.15 || 1;

  const isDayPositive = portfolio.dayChangePercent >= 0;
  const isTotalPositive = portfolio.totalGainPercent >= 0;

  const recentTransactions = portfolio.transactions.slice(-5).reverse();

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between pt-2 pb-8">
            <View>
              <Text className="text-neutral-300">Overview</Text>
              <Text className="text-white text-2xl font-bold">Portfolio</Text>
            </View>

            <Pressable
              className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800">
              <IconAdjustmentsHorizontal size={20} color="white"/>
            </Pressable>
          </View>

          {/* Total Value */}
          <View className="gap-4 items-center">
            <Text className="text-neutral-100 font-light text-xl">
              Total Value
            </Text>

            <Text className="text-white text-4xl font-semibold">
              ${formatCurrency(portfolio.totalValue)}
            </Text>

            <View className="flex-row items-center gap-2">
              {isDayPositive
                ? <IconTrendingUp3 color="#4ade80" size={16}/>
                : <IconTrendingDown3 color="#f87171" size={16}/>
              }
              <Text
                className={`text-sm font-medium ${isDayPositive ? 'text-green-400' : 'text-red-400'}`}
              >
                {isDayPositive ? '+' : ''}${formatCurrency(Math.abs(portfolio.dayChange))} ({isDayPositive ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%)
              </Text>
              <Text className="text-neutral-500 text-sm">Today</Text>
            </View>
          </View>

          {/* Period change label */}
          <View className="flex-row items-center justify-center gap-2 mt-4">
            {isPeriodPositive
              ? <IconTrendingUp3 color="#4ade80" size={14}/>
              : <IconTrendingDown3 color="#f87171" size={14}/>
            }
            <Text
              className={`text-xs font-medium ${isPeriodPositive ? 'text-green-400' : 'text-red-400'}`}
            >
              {isPeriodPositive ? '+' : ''}${formatCurrency(Math.abs(periodChange))}{' '}
              ({isPeriodPositive ? '+' : ''}{periodChangePct.toFixed(2)}%)
            </Text>
            <Text className="text-neutral-500 text-xs">· {activeTimeframe}</Text>
          </View>

          {/* Chart */}
          <View className="mt-4 -ml-2">
            <LineChart
              data={chartData}
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              initialSpacing={0}
              endSpacing={0}
              spacing={CHART_WIDTH / (chartData.length - 1)}
              thickness={2.5}
              color={lineColor}
              curved
              areaChart
              startFillColor={startFillColor}
              endFillColor={endFillColor}
              startOpacity={1}
              endOpacity={0}
              hideDataPoints
              hideRules
              hideAxesAndRules
              hideYAxisText
              xAxisColor="transparent"
              yAxisColor="transparent"
              yAxisOffset={minValue - padding}
              maxValue={maxValue - minValue + padding * 2}
              pointerConfig={{
                pointerStripHeight: CHART_HEIGHT,
                pointerStripColor: 'rgba(255,255,255,0.15)',
                pointerStripWidth: 1,
                pointerColor: lineColor,
                radius: 5,
                activatePointersOnLongPress: false,
                autoAdjustPointerLabelPosition: true,
                pointerLabelWidth: 100,
                pointerLabelHeight: 34,
                pointerLabelComponent: (items: ChartPointProps[]) => (
                  <View className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5">
                    <Text className="text-white text-xs font-semibold">
                      ${formatCurrency(items[0].value)}
                    </Text>
                  </View>
                ),
              }}
            />
          </View>

          {/* Timeframe Tabs */}
          <View className="flex-row gap-2 mt-4">
            {TIMEFRAMES.map((tf) => {
              const isActive = tf.id === activeTimeframe;

              return (
                <Pressable
                  key={tf.id}
                  onPress={() => setActiveTimeframe(tf.id)}
                  className={`flex-1 px-3 py-2 rounded-full border items-center ${isActive ? 'bg-white border-white' : 'bg-surface-light border-neutral-800'}`}
                >
                  <Text
                    className={`text-xs font-medium ${isActive ? 'text-black' : 'text-neutral-300'}`}
                  >
                    {tf.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-3 mt-6">
            <View className="flex-1 bg-surface-light rounded-2xl p-4 gap-2">
              <Text className="text-neutral-400 text-xs">Invested</Text>
              <Text className="text-white text-lg font-semibold">
                ${formatCurrency(portfolio.totalCost)}
              </Text>
            </View>

            <View className="flex-1 bg-surface-light rounded-2xl p-4 gap-2">
              <Text className="text-neutral-400 text-xs">Total P&L</Text>
              <View className="flex-row items-center gap-1.5">
                <Text
                  className={`text-lg font-semibold ${isTotalPositive ? 'text-green-400' : 'text-red-400'}`}
                >
                  {isTotalPositive ? '+' : ''}{portfolio.totalGainPercent.toFixed(2)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Holdings */}
          <View className="mt-8 gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-lg font-medium">Holdings</Text>

              <Pressable>
                <Text className="text-neutral-500 text-sm">Show All</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {portfolio.holdings.map((holding) => {
                const stock = stockMap.get(holding.symbol);
                if (!stock) return null;

                const totalCost = holding.shares * holding.avgCost;
                const totalCurrent = holding.shares * holding.currentPrice;
                const pnl = totalCurrent - totalCost;
                const pnlPercent = (pnl / totalCost) * 100;
                const isPositive = pnl >= 0;

                return (
                  <Pressable
                    key={holding.symbol}
                    onPress={() => router.push(`/stock/${holding.symbol}`)}
                    className="flex-row items-center px-4 py-4 bg-surface-light rounded-2xl"
                  >
                    <Image
                      source={{uri: stock.logo}}
                      style={{width: 36, height: 36, borderRadius: 50}}
                    />

                    <View className="ml-3 flex-1">
                      <Text className="text-neutral-200 text-base font-medium">
                        {holding.symbol}
                      </Text>

                      <Text className="text-neutral-500 text-xs" numberOfLines={1}>
                        {holding.shares} shares · ${formatCurrency(holding.avgCost)}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-white font-medium">
                        ${formatCurrency(totalCurrent)}
                      </Text>

                      <View className="flex-row items-center gap-1.5">
                        {isPositive
                          ? <IconTrendingUp3 color="#4ade80" size={14}/>
                          : <IconTrendingDown3 color="#f87171" size={14}/>
                        }
                        <Text
                          className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Recent Transactions */}
          <View className="mt-8 gap-4 mb-32">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-lg font-medium">Recent Transactions</Text>

              <Pressable>
                <Text className="text-neutral-500 text-sm">Show All</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {recentTransactions.map((tx) => {
                const stock = stockMap.get(tx.symbol);
                const isBuy = tx.type === 'buy';

                return (
                  <Pressable
                    key={tx.id}
                    onPress={() => router.push(`/transaction/${tx.id}`)}
                    className="flex-row items-center px-4 py-4 bg-surface-light rounded-2xl"
                  >
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center ${isBuy ? 'bg-green-400/10' : 'bg-red-400/10'}`}
                    >
                      {isBuy
                        ? <IconArrowDownRight size={18} color="#4ade80"/>
                        : <IconArrowUpRight size={18} color="#f87171"/>
                      }
                    </View>

                    <View className="ml-3 flex-1">
                      <Text className="text-neutral-200 text-base font-medium">
                        {isBuy ? 'Buy' : 'Sell'} {tx.symbol}
                      </Text>

                      <Text className="text-neutral-500 text-xs" numberOfLines={1}>
                        {stock?.name ?? tx.symbol} · {tx.date}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-white font-medium">
                        ${formatCurrency(tx.shares * tx.price)}
                      </Text>

                      <Text className="text-neutral-500 text-xs">
                        {tx.shares} @ ${formatCurrency(tx.price)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PortfolioScreen;
