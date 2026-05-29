import {useMemo, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLocalSearchParams} from 'expo-router';

import {stocks, news} from '@/core/data';
import {ActionHeader} from '@/components';
import {
  StockHeaderCenter,
  StockHeaderActions,
  StockInfo,
  PriceChart,
  HistoricalSession,
  KeyStats,
  AboutSection,
  RelatedNews,
  StockActions,
} from '@/screens/stock/components';
import {buildChartData, getHistoricalSlice, type Timeframe} from '@/screens/stock/chart';

const StockDetailScreen = () => {
  const {symbol} = useLocalSearchParams<{symbol: string}>();
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1M');

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

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ActionHeader
          center={<StockHeaderCenter stock={stock}/>}
          right={<StockHeaderActions/>}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <StockInfo stock={stock}/>

          <PriceChart
            stock={stock}
            chartData={chartData}
            activeTimeframe={activeTimeframe}
            onTimeframeChange={setActiveTimeframe}
          />

          {historicalSlice && historicalSlice.length > 0 && (
            <HistoricalSession historicalSlice={historicalSlice}/>
          )}

          <KeyStats stock={stock} historicalSlice={historicalSlice}/>

          <AboutSection stock={stock}/>

          <RelatedNews items={relatedNews}/>
        </ScrollView>

        <StockActions/>
      </SafeAreaView>
    </View>
  );
};

export default StockDetailScreen;
