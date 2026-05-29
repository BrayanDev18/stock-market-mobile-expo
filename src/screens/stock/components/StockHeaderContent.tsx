import {useState} from 'react';
import {View, Text} from 'react-native';
import {Image} from 'expo-image';
import {IconStar, IconShare3} from '@tabler/icons-react-native';

import {HeaderIconButton} from '@/components';
import type {StockProps} from '@/core/interfaces';

interface StockHeaderCenterProps {
  stock: StockProps;
}

export const StockHeaderCenter = ({stock}: StockHeaderCenterProps) => (
  <View className="flex-row items-center gap-2">
    <Image
      source={{uri: stock.logo}}
      style={{width: 24, height: 24, borderRadius: 6}}
    />
    <Text className="text-white text-base font-semibold">{stock.symbol}</Text>
  </View>
);

export const StockHeaderActions = () => {
  const [isWatched, setIsWatched] = useState(false);

  return (
    <View className="flex-row gap-2">
      <HeaderIconButton
        onPress={() => setIsWatched((prev) => !prev)}
        className="active:opacity-70"
      >
        <IconStar
          size={20}
          color={isWatched ? '#fbbf24' : 'white'}
          fill={isWatched ? '#fbbf24' : 'transparent'}
        />
      </HeaderIconButton>

      <HeaderIconButton className="active:opacity-70">
        <IconShare3 size={20} color="white"/>
      </HeaderIconButton>
    </View>
  );
};
