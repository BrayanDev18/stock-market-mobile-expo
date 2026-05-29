import type {PaymentMethodProps} from '@/core/interfaces';

export const paymentMethods: PaymentMethodProps[] = [
  {
    id: 'visa',
    type: 'visa',
    name: 'Visa Debit',
    detail: '•••• 4829',
    color: '#3b82f6',
    eta: 'Instant',
    fee: 0,
  },
  {
    id: 'mastercard',
    type: 'mastercard',
    name: 'Mastercard',
    detail: '•••• 2847',
    color: '#ef4444',
    eta: 'Instant',
    fee: 0,
  },
  {
    id: 'chase',
    type: 'bank',
    name: 'Chase Bank',
    detail: '•••• 8273 · Checking',
    color: '#4ade80',
    eta: '1-2 days',
    fee: 0,
  },
  {
    id: 'apple-pay',
    type: 'apple-pay',
    name: 'Apple Pay',
    detail: 'Face ID verified',
    color: '#ffffff',
    eta: 'Instant',
    fee: 0,
  },
  {
    id: 'paypal',
    type: 'paypal',
    name: 'PayPal',
    detail: 'cristiano@quantix.app',
    color: '#60a5fa',
    eta: 'Instant',
    fee: 0.5,
  },
];