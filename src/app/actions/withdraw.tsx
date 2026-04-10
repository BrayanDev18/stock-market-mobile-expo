import {useState} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {Modal} from 'react-native-reanimated-modal';
import {
  IconArrowLeft,
  IconHelpCircle,
  IconCreditCard,
  IconBuildingBank,
  IconBrandApple,
  IconBrandPaypal,
  IconCheck,
  IconBackspace,
  IconAlertCircle,
  IconCashBanknote,
  IconChevronRight,
  IconX,
} from '@tabler/icons-react-native';

import {formatCurrency} from '@/utils';
import {paymentMethods} from '@/data';
import type {PaymentMethodProps, PaymentMethodType} from '@/interfaces';

const AVAILABLE = 89432.55;

const PERCENTS = [
  {label: '25%', value: 0.25},
  {label: '50%', value: 0.5},
  {label: '75%', value: 0.75},
  {label: 'Max', value: 1},
];

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

const getMethodIcon = (type: PaymentMethodType) => {
  switch (type) {
    case 'visa':
    case 'mastercard':
      return IconCreditCard;
    case 'bank':
      return IconBuildingBank;
    case 'apple-pay':
      return IconBrandApple;
    case 'paypal':
      return IconBrandPaypal;
  }
};

interface MethodIconProps {
  method: PaymentMethodProps;
  size?: number;
}

const MethodIcon = ({method, size = 44}: MethodIconProps) => {
  const Icon = getMethodIcon(method.type);
  const iconSize = size * 0.45;

  return (
    <View
      className="rounded-full items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: method.color + '22',
      }}
    >
      <Icon size={iconSize} color={method.color}/>
    </View>
  );
};

const WithdrawScreen = () => {
  const [amount, setAmount] = useState('0');
  const [methodId, setMethodId] = useState('chase');
  const [showMethods, setShowMethods] = useState(false);

  const addKey = (key: string) => {
    if (key === 'del') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (key === '.' && amount.includes('.')) return;
    if (amount.includes('.') && amount.split('.')[1]?.length >= 2) return;
    setAmount((prev) => (prev === '0' && key !== '.' ? key : prev + key));
  };

  const setPercent = (percent: number) => {
    const value = (AVAILABLE * percent).toFixed(2);
    setAmount(value);
  };

  const numericAmount = parseFloat(amount) || 0;
  const selectedMethod = paymentMethods.find((m) => m.id === methodId) ?? paymentMethods[2];
  const exceedsBalance = numericAmount > AVAILABLE;
  const canContinue = numericAmount > 0 && !exceedsBalance;

  const handleContinue = () => {
    if (!canContinue) return;
    router.push({
      pathname: '/actions/withdraw-confirm',
      params: {
        amount: numericAmount.toFixed(2),
        methodId: selectedMethod.id,
      },
    });
  };

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
          >
            <IconArrowLeft size={20} color="white"/>
          </Pressable>

          <Text className="text-white text-base font-semibold">Withdraw</Text>

          <Pressable
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
          >
            <IconHelpCircle size={20} color="white"/>
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Available balance card */}
          <View className="mx-5 mt-2">
            <LinearGradient
              colors={['#111111', '#0a0a0a']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                padding: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#262626',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View className="w-11 h-11 rounded-full bg-green-400/20 items-center justify-center">
                <IconCashBanknote size={20} color="#4ade80"/>
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-neutral-400 text-xs">Available to withdraw</Text>
                <Text className="text-white text-lg font-semibold">
                  ${formatCurrency(AVAILABLE)}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Amount display */}
          <View className="items-center gap-3 px-5 mt-6">
            <Text className="text-neutral-400 text-sm">You withdraw</Text>

            <View className="flex-row items-start">
              <Text
                className={`text-2xl mt-2 ${exceedsBalance ? 'text-red-400' : 'text-neutral-500'}`}
              >
                $
              </Text>
              <Text
                className={`text-6xl font-semibold tracking-tight ${exceedsBalance ? 'text-red-400' : 'text-white'}`}
              >
                {numericAmount > 0 ? formatCurrency(numericAmount) : amount}
              </Text>
            </View>

            {exceedsBalance && (
              <View className="flex-row items-center gap-1.5">
                <IconAlertCircle size={14} color="#f87171"/>
                <Text className="text-red-400 text-xs">Exceeds available balance</Text>
              </View>
            )}
          </View>

          {/* Percent chips */}
          <View className="flex-row gap-2 px-5 mt-6">
            {PERCENTS.map(({label, value}) => (
              <Pressable
                key={label}
                onPress={() => setPercent(value)}
                className="flex-1 items-center bg-surface-light border border-neutral-800 rounded-full py-2.5"
              >
                <Text className="text-neutral-200 text-sm font-medium">{label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Selected destination row (opens modal) */}
          <View className="mt-8 px-5 gap-3">
            <Text className="text-white text-lg font-medium">Destination</Text>

            <Pressable
              onPress={() => setShowMethods(true)}
              className="flex-row items-center bg-surface-light rounded-2xl p-4"
            >
              <MethodIcon method={selectedMethod}/>

              <View className="ml-3 flex-1">
                <Text className="text-neutral-200 text-base font-medium">
                  {selectedMethod.name}
                </Text>
                <Text className="text-neutral-500 text-xs">
                  {selectedMethod.detail} · {selectedMethod.eta}
                </Text>
              </View>

              <IconChevronRight size={18} color="#737373"/>
            </Pressable>
          </View>

          {/* Numpad */}
          <View className="mt-8 px-5 flex-row flex-wrap gap-y-2">
            {KEYS.map((key) => (
              <Pressable
                key={key}
                onPress={() => addKey(key)}
                className="items-center justify-center"
                style={{width: '33.33%', height: 60}}
              >
                {key === 'del' ? (
                  <IconBackspace size={24} color="#a3a3a3"/>
                ) : (
                  <Text className="text-white text-2xl font-medium">{key}</Text>
                )}
              </Pressable>
            ))}
          </View>

          {/* CTA */}
          <View className="px-5 mt-4 mb-10">
            <Pressable onPress={handleContinue} disabled={!canContinue}>
              <LinearGradient
                colors={canContinue ? ['#4ade80', '#22c55e'] : ['#262626', '#262626']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  height: 60,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  className={`text-base font-bold ${canContinue ? 'text-black' : 'text-neutral-500'}`}
                >
                  Continue
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Destination Modal */}
      <Modal
        visible={showMethods}
        onHide={() => setShowMethods(false)}
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
            <View className="w-10 h-1 rounded-full bg-neutral-700"/>
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
            <Text className="text-white text-lg font-semibold">Select destination</Text>

            <Pressable
              onPress={() => setShowMethods(false)}
              className="w-9 h-9 rounded-full bg-neutral-800 items-center justify-center"
            >
              <IconX size={16} color="white"/>
            </Pressable>
          </View>

          {/* Methods list */}
          <View className="px-4 gap-3">
            {paymentMethods.map((method) => {
              const selected = method.id === methodId;

              return (
                <Pressable
                  key={method.id}
                  onPress={() => {
                    setMethodId(method.id);
                    setShowMethods(false);
                  }}
                  className={`flex-row items-center bg-neutral-900 rounded-2xl p-4 border ${selected ? 'border-green-400' : 'border-transparent'}`}
                >
                  <MethodIcon method={method}/>

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
                      <Text className="text-green-400 text-[10px] font-semibold">Free</Text>
                    )}
                  </View>

                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center ml-3 ${selected ? 'bg-green-400' : 'border border-neutral-700'}`}
                  >
                    {selected && <IconCheck size={14} color="black"/>}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WithdrawScreen;
