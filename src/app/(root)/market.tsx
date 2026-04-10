import {useMemo, useState} from 'react';
import {View, Text, ScrollView, Pressable, Dimensions} from 'react-native';
import {router} from 'expo-router';
import {
  IconSearch,
  IconTrendingUp3,
  IconTrendingDown3,
  IconFlame,
  IconChartBar,
} from '@tabler/icons-react-native';
import {Image} from 'expo-image';
import {LineChart, BarChart} from 'react-native-gifted-charts';

import {
  marketIndices,
  stocks,
  sectors,
  topGainers,
  topLosers,
  mostActive,
  news,
} from '@/data';
import {formatCurrency} from '@/utils';
import type {StockProps, MarketIndexProps, SectorProps} from '@/interfaces';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HERO_CHART_WIDTH = SCREEN_WIDTH - 72;
const HERO_CHART_HEIGHT = 160;

// -----------------------------------------------------------------------------
// Seeded PRNG — keeps generated charts stable across renders for a given seed
// -----------------------------------------------------------------------------

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
 * Builds a trend-aware synthetic sparkline. The final value is biased by
 * `changePercent` so gainers end higher than they started, and losers end
 * lower — without that the sparkline would just look like noise.
 */
const buildTrendSeries = (
  seed: string,
  changePercent: number,
  count: number,
  baseValue = 100,
): ChartPointProps[] => {
  const rand = mulberry32(seedFromString(seed));
  const drift = (changePercent / 100) * baseValue * 0.18;
  const volatility = baseValue * 0.012;

  const points: ChartPointProps[] = [];
  let value = baseValue - drift * (0.5 + rand() * 0.4);

  for (let i = 0; i < count - 1; i++) {
    const jitter = (rand() - 0.5) * volatility * 2;
    value += jitter + drift / count;
    points.push({value: parseFloat(value.toFixed(2))});
  }
  points.push({value: parseFloat((baseValue + (rand() - 0.5) * volatility).toFixed(2))});

  return points;
};

// -----------------------------------------------------------------------------
// Types + constants
// -----------------------------------------------------------------------------

type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y';

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
];

const TIMEFRAME_POINTS: Record<Timeframe, number> = {
  '1D': 24,
  '1W': 28,
  '1M': 32,
  '3M': 45,
  '1Y': 52,
};

type MoverTab = 'gainers' | 'losers' | 'active';

interface MoverTabOptionProps {
  id: MoverTab;
  label: string;
}

const MOVER_TABS: MoverTabOptionProps[] = [
  {id: 'gainers', label: 'Gainers'},
  {id: 'losers', label: 'Losers'},
  {id: 'active', label: 'Most Active'},
];

// -----------------------------------------------------------------------------
// Hero index chart
// -----------------------------------------------------------------------------

interface HeroChartProps {
  index: MarketIndexProps;
  timeframe: Timeframe;
}

const HeroChart = ({index, timeframe}: HeroChartProps) => {
  const data = useMemo(
    () =>
      buildTrendSeries(
        `${index.symbol}-${timeframe}`,
        index.changePercent,
        TIMEFRAME_POINTS[timeframe],
        index.value,
      ),
    [index, timeframe],
  );

  const isPositive = index.changePercent >= 0;
  const lineColor = isPositive ? '#4ade80' : '#f87171';
  const fillStart = isPositive ? 'rgba(74, 222, 128, 0.35)' : 'rgba(248, 113, 113, 0.35)';
  const fillEnd = isPositive ? 'rgba(74, 222, 128, 0)' : 'rgba(248, 113, 113, 0)';

  const values = data.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.15 || 1;

  return (
    <LineChart
      data={data}
      width={HERO_CHART_WIDTH}
      height={HERO_CHART_HEIGHT}
      initialSpacing={0}
      endSpacing={0}
      spacing={HERO_CHART_WIDTH / (data.length - 1)}
      thickness={2.5}
      color={lineColor}
      curved
      areaChart
      startFillColor={fillStart}
      endFillColor={fillEnd}
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
        pointerStripHeight: HERO_CHART_HEIGHT,
        pointerStripColor: 'rgba(255,255,255,0.15)',
        pointerStripWidth: 1,
        pointerColor: lineColor,
        radius: 5,
        activatePointersOnLongPress: false,
        autoAdjustPointerLabelPosition: true,
        pointerLabelWidth: 90,
        pointerLabelHeight: 30,
        pointerLabelComponent: (items: ChartPointProps[]) => (
          <View className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1">
            <Text className="text-white text-xs font-semibold">
              {formatCurrency(items[0].value)}
            </Text>
          </View>
        ),
      }}
    />
  );
};

