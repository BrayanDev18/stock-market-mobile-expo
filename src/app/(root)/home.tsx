import {View, Text, ScrollView, Pressable} from 'react-native';
import {router} from 'expo-router';
import {
  IconArrowsTransferDown, IconBell, IconCashMinus, IconCashPlus,
  IconScanTraces, IconTrendingDown3, IconTrendingUp3,
} from '@tabler/icons-react-native';
import {ScreenBackgroundWrapper} from '@/components';
import Svg, {Polyline} from 'react-native-svg';
import {portfolio, stocks, watchlists} from '@/data';
import {formatCurrency} from "@/utils";
import {Image} from "expo-image";

const generateSparkline = (isPositive: boolean): string => {
  const points: number[] = [];
  let value = 10 + Math.random() * 10;
  for (let i = 0; i < 20; i++) {
    value += (Math.random() - (isPositive ? 0.35 : 0.65)) * 3;
    value = Math.max(2, Math.min(28, value));
    points.push(value);
  }
  return points.map((y, x) => `${(x / 19) * 60},${y}`).join(' ');
};

interface MiniChartProps {
  isPositive: boolean;
}

const MiniChart = ({isPositive}: MiniChartProps) => (
  <Svg width={60} height={30} viewBox="0 0 60 30">
    <Polyline
      points={generateSparkline(isPositive)}
      fill="none"
      stroke={isPositive ? '#4ade80' : '#f87171'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HomeScreen = () => {
  return (
    <ScreenBackgroundWrapper>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-8">
          <View className="flex-row gap-2 items-center">
            <Image
              source={{uri: 'https://editorial.uefa.com/resources/027b-16a6f83fcf8f-179708787343-1000/cristiano_ronaldo_of_portugal_celebrates_after_scoring_a.jpeg'}}
              style={{width: 40, height: 40, borderRadius: 10}}
            />

            <View>
              <Text className="text-white text-base font-bold">Crisitiano Ronaldo</Text>
              <Text className="text-neutral-300">Good morning</Text>
            </View>
          </View>

          <Pressable
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800">
            <IconBell size={20} color="white"/>
          </Pressable>
        </View>

        {/* Portfolio Card */}
        <View className="gap-5 px-5">
          <View className="gap-4 items-center">
            <View className="flex-row items-center gap-2">
              {/*<View className="w-10 h-10 rounded-xl bg-neutral-900 items-center justify-center">*/}
              {/*  <IconWallet size={18} color="#a3a3a3"/>*/}
              {/*</View>*/}

              <Text className="text-neutral-100 font-light text-xl">
                Available balance
              </Text>
            </View>

            <Text className="text-white text-4xl font-semibold">
              ${formatCurrency(portfolio.totalValue)}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <Pressable
              onPress={() => router.push('/actions/deposit')}
              className="flex-1 items-center justify-center rounded-2xl gap-2 py-2"
            >
              <View className="w-16 h-16 rounded-2xl bg-surface-light items-center justify-center">
                <IconCashPlus size={22} color="white"/>
              </View>

              <Text className="text-neutral-200 text-base">
                Deposit
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/actions/transfer')}
              className="flex-1 items-center justify-center rounded-2xl gap-2 py-2"
            >
              <View className="w-16 h-16 rounded-2xl bg-surface-light items-center justify-center">
                <IconArrowsTransferDown size={22} color="white"/>
              </View>

              <Text className="text-neutral-200 text-base">
                Transfer
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/actions/withdraw')}
              className="flex-1 items-center justify-center rounded-2xl gap-2 py-2"
            >
              <View className="w-16 h-16 rounded-2xl bg-surface-light items-center justify-center">
                <IconCashMinus size={22} color="white"/>
              </View>

              <Text className="text-neutral-200 text-base">
                Withdraw
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/actions/scan')}
              className="flex-1 items-center justify-center rounded-2xl gap-2 py-2"
            >
              <View className="w-16 h-16 rounded-2xl bg-surface-light items-center justify-center">
                <IconScanTraces size={22} color="white"/>
              </View>

              <Text className="text-neutral-200 text-base">
                Scan
              </Text>
            </Pressable>
          </View>
        </View>

        {/* My Portfolio */}
        <View className="mt-8 gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-lg font-medium">My Portfolio</Text>

            <Pressable>
              <Text className="text-neutral-500 text-sm">Show All</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
            {portfolio.holdings.map((holding) => {
              const stock = stocks.find((s) => s.symbol === holding.symbol);
              if (!stock) return null;

              const gainPercent = ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100;
              const isPositive = gainPercent >= 0;

              return (
                <Pressable
                  key={holding.symbol}
                  onPress={() => router.push(`/stock/${holding.symbol}`)}
                  className="bg-surface-light rounded-2xl p-4 gap-5"
                  style={{width: 180}}
                >
                  <View className="flex-row gap-3 items-center">
                    <Image
                      source={{uri: stock.logo}}
                      style={{width: 36, height: 36, aspectRatio: 1, borderRadius: 5}}
                    />

                    <View className="flex-1">
                      <Text className="text-neutral-200  font-medium">
                        {stock.symbol}
                      </Text>

                      <Text className="text-neutral-400 text-xs" numberOfLines={1}>
                        {stock.name}
                      </Text>
                    </View>
                  </View>

                  <View className="gap-1.5">
                    <Text className="text-white text-xl font-semibold">
                      ${formatCurrency(stock.price)}
                    </Text>

                    <View className="flex-row items-center gap-1.5">
                      {isPositive
                        ? <IconTrendingUp3 color="#4ade80" size={16}/>
                        : <IconTrendingDown3 color="#f87171" size={16}/>
                      }
                      <Text
                        className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {Math.abs(gainPercent).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* My Watchlists */}
        <View className="mt-8 gap-4 mb-32">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-lg font-medium">My Watchlists</Text>

            <Pressable>
              <Text className="text-neutral-500 text-sm">Show All</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {watchlists[0].symbols.map((symbol, index) => {
              const stock = stocks.find((s) => s.symbol === symbol);
              if (!stock) return null;

              const isPositive = stock.changePercent >= 0;

              return (
                <Pressable
                  key={symbol}
                  onPress={() => router.push(`/stock/${symbol}`)}
                  className='flex-row items-center px-4 py-4 bg-surface-light rounded-2xl'
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

                  <View className="mx-8">
                    <MiniChart isPositive={isPositive}/>
                  </View>

                  <View className="items-end">
                    <Text className="text-white font-medium">
                      ${formatCurrency(stock.price)}
                    </Text>

                    <View className="flex-row items-center gap-2">
                      {isPositive
                        ? <IconTrendingUp3 color="#4ade80" size={16}/>
                        : <IconTrendingDown3 color="#f87171" size={16}/>
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
      </ScrollView>
    </ScreenBackgroundWrapper>
  );
};

export default HomeScreen;
