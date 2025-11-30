import { Trade, TradeMetrics, DailySummary, WeekDayStats, PerformanceStats, ExitAnalysis } from '../types';
import { parseISO, format, getDay, getHours, getDate, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';

// ==================== TEMELLİ HESAPLAMALAR ====================

/**
 * Long/Short işlem için yüzde bazlı getiriyi hesapla
 */
export const calculateTradeReturnPercent = (
  direction: 'long' | 'short',
  entryPrice: number,
  exitPrice: number
): number => {
  if (direction === 'long') {
    return ((exitPrice - entryPrice) / entryPrice) * 100;
  } else {
    // Short: entry - exit
    return ((entryPrice - exitPrice) / entryPrice) * 100;
  }
};

/**
 * Risk/Reward oranını hesapla
 */
export const calculateRiskRewardRatio = (
  entryPrice: number,
  exitPrice: number,
  stopLoss?: number,
  takeProfit?: number
): number => {
  let risk = 0;
  let reward = 0;

  if (stopLoss !== undefined && takeProfit !== undefined) {
    risk = Math.abs(entryPrice - stopLoss);
    reward = Math.abs(takeProfit - entryPrice);
  } else {
    // SL/TP yoksa gerçekleşen R:R
    reward = Math.abs(exitPrice - entryPrice);
    risk = reward * 0.5; // Fallback olarak 2:1 varsay
  }

  if (risk === 0) return 0;
  return reward / risk;
};

/**
 * Trade sonucunu belirle (win/loss/breakeven)
 */
export const determineTradeResult = (
  returnPercent: number
): 'win' | 'loss' | 'breakeven' => {
  if (returnPercent > 0.01) return 'win';
  if (returnPercent < -0.01) return 'loss';
  return 'breakeven';
};

/**
 * Trade süresi hesapla (dakika cinsinden)
 */
export const calculateTradeDuration = (entryTime: string, exitTime: string): number => {
  const entry = parseISO(entryTime);
  const exit = parseISO(exitTime);
  return Math.round((exit.getTime() - entry.getTime()) / (1000 * 60));
};

/**
 * Trade için detaylı metrikleri hesapla
 */
export const calculateTradeMetrics = (trade: Trade): TradeMetrics => {
  const returnPercent = calculateTradeReturnPercent(
    trade.direction,
    trade.entryPrice,
    trade.exitPrice
  );

  const riskRewardRatio = calculateRiskRewardRatio(
    trade.entryPrice,
    trade.exitPrice,
    trade.stopLoss,
    trade.takeProfit
  );

  const result = determineTradeResult(returnPercent);
  const duration = calculateTradeDuration(trade.entryTime, trade.exitTime);

  const entryDate = parseISO(trade.entryTime);
  const dateStr = format(entryDate, 'yyyy-MM-dd');
  const dayOfWeek = format(entryDate, 'EEEE', { locale: tr });
  const hour = getHours(entryDate);

  return {
    tradeReturnPercent: returnPercent,
    riskRewardRatio,
    result,
    tradeDuration: duration,
    entryDate: dateStr,
    entryDayOfWeek: dayOfWeek,
    entryHour: hour,
  };
};

// ==================== PERFORMANS HESAPLAMALARI ====================

/**
 * Belirli bir döneme ait trade'leri filtrele
 */
export const filterTradesByPeriod = (
  trades: Trade[],
  period: 'all' | 'week' | 'month' | 'year'
): Trade[] => {
  if (period === 'all') return trades;

  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - now.getDay() + 1); // Pazartesi
      break;
    case 'month':
      startDate.setDate(1);
      break;
    case 'year':
      startDate.setMonth(0);
      startDate.setDate(1);
      break;
  }

  return trades.filter(trade => {
    const tradeDate = parseISO(trade.entryTime);
    return tradeDate >= startDate && tradeDate <= now;
  });
};

/**
 * Toplam performans istatistiklerini hesapla
 */
