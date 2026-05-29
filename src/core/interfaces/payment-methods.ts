export type PaymentMethodType = 'visa' | 'mastercard' | 'bank' | 'apple-pay' | 'paypal';

export interface PaymentMethodProps {
  id: string;
  type: PaymentMethodType;
  name: string;
  detail: string;
  color: string;
  eta: string;
  fee: number;
}
