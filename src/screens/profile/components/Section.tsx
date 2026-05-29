import type {ReactNode} from 'react';
import {View, Text} from 'react-native';

interface SectionProps {
  title: string;
  children: ReactNode;
}

/** Titled settings group: uppercase header + a rounded card holding the rows. */
export const Section = ({title, children}: SectionProps) => (
  <View className="mt-6 gap-3">
    <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider px-5">
      {title}
    </Text>
    <View className="bg-surface-light rounded-2xl mx-4 overflow-hidden">
      {children}
    </View>
  </View>
);

/** Hairline divider between rows inside a {@link Section}. */
export const Divider = () => <View className="h-px bg-neutral-800/80 ml-16" />;