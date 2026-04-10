import {useEffect, useRef, useState} from 'react';
import type {FC} from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {Canvas, Circle, Blur, Fill} from '@shopify/react-native-skia';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {
  Polyline,
  Line,
  Circle as SvgCircle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Path as SvgPath,
  Rect,
} from 'react-native-svg';
import {
  IconArrowLeft,
  IconSearch,
  IconHeartFilled,
  IconTrendingUp3,
  IconTrendingDown3,
  IconChevronRight,
  IconBell,
  IconWallet,
  IconFlame,
  IconArrowUpRight,
} from '@tabler/icons-react-native';

import {navigate} from '@/constants';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH * 0.78;

const AAPL_CHART_POINTS = [
  18, 22, 19, 25, 14, 28, 16, 24, 12, 20,
  17, 26, 15, 23, 18, 21, 13, 27, 16, 25,
  19, 29, 15, 24, 18, 22, 14, 26, 17, 21,
  15, 23, 19, 27, 14, 25, 18, 22, 16, 24,
];

const PORTFOLIO_CHART_POINTS = [
  38, 35, 37, 32, 34, 30, 31, 28, 29, 25,
  27, 23, 24, 21, 22, 19, 20, 16, 17, 14,
  15, 12, 13, 11, 12, 9, 10, 8, 9, 7,
  8, 6, 7, 5, 6, 4, 5, 3, 4, 2,
];

const CHART_VIEW_W = 260;
const CHART_VIEW_H = 90;

const buildChartPointsString = (values: number[], width: number) =>
  values
    .map((y, x) => `${(x / (values.length - 1)) * width},${y + 5}`)
    .join(' ');

const generateSparklinePoints = (rising: boolean): string => {
  const points: number[] = [];
  let value = 10 + Math.random() * 6;
  for (let i = 0; i < 20; i++) {
    value += (Math.random() - (rising ? 0.3 : 0.7)) * 3;
    value = Math.max(3, Math.min(18, value));
    points.push(value);
  }
  return points.map((y, x) => `${(x / 19) * 70},${y}`).join(' ');
};

const BackgroundEffect = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{flex: 1}}>
        <Fill color="#0a0a0a"/>
        <Circle cx={SCREEN_WIDTH * 0.5} cy={SCREEN_HEIGHT * 0.35} r={180} color="#4ade80">
          <Blur blur={100}/>
        </Circle>
        {/*<Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.15} r={90} color="#22c55e">*/}
        {/*  <Blur blur={50}/>*/}
        {/*</Circle>*/}
      </Canvas>
    </View>
  );
};

// -----------------------------------------------------------------------------
// Preview Card 1 — Stock chart
// -----------------------------------------------------------------------------

