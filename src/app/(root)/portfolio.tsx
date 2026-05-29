import {useMemo, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {portfolio} from '@/core/data';
import {
  PortfolioHeader,
  PortfolioChart,
  TimeframeSelector,
  PortfolioStats,
  HoldingsList,
  TransactionsList,
} from '@/screens/portfolio/components';
import {buildPortfolioSeries, type Timeframe} from '@/screens/portfolio/chart';

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

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          <PortfolioHeader
            periodChange={periodChange}
            periodChangePct={periodChangePct}
            isPeriodPositive={isPeriodPositive}
            activeTimeframe={activeTimeframe}
          />

          <PortfolioChart
            chartData={chartData}
            isPeriodPositive={isPeriodPositive}
          />

          <TimeframeSelector
            activeTimeframe={activeTimeframe}
            onChange={setActiveTimeframe}
          />

          <PortfolioStats />

          <HoldingsList />

          <TransactionsList />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PortfolioScreen;
