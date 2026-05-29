import type {ReactNode} from 'react';
import {View, Text} from 'react-native';
import {IconInfoCircle} from '@tabler/icons-react-native';

interface FinePrintProps {
  children: ReactNode;
}

/** Info-icon + legal authorization copy shown at the bottom of the confirm screens. */
export const FinePrint = ({children}: FinePrintProps) => (
  <View className="mt-6 mx-5 flex-row gap-2 mb-10">
    <IconInfoCircle size={14} color="#737373" />
    <Text className="text-neutral-500 text-xs leading-4 flex-1">{children}</Text>
  </View>
);
