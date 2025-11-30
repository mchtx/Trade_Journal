# Trading Journal - Teknik Belgesi

## 🏗️ Mimari Tasarım

### 1. Folder Structure (Feature-Based)

```
src/
├── features/                    # Her feature kendi klasöründe
│   ├── dashboard/
│   │   ├── Dashboard.tsx        # Ana sayfa
│   │   └── components/          # Dashboard özgü komponenler
│   ├── trades/
│   │   ├── TradesList.tsx       # Tüm işlemler
│   │   ├── AddTrade.tsx         # Yeni işlem
│   │   ├── EditTrade.tsx        # İşlem düzenleme
│   │   └── TradeForm.tsx        # Paylaşılan form
│   ├── analytics/
│   │   ├── Analytics.tsx
│   │   └── components/
│   ├── daily-journal/
│   │   └── DailyJournal.tsx
│   ├── rules/
│   │   └── Rules.tsx
│   └── settings/
│       └── Settings.tsx
├── components/                  # Global reusable komponenler
│   └── Layout.tsx              # Ana layout
├── hooks/                       # Custom React hooks
│   └── useAnalytics.ts         # Analitik hesaplamalar
├── utils/                       # Saf fonksiyonlar
│   ├── calculations.ts         # Tüm matematiksel hesaplamalar
│   ├── storage.ts              # LocalStorage işlemleri
│   └── demoData.ts             # Demo veri generator
├── context/                     # State management
│   └── store.ts                # Zustand stores
├── types/                       # TypeScript interfaces
│   └── index.ts
└── Router.tsx                  # Route tanımları
```

## 📊 Data Flow

```
UI Components
    ↓
Zustand Store (trade, rules, settings)
    ↓
Calculation Functions (calculations.ts)
    ↓
Storage Layer (LocalStorage)
    ↓
Browser LocalStorage
```

## 🧮 Hesaplama Fonksiyonları

### Temel Hesaplamalar (`calculations.ts`)

1. **calculateTradeReturnPercent()**
   - Input: direction, entryPrice, exitPrice
   - Output: Yüzde bazlı getiri
   - Kullanım: Her trade için temel metrik

2. **calculateRiskRewardRatio()**
   - Input: entryPrice, exitPrice, stopLoss, takeProfit
   - Output: R:R oranı
   - Fallback: SL/TP yoksa gerçekleşen R:R

3. **calculateTradeMetrics()**
   - Input: Trade obje
   - Output: TradeMetrics (return%, R:R, result, duration, entryDate, vb)
   - Kullanım: Tüm istatistiklerde kullanılır

4. **calculatePerformanceStats()**
   - Input: Trade array, period (all/week/month/year)
   - Output: PerformanceStats (toplam getiri, win rate, expectancy, vb)
   - Filtreleme: excludeFromStats == false olan işlemler

5. **calculateWeekDayStats()**
   - Input: Trade array
   - Output: WeekDayStats[] (5 gün = Pazartesi-Cuma)
   - Analiz: Günlere göre performans

6. **analyzeOptimalExit()**
   - Input: Trade array
   - Output: ExitAnalysis (optimal %, histogram, analiz notu)
   - Metod: Win trade'lerin exit % dağılımı

7. **analyzeHourlyPerformance()**
   - Input: Trade array
   - Output: Record<hour, PerformanceStats>
   - Saatlik analiz: 0-23 saatler

## 🔐 State Management (Zustand)

### useTradeStore
```typescript
trades: Trade[]
addTrade(trade: Trade)
updateTrade(id: string, updates: Partial<Trade>)
deleteTrade(id: string)
deleteMultipleTrades(ids: string[])
getTrade(id: string)
getFilteredTrades(filters: TradeFilters)
loadTrades()
```

### useRuleStore
```typescript
rules: Rule[]
addRule(rule: Rule)
updateRule(id: string, updates: Partial<Rule>)
deleteRule(id: string)
getRule(id: string)
loadRules()
```

### useSettingsStore
```typescript
settings: Settings
updateSettings(updates: Partial<Settings>)
resetSettings()
loadSettings()
```

## 💾 Storage Layer

### tradesStorage
- `getAll()` - Tüm işlemleri getir
- `getById(id)` - ID'ye göre getir
- `add(trade)` - Yeni ekle
- `update(id, updates)` - Güncelle
- `delete(id)` - Sil
- `deleteMany(ids)` - Toplu sil
- `export()` - JSON string olarak dışa aktar
- `import(jsonData)` - JSON'dan içe aktar

### rulesStorage
- Aynı pattern
- Otomatik sabitlenmiş kuralları öne al

### settingsStorage
- Basit key-value store
- Default ayarlarla fallback

## 🎯 Custom Hooks (`useAnalytics.ts`)

