import {View, Text, Pressable, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router, useLocalSearchParams} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {
  IconArrowLeft,
  IconHelpCircle,
  IconCreditCard,
  IconBuildingBank,
  IconBrandApple,
  IconBrandPaypal,
  IconShieldLock,
  IconClockHour4,
  IconWallet,
  IconArrowDown,
  IconInfoCircle,
  IconCircleCheckFilled,
} from '@tabler/icons-react-native';

import {formatCurrency} from '@/utils';
import {paymentMethods} from '@/data';
import type {PaymentMethodProps, PaymentMethodType} from '@/interfaces';

const WITHDRAWAL_FEE_RATE = 0.002; // 0.20%

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

interface SummaryRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

const SummaryRow = ({label, value, valueColor = 'text-white'}: SummaryRowProps) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-neutral-400 text-sm">{label}</Text>
    <Text className={`text-sm font-medium ${valueColor}`}>{value}</Text>
  </View>
);

const WithdrawConfirmScreen = () => {
  const {amount: amountParam, methodId} = useLocalSearchParams<{
    amount: string;
    methodId: string;
  }>();

  const numericAmount = parseFloat(amountParam ?? '0') || 0;
  const method =
    paymentMethods.find((m) => m.id === methodId) ?? paymentMethods[2];

  const networkFee = numericAmount * WITHDRAWAL_FEE_RATE;
  const methodFee = method.fee;
  const totalFee = networkFee + methodFee;
  const youReceive = Math.max(0, numericAmount - totalFee);

  const handleConfirm = () => {
    router.dismissAll();
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

          <Text className="text-white text-base font-semibold">Confirm Withdrawal</Text>

          <Pressable
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
          >
            <IconHelpCircle size={20} color="white"/>
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View className="items-center px-5 mt-4 gap-3">
            <View className="w-20 h-20 rounded-full bg-green-400/10 items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-green-400/20 items-center justify-center">
                <IconArrowDown
                  size={30}
                  color="#4ade80"
                  style={{transform: [{rotate: '180deg'}]}}
                />
              </View>
            </View>

            <Text className="text-neutral-400 text-sm">You&apos;re withdrawing</Text>

            <Text className="text-white text-5xl font-semibold tracking-tight">
              ${formatCurrency(numericAmount)}
            </Text>

            <View className="flex-row items-center gap-1.5 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1.5">
              <IconClockHour4 size={12} color="#4ade80"/>
              <Text className="text-green-400 text-xs font-semibold">
                Arrives {method.eta.toLowerCase()}
              </Text>
            </View>
          </View>

          {/* Flow card — From / To */}
          <View className="mt-8 mx-5">
            <View className="bg-surface-light rounded-2xl p-4 gap-4">
              {/* From */}
              <View className="flex-row items-center">
                <View className="w-11 h-11 rounded-full bg-green-400/20 items-center justify-center">
                  <IconWallet size={20} color="#4ade80"/>
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-neutral-500 text-xs">From</Text>
                  <Text className="text-neutral-200 text-base font-medium">
                    Main Wallet
                  </Text>
                  <Text className="text-neutral-500 text-xs">QuantiX Cash Balance</Text>
                </View>
              </View>

              {/* Connector line with arrow */}
              <View className="flex-row items-center gap-3 ml-5">
                <View className="w-px h-6 bg-neutral-700"/>
                <View className="w-6 h-6 rounded-full bg-neutral-800 items-center justify-center">
                  <IconArrowDown size={12} color="#4ade80"/>
                </View>
              </View>

              {/* To */}
              <View className="flex-row items-center">
                <MethodIcon method={method}/>

                <View className="ml-3 flex-1">
                  <Text className="text-neutral-500 text-xs">To</Text>
                  <Text className="text-neutral-200 text-base font-medium">
                    {method.name}
                  </Text>
                  <Text className="text-neutral-500 text-xs">{method.detail}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Summary */}
          <View className="mt-6 mx-5 gap-4">
            <Text className="text-white text-lg font-medium">Summary</Text>

            <View className="bg-surface-light rounded-2xl p-4 gap-3">
              <SummaryRow
                label="Withdrawal amount"
                value={`$${formatCurrency(numericAmount)}`}
              />

              <View className="h-px bg-neutral-800"/>

              <SummaryRow
                label="Network fee"
                value={`$${formatCurrency(networkFee)}`}
              />

              <View className="h-px bg-neutral-800"/>

              <SummaryRow
                label="Method fee"
                value={methodFee > 0 ? `$${formatCurrency(methodFee)}` : 'Free'}
                valueColor={methodFee > 0 ? 'text-white' : 'text-green-400'}
              />

              <View className="h-px bg-neutral-800"/>

              <SummaryRow label="Arrival" value={method.eta}/>

              <View className="h-px bg-neutral-800"/>

              <View className="flex-row items-center justify-between">
                <Text className="text-white text-base font-semibold">
                  You receive
                </Text>
                <Text className="text-green-400 text-base font-semibold">
                  ${formatCurrency(youReceive)}
                </Text>
              </View>
            </View>
          </View>

          {/* Security notice */}
          <View className="mt-6 mx-5">
            <LinearGradient
              colors={['rgba(74, 222, 128, 0.1)', 'rgba(74, 222, 128, 0.02)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                padding: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(74, 222, 128, 0.2)',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View className="w-9 h-9 rounded-full bg-green-400/20 items-center justify-center">
                <IconShieldLock size={16} color="#4ade80"/>
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-neutral-200 text-sm font-medium">
                  Secured transaction
                </Text>
                <Text className="text-neutral-500 text-xs" numberOfLines={2}>
                  Protected by 256-bit encryption and SIPC insured.
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Fine print */}
          <View className="mt-6 mx-5 flex-row gap-2 mb-10">
            <IconInfoCircle size={14} color="#737373"/>
            <Text className="text-neutral-500 text-xs leading-4 flex-1">
              By tapping confirm, you authorize QuantiX to debit{' '}
              <Text className="text-neutral-300">${formatCurrency(numericAmount)}</Text>{' '}
              from your Main Wallet and credit {method.name} ({method.detail}).
            </Text>
          </View>
        </ScrollView>

        {/* Sticky CTA */}
        <View className="px-4 pb-6">
          <Pressable onPress={handleConfirm}>
            <LinearGradient
              colors={['#4ade80', '#22c55e']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                height: 60,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              <IconCircleCheckFilled size={18} color="black"/>
              <Text className="text-black text-base font-bold">
                Confirm Withdrawal
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WithdrawConfirmScreen;
