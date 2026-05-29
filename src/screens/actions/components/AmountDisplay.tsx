import {View, Text} from 'react-native';
import {IconShieldLock, IconAlertCircle} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';

interface AmountDisplayProps {
  /** Caption above the amount, e.g. "Amount to deposit". */
  label: string;
  /** Pre-formatted amount string to render (already currency-formatted). */
  value: string;
  /** Show the "Secured by 256-bit encryption" footnote (deposit). */
  showSecurityNote?: boolean;
  /** Render the amount in the error color and show the error footnote (withdraw). */
  hasError?: boolean;
  /** Error footnote copy when `hasError` is true. */
  errorText?: string;
}

/** Large centered `$NNN` amount block used by the deposit & withdraw entry screens. */
export const AmountDisplay = ({
  label,
  value,
  showSecurityNote = false,
  hasError = false,
  errorText = 'Exceeds available balance',
}: AmountDisplayProps) => (
  <View className="items-center gap-3 px-5 mt-6">
    <Text className="text-neutral-400 text-sm">{label}</Text>

    <View className="flex-row items-start">
      <Text className={`text-2xl mt-2 ${hasError ? 'text-red-400' : 'text-neutral-500'}`}>
        $
      </Text>
      <Text
        className={`text-6xl font-semibold tracking-tight ${hasError ? 'text-red-400' : 'text-white'}`}
      >
        {value}
      </Text>
    </View>

    {showSecurityNote && (
      <View className="flex-row items-center gap-1.5">
        <IconShieldLock size={14} color={Colors.accentLight} />
        <Text className="text-neutral-400 text-xs">
          Secured by 256-bit encryption
        </Text>
      </View>
    )}

    {hasError && (
      <View className="flex-row items-center gap-1.5">
        <IconAlertCircle size={14} color={Colors.down} />
        <Text className="text-red-400 text-xs">{errorText}</Text>
      </View>
    )}
  </View>
);
