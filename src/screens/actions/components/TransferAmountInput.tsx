import {View, Text, TextInput} from 'react-native';

import {formatCurrency} from '@/core/utils';

interface TransferAmountInputProps {
  /** Raw text buffer of the amount. */
  value: string;
  /** Receives the sanitized (digits + dot only) value. */
  onChangeText: (value: string) => void;
  /** Available balance shown beneath the field. */
  balance: number;
}

/** Centered editable "You send" amount input on the transfer screen. */
export const TransferAmountInput = ({
  value,
  onChangeText,
  balance,
}: TransferAmountInputProps) => (
  <View className="mt-8 items-center gap-2">
    <Text className="text-neutral-400 text-sm">You send</Text>

    <View className="flex-row items-start">
      <Text className="text-neutral-500 text-2xl mt-2">$</Text>
      <TextInput
        value={value}
        onChangeText={(v) => onChangeText(v.replace(/[^0-9.]/g, ''))}
        placeholder="0"
        placeholderTextColor="#525252"
        keyboardType="decimal-pad"
        className="text-white text-6xl font-semibold tracking-tight"
        style={{minWidth: 120, textAlign: 'center'}}
      />
    </View>

    <Text className="text-neutral-500 text-xs">
      Available ${formatCurrency(balance)}
    </Text>
  </View>
);
