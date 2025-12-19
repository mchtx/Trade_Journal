import { CalculatorInput, CalculatorResult, CalculatorYearlyData, ReturnPeriod } from '../types';

/**
 * Basit bileşik faiz hesaplayıcı
 * Formül: A = P(1 + r)^n
 * 
 * Örnek: 10.000 TRY, aylık %4 getiri, 12 ay
 * Ay 1: 10.000 * 1.04 = 10.400
 * Ay 2: 10.400 * 1.04 = 10.816
 * ...
 * Ay 12: 14.026 TRY
 */

export function calculateCompoundInterest(input: CalculatorInput): CalculatorResult {
  const {
    currency,
    principal,
    returnRate,
    returnPeriod,
    periodCount,
    contributionType,
    contributionAmount = 0,
  } = input;

  const yearlyData: CalculatorYearlyData[] = [];
  let balance = principal;
  let totalContributed = principal;
  let totalWithdrawn = 0;

  // Başlangıç verisi (0. periyot)
  yearlyData.push({
    year: 0,
    month: 0,
    periodsCompleted: 0,
    balance: principal,
    interestEarned: 0,
    cumulativeInterest: 0,
    totalContributed: principal,
    totalWithdrawn: 0,
  });

  // Getiri oranını ondalık sayıya çevir
  const rateDecimal = returnRate / 100;

  // Her periyot için döngü
  for (let i = 1; i <= periodCount; i++) {
    // Bileşik faiz uygula
    balance = balance * (1 + rateDecimal);

    // Ekleme/çekim yap
    if (contributionType === 'addition' && contributionAmount > 0) {
      balance += contributionAmount;
      totalContributed += contributionAmount;
    } else if (contributionType === 'withdrawal' && contributionAmount > 0) {
      balance = Math.max(0, balance - contributionAmount);
      totalWithdrawn += contributionAmount;
    }

    // Her periyodu kaydet
    let year = 0;
    let month = 0;

    if (returnPeriod === 'weekly') {
      const weeks = i;
      month = Math.floor((weeks * 7) / 30); // Yaklaşık ay
      year = Math.floor(month / 12);
      month = month % 12;
    } else if (returnPeriod === 'monthly') {
      month = i % 12;
      year = Math.floor(i / 12);
    } else if (returnPeriod === 'quarterly') {
      const months = i * 3;
      year = Math.floor(months / 12);
      month = months % 12;
    } else if (returnPeriod === 'annually') {
      year = i;
      month = 0;
    }

    yearlyData.push({
      year,
      month,
      periodsCompleted: i,
      balance: Math.round(balance * 100) / 100,
      interestEarned: Math.round((balance - totalContributed + totalWithdrawn) * 100) / 100,
      cumulativeInterest: Math.round((balance - totalContributed + totalWithdrawn) * 100) / 100,
      totalContributed: Math.round(totalContributed * 100) / 100,
      totalWithdrawn: Math.round(totalWithdrawn * 100) / 100,
    });
  }

  const finalBalance = Math.round(balance * 100) / 100;
  const totalInterestEarned = Math.round((balance - totalContributed + totalWithdrawn) * 100) / 100;
  const totalPrincipalInvested = Math.round((totalContributed - totalWithdrawn) * 100) / 100;
  const totalReturnPercent =
    totalPrincipalInvested > 0
      ? Math.round(((finalBalance - totalPrincipalInvested) / totalPrincipalInvested) * 10000) / 100
      : 0;

  return {
    input,
    finalBalance,
    totalInterestEarned,
    totalPrincipalInvested,
    yearlyData,
    calculatedAt: new Date().toISOString(),
    totalReturnPercent,
  };
}

/**
 * Para birimi simgesi döndür
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    TRY: '₺',
    GBP: '£',
    JPY: '¥',
    CHF: 'CHF',
    CAD: 'C$',
    AUD: 'A$',
  };
  return symbols[currency] || '$';
}

/**
 * Para birimini yereli formatla
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Yüzdeyi formatla
 */
export function formatPercent(percent: number, decimals = 2): string {
  return `${(Math.round(percent * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)}%`;
}

