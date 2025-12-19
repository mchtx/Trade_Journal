# 🚀 ExtraCalculator - Hızlı Başlangıç Rehberi

## 📍 Nereye Bulunur?

Sol menüde **"💰 Hesaplayıcı"** linkine tıklayın veya doğrudan `http://localhost:5174/calculator` adresine gidin.

## 🎯 3 Adımda Basit Hesaplama

### 1. Temel Parametreleri Girin
```
📊 Hesapla sekmesine gidin
↓
Para Birimi: USD seçin
Başlangıç: 10.000 yazın
Getiri: %4 yazın
Bileşik: Aylık seçin
Süre: 10 yıl, 0 ay
```

### 2. Hesapla Butonuna Basın
```
🧮 Hesapla butonuna tıklayın
↓
Sistem otomatik olarak hesaplar
↓
Sonuç otomatik Geçmiş'e kaydedilir
```

### 3. Sonuçları Görün
```
"Sonuç" sekmesine geçin
↓
Özet kartlarında ana rakamları görün:
  - Gelecek Toplam Değer
  - Toplam Kazanılan Getiri
  - Başlangıç + Eklemeler
  - Toplam Getiri Oranı
```

## 💡 Pratik Örnekler

### Örnek 1: Tasarruf Hedefi
**"10 senede 20.000 TRY'ye ulaşmak istersem, kaç TRY başlamalıyım?"**

```
Parametreler:
├─ Para: TRY
├─ Başlangıç: ? (Bulmaya çalışıyoruz)
├─ Getiri: %5
├─ Süre: 10 yıl
└─ Bileşik: Aylık

Adımlar:
1. Farklı başlangıç tutarları dene
   - 10.000 TRY → 16.400 TRY (eksik)
   - 12.000 TRY → 19.700 TRY (yakın)
   - 12.200 TRY → 20.000 TRY ✅
```

### Örnek 2: Emeklilik Planı
**"Ayda 500€ biriktirirsem 30 senede kaç parayla emekli olabilirim?"**

```
Parametreler:
├─ Para: EUR
├─ Başlangıç: 10.000 (mevcut tasarruf)
├─ Getiri: %6
├─ Düzenli Ekleme: 500€/ay
├─ Süre: 30 yıl
└─ Bileşik: Aylık

Sonuç: ~€550.000 ✅
```

### Örnek 3: Yatırım Karşılaştırması
**"Hangi getiri oranı daha iyi?"**

```
Senaryo A: %4 yıllık getiri
├─ Başlangıç: 10.000$
├─ Süre: 20 yıl
└─ Final: 21.911$ (119% getiri)

Senaryo B: %6 yıllık getiri
├─ Başlangıç: 10.000$
├─ Süre: 20 yıl
└─ Final: 32.071$ (220% getiri) ← Çok daha iyi!

Fark: 10.160$ ek kazanç
```

## 🎛️ İleri Ayarlar

### Düzenli Para Ekleme
```
"Düzenli Ekleme/Çekim" → "Ekleme" seçin
↓
Tutarı: 500 yazın
Frekansı: Aylık seçin
↓
Sistem aylık 500 katkı ekleyecek
```

### Düzenli Para Çekimi
```
"Düzenli Ekleme/Çekim" → "Çekim" seçin
↓
Tutarı: 200 yazın
Frekansı: Aylık seçin
↓
Sistem aylık 200 para çekecek (emeklilik simülasyonu)
```

### Farklı Bileşik Frekansları
| Frekans | Ne Demek | En İyi Olduğu Durum |
|---------|----------|-------------------|
| Günlük | 365 kez/yıl | Yüksek faizli hesaplar |
| Aylık | 12 kez/yıl | Çoğu yatırım ürünü |
| Üç Aylık | 4 kez/yıl | Bazı mevduat ürünleri |
| Yıllık | 1 kez/yıl | Basit tahviller |

**Kural**: Bileşik ne sık olursa, sonuç o kadar yüksek!

## 📊 Grafikleri Anlamak

