import {forwardRef} from 'react';
import {
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import {SLIDES} from './slides';

interface WelcomeCarouselProps {
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const WelcomeCarousel = forwardRef<ScrollView, WelcomeCarouselProps>(
  ({onScroll}, ref) => (
    <ScrollView
      ref={ref}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      decelerationRate="fast"
    >
      {SLIDES.map((slide) => (
        <slide.Component key={slide.id}/>
      ))}
    </ScrollView>
  ),
);

WelcomeCarousel.displayName = 'WelcomeCarousel';
