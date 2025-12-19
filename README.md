# 📊 Trading Journal - İşlem Günlüğü

Profesyonel traders için geliştirilmiş, %100 yüzde bazlı analitik yapan bir web uygulaması. Tüm işlemlerinizi detaylı şekilde kaydedin ve istatistiksel analizlerle strateji optimizasyonunu sağlayın.

## 🎯 Özellikler

### 1. **Trade Kayıt Sistemi**
- ✅ Long/Short işlem kaydı
- ✅ Entry/Exit fiyatı, SL/TP, Pozisyon boyutu
- ✅ Strateji etiketi ve zorunlu notlar
- ✅ Duygu & Disiplin puanlaması (1-5)
- ✅ Ekran görüntüsü desteği
- ✅ İstatistikten hariç tutma seçeneği

### 2. **Otomatik Hesaplamalar**
- ✅ **Trade Return %**: Long/Short için yüzde bazlı getiri
- ✅ **Risk/Reward Ratio**: SL/TP varsa otomatik hesaplama
- ✅ **Win/Loss/Breakeven**: Otomatik sınıflandırma
- ✅ **Max Win/Loss Streak**: Ardışık seriler
- ✅ **Expectancy %**: Matematiksel beklenti

### 3. **Dashboard & İstatistikler**
- 📊 Toplam Getiri %, Win Rate, Ortalama R:R
- 📈 Haftalık/Aylık/Tüm zaman performans
- 📉 Haftanın günlerinin performans analizi
- 🔄 Saatlik işlem performansı
- 🎯 En iyi/En kötü işlemler

### 4. **Gelişmiş Analitikler**
- 🎲 **Optimum Çıkış Analizi**: Kar alma yüzde dağılımı
- 📍 **Risk/Ödül Dağılımı**: Scatter chart görselleştirme
- 📅 **Günlük Günlük**: Gün bazlı işlem özeti
- 🌟 **Trading Kuralları**: Sabitlenebilir önemli kurallar

### 5. **Veri Yönetimi**
- 💾 LocalStorage/IndexedDB ile otomatik saklama
- 📥 JSON Import/Export
- 🔄 Tam yedek alma
- 🌙 Dark/Light Mode desteği

### 6. **💰 Bileşik Faiz Hesaplayıcı (ExtraCalculator)**
- ✅ Başlangıç yatırımı ve getiri oranı parametreleri
- ✅ Farklı bileşik frekansları (günlük, aylık, üç aylık, yıllık)
- ✅ Düzenli ekleme/çekim simülasyonu
- ✅ Yıllık detaylı analiz tablosu
- ✅ Grafik görselleştirme (eğri, bar chart)
- ✅ Geçmiş hesaplamaları kaydetme (son 50)
- ✅ 8 farklı para birimi desteği (USD, EUR, TRY, GBP, JPY, CHF, CAD, AUD)

## 🛠️ Teknoloji Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **UI Framework**: Chakra UI
- **Grafikler**: Recharts
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Tarihler**: date-fns
- **Storage**: localStorage (Backend-ready design)

## 📂 Proje Yapısı

```
src/
├── features/                    # Feature-based klasörler
│   ├── dashboard/               # Dashboard & Analytics
│   ├── trades/                  # CRUD İşlemleri
│   ├── analytics/               # Detaylı Analitikler
│   ├── daily-journal/           # Günlük Günlük
│   ├── rules/                   # Trading Kuralları
│   ├── extra-calculator/        # 💰 Bileşik Faiz Hesaplayıcı
│   │   └── components/          # Form, Tablo, Grafik, vb.
│   └── settings/                # Ayarlar & Veri Yönetimi
├── components/                  # Reusable Komponenler
├── hooks/                       # Custom Hooks (useCalculator, useAnalytics)
├── utils/                       # Saf hesaplama fonksiyonları
│   ├── calculations.ts          # Trade hesaplamaları
│   └── compoundCalculations.ts  # Bileşik faiz hesaplamaları
├── context/                     # Zustand Store
└── types/                       # TypeScript Interfaces
```

## 🚀 Başlangıç

### Kurulum

```bash
npm install
```

### Geliştirme Modu

```bash
npm run dev
```

Browser'de `http://localhost:5173` açılacak.