### 📈 Portföy Değeri Eğrisi
- **Y Ekseni**: Para tutarı
- **X Ekseni**: Zaman
- **Eğim**: Bileşikleşmenin hızlanmasını gösterir
- **Sağ taraf daha dik**: Zaman ilerledikçe hızlanıyor!

### 💰 Dönemsel vs Kümülatif Faiz
- **Bar Chart (Mavi)**: Her ay kazanılan faiz
- **Çizgi (Sarı)**: Toplam birikmiş faiz
- **İkisinin ayrılması**: Bileşikleşme etkisini gösterir

## 🔄 Geçmiş Sonuçları Yönetme

### Son 50 Hesaplama Kaydediliyor
```
"Geçmiş" sekmesini aç
↓
Tüm hesaplamalarını göreceksin
↓
Tarihi, parametreleri, sonuçları gör
```

### Bir Hesaplamayı Kopyalama
```
Karta hover yap
↓
"📋" (kopyala) ikonuna tıkla
↓
Metin panoya kopyalanır
↓
Excel'e yapıştırabilirsin
```

### Bir Hesaplamayı Silme
```
Karta hover yap
↓
"🗑️" (sil) ikonuna tıkla
↓
Hesaplama silinir (geri alınamaz!)
```

## ❓ Sıkça Sorulan Sorular

### S: Getiri oranı nedir?
**C:** Yatırımınızın yıllık kazanç yüzdesidir. Örneğin %4 demek, 10.000 TRY'nin ilk yıl %400 kazanması.

### S: Aylık vs Yıllık bileşik fark?
**C:** Aylık daha fazla kazandırır! Çünkü her ay kazanılan faiz hemen anapara haline geçer ve faiz kazanmaya başlar.

### S: Düzenli ekleme ne işe yarar?
**C:** Emeklilik veya tasarruf planı yapıyorsan, ayda belirli bir miktar biriktireceksen, bunun 30 senede ne kadar olacağını görmek için.

### S: Negatif getiri yapabilir miyim?
**C:** Teorik olarak evet (kayıp simülasyonu), ama tam test edilmedi. Büyük rakamlarda sorun olabilir.

### S: Tablodaki "Getiri %" ne anlama geliyor?
**C:** O dönemde kazanılan yüzde. Mesela %1.2 demek, o ay başındaki bakiyenin %1.2'si kadar kazanç.

## 💾 Veri Yedekleme

### Otomatik Kayıt
- Hesaplamalar otomatik kaydediliyor
- LocalStorage'da tuttuğu için bilgisayarı kapatsan da kalır
- Tarayıcı cache temizleyersen silinir!

### Manuel Yedekleme (Gelecekte)
- Şu an JSON export yok
- Planlanan özellik

## 🎓 Matematiksel Arka Plan

### Neden Bileşik Faiz Önemli?
```
Albert Einstein'ın sözü: "Dünyadaki sekizinci harika bileşik faizdir"

Örnek: 10.000$ @ %7, 40 yıl

Basit Faiz: 10.000 + (10.000 × 0.07 × 40) = 38.000$
Bileşik Faiz: 10.000 × (1.07)^40 = 149.745$

Fark: 111.745$ ekstra kazanç!
```

### Formül (Meraklılar İçin)
```
A = P(1 + r/n)^(nt) + D × [((1 + r/n)^(nt) - 1) / (r/n)]

A = Final Amount (Nihai Miktar)
P = Principal (Anapara)
r = Annual Rate (Yıllık Getiri)
n = Compounds per Year (Yıl başına bileşikleşme)
t = Time in Years (Yıl cinsinden zaman)
D = Regular Deposits (Düzenli Yatırımlar)
```

## 🔗 İlgili Kaynaklar

- **Compound Interest Calculator**: Bu sayfa 😊
- **Trading Journal Dashboard**: Ana işlem takibi
- **Analitik**: İşlem performans analizi

## 📞 Yardım

Sorun mu yaşıyorsun?
1. Sayfayı yenile (F5)
2. Tarayıcı cache'ini temizle
3. GitHub Issues'te rapor et

---

**Başarılı yatırımlar!** 💹