Tüm hooklar `useMemo` ile memoized'dir:

```typescript
useTradeMetrics(trades: Trade[])        // Trade metrikleri
usePerformanceStats(trades, period)     // Performans istatistikleri
useDailySummary(trades, dateStr)        // Günlük özet
useWeekDayStats(trades)                 // Hafta günleri performansı
useOptimalExit(trades)                  // Optimum çıkış analizi
useHourlyPerformance(trades)            // Saatlik performans
```

## 🎨 UI Components

### Layout Hierarchy
```
App (Theme Provider)
├── Layout (Sidebar + Header)
│   ├── Dashboard
│   ├── TradesList
│   ├── Analytics
│   ├── DailyJournal
│   ├── Rules
│   └── Settings
```

### Chart Components
- `PerformanceChart`: Bar chart (günlük getiriler)
- `WeekDayStatsChart`: Bar chart (haftanın günleri)
- `HourlyPerformanceChart`: Line chart (saatlik)
- `TopTradesChart`: Horizontal bar (en iyi/kötü)
- `RiskRewardDistribution`: Scatter chart (R:R vs Return%)

### Reusable Components
- `TradeForm`: Validation ile trade formu
- `StatCard`: Metric gösterimi kartları

## 🔄 Data Types

### Trade Interface
```typescript
interface Trade {
  id: string
  symbol: string
  direction: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  positionSize?: number
  entryTime: string (ISO 8601)
  exitTime: string (ISO 8601)
  stopLoss?: number
  takeProfit?: number
  strategyTag: string
  notes: string (zorunlu)
  screenshots?: string[] (base64/url)
  emotionScore: 1-5
  disciplineScore: 1-5
  excludeFromStats: boolean
  createdAt: string
  updatedAt: string
}
```

### TradeMetrics Interface
```typescript
interface TradeMetrics {
  tradeReturnPercent: number
  riskRewardRatio: number
  result: 'win' | 'loss' | 'breakeven'
  tradeDuration: number (dakika)
  entryDate: string (YYYY-MM-DD)
  entryDayOfWeek: string
  entryHour: number (0-23)
}
```

### PerformanceStats Interface
```typescript
interface PerformanceStats {
  period: 'all' | 'week' | 'month' | 'year'
  totalReturnPercent: number
  winRate: number (0-100)
  averageWinPercent: number
  averageLossPercent: number
  expectancyPercent: number
  maxWinStreak: number
  maxLossStreak: number
  tradeCount: number
  winCount: number
  lossCount: number
  breakevenCount: number
  averageRiskRewardRatio: number
  bestTradePercent: number
  worstTradePercent: number
}
```

## 🚀 Performans Optimizasyonları

1. **Memoization**: Tüm custom hooks useMemo kulllanır
2. **Lazy Loading**: Route-based code splitting
3. **LocalStorage Caching**: Tüm veriler cached
4. **Efficient Filtering**: Spread operator yerine filter()
5. **Recharts Optimization**: ResponsiveContainer kullanımı

## 🔒 Veri Güvenliği

- LocalStorage'da şifrelenmeden saklanır (tarayıcı izolasyonu)
- Sıfır sunucu iletişimi
- JSON export ile tam kontrol

## 📱 Responsive Design

- Mobile-first Chakra UI
- Tablet optimized tablo görünümü
- Desktop için yan panel navigasyon
- Drawer menü mobil için

## 🧪 Testing (Öneriler)

```typescript
// Hesaplama testleri
calculateTradeReturnPercent('long', 1.0, 1.05) // 5.0
calculateTradeReturnPercent('short', 1.0, 0.95) // 5.0

// Storage testleri
tradesStorage.add(trade)
expect(tradesStorage.getAll().length).toBe(1)

// Component testleri
<TradeForm tradeId={undefined} />
<DailyJournal />
```

## 📈 Scalability

### Backend Migration Path
1. Store actions'ları API çağrılarına çevir
2. Zustand → Redux Toolkit
3. LocalStorage → API cache layer
4. Data model same kalır

### Database Schema
```sql
trades (
  id, symbol, direction, entryPrice, exitPrice,
  entryTime, exitTime, stopLoss, takeProfit,
  strategyTag, notes, emotionScore, disciplineScore,
  excludeFromStats, userId, createdAt, updatedAt
)

rules (
  id, title, description, isPinned, userId,
  createdAt, updatedAt
)

settings (
  userId, theme, defaultRiskRewardThreshold,
  excludedDates, updatedAt
)
```

## 🐛 Debug Mode

Tarayıcı console'da:
```typescript
// Store erişim
localStorage.getItem('trading_journal_trades')

// Export all
console.log(JSON.parse(localStorage.getItem('trading_journal_trades')))
```

---

**Version**: 1.0.0
**Last Updated**: 2025-01-01
