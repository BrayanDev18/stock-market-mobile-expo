import {Pressable, Text} from 'react-native';

import {previewStyles} from '../constants';

interface WelcomeCTAProps {
  isLast: boolean;
  onPress: () => void;
}

export const WelcomeCTA = ({isLast, onPress}: WelcomeCTAProps) => (
  <Pressable
    onPress={onPress}
    className="bg-accent-dim rounded-full h-16 items-center justify-center"
    style={previewStyles.ctaShadow}
  >
    <Text className="text-black text-base font-bold tracking-wide">
      {isLast ? 'Get Started' : 'Next'}
    </Text>
  </Pressable>
);