export const calculatePerformanceStats = (
  trades: Trade[],
  period: 'all' | 'week' | 'month' | 'year' = 'all'
): PerformanceStats => {
  const filteredTrades = filterTradesByPeriod(trades, period);
  const includedTrades = filteredTrades.filter(t => !t.excludeFromStats);

  if (includedTrades.length === 0) {
    return {
      period,
      totalReturnPercent: 0,
      winRate: 0,
      averageWinPercent: 0,
      averageLossPercent: 0,
      expectancyPercent: 0,
      maxWinStreak: 0,
      maxLossStreak: 0,
      tradeCount: 0,
      winCount: 0,
      lossCount: 0,
      breakevenCount: 0,
      averageRiskRewardRatio: 0,
      bestTradePercent: 0,
      worstTradePercent: 0,
    };
  }

  // Metrikleri hesapla
  const metricsArray = includedTrades.map(calculateTradeMetrics);

  // Toplam getiri
  const totalReturnPercent = metricsArray.reduce(
    (sum, m) => sum + m.tradeReturnPercent,
    0
  );

  // Win/Loss dağılımı
  const winTrades = metricsArray.filter(m => m.result === 'win');
  const lossTrades = metricsArray.filter(m => m.result === 'loss');
  const breakevenTrades = metricsArray.filter(m => m.result === 'breakeven');

  const winCount = winTrades.length;
  const lossCount = lossTrades.length;
  const breakevenCount = breakevenTrades.length;
  const winRate = (winCount / includedTrades.length) * 100;

  // Ortalama win/loss
  const averageWinPercent =
    winTrades.length > 0
      ? winTrades.reduce((sum, m) => sum + m.tradeReturnPercent, 0) / winTrades.length
      : 0;

  const averageLossPercent =
    lossTrades.length > 0
      ? lossTrades.reduce((sum, m) => sum + m.tradeReturnPercent, 0) / lossTrades.length
      : 0;

  // Expectancy
  const expectancyPercent =
    winRate * averageWinPercent + (1 - winRate / 100) * averageLossPercent;

  // Max win/loss streak
  const { maxWinStreak, maxLossStreak } = calculateStreaks(metricsArray);

  // Ortalama R:R
  const averageRiskRewardRatio =
    metricsArray.reduce((sum, m) => sum + m.riskRewardRatio, 0) / metricsArray.length;

  // Best/Worst trade
  const bestTradePercent = Math.max(...metricsArray.map(m => m.tradeReturnPercent));
  const worstTradePercent = Math.min(...metricsArray.map(m => m.tradeReturnPercent));

  return {
    period,
    totalReturnPercent,
    winRate,
    averageWinPercent,
    averageLossPercent,
    expectancyPercent,
    maxWinStreak,
    maxLossStreak,
    tradeCount: includedTrades.length,
    winCount,
    lossCount,
    breakevenCount,
    averageRiskRewardRatio,
    bestTradePercent,
    worstTradePercent,
  };
};

/**
 * Win/Loss streak'leri hesapla
 */