// -----------------------------------------------------------------------------
// Mini sparkline (used in index cards + mover rows)
// -----------------------------------------------------------------------------

interface SparklineProps {
  seed: string;
  changePercent: number;
  width?: number;
  height?: number;
  points?: number;
}

const Sparkline = ({
  seed,
  changePercent,
  width = 70,
  height = 34,
  points = 18,
}: SparklineProps) => {
  const data = useMemo(
    () => buildTrendSeries(seed, changePercent, points),
    [seed, changePercent, points],
  );

  const isPositive = changePercent >= 0;
  const lineColor = isPositive ? '#4ade80' : '#f87171';
  const fillStart = isPositive ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)';
  const fillEnd = isPositive ? 'rgba(74, 222, 128, 0)' : 'rgba(248, 113, 113, 0)';

  const values = data.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.2 || 1;

  return (
    <LineChart
      data={data}
      width={width}
      height={height}
      initialSpacing={0}
      endSpacing={0}
      spacing={width / (data.length - 1)}
      thickness={1.5}
      color={lineColor}
      curved
      areaChart
      startFillColor={fillStart}
      endFillColor={fillEnd}
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
      disableScroll
    />
  );
};

// -----------------------------------------------------------------------------
// Sector bar chart mini
// -----------------------------------------------------------------------------

interface SectorBarsProps {
  sector: SectorProps;
}

const SectorBars = ({sector}: SectorBarsProps) => {
  const data = useMemo(() => {
    const rand = mulberry32(seedFromString(sector.name));
    const isPositive = sector.change >= 0;
    return Array.from({length: 10}, (_, i) => {
      const base = 8 + rand() * 10 + (isPositive ? i * 0.6 : (10 - i) * 0.6);
      return {
        value: parseFloat(base.toFixed(2)),
        frontColor: isPositive
          ? 'rgba(74, 222, 128, 0.5)'
          : 'rgba(248, 113, 113, 0.5)',
      };
    });
  }, [sector]);

  return (
    <BarChart
      data={data}
      width={120}
      height={32}
      barWidth={6}
      spacing={4}
      initialSpacing={0}
      hideRules
      hideYAxisText
      xAxisColor="transparent"
      yAxisColor="transparent"
      barBorderRadius={1.5}
      disableScroll
    />
  );
};

// -----------------------------------------------------------------------------
// Market screen
// -----------------------------------------------------------------------------

