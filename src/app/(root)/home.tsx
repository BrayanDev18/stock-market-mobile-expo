import {View, ScrollView} from 'react-native';

import {
  ScreenBackgroundWrapper,
  HomeHeader,
  BalanceCard,
  QuickActions,
  PortfolioCarousel,
  WatchlistSection,
} from '@/screens/home/components';

const HomeScreen = () => {
  return (
    <ScreenBackgroundWrapper>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <HomeHeader/>

        <View className="gap-5 px-5">
          <BalanceCard/>
          <QuickActions/>
        </View>

        <PortfolioCarousel/>

        <WatchlistSection/>
      </ScrollView>
    </ScreenBackgroundWrapper>
  );
};

export default HomeScreen;
