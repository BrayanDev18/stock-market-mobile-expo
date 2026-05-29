import type {ReactNode} from 'react';
import {View, Text} from 'react-native';
import {IconArrowDown, IconWallet} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';

import {MethodIcon} from './MethodIcon';
import type {PaymentMethodProps} from '@/core/interfaces';

interface FlowEndpointProps {
  /** "From" or "To". */
  role: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
}

const FlowEndpoint = ({role, icon, title, subtitle}: FlowEndpointProps) => (
  <View className="flex-row items-center">
    {icon}

    <View className="ml-3 flex-1">
      <Text className="text-neutral-500 text-xs">{role}</Text>
      <Text className="text-neutral-200 text-base font-medium">{title}</Text>
      <Text className="text-neutral-500 text-xs">{subtitle}</Text>
    </View>
  </View>
);

const WalletIcon = () => (
  <View className="w-11 h-11 rounded-full bg-green-400/20 items-center justify-center">
    <IconWallet size={20} color={Colors.accentLight} />
  </View>
);

interface FlowCardProps {
  /** Payment method shown on the method endpoint. */
  method: PaymentMethodProps;
  /** When true the method is the source (deposit); otherwise wallet is the source (withdraw). */
  methodIsSource: boolean;
}

/** From → To flow card shared by the deposit/withdraw confirm screens. */
export const FlowCard = ({method, methodIsSource}: FlowCardProps) => {
  const methodEndpoint = (role: string) => (
    <FlowEndpoint
      role={role}
      icon={<MethodIcon method={method} />}
      title={method.name}
      subtitle={method.detail}
    />
  );

  const walletEndpoint = (role: string) => (
    <FlowEndpoint
      role={role}
      icon={<WalletIcon />}
      title="Main Wallet"
      subtitle="QuantiX Cash Balance"
    />
  );

  return (
    <View className="mt-8 mx-5">
      <View className="bg-surface-light rounded-2xl p-4 gap-4">
        {methodIsSource ? methodEndpoint('From') : walletEndpoint('From')}

        {/* Connector line with arrow */}
        <View className="flex-row items-center gap-3 ml-5">
          <View className="w-px h-6 bg-neutral-700" />
          <View className="w-6 h-6 rounded-full bg-neutral-800 items-center justify-center">
            <IconArrowDown size={12} color={Colors.accentLight} />
          </View>
        </View>

        {methodIsSource ? walletEndpoint('To') : methodEndpoint('To')}
      </View>
    </View>
  );
};