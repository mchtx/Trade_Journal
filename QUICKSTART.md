# 🚀 Trading Journal - Hızlı Başlangıç

## 📦 Kurulum

```bash
# 1. Proje klasörüne git
cd trading-journal

# 2. Bağımlılıkları yükle
npm install

# 3. Dev server'ı başlat
npm run dev
```

Tarayıcınız otomatik olarak `http://localhost:5173` adresine açılacak.

## 🎯 İlk Adımlar

### 1️⃣ Yeni İşlem Eklemek

1. **İşlemler** sekmesine tıklayın
2. **Yeni İşlem** butonuna basın
3. Formu doldurun:
   - **Sembol**: EURUSD, AAPL, vb.
   - **Yön**: Long/Short
   - **Giriş/Çıkış Fiyatları**: Mutlaka tüm alanları doldurun
   - **SL/TP**: İsteğe bağlı (ama R:R hesabı için önerilir)
   - **Strateji**: Scalping, Swing, Breakout, vb.
   - **Not**: Zorunlu! Neden girdim, neden çıktım yazın
   - **Puanlar**: Duygu ve Disiplin (1-5)

4. **Kaydet** butonuna basın

### 2️⃣ Dashboard'da İstatistikleri Görüntüleme

1. **Dashboard** sekmesini açın
2. Sağ üstte **Hafta/Ay/Tümü** seçeneğinden periyodu seçin
3. Otomatik olarak hesaplanmış metrikleri görün:
   - Toplam Getiri %
   - Win Rate %
   - Ortalama R:R
   - Expectancy %

### 3️⃣ Günlük Analiz

1. **Günlük** sekmesine gidin
2. Tarih seçin (kalender inputu)
3. O güne ait tüm işlemleri ve özeti görün

### 4️⃣ Detaylı Analitikler

1. **Analitik** sekmesini açın
2. Tab'lar arasında geçiş yapın:
   - **Haftanın Günleri**: Pazartesi-Cuma performans
   - **Optimum Çıkış**: Kar alma yüzde önerisi
   - **Risk/Ödül**: Dağılım grafiği

### 5️⃣ Trading Kuralları

1. **Kurallar** sekmesine gidin
2. **Yeni Kural** butonuna basın
3. Kural başlığı ve açıklamasını yazın
4. **Kaydet** butonuna basın
5. Önemli kuralları ⭐ ile sabitleyin

### 6️⃣ Veri Yönetimi

1. **Ayarlar** sekmesine gidin
2. **Veri Yönetimi** bölümü altında:
   - **JSON Olarak Dışa Aktar**: Bilgisayarınıza indir
   - **JSON Dosyasından İçe Aktar**: Başka cihazdan yükle
   - **Tam Yedek Al**: Tüm veri+ayarların yedeği
   - **Tüm İşlemleri Sil**: Tamamen temizle

## 💡 İpuçları

### ✅ Önemli
- **Her trade'ye not yazın** - Psikolojik gelişim için
- **SL/TP belirleyin** - R:R hesabı doğru olsun
- **Duygu puanını adil verin** - Pazar analizi için
- **Olağandışı günleri işaretleyin** - İstatistikleri temiz tutun

### 📊 İstatistik Anlamı
- **Win Rate > 50%**: Sistemin karlı olabilir
- **Expectancy > 0**: Beklenti pozitif (karlı sistem)
- **R:R > 1**: Risk almaya değer bir işlem
- **Streak**: Psikolojik direnci ölçer

### 🎯 Optimum Çıkış Kullanımı
- Grafikteki histogram dağılımını analiz edin
- Önerilen % seviyesini test edin
- Kendi stratejinizle combine edin

## 🔄 Veri Akışı

```
İşlem Ekle
    ↓
LocalStorage'a otomatik kaydedilir
    ↓
Dashboard/Analytics otomatik güncellenir
    ↓
Eksik? JSON'u indirin ve yedekle
```

## 🛠️ Araçlar Açıklaması

| Tool | Kullanım |
|------|----------|
| **Dashboard** | Genel performans özeti |
| **İşlemler** | CRUD + Filtreleme |
| **Analitik** | Derinlemesine istatistikler |
| **Günlük** | Gün bazlı review |
| **Kurallar** | Disiplin hatırlatıcısı |
| **Ayarlar** | Veri yönetimi |

## 🎨 Tema Değiştirme

Sağ üst köşede Ay/Güneş ikonu:
- **Ay**: Dark mode (Gözler rahat)
- **Güneş**: Light mode (Gün ışığında)

## 📱 Mobil Kullanım

- Menu'ye erişmek için hamburger ikonu (☰) basın
- Tablo tamamen responsive
- Grafikleri döndürerek okuabilirsiniz

## ❓ Sık Sorulan Sorular

**S: Verilerim kayıp olur mu?**
A: Hayır, LocalStorage'da kalıcı olarak saklanır. Browser'ı temizlemek istediğinde export edin.

**S: Kaç işlem tutabilirim?**
A: Genelde 1000-2000 işlem. Çok fazla olursa export edip temizleyin.

**S: Verileri başka cihaza taşıyabilir miyim?**
A: Evet, JSON export yapıp diğer cihazda import edin.

**S: Grafikleri indire bilirim mi?**
A: Henüz yok ama İşlemler tablosundan screenshot alabilirsiniz.

**S: Backend var mı?**
A: Şu an yok, sadece frontend. Ileride API eklenebilir.

## 🎓 Örnek İşlem Kaydı

```
Symbol: EURUSD
Direction: Long
Entry: 1.0850
Exit: 1.0920
SL: 1.0800
TP: 1.0950
Strategy: Support Resistance
Notes: Saatin 9'unda S/R kırılması, test sonrası rebound bekledi. 
       İyi girdi, disiplinli çıkış.
Emotion: 4 (Rahat)
Discipline: 5 (Perfect)
```

## 🚀 Sonraki Adımlar

1. **Mini-testler yapın** - Birkaç işlem ekleyip hissedin
2. **Kurallarınızı yazın** - Strateji tanımlayın
3. **Günlük review yapın** - Her gün Günlük sekmesine bakın
4. **Analitikleri inceleyin** - Haftanın günlerine bakın
5. **Sistemi iyileştirin** - Veriler arttıkça daha iyi analitikler

---

**İhtiyaç varsa Readme.md ve ARCHITECTURE.md dosyalarını okuyabilirsiniz.**

Başarılı trading'ler! 🎯📈
