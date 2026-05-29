import type {ComponentType} from 'react';
import {View, Text, Pressable} from 'react-native';
import {IconChevronRight} from '@tabler/icons-react-native';

type IconComponent = ComponentType<{size?: number; color?: string}>;

interface MenuRowProps {
  Icon: IconComponent;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  valueColor?: string;
  showChevron?: boolean;
  onPress?: () => void;
}

/** Settings list row: tinted icon, label, optional value, optional chevron. */
export const MenuRow = ({
  Icon,
  iconColor,
  iconBg,
  label,
  value,
  valueColor = 'text-neutral-500',
  showChevron = true,
  onPress,
}: MenuRowProps) => (
  <Pressable onPress={onPress} className="flex-row items-center py-3.5 px-4">
    <View
      className="w-9 h-9 rounded-full items-center justify-center"
      style={{backgroundColor: iconBg}}
    >
      <Icon size={18} color={iconColor} />
    </View>

    <Text className="text-neutral-200 text-base flex-1 ml-3">{label}</Text>

    {value && <Text className={`text-sm ${valueColor} mr-1`}>{value}</Text>}

    {showChevron && <IconChevronRight size={16} color="#525252" />}
  </Pressable>
);