import {View, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {IconShieldLock} from '@tabler/icons-react-native';

import {Colors, trendAlpha} from '@/core/constants';

interface SecurityNoticeProps {
  title?: string;
  description?: string;
}

/** Reassurance card (shield + copy) shown on the confirmation screens. */
export const SecurityNotice = ({
  title = 'Secured transaction',
  description = 'Protected by 256-bit encryption and SIPC insured.',
}: SecurityNoticeProps) => (
  <LinearGradient
    colors={[trendAlpha.up(0.1), trendAlpha.up(0.02)]}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 1}}
    style={{
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: trendAlpha.up(0.2),
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <View className="w-9 h-9 rounded-full bg-green-400/20 items-center justify-center">
      <IconShieldLock size={16} color={Colors.accentLight} />
    </View>

    <View className="ml-3 flex-1">
      <Text className="text-neutral-200 text-sm font-medium">{title}</Text>
      <Text className="text-neutral-500 text-xs" numberOfLines={2}>
        {description}
      </Text>
    </View>
  </LinearGradient>
);