import {View, Text, Pressable, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router, useLocalSearchParams} from 'expo-router';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {
  IconArrowLeft,
  IconShare3,
  IconArrowDownRight,
  IconArrowUpRight,
  IconCheck,
  IconDownload,
  IconHelpCircle,
  IconCircleCheckFilled,
  IconCopy,
} from '@tabler/icons-react-native';

import {portfolio, stocks} from '@/data';
import {formatCurrency} from '@/utils';

interface DetailRowProps {
  label: string;
  value: string;
  valueClassName?: string;
  copyable?: boolean;
}

const DetailRow = ({label, value, valueClassName = 'text-white', copyable = false}: DetailRowProps) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-neutral-400 text-sm">{label}</Text>
    <View className="flex-row items-center gap-2">
      <Text className={`text-sm font-medium ${valueClassName}`}>{value}</Text>
      {copyable && <IconCopy size={14} color="#737373"/>}
    </View>
  </View>
);

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
  const accentColor = isBuy ? '#4ade80' : '#f87171';

  // Mock settlement date (+2 days)
  const settlementDate = new Date(transaction.date);
  settlementDate.setDate(settlementDate.getDate() + 2);
  const settlementString = settlementDate.toISOString().split('T')[0];

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

          <Text className="text-white text-base font-semibold">Transaction</Text>

          <Pressable
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
          >
            <IconShare3 size={20} color="white"/>
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero — Type icon + amount */}
          <View className="items-center px-5 mt-4 gap-3">
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{backgroundColor: accentColor + '1A'}}
            >
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{backgroundColor: accentColor + '26'}}
              >
                {isBuy
                  ? <IconArrowDownRight size={30} color={accentColor}/>
                  : <IconArrowUpRight size={30} color={accentColor}/>
                }
              </View>
            </View>

            <Text className="text-neutral-400 text-sm">
              {isBuy ? 'Bought' : 'Sold'} {transaction.shares} shares
            </Text>

            <Text
              className="text-white text-5xl font-semibold tracking-tight"
              style={{color: isBuy ? 'white' : 'white'}}
            >
              {isBuy ? '-' : '+'}${formatCurrency(net)}
            </Text>

            {/* Status pill */}
            <View className="flex-row items-center gap-1.5 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1.5 mt-1">
              <IconCircleCheckFilled size={14} color="#4ade80"/>
              <Text className="text-green-400 text-xs font-semibold">Completed</Text>
            </View>
          </View>

          {/* Stock card */}
          <View className="mx-5 mt-8">
            <LinearGradient
              colors={['#161616', '#0f0f0f']}
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
              <Image
                source={{uri: stock.logo}}
                style={{width: 48, height: 48, borderRadius: 12}}
              />

              <View className="ml-3 flex-1">
                <Text className="text-white text-base font-semibold">{stock.symbol}</Text>
                <Text className="text-neutral-500 text-xs" numberOfLines={1}>
                  {stock.name}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-neutral-400 text-xs">Current Price</Text>
                <Text className="text-white text-base font-semibold">
                  ${formatCurrency(stock.price)}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Order Details */}
          <View className="mt-6 px-5 gap-4">
            <Text className="text-white text-lg font-medium">Order Details</Text>

            <View className="bg-surface-light rounded-2xl p-4 gap-3">
              <DetailRow
                label="Order type"
                value={isBuy ? 'Buy · Market' : 'Sell · Market'}
                valueClassName={isBuy ? 'text-green-400' : 'text-red-400'}
              />

              <View className="h-px bg-neutral-800"/>

              <DetailRow label="Shares" value={`${transaction.shares}`}/>

              <View className="h-px bg-neutral-800"/>

              <DetailRow
                label="Price per share"
                value={`$${formatCurrency(transaction.price)}`}
              />

              <View className="h-px bg-neutral-800"/>

              <DetailRow
                label="Subtotal"
                value={`$${formatCurrency(total)}`}
              />

              <View className="h-px bg-neutral-800"/>

              <DetailRow
                label="Commission fee"
                value={`$${formatCurrency(fee)}`}
              />

              <View className="h-px bg-neutral-800"/>

              <View className="flex-row items-center justify-between">
                <Text className="text-white text-base font-semibold">
                  {isBuy ? 'Total paid' : 'Total received'}
                </Text>
                <Text className="text-white text-base font-semibold">
                  ${formatCurrency(net)}
                </Text>
              </View>
            </View>
          </View>

          {/* Timeline */}
          <View className="mt-6 px-5 gap-4">
            <Text className="text-white text-lg font-medium">Timeline</Text>

            <View className="bg-surface-light rounded-2xl p-4 gap-4">
              <View className="flex-row items-start gap-3">
                <View className="items-center">
                  <View className="w-7 h-7 rounded-full bg-green-400 items-center justify-center">
                    <IconCheck size={14} color="black"/>
                  </View>
                  <View className="w-px flex-1 bg-neutral-800 mt-1" style={{minHeight: 24}}/>
                </View>

                <View className="flex-1 pb-4">
                  <Text className="text-white text-sm font-medium">Order placed</Text>
                  <Text className="text-neutral-500 text-xs">{transaction.date} · 09:31 AM</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <View className="items-center">
                  <View className="w-7 h-7 rounded-full bg-green-400 items-center justify-center">
                    <IconCheck size={14} color="black"/>
                  </View>
                  <View className="w-px flex-1 bg-neutral-800 mt-1" style={{minHeight: 24}}/>
                </View>

                <View className="flex-1 pb-4">
                  <Text className="text-white text-sm font-medium">Order executed</Text>
                  <Text className="text-neutral-500 text-xs">{transaction.date} · 09:31 AM</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <View className="items-center">
                  <View className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 items-center justify-center">
                    <View className="w-2 h-2 rounded-full bg-neutral-500"/>
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-neutral-300 text-sm font-medium">Settlement</Text>
                  <Text className="text-neutral-500 text-xs">{settlementString}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Reference */}
          <View className="mt-6 px-5 gap-4">
            <Text className="text-white text-lg font-medium">Reference</Text>

            <View className="bg-surface-light rounded-2xl p-4 gap-3">
              <DetailRow
                label="Order ID"
                value={`#${transaction.id.toUpperCase()}-${transaction.symbol}`}
                copyable
              />

              <View className="h-px bg-neutral-800"/>

              <DetailRow label="Exchange" value={stock.exchange}/>

              <View className="h-px bg-neutral-800"/>

              <DetailRow label="Settlement" value={settlementString}/>
            </View>
          </View>

          {/* Actions */}
          <View className="mt-6 px-5 flex-row gap-3 mb-10">
            <Pressable className="flex-1 bg-surface-light border border-neutral-800 rounded-2xl py-4 items-center gap-2">
              <IconDownload size={20} color="white"/>
              <Text className="text-neutral-200 text-xs font-medium">Download Receipt</Text>
            </Pressable>

            <Pressable className="flex-1 bg-surface-light border border-neutral-800 rounded-2xl py-4 items-center gap-2">
              <IconHelpCircle size={20} color="white"/>
              <Text className="text-neutral-200 text-xs font-medium">Get Help</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default TransactionDetailScreen;
