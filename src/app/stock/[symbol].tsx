import {useMemo, useState} from 'react';
import {View, Text, ScrollView, Pressable, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router, useLocalSearchParams} from 'expo-router';
import {Image} from 'expo-image';
import {BarChart, LineChart} from 'react-native-gifted-charts';
import {
  IconArrowLeft,
  IconStar,
  IconShare3,
  IconTrendingUp3,
  IconTrendingDown3,
  IconActivity,
} from '@tabler/icons-react-native';

import {stocks, news, historicalDataAAPL} from '@/data';
import {formatCurrency} from '@/utils';
import type {HistoricalPointProps, StockProps} from '@/interfaces';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 10;
const CHART_HEIGHT = 220;

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

const POINT_COUNTS: Record<Timeframe, number> = {
  '1D': 26,
  '1W': 28,
  '1M': 30,
  '3M': 45,
  '1Y': 52,
  'ALL': 60,
};

// Seeded pseudo-random so charts stay stable across renders
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
  label?: string;
  date?: string;
}

// For AAPL, select a slice of real historical data based on timeframe.
// Intraday timeframes (1D/1W) don't have true intraday data, so we
// fall back to the last 5/10 daily closes.
const TIMEFRAME_SLICES: Record<Timeframe, number> = {
  '1D': 5,
  '1W': 10,
  '1M': 22,
  '3M': 22,
  '1Y': 22,
  'ALL': 22,
};

const getHistoricalSlice = (tf: Timeframe): HistoricalPointProps[] => {
  const count = Math.min(TIMEFRAME_SLICES[tf], historicalDataAAPL.length);
  return historicalDataAAPL.slice(-count);
};

const buildChartData = (stock: StockProps, tf: Timeframe): ChartPointProps[] => {
  // Real historical data path — only AAPL has it mocked in the dataset.
  if (stock.symbol === 'AAPL') {
    return getHistoricalSlice(tf).map((p) => ({
      value: p.close,
      date: p.date,
    }));
  }

  // Synthetic, deterministic generator for other symbols
  const count = POINT_COUNTS[tf];
  const rand = mulberry32(seedFromString(stock.symbol + tf));

  const range = stock.high52w - stock.low52w;
  const volatility = range * 0.035;
  const drift = (stock.changePercent / 100) * (range * 0.15);

  const points: ChartPointProps[] = [];
  let value = stock.price * (0.92 + rand() * 0.06);

  for (let i = 0; i < count - 1; i++) {
    const bias = (rand() - 0.5) * volatility + drift / count;
    value += bias;
    value = Math.max(stock.low52w * 0.98, Math.min(stock.high52w * 1.02, value));
    points.push({value: parseFloat(value.toFixed(2))});
  }
  points.push({value: stock.price});

  return points;
};

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem = ({label, value}: StatItemProps) => (
  <View className="flex-1 gap-1">
    <Text className="text-neutral-500 text-xs">{label}</Text>
    <Text className="text-white text-sm font-medium">{value}</Text>
  </View>
);

