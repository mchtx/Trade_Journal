// Trade Kaydı İçin Temel Interface
export interface Trade {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  positionSize?: number;
  entryTime: string; // ISO 8601 format
  exitTime: string; // ISO 8601 format
  stopLoss?: number;
  takeProfit?: number;
  strategyTag: string;
  notes: string;
  screenshots?: string[]; // base64 or local URLs
  emotionScore: number; // 1-5
  disciplineScore: number; // 1-5
  excludeFromStats: boolean;
  createdAt: string;
  updatedAt: string;
}

// Trade Hesaplamalarından Çıkan Metrikleri İçeren Interface
export interface TradeMetrics {
  tradeReturnPercent: number; // Yüzde bazlı getiri
  riskRewardRatio: number; // R:R
  result: 'win' | 'loss' | 'breakeven';
  tradeDuration: number; // Dakika cinsinden
  entryDate: string; // Tarih (YYYY-MM-DD)
  entryDayOfWeek: string; // Günün adı (Pazartesi, Salı vb.)
  entryHour: number; // Saat (0-23)
}

// Günlük Özet
export interface DailySummary {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  totalReturnPercent: number;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  breakevenCount: number;
  winRate: number; // 0-100
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  notes: string[];
  excludeFromStats: boolean;
}

// Haftalık Gün Performansı (Pazartesi-Cuma)
export interface WeekDayStats {
  dayOfWeek: string; // 'Pazartesi', 'Salı', vb.
  dayIndex: number; // 0-4 (Pazartesi-Cuma)
  totalReturnPercent: number;
  averageReturnPercent: number;
  tradeCount: number;
  winRate: number;
  largestWinPercent: number;
  largestLossPercent: number;
}

// Genel Performans İstatistikleri
export interface PerformanceStats {
  period: 'all' | 'week' | 'month' | 'year';
  totalReturnPercent: number;
  winRate: number; // 0-100
  averageWinPercent: number;
  averageLossPercent: number;
  expectancyPercent: number; // Matematiksel beklenti
  maxWinStreak: number;
  maxLossStreak: number;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  breakevenCount: number;
  averageRiskRewardRatio: number;
  bestTradePercent: number;
  worstTradePercent: number;
}

// Optimum Çıkış Analizi
export interface ExitAnalysis {
  optimalExitPercent: number; // Önerilen en iyi çıkış %
  exitRangeMin: number;
  exitRangeMax: number;
  histogram: {
    range: string; // '0-0.5%', '0.5-1%', vb.
    count: number;
    percentage: number;
  }[];
  analysisNote: string;
}

// Kural Kaydı
export interface Rule {
  id: string;
  title: string;
  description: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ayarlar
export interface Settings {
  theme: 'light' | 'dark';
  defaultRiskRewardThreshold: number;
  excludedDates: string[]; // YYYY-MM-DD formatında
}
