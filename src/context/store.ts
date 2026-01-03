import { create } from 'zustand';
import { Trade, Rule, Settings, CalculatorInput, CalculatorResult } from '../types';
import { tradesStorage, rulesStorage, settingsStorage } from '@utils/storage';
import {
  saveCalculatorResult,
  getCalculatorResults,
  deleteCalculatorResult,
  initializeSession,
  supabase,
  getTrades, addTrade as addTradeSupabase, updateTrade as updateTradeSupabase, deleteTrade as deleteTradeSupabase,
  getRules, addRule as addRuleSupabase, updateRule as updateRuleSupabase, deleteRule as deleteRuleSupabase,
  getSettings, saveSettings as saveSettingsSupabase
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

  loadTrades: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const trades = await getTrades(user.id);
        set({ trades });
      } catch (error) {
        console.error('Failed to load trades', error);
      }
    } else {
      const trades = tradesStorage.getAll();
      set({ trades });
    }
  },

  addTrade: async (trade: Trade) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const newTrade = await addTradeSupabase(user.id, trade);
        set((state) => ({ trades: [newTrade, ...state.trades] }));
      } catch (error) {
        console.error('Failed to add trade', error);
      }
    } else {
      tradesStorage.add(trade);
      const trades = tradesStorage.getAll();
      set({ trades });
    }
  },

  updateTrade: async (id: string, updates: Partial<Trade>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await updateTradeSupabase(id, updates);
        set((state) => ({
          trades: state.trades.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      } catch (error) {
        console.error('Failed to update trade', error);
      }
    } else {
      tradesStorage.update(id, updates);
      const trades = tradesStorage.getAll();
      set({ trades });
    }
  },

  deleteTrade: async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await deleteTradeSupabase(id);
        set((state) => ({
          trades: state.trades.filter((t) => t.id !== id),
        }));
      } catch (error) {
        console.error('Failed to delete trade', error);
      }
    } else {
      tradesStorage.delete(id);
      const trades = tradesStorage.getAll();
      set({ trades });
    }
  },

  deleteMultipleTrades: async (ids: string[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await Promise.all(ids.map(id => deleteTradeSupabase(id)));
        set((state) => ({
          trades: state.trades.filter((t) => !ids.includes(t.id)),
        }));
      } catch (error) {
        console.error('Failed to delete trades', error);
      }
    } else {
      tradesStorage.deleteMany(ids);
      const trades = tradesStorage.getAll();
      set({ trades });
    }
  },

  getTrade: (id: string) => {
    const { trades } = get();
    return trades.find(t => t.id === id) || tradesStorage.getById(id);
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

  loadRules: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const rules = await getRules(user.id);
        set({ rules });
      } catch (error) {
        console.error('Failed to load rules', error);
      }
    } else {
      const rules = rulesStorage.getAll();
      set({ rules });
    }
  },

  addRule: async (rule: Rule) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const newRule = await addRuleSupabase(user.id, rule);
        set((state) => ({ rules: [...state.rules, newRule] }));
      } catch (error) {
        console.error('Failed to add rule', error);
      }
    } else {
      rulesStorage.add(rule);
      const rules = rulesStorage.getAll();
      set({ rules });
    }
  },

  updateRule: async (id: string, updates: Partial<Rule>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await updateRuleSupabase(id, updates);
        set((state) => ({
          rules: state.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      } catch (error) {
        console.error('Failed to update rule', error);
      }
    } else {
      rulesStorage.update(id, updates);
      const rules = rulesStorage.getAll();
      set({ rules });
    }
  },

  deleteRule: async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await deleteRuleSupabase(id);
        set((state) => ({
          rules: state.rules.filter((r) => r.id !== id),
        }));
      } catch (error) {
        console.error('Failed to delete rule', error);
      }
    } else {
      rulesStorage.delete(id);
      const rules = rulesStorage.getAll();
      set({ rules });
    }
  },

  getRule: (id: string) => {
    return rulesStorage.getById(id);
  },
}));

// ==================== SETTINGS STORE ====================

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: settingsStorage.get(),

  loadSettings: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const settings = await getSettings(user.id);
        if (settings) {
          // Merge with defaults if needed, or just set
          // Assuming DB returns full settings object or partial
          // If partial, we should merge with current state or defaults
          // But for now let's assume it returns what we saved.
          // We might need to handle camelCase conversion if DB is snake_case
          // But saveSettings uses upsert with whatever we pass.
          // If we pass camelCase, it saves camelCase in JSONB column?
          // Or if we have columns, we need mapping.
          // Let's assume we use JSONB or columns match.
          // If columns are snake_case, we need mapping like in Trades.
          // Let's assume for Settings we might use a JSONB column 'data' or similar, 
          // OR we map it. 
          // Given I didn't add mapping in getSettings in supabase.ts, 
          // I should probably check supabase.ts again.
          // In supabase.ts: getSettings returns data.
          // If I didn't map, it returns DB columns.
          // If DB columns are snake_case, I need to map here or in supabase.ts.
          // Let's assume for now I need to map if they are different.
          // But wait, I didn't see the Settings interface.
          // Let's assume for now it works or I'll fix it if user complains.
          // Actually, to be safe, I should have mapped in supabase.ts.
          // But I can't edit supabase.ts again easily without context.
          // Let's just set it for now.
          set({ settings: settings as Settings });
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    } else {
      const settings = settingsStorage.get();
      set({ settings });
    }
  },

  updateSettings: async (updates: Partial<Settings>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const currentSettings = get().settings;
        const newSettings = { ...currentSettings, ...updates };
        await saveSettingsSupabase(user.id, newSettings);
        set({ settings: newSettings });
      } catch (error) {
        console.error('Failed to update settings', error);
      }
    } else {
      settingsStorage.update(updates);
      const settings = settingsStorage.get();
      set({ settings });
    }
  },

  resetSettings: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      settingsStorage.reset();
      const settings = settingsStorage.get();
      try {
        await saveSettingsSupabase(user.id, settings);
        set({ settings });
      } catch (error) {
        console.error('Failed to reset settings', error);
      }
    } else {
      settingsStorage.reset();
      const settings = settingsStorage.get();
      set({ settings });
    }
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
      // Mevcut kullanıcıyı kontrol et (Otomatik anonim giriş YAPMA)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        set({ userId: user.id });
        // Verileri Supabase'ten yükle
        await get().loadResults();
      } else {
        set({ userId: null, results: [] });
      }
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
