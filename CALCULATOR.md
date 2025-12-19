# 💰 Bileşik Faiz Hesaplayıcı - ExtraCalculator

Trading Journal uygulamasına ek olarak, gelecek portföy değerinizi projekte etmek için geliştirilmiş profesyonel bir **Bileşik Faiz Hesaplayıcı** özelliğidir.

## 📋 Özellikler

### 1. **Temel Hesaplama Parametreleri**
- ✅ **Para Birimi Seçimi**: USD, EUR, TRY, GBP, JPY, CHF, CAD, AUD
- ✅ **Başlangıç Yatırımı**: İlk yatırılan anapara tutarı
- ✅ **Getiri Oranı**: Yıllık beklenen getiri yüzdesi
- ✅ **Getiri Dönemi**: Aylık, Üç Aylık, Yıllık seçenekleri
- ✅ **Bileşik Frekansı**: Günlük, Aylık, Üç Aylık, Yıllık bileşikleşme

### 2. **Zaman Ayarları**
- 📅 Yıl ve ay cinsinden esnek süre belirleme
- 🔢 Hassas hesaplama için kombinasyon

### 3. **Düzenli Ekleme/Çekim**
- ➕ **Ekleme**: Belirli aralıklarla düzenli katkı
- ➖ **Çekim**: Belirli aralıklarla düzenli para çekimi
- ❌ **Yok**: Sadece başlangıç anaparasıyla hesaplama

### 4. **Özet Sonuç Kartları**
Hesaplama sonrası anında gösterilen dört ana metrik:

```
💰 Gelecek Toplam Değer
   └─ Süre sonunda beklenen portföy değeri

📈 Toplam Kazanılan Getiri
   └─ Anapara dışındaki kazanç (faiz)

💵 Başlangıç + Eklemeler (Anapara)
   └─ Toplam yatırılan para

📊 Toplam Getiri Oranı
   └─ Yüzdesel toplam kazanç oranı
```

### 5. **Detaylı Yıllık Analiz Tablosu**

| Kolon | Açıklama |
|-------|----------|
| Yıl | Projeksiyondaki yıl |
| Ay | Aylar (0-11 arası) |
| Başlangıç Bakiyesi | O döneme başlama değeri |
| Kazanılan Faiz | O dönemde kazanılan faiz |
| Kümülatif Faiz | Başlangıçtan bu ana kadar toplam faiz |
| Yıl Sonu Bakiyesi | Dönem sonu portföy değeri |
| Getiri % | O dönemdeki getiri yüzdesi |

### 6. **Görselleştirmeler**

#### 📈 Portföy Değeri Eğrisi
- Zaman içinde portföy büyümesini gösteren çizgi grafik
- Eğilimleri ve büyüme hızını anlamak için ideal

#### 💰 Dönemsel vs Kümülatif Faiz
- Aylık kazanılan faiz (bar chart)
- Toplam birikmiş faiz (çizgi grafik)
- Bileşikleşme etkisini görselleştirir

#### 📊 İstatistiksel Özet Kartları
- Başlangıç Bakiyesi
- Son Değer
- Toplam Kazanç
- Yıllık Ortalama Getiri

### 7. **Geçmiş Sonuçları Yönetme**
- 📝 Otomatik kayıt: Son 50 hesaplama saklanır
- 🕐 Tarih/Saat: Her hesaplama otomatik zaman damgasıyla kaydedilir
- 📋 Hızlı Özet: Her sonucun ana metriklerini kart formatında gösterir
- 🗑️ Silme: İstenmeyen sonuçları kaldırmak
- 📋 Kopyala: Sonuçları metne dönüştürüp kopyalama

## 🚀 Nasıl Kullanılır?

### Adım 1: Sayfaya Gitmek
1. Menüden **"💰 Hesaplayıcı"** linkine tıklayın
2. Veya doğrudan `/calculator` URL'sine gidin

### Adım 2: Parametreleri Ayarlamak
1. **Para Birimi** seçin (USD, EUR, TRY, vb.)
2. **Başlangıç Yatırımı** girin (örn: 10.000)
3. **Getiri Oranı** belirleyin (örn: %4)
4. **Getiri Dönemi** seçin (Aylık, Üç Aylık, Yıllık)
5. **Bileşik Frekansı** ayarlayın (Aylık, Yıllık vb.)
6. **Süre** belirleyin (10 yıl, 0 ay)
7. (Opsiyonel) **Ekleme/Çekim** ayarları
8. **"🧮 Hesapla"** butonuna basın

### Adım 3: Sonuçları İncelemek
1. **"Sonuç"** sekmesine geçin
2. Özet kartlarından ana metrikleri görün
3. **Tablo/Grafik** seçeneğiyle detayları inceleyin
4. Yıl yıl veya görsel trend analizi yapın

