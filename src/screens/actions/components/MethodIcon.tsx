import {createElement} from 'react';
import {View} from 'react-native';
import {
  IconCreditCard,
  IconBuildingBank,
  IconBrandApple,
  IconBrandPaypal,
} from '@tabler/icons-react-native';

import type {PaymentMethodProps, PaymentMethodType} from '@/core/interfaces';

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

/** Circular tinted badge with the brand icon for a payment method. */
export const MethodIcon = ({method, size = 44}: MethodIconProps) => {
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
      {createElement(getMethodIcon(method.type), {
        size: iconSize,
        color: method.color,
      })}
    </View>
  );
};