import {View, Text} from 'react-native';

import {SLIDES} from './slides';

interface WelcomeSlideTextProps {
  title: string;
  subtitle: string;
  activeIndex: number;
}

export const WelcomeSlideText = ({title, subtitle, activeIndex}: WelcomeSlideTextProps) => (
  <>
    <Text className="text-white text-3xl text-center font-bold tracking-tight leading-10">
      {title}
    </Text>

    <Text className="text-neutral-400 text-sm leading-5 text-center">
      {subtitle}
    </Text>

    {/* Page dots */}
    <View className="flex-row items-center gap-2 mt-2 justify-center">
      {SLIDES.map((_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full ${i === activeIndex ? 'w-6 bg-green-400' : 'w-2 bg-neutral-700'}`}
        />
      ))}
    </View>
  </>
);
