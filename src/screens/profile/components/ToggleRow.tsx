import type {ComponentType} from 'react';
import {View, Text, Switch} from 'react-native';

import {Colors} from '@/core/constants';

type IconComponent = ComponentType<{size?: number; color?: string}>;

interface ToggleRowProps {
  Icon: IconComponent;
  iconColor: string;
  iconBg: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/** Settings list row with a trailing Switch. */
export const ToggleRow = ({
  Icon,
  iconColor,
  iconBg,
  label,
  description,
  value,
  onValueChange,
}: ToggleRowProps) => (
  <View className="flex-row items-center py-3.5 px-4">
    <View
      className="w-9 h-9 rounded-full items-center justify-center"
      style={{backgroundColor: iconBg}}
    >
      <Icon size={18} color={iconColor} />
    </View>

    <View className="flex-1 ml-3">
      <Text className="text-neutral-200 text-base">{label}</Text>
      {description && (
        <Text className="text-neutral-500 text-xs mt-0.5">{description}</Text>
      )}
    </View>

    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{false: '#262626', true: Colors.accentLight}}
      thumbColor="white"
      ios_backgroundColor="#262626"
    />
  </View>
);