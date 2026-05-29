import {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';

import {navigate} from '@/core/constants';
import {SCREEN_WIDTH} from '@/screens/welcome/constants';
import {
  BackgroundEffect,
  WelcomeHeader,
  WelcomeCarousel,
  WelcomeSlideText,
  WelcomeCTA,
  SLIDES,
} from '@/screens/welcome/components';

const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const headerOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const actionsOpacity = useSharedValue(0);

  const headerTranslate = useSharedValue(-20);
  const cardTranslate = useSharedValue(40);
  const textTranslate = useSharedValue(20);
  const actionsTranslate = useSharedValue(30);

  useEffect(() => {
    const ease = {duration: 900, easing: Easing.out(Easing.exp)};

    headerOpacity.value = withDelay(100, withTiming(1, ease));
    headerTranslate.value = withDelay(100, withSpring(0, {damping: 20, stiffness: 90}));

    cardOpacity.value = withDelay(300, withTiming(1, ease));
    cardTranslate.value = withDelay(300, withSpring(0, {damping: 18, stiffness: 80}));

    textOpacity.value = withDelay(600, withTiming(1, ease));
    textTranslate.value = withDelay(600, withSpring(0, {damping: 20, stiffness: 90}));

    actionsOpacity.value = withDelay(800, withTiming(1, ease));
    actionsTranslate.value = withDelay(800, withSpring(0, {damping: 20, stiffness: 90}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{translateY: headerTranslate.value}],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{translateY: cardTranslate.value}],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{translateY: textTranslate.value}],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{translateY: actionsTranslate.value}],
  }));

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const activeSlide = SLIDES[activeIndex];
  const isLast = activeIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate('home');
      return;
    }
    scrollRef.current?.scrollTo({x: SCREEN_WIDTH * (activeIndex + 1), animated: true});
  };

  return (
    <View className="flex-1 bg-surface">
      <BackgroundEffect/>

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-between py-4">
          {/* Top bar */}
          <Animated.View style={headerStyle}>
            <WelcomeHeader onSkip={() => navigate('home')}/>
          </Animated.View>

          {/* Preview carousel */}
          <Animated.View style={cardStyle}>
            <WelcomeCarousel ref={scrollRef} onScroll={onScroll}/>
          </Animated.View>

          {/* Text */}
          <Animated.View style={textStyle} className="px-6 justify-center items-center gap-4">
            <WelcomeSlideText
              title={activeSlide.title}
              subtitle={activeSlide.subtitle}
              activeIndex={activeIndex}
            />
          </Animated.View>

          {/* CTA */}
          <Animated.View style={actionsStyle} className="px-6">
            <WelcomeCTA isLast={isLast} onPress={handleNext}/>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
