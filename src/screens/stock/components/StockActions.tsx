import {View, Text, Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

export const StockActions = () => (
  <>
    {/* Bottom fade so scrolling content dissolves cleanly under the actions */}
    <LinearGradient
      colors={['transparent', '#0A0A0A']}
      locations={[0, 0.6]}
      pointerEvents="none"
      className="absolute left-0 right-0 bottom-0 h-44"
    />

    {/* Buy / Sell Actions */}
    <View className="absolute bottom-8 left-4 right-4 flex-row gap-3">
      <Pressable className="flex-1 bg-surface-card border border-neutral-800 rounded-2xl py-4 items-center active:opacity-70">
        <Text className="text-red-400/90 text-base font-semibold">Sell</Text>
      </Pressable>

      <Pressable className="flex-1 bg-accent-dim rounded-2xl py-4 items-center active:opacity-90">
        <Text className="text-white text-base font-semibold">Buy</Text>
      </Pressable>
    </View>
  </>
);
