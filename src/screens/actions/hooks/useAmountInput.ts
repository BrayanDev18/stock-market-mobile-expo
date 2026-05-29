import {useState} from 'react';

/**
 * Numeric keypad amount state shared by the deposit and withdraw flows.
 *
 * Mirrors the original per-screen logic exactly: a string buffer that starts at
 * `'0'`, rejects a second decimal point, caps to two decimal places, and
 * replaces the leading zero when the first digit is typed. `del` removes the
 * last char (falling back to `'0'`).
 */
export const useAmountInput = (initial = '0') => {
  const [amount, setAmount] = useState(initial);

  const addKey = (key: string) => {
    if (key === 'del') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (key === '.' && amount.includes('.')) return;
    if (amount.includes('.') && amount.split('.')[1]?.length >= 2) return;
    setAmount((prev) => (prev === '0' && key !== '.' ? key : prev + key));
  };

  const numericAmount = parseFloat(amount) || 0;

  return {amount, setAmount, addKey, numericAmount};
};