### Adım 4: Geçmiş Sonuçlar
1. **"Geçmiş"** sekmesine gidin
2. Önceki hesaplamalarınızı görün
3. Sonuç kartlarından kopyala veya silin

## 📐 Matematiksel Formüller

### Bileşik Faiz Hesaplaması
```
A = P(1 + r/n)^(nt) + D × [((1 + r/n)^(nt) - 1) / (r/n)]

Burada:
A = Final Bakiye
P = Başlangıç Anaparası
r = Yıllık Getiri Oranı (ondalık)
n = Yıl başına bileşikleşme sayısı
t = Toplam yıl sayısı
D = Periyodik ekleme/çekim tutarı
```

### Toplam Getiri Oranı
```
Getiri % = ((Final Bakiye - Anapara) / Anapara) × 100
```

## 🔗 Bileşik Faiz vs Basit Faiz

### Basit Faiz
```
Faiz = Anapara × Oran × Zaman
```
- Sadece anapara üzerinden faiz
- Kazanılan faiz üzerine faiz eklenmez

### Bileşik Faiz (Bu Hesaplayıcı)
```
A = P(1 + r/n)^(nt)
```
- Kazanılan faiz anapara haline gelerek faiz kazanır
- Zaman ilerledikçe hızlanır (exponential growth)
- Uzun vadede çok daha yüksek getiri

### Örnek: 10.000₺ @ %4/yıl, 20 yıl

| Tür | Hesaplama | Sonuç |
|-----|-----------|-------|
| Basit Faiz | 10.000 × 0.04 × 20 = 8.000₺ | 18.000₺ |
| Bileşik (Yıllık) | 10.000 × (1.04)^20 | 21.911₺ |
| Bileşik (Aylık) | 10.000 × (1+0.04/12)^(12×20) | 22.079₺ |

**Fark: 4.079₺ extra kazanç!**

## 💡 Kullanım Önerileri

1. **Emeklilik Planlaması**: Uzun vadeli tasarruf hedefleri
2. **Yatırım Projeksiyonu**: Portföy büyüme tahminleri
3. **Kredi Simulasyonu**: Borcun büyümesini görmek
4. **Karşılaştırma**: Farklı getiri oranlarını test etmek
5. **Düzenli Katkı**: Ayda/yılda düzenli katkının etkisini görmek

## 📊 Örnek Senaryo

### Scenario: Aydan Aya Tasarruf Planı

**Parametreler:**
- Para Birimi: EUR
- Başlangıç: €10.000
- Getiri: %5/yıl
- Periyot: Aylık Bileşik
- Süre: 30 yıl
- Düzenli Ekleme: €500/ay

**Beklenen Sonuç:**
- Başlangıç: €10.000
- Düzenli Ekleme: €500 × 12 × 30 = €180.000
- Toplam Yatırılan: €190.000
- **Final Değer: ~€445.000** (Faiz kazancı: €255.000)

## ⚙️ Teknik Detaylar

- **Framework**: React + TypeScript
- **State Management**: Zustand
- **Grafik Kütüphanesi**: Recharts
- **UI Components**: Chakra UI
- **Depolama**: LocalStorage (otomatik persist)
- **Hesaplama Hassasiyeti**: ±2 ondalık basamak

## 🔄 Veri Yönetimi

### Otomatik Kayıt
- Her hesaplama otomatik olarak kaydedilir
- Son 50 sonuç tutulur
- LocalStorage'da depolanır

### Manuel Silme
- Geçmiş sekmesinden istenmeyen sonuçları silin
- Bir kez silindiğinde geri alınamaz

### Taşıma
- JSON export/import özelliği planlıyor

## 🐛 Bilinen Sınırlamalar

- Maksimum 100 yıl hassasiyeti (günlük)
- Çok yüksek tutarlar (~1 milyondan fazla) presizyon kaybı yaşayabilir
- Negatif getiri değerleri (kayıp simülasyonu) tam olarak test edilmedi

## 🚀 Gelecek Özellikler

- [ ] Vergi hesaplaması (KDV, vergi oranları)
- [ ] Enflasyon ayarlaması
- [ ] Hedef tutara ulaşma müddetinin hesaplanması
- [ ] PDF rapor oluşturma
- [ ] Karşılaştırmalı analiz (multiple scenarios)
- [ ] WebGL grafikleri performans iyileştirmesi
- [ ] Mobile app versiyonu

## 📞 Destek

Sorularınız veya önerileriniz için GitHub Issues'yi kullanabilirsiniz.

---

**Version**: 1.0.0  
**Son Güncelleme**: Aralık 2024  
**Durum**: Production Ready
