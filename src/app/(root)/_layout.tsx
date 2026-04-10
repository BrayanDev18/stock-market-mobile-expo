import {useState} from 'react';
import {Tabs} from 'expo-router';
import {View, Pressable, StyleSheet} from 'react-native';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from 'expo-blur';
import {
  IconHome,
  IconHomeFilled,
  IconChartLine,
  IconSearch,
  IconSearchFilled,
  IconChartPie,
  IconChartPieFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react-native';

const TAB_COUNT = 5;
const TAB_BAR_HORIZONTAL_MARGIN = 20;
const TAB_BAR_INNER_PADDING = 6;

interface TabIconMapProps {
  default: typeof IconHome;
  filled: typeof IconHomeFilled;
}

const TAB_ICONS: Record<string, TabIconMapProps> = {
  home: {default: IconHome, filled: IconHomeFilled},
  market: {default: IconChartLine, filled: IconChartLine},
  search: {default: IconSearch, filled: IconSearchFilled},
  portfolio: {default: IconChartPie, filled: IconChartPieFilled},
  profile: {default: IconUser, filled: IconUserFilled},
};

const FloatingTabBar = ({state, navigation}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);

  const tabWidth = (containerWidth - TAB_BAR_INNER_PADDING * 2) / TAB_COUNT;

  const maskStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: withSpring(state.index * tabWidth, {damping: 80, stiffness: 500})},
    ],
  }));

  return (
    <BlurView
      intensity={10}
      tint="dark"
      style={[styles.tabBarWrapper, {paddingBottom: Math.max(insets.bottom, 12)}]}
    >
      <View
        style={styles.tabBarOuter}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        className="bg-neutral-900"
      >

        {/* Active tab mask */}
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.mask,
              {width: tabWidth},
              maskStyle,
            ]}
          />
        )}

        {/* Tab icons */}
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icons = TAB_ICONS[route.name];
          const Icon = isFocused ? icons?.filled : icons?.default;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
            >
              {Icon && (
                <Icon
                  size={22}
                  color={isFocused ? 'white' : '#525252'}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
};

const RootLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{headerShown: false}}
    >
      <Tabs.Screen name="home"/>
      <Tabs.Screen name="market"/>
      <Tabs.Screen name="search"/>
      <Tabs.Screen name="portfolio"/>
      <Tabs.Screen name="profile"/>
    </Tabs>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: TAB_BAR_HORIZONTAL_MARGIN,
    overflow: 'hidden',
  },
  tabBarOuter: {
    flexDirection: 'row',
    borderRadius: 22,
    height: 64,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    padding: TAB_BAR_INNER_PADDING,
  },
  mask: {
    position: 'absolute',
    top: TAB_BAR_INNER_PADDING,
    bottom: TAB_BAR_INNER_PADDING,
    left: TAB_BAR_INNER_PADDING,
    backgroundColor: '#22c55e',
    borderRadius: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
