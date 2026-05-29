import {useState} from 'react';
import {ScrollView} from 'react-native';

import {
  marketIndices,
  stocks,
  sectors,
  topGainers,
  topLosers,
  mostActive,
  news,
} from '@/core/data';
import type {StockProps} from '@/core/interfaces';
import {
  MarketHeader,
  HeroIndexCard,
  MarketIndicesRow,
  TopMovers,
  SectorsGrid,
  NewsList,
} from '@/screens/market/components';
import type {Timeframe, MoverTab} from '@/screens/market/constants';

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

  return (
    <ScrollView className="flex-1 px-4 bg-surface" showsVerticalScrollIndicator={false}>
      <MarketHeader/>

      <HeroIndexCard
        indices={marketIndices}
        heroIndex={heroIndex}
        heroIndexSymbol={heroIndexSymbol}
        onSelectIndex={setHeroIndexSymbol}
        timeframe={heroTimeframe}
        onSelectTimeframe={setHeroTimeframe}
      />

      <MarketIndicesRow indices={marketIndices} onSelectIndex={setHeroIndexSymbol}/>

      <TopMovers activeTab={activeTab} onSelectTab={setActiveTab} movers={moverList}/>

      <SectorsGrid sectors={sectors}/>

      <NewsList news={news} stocks={stocks}/>
    </ScrollView>
  );
};

export default MarketScreen;