const StockDetailScreen = () => {
  const {symbol} = useLocalSearchParams<{symbol: string}>();
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1M');
  const [isWatched, setIsWatched] = useState(false);

  const stock = stocks.find((s) => s.symbol === symbol);

  const chartData = useMemo(
    () => (stock ? buildChartData(stock, activeTimeframe) : []),
    [stock, activeTimeframe],
  );

  // Only AAPL has real historical data backing it
  const historicalSlice = useMemo(
    () => (stock?.symbol === 'AAPL' ? getHistoricalSlice(activeTimeframe) : null),
    [stock?.symbol, activeTimeframe],
  );

  const relatedNews = useMemo(
    () => (stock ? news.filter((n) => n.symbols.includes(stock.symbol)).slice(0, 3) : []),
    [stock],
  );

  if (!stock) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-white text-base">Stock not found</Text>
      </View>
    );
  }

  const isPositive = stock.changePercent >= 0;
  const lineColor = isPositive ? '#4ade80' : '#f87171';
  const startFillColor = isPositive ? 'rgba(74, 222, 128, 0.35)' : 'rgba(248, 113, 113, 0.35)';
  const endFillColor = isPositive ? 'rgba(74, 222, 128, 0)' : 'rgba(248, 113, 113, 0)';

  const values = chartData.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.12 || 1;

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
          >
            <IconArrowLeft size={20} color="white"/>
          </Pressable>

          <View className="flex-row items-center gap-2">
            <Image
              source={{uri: stock.logo}}
              style={{width: 24, height: 24, borderRadius: 6}}
            />
            <Text className="text-white text-base font-semibold">{stock.symbol}</Text>
          </View>

          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setIsWatched((prev) => !prev)}
              className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
            >
              <IconStar
                size={20}
                color={isWatched ? '#fbbf24' : 'white'}
                fill={isWatched ? '#fbbf24' : 'transparent'}
              />
            </Pressable>

            <Pressable
              className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
            >
              <IconShare3 size={20} color="white"/>
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Stock Info */}
          <View className="px-5 gap-2">
            <View className="flex-row items-center gap-3">
              <Image
                source={{uri: stock.logo}}
                style={{width: 40, height: 40, borderRadius: 10}}
              />

              <View className="flex-1">
                <Text className="text-neutral-200 text-base font-medium" numberOfLines={1}>
                  {stock.name}
                </Text>
                <Text className="text-neutral-500 text-xs">
                  {stock.exchange} · {stock.sector}
                </Text>
              </View>
            </View>

            <Text className="text-white text-4xl font-semibold mt-3">
              ${formatCurrency(stock.price)}
            </Text>

            <View className="flex-row items-center gap-2">
              {isPositive
                ? <IconTrendingUp3 color="#4ade80" size={18}/>
                : <IconTrendingDown3 color="#f87171" size={18}/>
              }
              <Text
                className={`text-base font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
              >
                {isPositive ? '+' : ''}${formatCurrency(Math.abs(stock.change))} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </Text>
              <Text className="text-neutral-500 text-sm">Today</Text>
            </View>
          </View>

          {/* Chart */}
          <View className="mt-6">
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
                pointerLabelHeight: 40,
                pointerLabelComponent: (items: ChartPointProps[]) => (
                  <View className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5">
                    <Text className="text-white text-xs font-semibold">
                      ${formatCurrency(items[0].value)}
                    </Text>
                    {items[0].date && (
                      <Text className="text-neutral-400 text-[10px]">
                        {items[0].date}
                      </Text>
                    )}
                  </View>
                ),
              }}
            />
          </View>

          {/* Timeframe Tabs */}
          <View className="flex-row gap-2 mt-4 px-5">
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

          {/* Historical session — only shown for symbols with real historical data */}
          {historicalSlice && historicalSlice.length > 0 && (
            <>
              {/* OHLC summary card (latest session) */}
              <View className="mt-8 gap-4 px-5">
                <View className="flex-row items-center gap-2">
                  <IconActivity size={18} color="#4ade80"/>
                  <Text className="text-white text-lg font-medium">Latest Session</Text>
                  <Text className="text-neutral-500 text-xs ml-auto">
                    {historicalSlice[historicalSlice.length - 1].date}
                  </Text>
                </View>

                <View className="bg-surface-light rounded-2xl p-4 flex-row">
                  <StatItem
                    label="Open"
                    value={`$${formatCurrency(historicalSlice[historicalSlice.length - 1].open)}`}
                  />
                  <StatItem
                    label="High"
                    value={`$${formatCurrency(historicalSlice[historicalSlice.length - 1].high)}`}
                  />
                  <StatItem
                    label="Low"
                    value={`$${formatCurrency(historicalSlice[historicalSlice.length - 1].low)}`}
                  />
                  <StatItem
                    label="Close"
                    value={`$${formatCurrency(historicalSlice[historicalSlice.length - 1].close)}`}
                  />
                </View>
              </View>

              {/* Volume bar chart */}
              <View className="mt-8 gap-4 px-5">
                <View className="flex-row items-baseline justify-between">
                  <Text className="text-white text-lg font-medium">Volume</Text>
                  <Text className="text-neutral-500 text-xs">
                    {historicalSlice.length} sessions
                  </Text>
                </View>

                <View className="bg-surface-light rounded-2xl p-4">
                  <BarChart
                    data={historicalSlice.map((p, i) => ({
                      value: p.volume / 1_000_000,
                      frontColor:
                        i === historicalSlice.length - 1
                          ? '#4ade80'
                          : p.close >= p.open
                            ? 'rgba(74, 222, 128, 0.45)'
                            : 'rgba(248, 113, 113, 0.45)',
                    }))}
                    width={CHART_WIDTH - 16}
                    height={110}
                    barWidth={Math.max(6, (CHART_WIDTH - 16) / historicalSlice.length - 6)}
                    spacing={4}
                    initialSpacing={0}
                    hideRules
                    hideYAxisText
                    xAxisColor="transparent"
                    yAxisColor="transparent"
                    barBorderRadius={2}
                    disableScroll
                  />
                  <Text className="text-neutral-500 text-[10px] mt-2">
                    Volume in millions · green bars = up days
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Key Stats */}
          <View className="mt-8 gap-4 px-5">
            <Text className="text-white text-lg font-medium">Key Stats</Text>

            <View className="bg-surface-light rounded-2xl p-4 gap-4">
              <View className="flex-row">
                <StatItem
                  label="Open"
                  value={`$${formatCurrency(historicalSlice ? historicalSlice[historicalSlice.length - 1].open : stock.price - stock.change)}`}
                />
                <StatItem label="Volume" value={stock.volume}/>
                <StatItem label="Mkt Cap" value={stock.marketCap}/>
              </View>

              <View className="h-px bg-neutral-800"/>

              <View className="flex-row">
                <StatItem label="52W High" value={`$${formatCurrency(stock.high52w)}`}/>
                <StatItem label="52W Low" value={`$${formatCurrency(stock.low52w)}`}/>
                <StatItem label="P/E" value={stock.pe ? stock.pe.toFixed(2) : '—'}/>
              </View>

              <View className="h-px bg-neutral-800"/>

              <View className="flex-row">
                <StatItem label="EPS" value={stock.eps ? `$${stock.eps.toFixed(2)}` : '—'}/>
                <StatItem label="Dividend" value={stock.dividend ? `$${stock.dividend.toFixed(2)}` : '—'}/>
                <StatItem label="Exchange" value={stock.exchange}/>
              </View>
            </View>
          </View>

          {/* About */}
          <View className="mt-8 gap-4 px-5">
            <Text className="text-white text-lg font-medium">About</Text>

            <View className="bg-surface-light rounded-2xl p-4">
              <Text className="text-neutral-300 text-sm leading-5">
                {stock.about}
              </Text>
            </View>
          </View>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <View className="mt-8 gap-4 px-5 mb-32">
              <Text className="text-white text-lg font-medium">Related News</Text>

              <View className="gap-3">
                {relatedNews.map((item) => (
                  <Pressable
                    key={item.id}
                    className="flex-row items-center bg-surface-light rounded-2xl p-3 gap-3"
                  >
                    <Image
                      source={{uri: item.imageUrl}}
                      style={{width: 72, height: 72, borderRadius: 14}}
                    />

                    <View className="flex-1 gap-1.5">
                      <Text className="text-neutral-400 text-xs">
                        {item.source}
                      </Text>

                      <Text className="text-neutral-100 text-sm font-medium" numberOfLines={2}>
                        {item.title}
                      </Text>

                      <Text className="text-neutral-500 text-xs">
                        {item.date}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {relatedNews.length === 0 && <View className="mb-32"/>}
        </ScrollView>

        {/* Buy / Sell Actions */}
        <View className="absolute bottom-6 left-4 right-4 flex-row gap-3">
          <Pressable className="flex-1 bg-red-400/10 border border-red-400/30 rounded-2xl py-4 items-center">
            <Text className="text-red-400 text-base font-semibold">Sell</Text>
          </Pressable>

          <Pressable className="flex-1 bg-green-400 rounded-2xl py-4 items-center">
            <Text className="text-black text-base font-semibold">Buy</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default StockDetailScreen;
