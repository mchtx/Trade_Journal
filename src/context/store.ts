import { create } from 'zustand';
import { Trade, Rule, Settings, CalculatorInput, CalculatorResult } from '../types';
import { tradesStorage, rulesStorage, settingsStorage } from '@utils/storage';
import {
  saveCalculatorResult,
  getCalculatorResults,
  deleteCalculatorResult,
  initializeSession,
} from '@lib/supabase';

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

// ==================== CALCULATOR STORE ====================

interface CalculatorStore {
  userId: string | null;
  results: CalculatorResult[];
  currentInput: CalculatorInput;
  isLoading: boolean;
  error: string | null;
  initUser: () => Promise<void>;
  setCurrentInput: (input: CalculatorInput) => void;
  addResult: (result: CalculatorResult) => Promise<void>;
  loadResults: () => Promise<void>;
  getResults: () => CalculatorResult[];
  deleteResult: (id: string) => Promise<void>;
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  userId: null,
  results: [],
  currentInput: {
    currency: 'TRY',
    principal: 10000,
    returnRate: 4,
    returnPeriod: 'monthly',
    periodCount: 12,
    contributionType: 'none',
  },
  isLoading: false,
  error: null,

  initUser: async () => {
    try {
      set({ isLoading: true });
      const userId = await initializeSession();
      set({ userId });
      // Verileri Supabase'ten yükle
      await get().loadResults();
    } catch (error) {
      console.error('User initialization error:', error);
      set({ error: 'Bağlantı hatası' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentInput: (input) => {
    set({ currentInput: input });
  },

  addResult: async (result) => {
    try {
      const userId = get().userId;
      if (!userId) throw new Error('User not initialized');

      set({ isLoading: true });
      await saveCalculatorResult(userId, result);

      // Verileri yeniden yükle
      await get().loadResults();
      set({ error: null });
    } catch (error) {
      console.error('Error saving result:', error);
      set({ error: 'Veri kayıt edilemedi' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadResults: async () => {
    try {
      const userId = get().userId;
      if (!userId) return;

      set({ isLoading: true });
      const data = await getCalculatorResults(userId);
      set({ results: data });
    } catch (error) {
      console.error('Error loading results:', error);
      set({ error: 'Veriler yüklenemedi' });
    } finally {
      set({ isLoading: false });
    }
  },

  getResults: () => {
    return get().results;
  },

  deleteResult: async (id) => {
    try {
      set({ isLoading: true });
      await deleteCalculatorResult(id);
      // Verileri yeniden yükle
      await get().loadResults();
      set({ error: null });
    } catch (error) {
      console.error('Error deleting result:', error);
      set({ error: 'Veri silinemedi' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
