# Trading Journal - Copilot Instructions

## Proje Özeti

**Trading Journal**, profesyonel traders için geliştirilmiş, yüzde bazlı analitik yapan bir web uygulamasıdır. React + TypeScript + Vite ile build edilmiş, tamamen frontend'dir.

## 🎯 Amaç

Tüm işlemleri detaylı kaydedip %100 yüzde bazlı analizler üretmek:
- Haftanın en iyi/en kötü günleri
- Optimum kar alma seviyeleri (exit %)
- Risk-ödül performansı
- Strateji optimizasyonu

## 📂 Proje Yapısı

```
src/
├── features/          # Feature-based modules
├── components/        # Global components
├── hooks/             # Custom React hooks
├── utils/             # Pure functions
├── context/           # Zustand stores
└── types/             # TypeScript interfaces
```

## 🔑 Önemli Dosyalar

| Dosya | Amaç |
|-------|------|
| `src/utils/calculations.ts` | Tüm matematiksel hesaplamalar |
| `src/context/store.ts` | Zustand state management |
| `src/hooks/useAnalytics.ts` | Memoized custom hooks |
| `src/types/index.ts` | TypeScript interfaces |

## 📝 Coding Standards

- **Language**: TypeScript strict mode
- **Style**: Chakra UI components
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **Storage**: LocalStorage only
- **Calculations**: Pure functions in utils/

## 🔄 Genel Veri Akışı

```
User Action → Component → Zustand Store → Calculation → LocalStorage
```

## 📊 Hesaplama Özeti

- **Trade Return %**: Long/Short formülü
- **R:R Ratio**: SL/TP'den veya gerçekleşen yüzde
- **Win/Loss**: Return % temelinde otomatik
- **Expectancy**: (Win Rate × Avg Win) - (Loss Rate × |Avg Loss|)
- **Streaks**: Ardışık win/loss sayısı
- **Optimum Exit**: Win işlemlerinin exit % dağılımı

## 🎨 UI Components

- Chakra UI dark/light mode
- Recharts grafikler
- Responsive design (mobile, tablet, desktop)
- Dark mode default

## 🔐 Veri Kalıcılığı

- **Storage**: LocalStorage (tarayıcı)
- **Format**: JSON
- **Backup**: Manual export/import
- **Migration**: Backend-ready design

## 🧪 Testing Points

- Calculation functions (deterministic)
- Storage operations (persistence)
- Component rendering
- Custom hooks (memoization)

## 🚀 Deployment

- **Build**: `npm run build` (dist/ folder)
- **Preview**: `npm run preview`
- **Size**: ~320KB gzipped
- **Browser**: Chrome, Firefox, Safari, Edge

## 📖 Dokumentasyon

- `README.md` - Genel bilgi
- `QUICKSTART.md` - Hızlı başlangıç
- `ARCHITECTURE.md` - Teknik detaylar
- `PROJECT_SUMMARY.md` - Proje özeti
- `INSTALLATION.md` - Kurulum rehberi

## ⚡ Sık Yapılan Görevler

### Yeni Feature Ekleme
1. `src/features/[feature-name]/` klasörü oluştur
2. Main component ve subcomponents ekle
3. `src/routes.tsx`'e route ekle

### Yeni Calculation Ekleme
1. Pure function olarak `src/utils/calculations.ts`'e ekle
2. `src/hooks/useAnalytics.ts`'de useMemo hook oluştur
3. Component'ta hook'u kullan

### State Ekleme
1. `src/context/store.ts`'de Zustand store oluştur
2. Component'larda `useStore()` hook'u kullan
3. Otomatik olarak LocalStorage persist olur

## 🎯 Geliştirme Tipsler

- Hesaplamalar her zaman saf fonksiyon olmalı
- Custom hooks her zaman useMemo ile wrapper olmalı
- Tüm trade verileri excludeFromStats kontrolü yapmalı
- Tarih işlemleri daima ISO 8601 format'ında
- Yüzde değerleri round et: `.toFixed(2)`

## 🔗 Harici Bağlantılar

- [React Docs](https://react.dev)
- [TypeScript](https://typescriptlang.org)
- [Chakra UI](https://chakra-ui.com)
- [Recharts](https://recharts.org)
- [Zustand](https://github.com/pmndrs/zustand)

## ✅ Pre-commit Checklist

- [ ] TypeScript compiles without errors
- [ ] Calculations are pure functions
- [ ] Components use custom hooks
- [ ] Responsive design tested
- [ ] Dark/Light mode works
- [ ] LocalStorage persist works

---

**Version**: 1.0.0
**Status**: Production Ready
