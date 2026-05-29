import {View, Text} from 'react-native';

/** App version / build footer. */
export const AppFooter = () => (
  <View className="items-center gap-1 mt-6 mb-32">
    <Text className="text-neutral-600 text-xs">QuantiX v1.0.0</Text>
    <Text className="text-neutral-700 text-[10px]">Build 2026.04.10</Text>
  </View>
);
