import {View, Text, Pressable} from 'react-native';
import {Image} from 'expo-image';

import type {NewsItemProps, StockProps} from '@/core/interfaces';

interface NewsListProps {
  news: NewsItemProps[];
  stocks: StockProps[];
}

export const NewsList = ({news, stocks}: NewsListProps) => (
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
);