import { useMemo } from 'react';
import type { CalculatorInput, CalculatorResult } from '../types';
import { calculateCompoundInterest } from '@utils/compoundCalculations';

/**
 * useCalculator Hook - Bileşik faiz hesaplamalarını memoize eder
 */
export function useCalculator(input: CalculatorInput) {
  const result = useMemo(() => {
    return calculateCompoundInterest(input);
  }, [
    input.currency,
    input.principal,
    input.returnRate,
    input.returnPeriod,
    input.periodCount,
    input.contributionType,
    input.contributionAmount,
  ]);

  return result;
}

/**
 * useCalculatorSummary Hook - Özet metrikleri hesapla
 */
export function useCalculatorSummary(result: CalculatorResult) {
  return useMemo(() => {
    const input = result.input;
    const finalYear = result.yearlyData[result.yearlyData.length - 1];
    
    return {
      currency: input.currency,
      finalBalance: result.finalBalance,
      totalInterestEarned: result.totalInterestEarned,
      totalPrincipalInvested: result.totalPrincipalInvested,
      totalReturnPercent: result.totalReturnPercent,
      initialPrincipal: input.principal,
      totalContributions: finalYear?.totalContributed - input.principal || 0,
      totalWithdrawals: finalYear?.totalWithdrawn || 0,
    };
  }, [result]);
}
