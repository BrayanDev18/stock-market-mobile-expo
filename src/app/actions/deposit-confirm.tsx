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

const DepositConfirmScreen = () => {
  const {amount: amountParam, methodId} = useLocalSearchParams<{
    amount: string;
    methodId: string;
  }>();

  const numericAmount = parseFloat(amountParam ?? '0') || 0;
  const method =
    paymentMethods.find((m) => m.id === methodId) ?? paymentMethods[0];

  const fee = method.fee;
  const total = numericAmount + fee;

  const handleConfirm = () => {
    // In a real app this would trigger the API call, then show a success
    // screen. For now, pop back to home.
    router.dismissAll();
  };

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ActionHeader title="Confirm Deposit" />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ConfirmHero
            label="You're depositing"
            amount={numericAmount}
            etaText={`Arrives ${method.eta.toLowerCase()}`}
          />

          <FlowCard method={method} methodIsSource />

          <SummaryCard
            rows={[
              {label: 'Deposit amount', value: `$${formatCurrency(numericAmount)}`},
              {
                label: 'Processing fee',
                value: fee > 0 ? `$${formatCurrency(fee)}` : 'Free',
                valueColor: fee > 0 ? 'text-white' : 'text-green-400',
              },
              {label: 'Arrival', value: method.eta},
            ]}
            total={{label: 'Total charged', value: `$${formatCurrency(total)}`}}
          />

          <View className="mt-6 mx-5">
            <SecurityNotice />
          </View>

          <FinePrint>
            By tapping confirm, you authorize QuantiX to debit{' '}
            <Text className="text-neutral-300">${formatCurrency(total)}</Text>{' '}
            from {method.name} ({method.detail}) and credit your Main Wallet.
          </FinePrint>
        </ScrollView>

        <View className="px-4 pb-6">
          <GradientButton
            label={`Confirm & Deposit $${formatCurrency(total)}`}
            onPress={handleConfirm}
            icon={<IconCircleCheckFilled size={18} color="black" />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default DepositConfirmScreen;
