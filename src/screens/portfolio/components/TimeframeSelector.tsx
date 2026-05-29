import {View, Text, Pressable} from 'react-native';

import {TIMEFRAMES, type Timeframe} from '../chart';

interface TimeframeSelectorProps {
  activeTimeframe: Timeframe;
  onChange: (tf: Timeframe) => void;
}

/** Pill row that switches the portfolio chart timeframe. */
export const TimeframeSelector = ({
  activeTimeframe,
  onChange,
}: TimeframeSelectorProps) => (
  <View className="flex-row gap-2 mt-4">
    {TIMEFRAMES.map((tf) => {
      const isActive = tf.id === activeTimeframe;

      return (
        <Pressable
          key={tf.id}
          onPress={() => onChange(tf.id)}
          className={`flex-1 px-3 py-2 rounded-full border items-center ${isActive ? 'bg-white border-white' : 'bg-surface-light border-neutral-800'}`}
        >
          <Text
            className={`text-xs font-medium ${isActive ? 'text-black' : 'text-neutral-300'}`}
          >
            {tf.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
