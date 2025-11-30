import { Trade, Rule, Settings } from '../types';

const STORAGE_KEYS = {
  TRADES: 'trading_journal_trades',
  RULES: 'trading_journal_rules',
  SETTINGS: 'trading_journal_settings',
};

// ==================== TRADES ====================

export const tradesStorage = {
  getAll: (): Trade[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRADES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Trade storage hatası:', error);
      return [];
    }
  },

  getById: (id: string): Trade | null => {
    const trades = tradesStorage.getAll();
    return trades.find(t => t.id === id) || null;
  },

  add: (trade: Trade): void => {
    const trades = tradesStorage.getAll();
    trades.push(trade);
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
  },

  update: (id: string, updates: Partial<Trade>): void => {
    const trades = tradesStorage.getAll();
    const index = trades.findIndex(t => t.id === id);
    if (index !== -1) {
      trades[index] = { ...trades[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    }
  },

  delete: (id: string): void => {
    const trades = tradesStorage.getAll();
    const filtered = trades.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(filtered));
  },

  deleteMany: (ids: string[]): void => {
    const trades = tradesStorage.getAll();
    const filtered = trades.filter(t => !ids.includes(t.id));
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(filtered));
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TRADES);
  },

  export: (): string => {
    const trades = tradesStorage.getAll();
    return JSON.stringify(trades, null, 2);
  },

  import: (jsonData: string): boolean => {
    try {
      const trades = JSON.parse(jsonData);
      if (Array.isArray(trades)) {
        localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Import hatası:', error);
      return false;
    }
  },
};

// ==================== RULES ====================

export const rulesStorage = {
  getAll: (): Rule[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RULES);
      const rules = data ? JSON.parse(data) : [];
      // Sabitlenenleri öne al
      return rules.sort((a: Rule, b: Rule) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });
    } catch (error) {
      console.error('Rules storage hatası:', error);
      return [];
    }
  },

  getById: (id: string): Rule | null => {
    const rules = rulesStorage.getAll();
    return rules.find(r => r.id === id) || null;
  },

  add: (rule: Rule): void => {
    const rules = rulesStorage.getAll();
    rules.push(rule);
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  },

  update: (id: string, updates: Partial<Rule>): void => {
    const rules = rulesStorage.getAll();
    const index = rules.findIndex(r => r.id === id);
    if (index !== -1) {
      rules[index] = { ...rules[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
    }
  },

  delete: (id: string): void => {
    const rules = rulesStorage.getAll();
    const filtered = rules.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(filtered));
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.RULES);
  },
};

// ==================== SETTINGS ====================

const defaultSettings: Settings = {
  theme: 'dark',
  defaultRiskRewardThreshold: 2,
  excludedDates: [],
};

export const settingsStorage = {
  get: (): Settings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : defaultSettings;
    } catch (error) {
      console.error('Settings storage hatası:', error);
      return defaultSettings;
    }
  },

  set: (settings: Settings): void => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  update: (updates: Partial<Settings>): void => {
    const current = settingsStorage.get();
    const updated = { ...current, ...updates };
    settingsStorage.set(updated);
  },

  reset: (): void => {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
