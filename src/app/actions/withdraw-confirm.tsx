import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router, useLocalSearchParams} from 'expo-router';
import {IconCircleCheckFilled} from '@tabler/icons-react-native';

import {formatCurrency} from '@/core/utils';
import {paymentMethods} from '@/core/data';
import {ActionHeader, GradientButton} from '@/components';
import {
  ConfirmHero,
  FlowCard,
  SummaryCard,
  SecurityNotice,
  FinePrint,
} from '@/screens/actions/components';

const WITHDRAWAL_FEE_RATE = 0.002; // 0.20%

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
        <ActionHeader title="Confirm Withdrawal" />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ConfirmHero
            label="You're withdrawing"
            amount={numericAmount}
            etaText={`Arrives ${method.eta.toLowerCase()}`}
            arrowReversed
          />

          <FlowCard method={method} methodIsSource={false} />

          <SummaryCard
            rows={[
              {label: 'Withdrawal amount', value: `$${formatCurrency(numericAmount)}`},
              {label: 'Network fee', value: `$${formatCurrency(networkFee)}`},
              {
                label: 'Method fee',
                value: methodFee > 0 ? `$${formatCurrency(methodFee)}` : 'Free',
                valueColor: methodFee > 0 ? 'text-white' : 'text-green-400',
              },
              {label: 'Arrival', value: method.eta},
            ]}
            total={{
              label: 'You receive',
              value: `$${formatCurrency(youReceive)}`,
              valueColor: 'text-green-400',
            }}
          />

          <View className="mt-6 mx-5">
            <SecurityNotice />
          </View>

          <FinePrint>
            By tapping confirm, you authorize QuantiX to debit{' '}
            <Text className="text-neutral-300">${formatCurrency(numericAmount)}</Text>{' '}
            from your Main Wallet and credit {method.name} ({method.detail}).
          </FinePrint>
        </ScrollView>

        <View className="px-4 pb-6">
          <GradientButton
            label="Confirm Withdrawal"
            onPress={handleConfirm}
            icon={<IconCircleCheckFilled size={18} color="black" />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WithdrawConfirmScreen;
