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
} from '@/screens/actions/components';
import {useAmountInput} from '@/screens/actions/hooks';
import {formatCurrency} from '@/core/utils';
import {paymentMethods} from '@/core/data';
import {ScreenRoutes} from '@/core/constants';

const QUICK_AMOUNTS = [100, 500, 1000, 5000];
const QUICK_CHIPS = QUICK_AMOUNTS.map((value) => ({label: `$${value.toLocaleString()}`}));

const DepositScreen = () => {
  const {amount, setAmount, addKey, numericAmount} = useAmountInput();
  const [methodId, setMethodId] = useState(paymentMethods[0].id);
  const [showMethods, setShowMethods] = useState(false);

  const selectedMethod = paymentMethods.find((m) => m.id === methodId) ?? paymentMethods[0];

  const handleContinue = () => {
    if (numericAmount <= 0) return;
    router.push({
      pathname: ScreenRoutes.depositConfirm,
      params: {
        amount: numericAmount.toFixed(2),
        methodId: selectedMethod.id,
      },
    });
  };

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ActionHeader title="Deposit" />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <AmountDisplay
            label="Amount to deposit"
            value={numericAmount > 0 ? formatCurrency(numericAmount) : amount}
            showSecurityNote
          />

          <ChipRow
            chips={QUICK_CHIPS}
            onPress={(index) => setAmount(String(QUICK_AMOUNTS[index]))}
          />

          <MethodSelectRow
            label="Payment Method"
            method={selectedMethod}
            onPress={() => setShowMethods(true)}
          />

          <AmountKeypad onKeyPress={addKey} />

          <View className="px-5 mt-4 mb-10">
            <GradientButton label="Continue" onPress={handleContinue} disabled={numericAmount <= 0} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <PaymentMethodModal
        visible={showMethods}
        onHide={() => setShowMethods(false)}
        title="Select method"
        selectedId={methodId}
        onSelect={setMethodId}
      />
    </View>
  );
};

export default DepositScreen;
