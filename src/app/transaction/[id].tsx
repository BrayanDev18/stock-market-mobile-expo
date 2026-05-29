import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLocalSearchParams} from 'expo-router';
import {IconShare3} from '@tabler/icons-react-native';

import {portfolio, stocks} from '@/core/data';
import {Colors} from '@/core/constants';
import {ActionHeader, HeaderIconButton} from '@/components';
import {
  TransactionHero,
  TransactionStockCard,
  OrderDetailsCard,
  TransactionTimeline,
  ReferenceCard,
  TransactionActions,
} from '@/screens/transaction/components';

const TransactionDetailScreen = () => {
  const {id} = useLocalSearchParams<{id: string}>();

  const transaction = portfolio.transactions.find((t) => t.id === id);
  const stock = transaction ? stocks.find((s) => s.symbol === transaction.symbol) : null;

  if (!transaction || !stock) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-white text-base">Transaction not found</Text>
      </View>
    );
  }

  const isBuy = transaction.type === 'buy';
  const total = transaction.shares * transaction.price;
  const fee = total * 0.0025;
  const net = isBuy ? total + fee : total - fee;
  const accentColor = isBuy ? Colors.up : Colors.down;

  // Mock settlement date (+2 days)
  const settlementDate = new Date(transaction.date);
  settlementDate.setDate(settlementDate.getDate() + 2);
  const settlementString = settlementDate.toISOString().split('T')[0];

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ActionHeader
          title="Transaction"
          right={
            <HeaderIconButton>
              <IconShare3 size={20} color="white"/>
            </HeaderIconButton>
          }
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <TransactionHero
            isBuy={isBuy}
            shares={transaction.shares}
            net={net}
            accentColor={accentColor}
          />

          <TransactionStockCard stock={stock}/>

          <OrderDetailsCard
            isBuy={isBuy}
            shares={transaction.shares}
            price={transaction.price}
            total={total}
            fee={fee}
            net={net}
          />

          <TransactionTimeline
            date={transaction.date}
            settlementString={settlementString}
          />

          <ReferenceCard
            id={transaction.id}
            symbol={transaction.symbol}
            exchange={stock.exchange}
            settlementString={settlementString}
          />

          <TransactionActions/>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default TransactionDetailScreen;