const calculateStreaks = (
  metricsArray: TradeMetrics[]
): { maxWinStreak: number; maxLossStreak: number } => {
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;

  for (const metric of metricsArray) {
    if (metric.result === 'win') {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else if (metric.result === 'loss') {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  }

  return { maxWinStreak, maxLossStreak };
};

// ==================== GÜNLÜK HESAPLAMALARI ====================

/**
 * Belirli bir tarihteki trade'leri filtrele
 */
export const getTradesByDate = (trades: Trade[], dateStr: string): Trade[] => {
  return trades.filter(trade => {
    const tradeDate = format(parseISO(trade.entryTime), 'yyyy-MM-dd');
    return tradeDate === dateStr && !trade.excludeFromStats;
  });
};

/**
 * Günlük özet hesapla
 */
export const calculateDailySummary = (trades: Trade[], dateStr: string): DailySummary => {
  const dayTrades = getTradesByDate(trades, dateStr);
  const metricsArray = dayTrades.map(calculateTradeMetrics);

  const date = parseISO(dateStr);
  const dayOfWeek = format(date, 'EEEE', { locale: tr });

  const totalReturnPercent = metricsArray.reduce(
    (sum, m) => sum + m.tradeReturnPercent,
    0
  );

  const winCount = metricsArray.filter(m => m.result === 'win').length;
  const lossCount = metricsArray.filter(m => m.result === 'loss').length;
  const breakevenCount = metricsArray.filter(m => m.result === 'breakeven').length;

  const winRate =
    metricsArray.length > 0 ? (winCount / metricsArray.length) * 100 : 0;

  const bestTrade =
    dayTrades.length > 0
      ? dayTrades.reduce((best, current) => {
          const bestMetrics = calculateTradeMetrics(best);
          const currentMetrics = calculateTradeMetrics(current);
          return currentMetrics.tradeReturnPercent >
            bestMetrics.tradeReturnPercent
            ? current
            : best;
        })
      : null;

  const worstTrade =
    dayTrades.length > 0
      ? dayTrades.reduce((worst, current) => {
          const worstMetrics = calculateTradeMetrics(worst);
          const currentMetrics = calculateTradeMetrics(current);
          return currentMetrics.tradeReturnPercent <
            worstMetrics.tradeReturnPercent
            ? current
            : worst;
        })
      : null;

  const notes = dayTrades.map(t => t.notes).filter(n => n.trim().length > 0);

  return {
    date: dateStr,
    dayOfWeek,
    totalReturnPercent,
    tradeCount: dayTrades.length,
    winCount,
    lossCount,
    breakevenCount,
    winRate,
    bestTrade,
    worstTrade,
    notes,
    excludeFromStats: false,
  };
};

// ==================== HAFTALIK GÜN PERFORMANSI ====================

/**
 * Hafta içi günlerin performans istatistiklerini hesapla
 */
export const calculateWeekDayStats = (trades: Trade[]): WeekDayStats[] => {
  const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  const dayStats: Record<string, TradeMetrics[]> = {
    Pazartesi: [],
    Salı: [],
    Çarşamba: [],
    Perşembe: [],
    Cuma: [],
  };

  // Trade'leri günlere göre grupla
  const includedTrades = trades.filter(t => !t.excludeFromStats);
  for (const trade of includedTrades) {
    const metrics = calculateTradeMetrics(trade);
    const dayName = metrics.entryDayOfWeek;
    if (dayStats[dayName]) {
      dayStats[dayName].push(metrics);
    }
  }

  // İstatistikleri hesapla
  return dayNames.map((dayName, dayIndex) => {
    const metrics = dayStats[dayName] || [];

    if (metrics.length === 0) {
      return {
        dayOfWeek: dayName,
        dayIndex,
        totalReturnPercent: 0,
        averageReturnPercent: 0,
        tradeCount: 0,
        winRate: 0,
        largestWinPercent: 0,
        largestLossPercent: 0,
      };
    }

    const totalReturnPercent = metrics.reduce(
      (sum, m) => sum + m.tradeReturnPercent,
      0
    );
    const averageReturnPercent = totalReturnPercent / metrics.length;

    const winCount = metrics.filter(m => m.result === 'win').length;
    const winRate = (winCount / metrics.length) * 100;

    const largestWinPercent = Math.max(
      ...metrics.map(m => m.tradeReturnPercent),
      0
    );
    const largestLossPercent = Math.min(
      ...metrics.map(m => m.tradeReturnPercent),
      0
    );

    return {
      dayOfWeek: dayName,
      dayIndex,
      totalReturnPercent,
      averageReturnPercent,
      tradeCount: metrics.length,
      winRate,
      largestWinPercent,
      largestLossPercent,
    };
  });
};

/**
 * En iyi ve en kötü trade günlerini bulma
 */
export const findBestWorstDays = (
  trades: Trade[]
): { bestDay: WeekDayStats; worstDay: WeekDayStats } => {
  const weekStats = calculateWeekDayStats(trades);
  const bestDay = weekStats.reduce((best, current) =>
    current.averageReturnPercent > best.averageReturnPercent ? current : best
  );
  const worstDay = weekStats.reduce((worst, current) =>
    current.averageReturnPercent < worst.averageReturnPercent ? current : worst
  );
  return { bestDay, worstDay };
};

// ==================== OPTIMUM ÇIKIS ANALIZI ====================

/**
 * Optimum çıkış yüzdesini analiz et
 */
export const analyzeOptimalExit = (trades: Trade[]): ExitAnalysis => {
  const includedTrades = trades.filter(t => !t.excludeFromStats);
  const winTrades = includedTrades.filter(trade => {
    const metrics = calculateTradeMetrics(trade);
    return metrics.result === 'win';
  });

  if (winTrades.length === 0) {
    return {
      optimalExitPercent: 0,
      exitRangeMin: 0,
      exitRangeMax: 0,
      histogram: [],
      analysisNote: 'Kazanç veren trade bulunmamaktadır.',
    };
  }

  // Kazanç yüzdelerini hesapla
  const exitPercents = winTrades.map(trade => {
    const metrics = calculateTradeMetrics(trade);
    return metrics.tradeReturnPercent;
  });

  const minPercent = Math.min(...exitPercents);
  const maxPercent = Math.max(...exitPercents);
  const avgPercent = exitPercents.reduce((a, b) => a + b, 0) / exitPercents.length;

  // Histogram oluştur (0.5% aralıklarla)
  const binSize = 0.5;
  const histogram: { range: string; count: number; percentage: number }[] = [];

  for (let i = 0; i <= Math.ceil(maxPercent / binSize); i++) {
    const binStart = i * binSize;
    const binEnd = (i + 1) * binSize;
    const count = exitPercents.filter(
      p => p >= binStart && p < binEnd
    ).length;

    if (count > 0) {
      histogram.push({
        range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}%`,
        count,
        percentage: (count / exitPercents.length) * 100,
      });
    }
  }

  // En sık görülen aralığı bul
  const mostFrequentBin = histogram.reduce((max, bin) =>
    bin.percentage > max.percentage ? bin : max
  );

  const optimalExitPercent = parseFloat(mostFrequentBin.range.split('-')[0]);

  return {
    optimalExitPercent,
    exitRangeMin: minPercent,
    exitRangeMax: maxPercent,
    histogram,
    analysisNote: `Geçmiş ${winTrades.length} kazanç işleminin analizine göre, ${optimalExitPercent.toFixed(2)}% - ${(optimalExitPercent + 0.5).toFixed(2)}% aralığında kar almak en etkili gözükmektedir. Bu istatistiksel bir çıkarımdır, mutlak bir tavsiye değildir.`,
  };
};

// ==================== SAATLİK PERFORMANS ====================

/**
 * Saatlere göre performans analiz et
 */
export const analyzeHourlyPerformance = (trades: Trade[]): Record<number, PerformanceStats> => {
  const hourlyTrades: Record<number, Trade[]> = {};

  for (let hour = 0; hour < 24; hour++) {
    hourlyTrades[hour] = [];
  }

  const includedTrades = trades.filter(t => !t.excludeFromStats);
  for (const trade of includedTrades) {
    const metrics = calculateTradeMetrics(trade);
    const hour = metrics.entryHour;
    hourlyTrades[hour].push(trade);
  }

  const hourlyStats: Record<number, PerformanceStats> = {};
  for (let hour = 0; hour < 24; hour++) {
    hourlyStats[hour] = calculatePerformanceStats(hourlyTrades[hour], 'all');
  }

  return hourlyStats;
};
