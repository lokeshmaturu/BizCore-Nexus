import { createSlice } from '@reduxjs/toolkit';

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'US Dollar (USD)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (EUR)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'British Pound (GBP)' },
  INR: { code: 'INR', symbol: '₹', rate: 83.5, label: 'Indian Rupee (INR)' },
  JPY: { code: 'JPY', symbol: '¥', rate: 154.2, label: 'Japanese Yen (JPY)' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, label: 'UAE Dirham (AED)' },
};

const savedCurrency = localStorage.getItem('bizcore_currency') || 'USD';

const initialState = {
  activeCurrency: savedCurrency,
  currencies: CURRENCIES,
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      const code = action.payload;
      if (state.currencies[code]) {
        state.activeCurrency = code;
        localStorage.setItem('bizcore_currency', code);
      }
    },
  },
});

export const { setCurrency } = currencySlice.actions;

/**
 * Helper to format amounts dynamically based on active currency
 */
export const formatWithCurrency = (amountInUSD, activeCurrencyCode = 'USD') => {
  if (amountInUSD === undefined || amountInUSD === null || isNaN(amountInUSD)) {
    return '$0';
  }
  const curr = CURRENCIES[activeCurrencyCode] || CURRENCIES.USD;
  const converted = amountInUSD * curr.rate;

  if (curr.code === 'JPY') {
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${curr.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default currencySlice.reducer;
