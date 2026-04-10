import {useMemo, useState} from 'react';
import {View, Text, ScrollView, Pressable, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from 'expo-router';
import {Image} from 'expo-image';
import {
  IconSearch,
  IconX,
  IconClockHour3,
  IconFlame,
  IconTrendingUp3,
  IconTrendingDown3,
  IconLayoutGrid,
} from '@tabler/icons-react-native';

import {stocks, mostActive, sectors} from '@/data';
import {formatCurrency} from '@/utils';
import type {StockProps} from '@/interfaces';

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
          {/* Header */}
          <View className="pt-2 pb-6">
            <Text className="text-neutral-300">Discover</Text>
            <Text className="text-white text-2xl font-bold">Search</Text>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-surface-light border border-neutral-800 rounded-2xl px-4 h-14 gap-3">
            <IconSearch size={20} color="#a3a3a3"/>

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search stocks, ETFs, sectors…"
              placeholderTextColor="#737373"
              className="flex-1 text-white text-base"
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="search"
            />

            {isSearching && (
              <Pressable
                onPress={() => setQuery('')}
                className="w-6 h-6 rounded-full bg-neutral-800 items-center justify-center"
              >
                <IconX size={14} color="white"/>
              </Pressable>
            )}
          </View>

          {isSearching ? (
            /* Search Results */
            <View className="mt-8 gap-4 mb-32">
              <Text className="text-neutral-400 text-sm">
                {filteredStocks.length} result{filteredStocks.length === 1 ? '' : 's'} for “{query}”
              </Text>

              {filteredStocks.length === 0 ? (
                <View className="items-center justify-center py-16 gap-2">
                  <View className="w-16 h-16 rounded-full bg-surface-light items-center justify-center">
                    <IconSearch size={24} color="#525252"/>
                  </View>
                  <Text className="text-neutral-300 text-base font-medium">
                    No matches found
                  </Text>
                  <Text className="text-neutral-500 text-sm">
                    Try a different symbol or company name
                  </Text>
                </View>
              ) : (
                <View className="gap-3">
                  {filteredStocks.map((stock) => {
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
                            {stock.name} · {stock.exchange}
                          </Text>
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
              )}
            </View>
          ) : (
            <>
              {/* Recent Searches */}
              {recent.length > 0 && (
                <View className="mt-8 gap-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <IconClockHour3 size={18} color="#a3a3a3"/>
                      <Text className="text-white text-lg font-medium">Recent</Text>
                    </View>

                    <Pressable onPress={clearAllRecent}>
                      <Text className="text-neutral-500 text-sm">Clear All</Text>
                    </Pressable>
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    {recent.map((symbol) => (
                      <Pressable
                        key={symbol}
                        onPress={() => setQuery(symbol)}
                        className="flex-row items-center gap-2 bg-surface-light border border-neutral-800 rounded-full pl-4 pr-2 py-2"
                      >
                        <Text className="text-neutral-200 text-sm font-medium">
                          {symbol}
                        </Text>

                        <Pressable
                          onPress={() => removeRecent(symbol)}
                          className="w-5 h-5 rounded-full bg-neutral-800 items-center justify-center"
                        >
                          <IconX size={12} color="#a3a3a3"/>
                        </Pressable>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* Trending */}
              <View className="mt-8 gap-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconFlame size={18} color="#fbbf24"/>
                    <Text className="text-white text-lg font-medium">Trending</Text>
                  </View>

                  <Pressable>
                    <Text className="text-neutral-500 text-sm">Show All</Text>
                  </Pressable>
                </View>

                <View className="gap-3">
                  {mostActive.map((stock, idx) => {
                    const isPositive = stock.changePercent >= 0;

                    return (
                      <Pressable
                        key={stock.symbol}
                        onPress={() => router.push(`/stock/${stock.symbol}`)}
                        className="flex-row items-center px-4 py-4 bg-surface-light rounded-2xl"
                      >
                        <Text className="text-neutral-500 text-sm font-semibold w-5">
                          {idx + 1}
                        </Text>

                        <Image
                          source={{uri: stock.logo}}
                          style={{width: 36, height: 36, borderRadius: 50, marginLeft: 8}}
                        />

                        <View className="ml-3 flex-1">
                          <Text className="text-neutral-200 text-base font-medium">
                            {stock.symbol}
                          </Text>

                          <Text className="text-neutral-500 text-xs" numberOfLines={1}>
                            {stock.name}
                          </Text>
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

              {/* Browse by Sector */}
              <View className="mt-8 gap-4 mb-32">
                <View className="flex-row items-center gap-2">
                  <IconLayoutGrid size={18} color="#a3a3a3"/>
                  <Text className="text-white text-lg font-medium">Browse by Sector</Text>
                </View>

                <View className="flex-row flex-wrap gap-3">
                  {sectors.map((sector) => {
                    const isPositive = sector.change >= 0;

                    return (
                      <Pressable
                        key={sector.name}
                        onPress={() => setQuery(sector.name)}
                        className="bg-surface-light rounded-2xl p-4 gap-2"
                        style={{width: '47.5%'}}
                      >
                        <Text className="text-neutral-200 text-sm font-medium" numberOfLines={1}>
                          {sector.name}
                        </Text>

                        <View className="flex-row items-center gap-1.5">
                          {isPositive
                            ? <IconTrendingUp3 color="#4ade80" size={14}/>
                            : <IconTrendingDown3 color="#f87171" size={14}/>
                          }
                          <Text
                            className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {isPositive ? '+' : ''}{sector.change.toFixed(2)}%
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SearchScreen;