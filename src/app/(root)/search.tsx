import {useMemo, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {stocks} from '@/core/data';
import type {StockProps} from '@/core/interfaces';
import {
  SearchBar,
  SearchResults,
  RecentSearches,
  TrendingList,
  SectorsList,
} from '@/screens/search/components';

const RECENT_SEARCHES = ['AAPL', 'NVDA', 'TSLA', 'META', 'GOOGL'];

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(RECENT_SEARCHES);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredStocks: StockProps[] = useMemo(() => {
    if (!normalizedQuery) return [];
    return stocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(normalizedQuery) ||
        s.name.toLowerCase().includes(normalizedQuery) ||
        s.sector.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const removeRecent = (symbol: string) => {
    setRecent((prev) => prev.filter((s) => s !== symbol));
  };

  const clearAllRecent = () => setRecent([]);

  const isSearching = normalizedQuery.length > 0;

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="pt-2 pb-6">
            <Text className="text-neutral-300">Discover</Text>
            <Text className="text-white text-2xl font-bold">Search</Text>
          </View>

          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            isSearching={isSearching}
          />

          {isSearching ? (
            <SearchResults query={query} results={filteredStocks} />
          ) : (
            <>
              <RecentSearches
                recent={recent}
                onSelect={setQuery}
                onRemove={removeRecent}
                onClearAll={clearAllRecent}
              />

              <TrendingList />

              <SectorsList onSelect={setQuery} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SearchScreen;