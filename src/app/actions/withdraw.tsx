import {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from 'expo-router';

import {ActionHeader, GradientButton} from '@/components';
import {
  PaymentMethodModal,
  AmountKeypad,
  AmountDisplay,
  ChipRow,
  MethodSelectRow,
  AvailableBalanceCard,
} from '@/screens/actions/components';
import {useAmountInput} from '@/screens/actions/hooks';
import {formatCurrency} from '@/core/utils';
import {paymentMethods} from '@/core/data';
import {ScreenRoutes} from '@/core/constants';

const AVAILABLE = 89432.55;

const PERCENTS = [
  {label: '25%', value: 0.25},
  {label: '50%', value: 0.5},
  {label: '75%', value: 0.75},
  {label: 'Max', value: 1},
];

const WithdrawScreen = () => {
  const {amount, setAmount, addKey, numericAmount} = useAmountInput();
  const [methodId, setMethodId] = useState('chase');
  const [showMethods, setShowMethods] = useState(false);

  const selectedMethod = paymentMethods.find((m) => m.id === methodId) ?? paymentMethods[2];
  const exceedsBalance = numericAmount > AVAILABLE;
  const canContinue = numericAmount > 0 && !exceedsBalance;

  const handleContinue = () => {
    if (!canContinue) return;
    router.push({
      pathname: ScreenRoutes.withdrawConfirm,
      params: {
        amount: numericAmount.toFixed(2),
        methodId: selectedMethod.id,
      },
    });
  };

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ActionHeader title="Withdraw" />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <AvailableBalanceCard amount={AVAILABLE} />

          <AmountDisplay
            label="You withdraw"
            value={numericAmount > 0 ? formatCurrency(numericAmount) : amount}
            hasError={exceedsBalance}
          />

          <ChipRow
            chips={PERCENTS}
            onPress={(index) => setAmount((AVAILABLE * PERCENTS[index].value).toFixed(2))}
          />

          <MethodSelectRow
            label="Destination"
            method={selectedMethod}
            onPress={() => setShowMethods(true)}
          />

          <AmountKeypad onKeyPress={addKey} />

          <View className="px-5 mt-4 mb-10">
            <GradientButton label="Continue" onPress={handleContinue} disabled={!canContinue} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <PaymentMethodModal
        visible={showMethods}
        onHide={() => setShowMethods(false)}
        title="Select destination"
        selectedId={methodId}
        onSelect={setMethodId}
      />
    </View>
  );
};

export default WithdrawScreen;