const StockChartPreview = () => {
  const chartPoints = buildChartPointsString(AAPL_CHART_POINTS, CHART_VIEW_W);
  const dowSparkline = generateSparklinePoints(true);
  const aaplSparkline = generateSparklinePoints(true);

  return (
    <View className="items-center justify-center" style={{width: SCREEN_WIDTH}}>
      <View className="items-center">
        <View
          className="bg-surface-light rounded-[28px] border border-neutral-800 overflow-hidden"
          style={{width: CARD_WIDTH, ...styles.phoneCard}}
        >
          {/* Mock status bar */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
            <Text className="text-white text-xs font-semibold">9:41</Text>
            <View className="flex-row gap-1">
              <View className="w-1 h-1 rounded-full bg-white"/>
              <View className="w-1 h-1 rounded-full bg-white"/>
              <View className="w-1 h-1 rounded-full bg-white"/>
            </View>
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-2">
            <View className="flex-row items-center gap-2">
              <View className="w-6 h-6 rounded-full bg-neutral-800 items-center justify-center">
                <IconArrowLeft size={12} color="white"/>
              </View>

              <View>
                <Text className="text-white text-sm font-semibold">AAPL</Text>
                <Text className="text-neutral-500 text-[10px]">Apple Inc.</Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <View className="w-6 h-6 rounded-full bg-neutral-800 items-center justify-center">
                <IconSearch size={12} color="white"/>
              </View>

              <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center">
                <IconHeartFilled size={12} color="white"/>
              </View>
            </View>
          </View>

          {/* Price + stats */}
          <View className="flex-row items-start justify-between px-5 mt-3">
            <View>
              <Text className="text-white text-2xl font-bold">$34,875.77</Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <IconTrendingUp3 size={12} color="#4ade80"/>
                <Text className="text-green-400 text-[11px] font-semibold">
                  +237.13 (3.84%)
                </Text>
              </View>
            </View>

            <View className="items-end gap-0.5">
              <View className="flex-row items-center gap-1">
                <Text className="text-neutral-500 text-[10px]">H/L</Text>
                <Text className="text-white text-[10px]">218.84-211.75</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-neutral-500 text-[10px]">Volume</Text>
                <Text className="text-white text-[10px]">94.84M</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-neutral-500 text-[10px]">MKT Cap</Text>
                <Text className="text-white text-[10px]">3.25T</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row items-center gap-4 px-5 mt-4">
            <Text className="text-white text-xs font-semibold">Chart</Text>
            <Text className="text-neutral-500 text-xs">Options</Text>
            <Text className="text-neutral-500 text-xs">News</Text>
            <Text className="text-neutral-500 text-xs">Feeds</Text>
          </View>

          <View className="h-px bg-neutral-800 mx-5 mt-2"/>

          {/* VWAP label */}
          <View className="flex-row items-center gap-1 px-5 mt-3">
            <Text className="text-neutral-400 text-[10px]">VWAP</Text>
            <Text className="text-yellow-400 text-[10px] font-semibold">27.08</Text>
          </View>

          {/* Chart */}
          <View className="px-3 mt-1 mb-5">
            <Svg width={CHART_VIEW_W} height={CHART_VIEW_H} viewBox={`0 0 ${CHART_VIEW_W} ${CHART_VIEW_H}`}>
              <Defs>
                <SvgLinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#4ade80" stopOpacity={0.25}/>
                  <Stop offset="1" stopColor="#4ade80" stopOpacity={0}/>
                </SvgLinearGradient>
              </Defs>

              <Line
                x1={CHART_VIEW_W * 0.45}
                y1={0}
                x2={CHART_VIEW_W * 0.45}
                y2={CHART_VIEW_H}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={0.6}
                strokeDasharray="2,3"
              />
              <Line
                x1={0}
                y1={CHART_VIEW_H * 0.5}
                x2={CHART_VIEW_W}
                y2={CHART_VIEW_H * 0.5}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={0.6}
                strokeDasharray="2,3"
              />

              <SvgPath
                d={`M 0,${AAPL_CHART_POINTS[0] + 5} ${chartPoints.split(' ').slice(1).map(p => `L ${p}`).join(' ')} L ${CHART_VIEW_W},${CHART_VIEW_H} L 0,${CHART_VIEW_H} Z`}
                fill="url(#chartFill)"
              />

              <Polyline
                points={chartPoints}
                fill="none"
                stroke="#4ade80"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <SvgCircle cx={CHART_VIEW_W * 0.45} cy={CHART_VIEW_H * 0.5} r={3} fill="#4ade80"/>
            </Svg>
          </View>
        </View>

        {/* Floating Dow Jones tooltip */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2"
          style={{top: 180, right: -10, ...styles.floatingCard}}
        >
          <View className="flex-row items-center gap-2">
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-[10px] font-bold">D</Text>
            </View>
            <Text className="text-white text-xs font-semibold">Dow Jones</Text>
          </View>
          <View className="flex-row items-center gap-2 mt-1.5">
            <View>
              <Text className="text-white text-sm font-bold">$5,987.58</Text>
              <View className="flex-row items-center gap-1">
                <IconTrendingUp3 size={10} color="#4ade80"/>
                <Text className="text-green-400 text-[10px] font-semibold">8.78%</Text>
              </View>
            </View>

            <Svg width={40} height={22}>
              <Polyline
                points={dowSparkline}
                fill="none"
                stroke="#4ade80"
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            </Svg>
          </View>
        </View>

        {/* Floating AAPL tooltip */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2 flex-row items-center gap-2"
          style={{bottom: 70, left: -15, ...styles.floatingCard}}
        >
          <View className="w-6 h-6 rounded-full bg-neutral-800 items-center justify-center">
            <Text className="text-white text-[9px] font-bold"></Text>
          </View>

          <View>
            <Text className="text-white text-[11px] font-semibold">AAPL</Text>
            <Text className="text-neutral-500 text-[9px]">Apple Inc.</Text>
          </View>

          <Svg width={36} height={20}>
            <Polyline
              points={aaplSparkline}
              fill="none"
              stroke="#4ade80"
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          </Svg>

          <View className="items-end">
            <Text className="text-white text-[11px] font-semibold">$132.843</Text>
            <Text className="text-green-400 text-[9px] font-semibold">8.78%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// -----------------------------------------------------------------------------
// Preview Card 2 — Portfolio
// -----------------------------------------------------------------------------

const PORTFOLIO_HOLDINGS = [
  {symbol: 'AAPL', name: 'Apple Inc.', price: '$4,468.00', pnl: '+14.32%', up: true, color: '#fbbf24'},
  {symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$7,026.88', pnl: '+82.99%', up: true, color: '#4ade80'},
  {symbol: 'TSLA', name: 'Tesla Inc.', price: '$1,401.76', pnl: '-16.72%', up: false, color: '#ef4444'},
];

const PortfolioPreview = () => {
  const chartPoints = buildChartPointsString(PORTFOLIO_CHART_POINTS, CHART_VIEW_W);

  return (
    <View className="items-center justify-center" style={{width: SCREEN_WIDTH}}>
      <View className="items-center">
        <View
          className="bg-surface-light rounded-[28px] border border-neutral-800 overflow-hidden"
          style={{width: CARD_WIDTH, ...styles.phoneCard}}
        >
          {/* Mock status bar */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
            <Text className="text-white text-xs font-semibold">9:41</Text>
            <View className="flex-row gap-1">
              <View className="w-1 h-1 rounded-full bg-white"/>
              <View className="w-1 h-1 rounded-full bg-white"/>
              <View className="w-1 h-1 rounded-full bg-white"/>
            </View>
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-2">
            <View>
              <Text className="text-neutral-500 text-[10px]">Overview</Text>
              <Text className="text-white text-base font-bold">Portfolio</Text>
            </View>

            <View className="w-7 h-7 rounded-xl bg-neutral-800 items-center justify-center">
              <IconBell size={13} color="white"/>
            </View>
          </View>

          {/* Total value */}
          <View className="items-center mt-5 gap-1">
            <View className="flex-row items-center gap-1.5">
              <IconWallet size={12} color="#a3a3a3"/>
              <Text className="text-neutral-400 text-[10px]">Total Value</Text>
            </View>
            <Text className="text-white text-2xl font-bold">$89,432.55</Text>
            <View className="flex-row items-center gap-1">
              <IconTrendingUp3 size={11} color="#4ade80"/>
              <Text className="text-green-400 text-[11px] font-semibold">
                +$1,248.90 (1.42%)
              </Text>
            </View>
          </View>

          {/* Chart */}
          <View className="px-3 mt-3">
            <Svg width={CHART_VIEW_W} height={70} viewBox={`0 0 ${CHART_VIEW_W} ${CHART_VIEW_H}`}>
              <Defs>
                <SvgLinearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#4ade80" stopOpacity={0.35}/>
                  <Stop offset="1" stopColor="#4ade80" stopOpacity={0}/>
                </SvgLinearGradient>
              </Defs>

              <SvgPath
                d={`M 0,${PORTFOLIO_CHART_POINTS[0] + 5} ${chartPoints.split(' ').slice(1).map(p => `L ${p}`).join(' ')} L ${CHART_VIEW_W},${CHART_VIEW_H} L 0,${CHART_VIEW_H} Z`}
                fill="url(#portfolioFill)"
              />

              <Polyline
                points={chartPoints}
                fill="none"
                stroke="#4ade80"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Holdings header */}
          <View className="flex-row items-center justify-between px-5 mt-2">
            <Text className="text-white text-[11px] font-semibold">Holdings</Text>
            <Text className="text-neutral-500 text-[9px]">Show All</Text>
          </View>

          {/* Holdings rows */}
          <View className="px-4 mt-2 gap-1.5 mb-5">
            {PORTFOLIO_HOLDINGS.map((h) => (
              <View
                key={h.symbol}
                className="flex-row items-center bg-neutral-900 rounded-xl px-2.5 py-2"
              >
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{backgroundColor: h.color + '33'}}
                >
                  <Text className="text-white text-[8px] font-bold">
                    {h.symbol.slice(0, 2)}
                  </Text>
                </View>

                <View className="ml-2 flex-1">
                  <Text className="text-white text-[10px] font-semibold">{h.symbol}</Text>
                  <Text className="text-neutral-500 text-[8px]">{h.name}</Text>
                </View>

                <View className="items-end">
                  <Text className="text-white text-[10px] font-semibold">{h.price}</Text>
                  <Text
                    className={`text-[8px] font-semibold ${h.up ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {h.pnl}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Floating P&L tooltip */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2"
          style={{top: 120, right: -12, ...styles.floatingCard}}
        >
          <Text className="text-neutral-400 text-[9px]">{"Today's P&L"}</Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <IconTrendingUp3 size={12} color="#4ade80"/>
            <Text className="text-green-400 text-sm font-bold">+$482.35</Text>
          </View>
        </View>

        {/* Floating badge */}
        <View
          className="absolute bg-green-400 rounded-full px-3 py-1.5 flex-row items-center gap-1"
          style={{bottom: 90, left: -8, ...styles.floatingCard}}
        >
          <IconArrowUpRight size={12} color="black"/>
          <Text className="text-black text-[10px] font-bold">Profit</Text>
        </View>
      </View>
    </View>
  );
};

// -----------------------------------------------------------------------------
// Preview Card 3 — Market Movers
// -----------------------------------------------------------------------------

const MOVERS = [
  {symbol: 'NVDA', name: 'NVIDIA', price: '$878.36', change: '+2.17%', up: true, color: '#4ade80'},
  {symbol: 'AMZN', name: 'Amazon', price: '$182.41', change: '+2.12%', up: true, color: '#fbbf24'},
  {symbol: 'NFLX', name: 'Netflix', price: '$628.34', change: '+2.04%', up: true, color: '#ef4444'},
  {symbol: 'TSLA', name: 'Tesla', price: '$175.22', change: '-3.51%', up: false, color: '#a855f7'},
];

const BARS = [12, 18, 10, 22, 15, 25, 19, 28, 21, 30, 23, 27];

const MoversPreview = () => {
  return (
    <View className="items-center justify-center" style={{width: SCREEN_WIDTH}}>
      <View className="items-center">
        <View
          className="bg-surface-light rounded-[28px] border border-neutral-800 overflow-hidden"
          style={{width: CARD_WIDTH, ...styles.phoneCard}}
        >
          {/* Mock status bar */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
            <Text className="text-white text-xs font-semibold">9:41</Text>
            <View className="flex-row gap-1">
              <View className="w-1 h-1 rounded-full bg-white"/>
              <View className="w-1 h-1 rounded-full bg-white"/>
              <View className="w-1 h-1 rounded-full bg-white"/>
            </View>
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-2">
            <View>
              <Text className="text-neutral-500 text-[10px]">Explore</Text>
              <Text className="text-white text-base font-bold">Market</Text>
            </View>

            <View className="w-7 h-7 rounded-xl bg-neutral-800 items-center justify-center">
              <IconSearch size={13} color="white"/>
            </View>
          </View>

          {/* Index strip */}
          <View className="flex-row gap-2 px-5 mt-3">
            <View className="bg-neutral-900 rounded-xl px-2.5 py-2 flex-1">
              <Text className="text-neutral-500 text-[8px]">S&P 500</Text>
              <Text className="text-white text-[11px] font-bold">5,248.62</Text>
              <Text className="text-green-400 text-[8px] font-semibold">+0.62%</Text>
            </View>

            <View className="bg-neutral-900 rounded-xl px-2.5 py-2 flex-1">
              <Text className="text-neutral-500 text-[8px]">NASDAQ</Text>
              <Text className="text-white text-[11px] font-bold">16,340.87</Text>
              <Text className="text-green-400 text-[8px] font-semibold">+0.48%</Text>
            </View>
          </View>

          {/* Volume bars */}
          <View className="px-5 mt-3">
            <View className="flex-row items-center gap-1 mb-1">
              <IconFlame size={10} color="#fbbf24"/>
              <Text className="text-white text-[10px] font-semibold">Top Movers</Text>
            </View>

            <Svg width={CARD_WIDTH - 40} height={26}>
              {BARS.map((h, i) => (
                <Rect
                  key={i}
                  x={i * 18}
                  y={28 - h}
                  width={10}
                  height={h}
                  rx={2}
                  fill={i === 7 ? '#4ade80' : 'rgba(74, 222, 128, 0.25)'}
                />
              ))}
            </Svg>
          </View>

          {/* Movers rows */}
          <View className="px-4 mt-2 gap-1.5 mb-5">
            {MOVERS.map((m) => (
              <View
                key={m.symbol}
                className="flex-row items-center bg-neutral-900 rounded-xl px-2.5 py-2"
              >
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{backgroundColor: m.color + '33'}}
                >
                  <Text className="text-white text-[8px] font-bold">
                    {m.symbol.slice(0, 2)}
                  </Text>
                </View>

                <View className="ml-2 flex-1">
                  <Text className="text-white text-[10px] font-semibold">{m.symbol}</Text>
                  <Text className="text-neutral-500 text-[8px]">{m.name}</Text>
                </View>

                <View className="items-end">
                  <Text className="text-white text-[10px] font-semibold">{m.price}</Text>
                  <View className="flex-row items-center gap-0.5">
                    {m.up
                      ? <IconTrendingUp3 size={8} color="#4ade80"/>
                      : <IconTrendingDown3 size={8} color="#f87171"/>
                    }
                    <Text
                      className={`text-[8px] font-semibold ${m.up ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {m.change}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Floating fire trending badge */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2"
          style={{top: 110, right: -10, ...styles.floatingCard}}
        >
          <View className="flex-row items-center gap-1.5">
            <View className="w-6 h-6 rounded-full bg-yellow-500/20 items-center justify-center">
              <IconFlame size={12} color="#fbbf24"/>
            </View>
            <View>
              <Text className="text-white text-[10px] font-bold">Trending</Text>
              <Text className="text-yellow-400 text-[9px]">NVDA +2.17%</Text>
            </View>
          </View>
        </View>

        {/* Floating sector badge */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2"
          style={{bottom: 80, left: -14, ...styles.floatingCard}}
        >
          <Text className="text-neutral-400 text-[9px]">Tech Sector</Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <IconTrendingUp3 size={10} color="#4ade80"/>
            <Text className="text-green-400 text-[11px] font-bold">+1.45%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// -----------------------------------------------------------------------------
// Slides
// -----------------------------------------------------------------------------

interface SlideProps {
  id: string;
  title: string;
  subtitle: string;
  Component: FC;
}

const SLIDES: SlideProps[] = [
  {
    id: 'market',
    title: 'Stay Ahead with Fast,\nReal-Time Market Data',
    subtitle: 'Access powerful tools for beginners and pros to trade smarter and faster.',
    Component: StockChartPreview,
  },
  {
    id: 'portfolio',
    title: 'Track Your Portfolio\nin One Glance',
    subtitle: 'Monitor holdings, P&L, and performance with beautiful visual breakdowns.',
    Component: PortfolioPreview,
  },
  {
    id: 'movers',
    title: 'Discover Top Movers &\nMarket Trends',
    subtitle: 'Spot hot sectors, trending stocks, and market insights the moment they happen.',
    Component: MoversPreview,
  },
];

// -----------------------------------------------------------------------------
// Welcome screen
// -----------------------------------------------------------------------------

const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const headerOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const actionsOpacity = useSharedValue(0);

  const headerTranslate = useSharedValue(-20);
  const cardTranslate = useSharedValue(40);
  const textTranslate = useSharedValue(20);
  const actionsTranslate = useSharedValue(30);

  useEffect(() => {
    const ease = {duration: 900, easing: Easing.out(Easing.exp)};

    headerOpacity.value = withDelay(100, withTiming(1, ease));
    headerTranslate.value = withDelay(100, withSpring(0, {damping: 20, stiffness: 90}));

    cardOpacity.value = withDelay(300, withTiming(1, ease));
    cardTranslate.value = withDelay(300, withSpring(0, {damping: 18, stiffness: 80}));

    textOpacity.value = withDelay(600, withTiming(1, ease));
    textTranslate.value = withDelay(600, withSpring(0, {damping: 20, stiffness: 90}));

    actionsOpacity.value = withDelay(800, withTiming(1, ease));
    actionsTranslate.value = withDelay(800, withSpring(0, {damping: 20, stiffness: 90}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{translateY: headerTranslate.value}],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{translateY: cardTranslate.value}],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{translateY: textTranslate.value}],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{translateY: actionsTranslate.value}],
  }));

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const activeSlide = SLIDES[activeIndex];
  const isLast = activeIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate('home');
      return;
    }
    scrollRef.current?.scrollTo({x: SCREEN_WIDTH * (activeIndex + 1), animated: true});
  };

  return (
    <View className="flex-1 bg-surface">
      <BackgroundEffect/>

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-between py-4">
          {/* Top bar */}
          <Animated.View
            style={headerStyle}
            className="flex-row items-center justify-between px-6"
          >
            <View className="flex-row items-center gap-2">
              <View className="w-9 h-9 rounded-xl bg-green-400/20 items-center justify-center border border-green-400/30">
                <IconTrendingUp3 size={20} color="#4ade80"/>
              </View>
              <Text className="text-white text-2xl font-bold tracking-tight">
                Quanti<Text className="text-green-400">X</Text>
              </Text>
            </View>

            <Pressable
              onPress={() => navigate('home')}
              className="flex-row items-center gap-1 bg-neutral-900/70 border border-neutral-800 rounded-full px-4 py-2"
            >
              <Text className="text-white text-sm font-medium">Skip</Text>
              <IconChevronRight size={14} color="white"/>
            </Pressable>
          </Animated.View>

          {/* Preview carousel */}
          <Animated.View style={cardStyle}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
            >
              {SLIDES.map((slide) => (
                <slide.Component key={slide.id}/>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Text */}
          <Animated.View style={textStyle} className="px-6 justify-center items-center gap-4">
            <Text className="text-white text-3xl text-center font-bold tracking-tight leading-10">
              {activeSlide.title}
            </Text>

            <Text className="text-neutral-400 text-sm leading-5 text-center">
              {activeSlide.subtitle}
            </Text>

            {/* Page dots */}
            <View className="flex-row items-center gap-2 mt-2 justify-center">
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  className={`h-2 rounded-full ${i === activeIndex ? 'w-6 bg-green-400' : 'w-2 bg-neutral-700'}`}
                />
              ))}
            </View>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={actionsStyle} className="px-6">
            <Pressable
              onPress={handleNext}
              className="bg-green-400 rounded-full h-16 items-center justify-center"
              style={styles.ctaShadow}
            >
              <Text className="text-black text-base font-bold tracking-wide">
                {isLast ? 'Get Started' : 'Next'}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneCard: {
    shadowColor: '#4ade80',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
  },
  floatingCard: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  ctaShadow: {
    shadowColor: '#4ade80',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
});

export default WelcomeScreen;
