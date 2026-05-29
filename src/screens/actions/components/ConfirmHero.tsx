import {View, Text} from 'react-native';
import {IconArrowDown, IconClockHour4} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';
import {formatCurrency} from '@/core/utils';

interface ConfirmHeroProps {
  /** Caption above the amount, e.g. "You're depositing". */
  label: string;
  amount: number;
  /** Arrival pill copy, e.g. "Arrives instantly". */
  etaText: string;
  /** Flip the hero arrow 180° (used for withdraw). */
  arrowReversed?: boolean;
}

/** Circular icon + amount + arrival pill hero block for the confirm screens. */
export const ConfirmHero = ({
  label,
  amount,
  etaText,
  arrowReversed = false,
}: ConfirmHeroProps) => (
  <View className="items-center px-5 mt-4 gap-3">
    <View className="w-20 h-20 rounded-full bg-green-400/10 items-center justify-center">
      <View className="w-16 h-16 rounded-full bg-green-400/20 items-center justify-center">
        <IconArrowDown
          size={30}
          color={Colors.accentLight}
          style={arrowReversed ? {transform: [{rotate: '180deg'}]} : undefined}
        />
      </View>
    </View>

    <Text className="text-neutral-400 text-sm">{label}</Text>

    <Text className="text-white text-5xl font-semibold tracking-tight">
      ${formatCurrency(amount)}
    </Text>

    <View className="flex-row items-center gap-1.5 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1.5">
      <IconClockHour4 size={12} color={Colors.accentLight} />
      <Text className="text-green-400 text-xs font-semibold">{etaText}</Text>
    </View>
  </View>
);