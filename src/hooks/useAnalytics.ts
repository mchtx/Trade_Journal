import { useMemo } from 'react';
import { Trade } from '../types';
import {
  calculateTradeMetrics,
  calculatePerformanceStats,
  calculateDailySummary,
  calculateWeekDayStats,
  analyzeOptimalExit,
  analyzeHourlyPerformance,
} from '@utils/calculations';

/**
 * Tüm trade'ler için metrikleri hesapla
 */
export const useTradeMetrics = (trades: Trade[]) => {
  return useMemo(() => {
    return trades.map(trade => calculateTradeMetrics(trade));
  }, [trades]);
};

/**
 * Performans istatistiklerini hesapla
 */
export const usePerformanceStats = (
  trades: Trade[],
  period: 'all' | 'week' | 'month' | 'year' = 'all'
) => {
  return useMemo(() => {
    return calculatePerformanceStats(trades, period);
  }, [trades, period]);
};

/**
 * Günlük özeti hesapla
 */
export const useDailySummary = (trades: Trade[], dateStr: string) => {
  return useMemo(() => {
    return calculateDailySummary(trades, dateStr);
  }, [trades, dateStr]);
};

/**
 * Haftalık gün istatistiklerini hesapla
 */
export const useWeekDayStats = (trades: Trade[]) => {
  return useMemo(() => {
    return calculateWeekDayStats(trades);
  }, [trades]);
};

/**
 * Optimum çıkış analizini hesapla
 */
export const useOptimalExit = (trades: Trade[]) => {
  return useMemo(() => {
    return analyzeOptimalExit(trades);
  }, [trades]);
};

/**
 * Saatlik performans analizini hesapla
 */
export const useHourlyPerformance = (trades: Trade[]) => {
  return useMemo(() => {
    return analyzeHourlyPerformance(trades);
  }, [trades]);
};