### Build

```bash
npm run build
```

## 📝 Kullanım

### 1. İşlem Eklemek
1. **İşlemler** → **Yeni İşlem** sayfasına gidin
2. Tüm alanları doldurun (Not alanı zorunludur)
3. **Kaydet** tuşuna basın

### 2. Dashboard Görüntüleme
1. **Dashboard** sayfasında özet metrikleri görün
2. Dönem seçin (Hafta/Ay/Tümü)
3. Grafikler ve istatistikler otomatik güncellenir

### 3. Günlük Analiz
1. **Günlük** sayfasına gidin
2. Tarih seçin
3. O güne ait tüm işlemleri görün
4. Günün özet metrikleri gösterilir

### 4. Trading Kuralları
1. **Kurallar** sayfasında kurallar ekleyin
2. Önemli kuralları ⭐ ile sabitleyin
3. Trading sırasında hızlı referans

### 5. Veri Yönetimi
1. **Ayarlar** → **Veri Yönetimi**
2. JSON olarak dışa aktarın
3. Başka cihazda içe aktarın

## 📊 Metriklerin Hesaplanması

### Trade Return %
```
Long:   (exit - entry) / entry * 100
Short:  (entry - exit) / entry * 100
```

### Risk/Reward Ratio
```
SL/TP varsa:
  Risk = |entry - stopLoss|
  Reward = |takeProfit - entry|
  R:R = reward / risk

SL/TP yoksa: Gerçekleşen R:R kullanılır
```

### Expectancy %
```
Expectancy = (Win Rate * Avg Win %) - ((1 - Win Rate) * |Avg Loss %|)
```

### Optimum Çıkış
- Geçmiş kazanç işlemlerinin exit % dağılımı analiz edilir
- En sık görülen aralık önerilir
- İstatistiksel bulgu, tavsiye değildir

## 🔒 Veri Gizliliği

- Tüm veriler **LocalStorage**'da saklanır
- Sunucuya gönderilmez
- İsterseniz JSON olarak yedekleyip silebilirsiniz

## 🎨 Özelleştirme

### Tema Değiştirme
`src/theme.ts` dosyasında Chakra UI tema ayarları yapılır.

### Renk Paleti
```typescript
colors: {
  brand: {
    500: '#0ea5e9', // Ana renk
  }
}
```

## 🐛 Bilinen Sorunlar

- Çok büyük veri setlerinde (1000+ işlem) performans etkilenebilir
- LocalStorage'ın 5-10MB limiti vardır (tarayıcıya göre değişir)

## 📈 Gelecek Özellikler

- [ ] Backend entegrasyonu (Node.js/Python)
- [ ] Trade fotoğrafı upload'ı
- [ ] Telegram/Discord notifikaşonları
- [ ] Machine Learning tabanlı sinyaller
- [ ] Multi-user desteği
- [ ] Mobile uygulaması

## 💡 Tips & Tricks

1. **Her trade'ye not ekleyin** - Psikolojik analiz için önemlidir
2. **Duygu puanını gerçekçi verin** - Sonra desenleri görebilirsiniz
3. **Olağandışı günleri işaretleyin** - İstatistikleri temiz tutun
4. **Kuralları sabitleyin** - Trading sırasında hızlı başvurun
5. **Düzenli yedek alın** - JSON'u indirip saklayın
6. **Hesaplayıcı ile planlama yapın** - Emeklilik/tasarruf hedeflerini belirleyin

## 📖 Ek Dokümantasyon

- **[CALCULATOR.md](./CALCULATOR.md)** - Bileşik Faiz Hesaplayıcı detaylı rehber
- **[CALCULATOR_QUICKSTART.md](./CALCULATOR_QUICKSTART.md)** - Hızlı başlangıç ve örnekler
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Teknik mimari detayları
- **[QUICKSTART.md](./QUICKSTART.md)** - Genel hızlı başlangıç
- **[INSTALLATION.md](./INSTALLATION.md)** - Kurulum rehberi
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Proje özeti

## 📞 Destek

Sorularınız için GitHub Issues'yi kullanabilirsiniz.

## 📄 Lisans

MIT License - Özgürce kullanabilirsiniz

---

**Başarılı Trading'ler!** 🚀📈
