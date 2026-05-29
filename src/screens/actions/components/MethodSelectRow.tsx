import {View, Text, Pressable} from 'react-native';
import {IconChevronRight} from '@tabler/icons-react-native';

import type {PaymentMethodProps} from '@/core/interfaces';

import {MethodIcon} from './MethodIcon';

interface MethodSelectRowProps {
  /** Section heading, e.g. "Payment Method" or "Destination". */
  label: string;
  method: PaymentMethodProps;
  /** Opens the picker modal. */
  onPress: () => void;
}

/** Tappable selected-method/destination row that opens the picker modal. */
export const MethodSelectRow = ({label, method, onPress}: MethodSelectRowProps) => (
  <View className="mt-8 px-5 gap-3">
    <Text className="text-white text-lg font-medium">{label}</Text>

    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-surface-light rounded-2xl p-4"
    >
      <MethodIcon method={method} />

      <View className="ml-3 flex-1">
        <Text className="text-neutral-200 text-base font-medium">{method.name}</Text>
        <Text className="text-neutral-500 text-xs">
          {method.detail} · {method.eta}
        </Text>
      </View>

      <IconChevronRight size={18} color="#737373" />
    </Pressable>
  </View>
);