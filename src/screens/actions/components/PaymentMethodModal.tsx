import {View, Text, Pressable} from 'react-native';
import {Modal} from 'react-native-reanimated-modal';
import {IconCheck, IconX} from '@tabler/icons-react-native';

import {paymentMethods} from '@/core/data';

import {MethodIcon} from './MethodIcon';

interface PaymentMethodModalProps {
  visible: boolean;
  onHide: () => void;
  /** Sheet title — e.g. "Select method" or "Select destination". */
  title: string;
  selectedId: string;
  /** Called with the chosen method id; the sheet hides itself afterwards. */
  onSelect: (id: string) => void;
}

/** Bottom-sheet payment-method picker shared by deposit and withdraw. */
export const PaymentMethodModal = ({
  visible,
  onHide,
  title,
  selectedId,
  onSelect,
}: PaymentMethodModalProps) => (
  <Modal
    visible={visible}
    onHide={onHide}
    animation={{
      type: 'slide',
      duration: 350,
      direction: {start: 'down', end: 'down'},
    }}
    swipe={{enabled: true, directions: ['down'], threshold: 80}}
    backdrop={{enabled: true, color: 'black', opacity: 0.7}}
    style={{justifyContent: 'flex-end', margin: 0}}
    statusBarTranslucent
  >
    <View className="bg-surface-light rounded-t-[32px] border-t border-l border-r border-neutral-800 pb-10">
      {/* Drag handle */}
      <View className="items-center pt-3 pb-1">
        <View className="w-10 h-1 rounded-full bg-neutral-700" />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
        <Text className="text-white text-lg font-semibold">{title}</Text>

        <Pressable
          onPress={onHide}
          className="w-9 h-9 rounded-full bg-neutral-800 items-center justify-center"
        >
          <IconX size={16} color="white" />
        </Pressable>
      </View>

      {/* Methods list */}
      <View className="px-4 gap-3">
        {paymentMethods.map((method) => {
          const selected = method.id === selectedId;

          return (
            <Pressable
              key={method.id}
              onPress={() => {
                onSelect(method.id);
                onHide();
              }}
              className={`flex-row items-center bg-neutral-900 rounded-2xl p-4 border ${selected ? 'border-green-400' : 'border-transparent'}`}
            >
              <MethodIcon method={method} />

              <View className="ml-3 flex-1">
                <Text className="text-neutral-200 text-base font-medium">
                  {method.name}
                </Text>
                <Text className="text-neutral-500 text-xs">{method.detail}</Text>
              </View>

              <View className="items-end gap-1">
                <Text className="text-neutral-400 text-xs">{method.eta}</Text>
                {method.fee > 0 ? (
                  <Text className="text-neutral-500 text-[10px]">
                    ${method.fee.toFixed(2)} fee
                  </Text>
                ) : (
                  <Text className="text-green-400 text-[10px] font-semibold">
                    Free
                  </Text>
                )}
              </View>

              <View
                className={`w-6 h-6 rounded-full items-center justify-center ml-3 ${selected ? 'bg-green-400' : 'border border-neutral-700'}`}
              >
                {selected && <IconCheck size={14} color="black" />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  </Modal>
);
