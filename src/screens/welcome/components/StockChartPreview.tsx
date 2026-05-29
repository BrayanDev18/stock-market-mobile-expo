import {View, Text} from 'react-native';
import Svg, {Polyline, Line, Circle as SvgCircle} from 'react-native-svg';
import {LinearGradient} from 'expo-linear-gradient';
import {
  IconArrowLeft,
  IconSearch,
  IconHeartFilled,
  IconTrendingUp3,
} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';
import {formatCurrency} from '@/core/utils';

import {
  SCREEN_WIDTH,
  CARD_WIDTH,
  CHART_VIEW_W,
  CHART_VIEW_H,
  AAPL_CHART_POINTS,
  aapl,
  aaplSession,
  aaplVwap,
  dowIndex,
  buildChartPointsString,
  generateSparklinePoints,
  previewStyles,
} from '../constants';

export const StockChartPreview = () => {
  const chartPoints = buildChartPointsString(AAPL_CHART_POINTS, CHART_VIEW_W);
  const dowSparkline = generateSparklinePoints(true, 7);
  const aaplSparkline = generateSparklinePoints(true, 42);

  return (
    <View className="items-center justify-center" style={{width: SCREEN_WIDTH}}>
      <View className="items-center">
        <LinearGradient
          colors={['#1a1a1a', '#0f0f0f']}
          className="rounded-[28px] border border-neutral-800 overflow-hidden"
          style={{width: CARD_WIDTH, ...previewStyles.phoneCard}}
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
              <Text className="text-white text-2xl font-bold">${formatCurrency(aapl.price)}</Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <IconTrendingUp3 size={12} color={Colors.up}/>
                <Text className="text-green-400 text-[11px] font-semibold">
                  +{formatCurrency(aapl.change)} ({aapl.changePercent.toFixed(2)}%)
                </Text>
              </View>
            </View>

            <View className="items-end gap-0.5">
              <View className="flex-row items-center gap-1">
                <Text className="text-neutral-500 text-[10px]">H/L</Text>
                <Text className="text-white text-[10px]">{formatCurrency(aaplSession.high)}-{formatCurrency(aaplSession.low)}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-neutral-500 text-[10px]">Volume</Text>
                <Text className="text-white text-[10px]">{aapl.volume}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-neutral-500 text-[10px]">MKT Cap</Text>
                <Text className="text-white text-[10px]">{aapl.marketCap}</Text>
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
            <Text className="text-yellow-400 text-[10px] font-semibold">{formatCurrency(aaplVwap)}</Text>
          </View>

          {/* Chart */}
          <View className="px-3 mt-1 mb-5">
            <Svg width={CHART_VIEW_W} height={CHART_VIEW_H} viewBox={`0 0 ${CHART_VIEW_W} ${CHART_VIEW_H}`}>
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

              <Polyline
                points={chartPoints}
                fill="none"
                stroke={Colors.up}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <SvgCircle cx={CHART_VIEW_W * 0.45} cy={CHART_VIEW_H * 0.5} r={3} fill={Colors.up}/>
            </Svg>
          </View>
        </LinearGradient>

        {/* Floating Dow Jones tooltip */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2"
          style={{top: 180, right: -10, ...previewStyles.floatingCard}}
        >
          <View className="flex-row items-center gap-2">
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-[10px] font-bold">D</Text>
            </View>
            <Text className="text-white text-xs font-semibold">Dow Jones</Text>
          </View>
          <View className="flex-row items-center gap-2 mt-1.5">
            <View>
              <Text className="text-white text-sm font-bold">{formatCurrency(dowIndex.value)}</Text>
              <View className="flex-row items-center gap-1">
                <IconTrendingUp3 size={10} color={Colors.up}/>
                <Text className="text-green-400 text-[10px] font-semibold">+{dowIndex.changePercent.toFixed(2)}%</Text>
              </View>
            </View>

            <Svg width={40} height={22}>
              <Polyline
                points={dowSparkline}
                fill="none"
                stroke={Colors.up}
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            </Svg>
          </View>
        </View>

        {/* Floating AAPL tooltip */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2 flex-row items-center gap-2"
          style={{bottom: 70, left: -15, ...previewStyles.floatingCard}}
        >
          <View className="w-6 h-6 rounded-full bg-neutral-800 items-center justify-center">
            <Text className="text-white text-[9px] font-bold">AA</Text>
          </View>

          <View>
            <Text className="text-white text-[11px] font-semibold">AAPL</Text>
            <Text className="text-neutral-500 text-[9px]">Apple Inc.</Text>
          </View>

          <Svg width={36} height={20}>
            <Polyline
              points={aaplSparkline}
              fill="none"
              stroke={Colors.up}
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          </Svg>

          <View className="items-end">
            <Text className="text-white text-[11px] font-semibold">${formatCurrency(aapl.price)}</Text>
            <Text className="text-green-400 text-[9px] font-semibold">+{aapl.changePercent.toFixed(2)}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
