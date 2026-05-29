import {View, Text, Pressable} from 'react-native';
import {IconBackspace} from '@tabler/icons-react-native';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

interface AmountKeypadProps {
  /** Receives the pressed key: a digit, `'.'`, or `'del'`. */
  onKeyPress: (key: string) => void;
}

/** 3-column numeric keypad used by the deposit and withdraw amount entry. */
export const AmountKeypad = ({onKeyPress}: AmountKeypadProps) => (
  <View className="mt-8 px-5 flex-row flex-wrap gap-y-2">
    {KEYS.map((key) => (
      <Pressable
        key={key}
        onPress={() => onKeyPress(key)}
        className="items-center justify-center"
        style={{width: '33.33%', height: 60}}
      >
        {key === 'del' ? (
          <IconBackspace size={24} color="#a3a3a3" />
        ) : (
          <Text className="text-white text-2xl font-medium">{key}</Text>
        )}
      </Pressable>
    ))}
  </View>
);