import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string | undefined | null,
  currencyOrCountry: string = 'USD'
): string {
  if (amount === undefined || amount === null || amount === '') {
    return '$0';
  }

  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  if (isNaN(num)) {
    return String(amount);
  }

  const str = String(currencyOrCountry || '').trim().toUpperCase();

  let currencyCode = 'USD';
  let locale = 'en-US';

  if (str === 'UK' || str === 'UNITED KINGDOM' || str === 'GBP' || str === '£') {
    currencyCode = 'GBP';
    locale = 'en-GB';
  } else if (str === 'AUSTRALIA' || str === 'AU' || str === 'AUD' || str === 'A$') {
    currencyCode = 'AUD';
    locale = 'en-AU';
  } else if (str === 'INR' || str === 'INDIA' || str === '₹') {
    currencyCode = 'INR';
    locale = 'en-IN';
  } else {
    currencyCode = 'USD';
    locale = 'en-US';
  }

  const hasDecimal = num % 1 !== 0;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
}

