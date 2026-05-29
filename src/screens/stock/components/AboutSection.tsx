import {View, Text} from 'react-native';

import type {StockProps} from '@/core/interfaces';

interface AboutSectionProps {
  stock: StockProps;
}

export const AboutSection = ({stock}: AboutSectionProps) => (
  <View className="mt-8 gap-4 px-5">
    <Text className="text-white text-lg font-medium">About</Text>

    <View className="bg-surface-light rounded-2xl p-4">
      <Text className="text-neutral-300 text-sm leading-5">
        {stock.about}
      </Text>
    </View>
  </View>
);
