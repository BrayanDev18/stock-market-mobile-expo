import {View, Text, Pressable} from 'react-native';
import {Image} from 'expo-image';

import type {NewsItemProps} from '@/core/interfaces';

interface RelatedNewsProps {
  items: NewsItemProps[];
}

export const RelatedNews = ({items}: RelatedNewsProps) => {
  if (items.length === 0) {
    return <View className="mb-32"/>;
  }

  return (
    <View className="mt-8 gap-4 px-5 mb-32">
      <Text className="text-white text-lg font-medium">Related News</Text>

      <View className="gap-3">
        {items.map((item) => (
          <Pressable
            key={item.id}
            className="flex-row items-center bg-surface-light rounded-2xl p-3 gap-3"
          >
            <Image
              source={{uri: item.imageUrl}}
              style={{width: 72, height: 72, borderRadius: 14}}
            />

            <View className="flex-1 gap-1.5">
              <Text className="text-neutral-400 text-xs">
                {item.source}
              </Text>

              <Text className="text-neutral-100 text-sm font-medium" numberOfLines={2}>
                {item.title}
              </Text>

              <Text className="text-neutral-500 text-xs">
                {item.date}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