const MarketScreen = () => {
  const [activeTab, setActiveTab] = useState<MoverTab>('gainers');
  const [heroIndexSymbol, setHeroIndexSymbol] = useState(marketIndices[0].symbol);
  const [heroTimeframe, setHeroTimeframe] = useState<Timeframe>('1M');

  const heroIndex =
    marketIndices.find((i) => i.symbol === heroIndexSymbol) ?? marketIndices[0];

  const moverList: StockProps[] =
    activeTab === 'gainers'
      ? topGainers
      : activeTab === 'losers'
        ? topLosers
        : mostActive;

  const isHeroPositive = heroIndex.changePercent >= 0;

  return (
    <ScrollView className="flex-1 px-4 bg-surface" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between pt-2 pb-6">
        <View>
          <Text className="text-neutral-300">Explore</Text>
          <Text className="text-white text-2xl font-bold">Market</Text>
        </View>

        <Pressable
          onPress={() => router.push('/(root)/search')}
          className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800">
          <IconSearch size={20} color="white"/>
        </Pressable>
      </View>

      {/* Hero Index Chart */}
      <View className="bg-surface-light rounded-3xl p-5 gap-4 border border-neutral-800">
        {/* Index tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {marketIndices.map((idx) => {
            const active = idx.symbol === heroIndexSymbol;
            return (
              <Pressable
                key={idx.symbol}
                onPress={() => setHeroIndexSymbol(idx.symbol)}
                className={`px-3 py-1.5 rounded-full border ${active ? 'bg-white border-white' : 'bg-neutral-900 border-neutral-800'}`}
              >
                <Text
                  className={`text-xs font-semibold ${active ? 'text-black' : 'text-neutral-300'}`}
                >
                  {idx.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Price */}
        <View className="gap-1">
          <Text className="text-neutral-400 text-xs">{heroIndex.symbol}</Text>
          <Text className="text-white text-3xl font-semibold tracking-tight">
            {formatCurrency(heroIndex.value)}
          </Text>

          <View className="flex-row items-center gap-2">
            {isHeroPositive
              ? <IconTrendingUp3 size={14} color="#4ade80"/>
              : <IconTrendingDown3 size={14} color="#f87171"/>
            }
            <Text
              className={`text-sm font-medium ${isHeroPositive ? 'text-green-400' : 'text-red-400'}`}
            >
              {isHeroPositive ? '+' : ''}{heroIndex.change.toFixed(2)}
              {' '}
              ({isHeroPositive ? '+' : ''}{heroIndex.changePercent.toFixed(2)}%)
            </Text>
            <Text className="text-neutral-500 text-xs">· {heroTimeframe}</Text>
          </View>
        </View>

        {/* Chart */}
        <View className="-ml-2">
          <HeroChart index={heroIndex} timeframe={heroTimeframe}/>
        </View>

        {/* Timeframe tabs */}
        <View className="flex-row gap-2">
          {TIMEFRAMES.map((tf) => {
            const active = tf.id === heroTimeframe;
            return (
              <Pressable
                key={tf.id}
                onPress={() => setHeroTimeframe(tf.id)}
                className={`flex-1 items-center py-2 rounded-full border ${active ? 'bg-white border-white' : 'bg-neutral-900 border-neutral-800'}`}
              >
                <Text
                  className={`text-xs font-medium ${active ? 'text-black' : 'text-neutral-300'}`}
                >
                  {tf.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Market Indices */}
      <View className="mt-8 gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-lg font-medium">Indices</Text>

          <Pressable>
            <Text className="text-neutral-500 text-sm">Show All</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3"
        >
          {marketIndices.map((index) => {
            const isPositive = index.changePercent >= 0;

            return (
              <Pressable
                key={index.symbol}
                onPress={() => setHeroIndexSymbol(index.symbol)}
                className="bg-surface-light rounded-2xl p-4 gap-3"
                style={{width: 170}}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-neutral-300 text-xs font-medium">
                    {index.name}
                  </Text>

                  {isPositive
                    ? <IconTrendingUp3 color="#4ade80" size={16}/>
                    : <IconTrendingDown3 color="#f87171" size={16}/>
                  }
                </View>

                {/* Mini chart */}
                <View className="-ml-1">
                  <Sparkline
                    seed={`idx-${index.symbol}`}
                    changePercent={index.changePercent}
                    width={140}
                    height={40}
                    points={20}
                  />
                </View>

                <View className="gap-0.5">
                  <Text className="text-white text-base font-semibold">
                    {formatCurrency(index.value)}
                  </Text>

                  <Text
                    className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Top Movers */}
      <View className="mt-8 gap-4">
        <View className="flex-row items-center justify-between px-5">
          <View className="flex-row items-center gap-2">
            <IconFlame size={18} color="#fbbf24"/>
            <Text className="text-white text-lg font-medium">Top Movers</Text>
          </View>

          <Pressable>
            <Text className="text-neutral-500 text-sm">Show All</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2">
          {MOVER_TABS.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full border ${isActive ? 'bg-white border-white' : 'bg-surface-light border-neutral-800'}`}
              >
                <Text
                  className={`text-sm font-medium ${isActive ? 'text-black' : 'text-neutral-300'}`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="gap-3">
          {moverList.map((stock) => {
            const isPositive = stock.changePercent >= 0;

            return (
              <Pressable
                key={stock.symbol}
                onPress={() => router.push(`/stock/${stock.symbol}`)}
                className="flex-row items-center px-4 py-4 bg-surface-light rounded-2xl"
              >
                <Image
                  source={{uri: stock.logo}}
                  style={{width: 36, height: 36, borderRadius: 50}}
                />

                <View className="ml-3 flex-1">
                  <Text className="text-neutral-200 text-base font-medium">
                    {stock.symbol}
                  </Text>

                  <Text className="text-neutral-500 text-xs" numberOfLines={1}>
                    {stock.name}
                  </Text>
                </View>

                <View className="mx-4">
                  <Sparkline
                    seed={`mover-${stock.symbol}`}
                    changePercent={stock.changePercent}
                    width={64}
                    height={30}
                    points={16}
                  />
                </View>

                <View className="items-end">
                  <Text className="text-white font-medium">
                    ${formatCurrency(stock.price)}
                  </Text>

                  <View className="flex-row items-center gap-1.5">
                    {isPositive
                      ? <IconTrendingUp3 color="#4ade80" size={14}/>
                      : <IconTrendingDown3 color="#f87171" size={14}/>
                    }

                    <Text
                      className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {Math.abs(stock.changePercent).toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Sectors */}
      <View className="mt-8 gap-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <IconChartBar size={18} color="#a3a3a3"/>
            <Text className="text-white text-lg font-medium">Sectors</Text>
          </View>

          <Pressable>
            <Text className="text-neutral-500 text-sm">Show All</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {sectors.slice(0, 6).map((sector) => {
            const isPositive = sector.change >= 0;

            return (
              <Pressable
                key={sector.name}
                className="bg-surface-light rounded-2xl p-4 gap-3"
                style={{width: '47.5%'}}
              >
                <View className="flex-row items-start justify-between">
                  <Text className="text-neutral-200 text-sm font-medium flex-1" numberOfLines={1}>
                    {sector.name}
                  </Text>
                </View>

                {/* Bars */}
                <View className="-ml-1">
                  <SectorBars sector={sector}/>
                </View>

                <View className="flex-row items-end justify-between">
                  <Text className="text-white text-base font-semibold">
                    {sector.marketCap}
                  </Text>

                  <View className="flex-row items-center gap-1">
                    {isPositive
                      ? <IconTrendingUp3 color="#4ade80" size={12}/>
                      : <IconTrendingDown3 color="#f87171" size={12}/>
                    }
                    <Text
                      className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {isPositive ? '+' : ''}{sector.change.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* News */}
      <View className="mt-8 gap-4 mb-32">
        <View className="flex-row items-center justify-between px-5">
          <Text className="text-white text-lg font-medium">Latest News</Text>

          <Pressable>
            <Text className="text-neutral-500 text-sm">Show All</Text>
          </Pressable>
        </View>

        <View className="gap-3">
          {news.slice(0, 4).map((item) => {
            const relatedStock = stocks.find((s) => s.symbol === item.symbols[0]);

            return (
              <Pressable
                key={item.id}
                className="flex-row items-center bg-surface-light rounded-2xl p-3 gap-3"
              >
                <Image
                  source={{uri: item.imageUrl}}
                  style={{width: 72, height: 72, borderRadius: 14}}
                />

                <View className="flex-1 gap-1.5">
                  <View className="flex-row items-center gap-2">
                    {relatedStock && (
                      <Image
                        source={{uri: relatedStock.logo}}
                        style={{width: 14, height: 14, borderRadius: 3}}
                      />
                    )}
                    <Text className="text-neutral-400 text-xs">
                      {item.source}
                    </Text>
                  </View>

                  <Text className="text-neutral-100 text-sm font-medium" numberOfLines={2}>
                    {item.title}
                  </Text>

                  <Text className="text-neutral-500 text-xs">
                    {item.date}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default MarketScreen;
