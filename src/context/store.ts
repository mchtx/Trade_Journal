import { create } from 'zustand';
import { Trade, Rule, Settings } from '../types';
import { tradesStorage, rulesStorage, settingsStorage } from '@utils/storage';

interface TradeStore {
  trades: Trade[];
  // Trades
  loadTrades: () => void;
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  deleteMultipleTrades: (ids: string[]) => void;
  getTrade: (id: string) => Trade | null;
  // Filtering
  getFilteredTrades: (filters: TradeFilters) => Trade[];
}

interface RuleStore {
  rules: Rule[];
  loadRules: () => void;
  addRule: (rule: Rule) => void;
  updateRule: (id: string, updates: Partial<Rule>) => void;
  deleteRule: (id: string) => void;
  getRule: (id: string) => Rule | null;
}

interface SettingsStore {
  settings: Settings;
  loadSettings: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

export interface TradeFilters {
  dateFrom?: string;
  dateTo?: string;
  symbol?: string;
  direction?: 'long' | 'short';
  strategyTag?: string;
  excludeFromStats?: boolean;
  rrMin?: number;
  rrMax?: number;
}

// ==================== TRADE STORE ====================

export const useTradeStore = create<TradeStore>((set, get) => ({
  trades: [],

  loadTrades: () => {
    const trades = tradesStorage.getAll();
    set({ trades });
  },

  addTrade: (trade: Trade) => {
    tradesStorage.add(trade);
    const trades = tradesStorage.getAll();
    set({ trades });
  },

  updateTrade: (id: string, updates: Partial<Trade>) => {
    tradesStorage.update(id, updates);
    const trades = tradesStorage.getAll();
    set({ trades });
  },

  deleteTrade: (id: string) => {
    tradesStorage.delete(id);
    const trades = tradesStorage.getAll();
    set({ trades });
  },

  deleteMultipleTrades: (ids: string[]) => {
    tradesStorage.deleteMany(ids);
    const trades = tradesStorage.getAll();
    set({ trades });
  },

  getTrade: (id: string) => {
    return tradesStorage.getById(id);
  },

  getFilteredTrades: (filters: TradeFilters) => {
    const { trades } = get();
    let filtered = [...trades];

    if (filters.dateFrom) {
      filtered = filtered.filter(t => t.entryTime >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => t.entryTime <= filters.dateTo!);
    }

    if (filters.symbol) {
      filtered = filtered.filter(t =>
        t.symbol.toLowerCase().includes(filters.symbol!.toLowerCase())
      );
    }

    if (filters.direction) {
      filtered = filtered.filter(t => t.direction === filters.direction);
    }

    if (filters.strategyTag) {
      filtered = filtered.filter(t => t.strategyTag === filters.strategyTag);
    }

    if (typeof filters.excludeFromStats === 'boolean') {
      filtered = filtered.filter(t => t.excludeFromStats === filters.excludeFromStats);
    }

    return filtered;
  },
}));

// ==================== RULE STORE ====================

export const useRuleStore = create<RuleStore>((set) => ({
  rules: [],

  loadRules: () => {
    const rules = rulesStorage.getAll();
    set({ rules });
  },

  addRule: (rule: Rule) => {
    rulesStorage.add(rule);
    const rules = rulesStorage.getAll();
    set({ rules });
  },

  updateRule: (id: string, updates: Partial<Rule>) => {
    rulesStorage.update(id, updates);
    const rules = rulesStorage.getAll();
    set({ rules });
  },

  deleteRule: (id: string) => {
    rulesStorage.delete(id);
    const rules = rulesStorage.getAll();
    set({ rules });
  },

  getRule: (id: string) => {
    return rulesStorage.getById(id);
  },
}));

// ==================== SETTINGS STORE ====================

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: settingsStorage.get(),

  loadSettings: () => {
    const settings = settingsStorage.get();
    set({ settings });
  },

  updateSettings: (updates: Partial<Settings>) => {
    settingsStorage.update(updates);
    const settings = settingsStorage.get();
    set({ settings });
  },

  resetSettings: () => {
    settingsStorage.reset();
    const settings = settingsStorage.get();
    set({ settings });
  },
}));
