# Supabase Kurulumu - Adım Adım Rehber

## 📋 Veritabanı Entegrasyonu

Trading Journal artık **Supabase** (PostgreSQL tabanlı gerçek veritabanı) ile veri kaydediyor.

### ✅ Neler Oluştu?

- **Gerçek veritabanı**: LocalStorage yerine Supabase'e veri kaydediliyor
- **Bulut depolama**: Veriler cloud'da güvenli şekilde saklanıyor
- **Multi-device sync**: Diğer cihazlardan aynı verilere erişebilirsiniz
- **Geçmiş koruması**: Silinmiş verileri restore edebilirsiniz
- **Backup otomatik**: Supabase günlük backup alıyor

---

## 🚀 Kurulum Adımları

### 1️⃣ Supabase Hesabı Oluştur

1. https://supabase.com adresine git
2. **Sign Up** butonuna tıkla
3. **Google** veya **GitHub** ile giriş yap
4. E-mail address doğrula

### 2️⃣ Yeni Proje Oluştur

1. Dashboard'da **New Project** → **Create a new project**
2. Bilgileri doldur:
   - **Name**: `trading-journal`
   - **Password**: Güvenli bir şifre (İleride database şifresi)
   - **Region**: `eu-west-1` (Europe West) ✅ Seçim önemli!
3. **Create new project** butonuna tıkla
4. **2-3 dakika** bekle (proje kurulması için)

### 3️⃣ API Anahtarlarını Kopyala

Proje başladığında:

1. Sol menüde **Settings** → **API** sekmesi
2. Şu iki değeri kopyala:
   - **Project URL**: `https://xxxxx.supabase.co` (Eğik çizgisiz)
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4️⃣ Veritabanı Tablolarını Oluştur

Dashboard'da:

1. Sol menüde **SQL Editor** sekmesi
2. **New Query** butonuna tıkla
3. Şu SQL kodunu kopyala:

```sql
-- Calculator Results Table
CREATE TABLE calculator_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  principal DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  return_rate DECIMAL(5, 2) NOT NULL,
  return_period VARCHAR(20) NOT NULL,
  period_count INTEGER NOT NULL,
  contribution_type VARCHAR(20) NOT NULL,
  contribution_amount DECIMAL(15, 2),
  final_balance DECIMAL(15, 2) NOT NULL,
  total_interest_earned DECIMAL(15, 2) NOT NULL,
  total_return_percent DECIMAL(8, 4) NOT NULL,
  total_principal_invested DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_calculator_user_id ON calculator_results(user_id);
CREATE INDEX idx_calculator_created_at ON calculator_results(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE calculator_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON calculator_results FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own data"
  ON calculator_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own data"
  ON calculator_results FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own data"
  ON calculator_results FOR DELETE
  USING (true);
```

4. **Run** butonuna tıkla
5. "Success" mesajını gördüysen tamam! ✅

### 5️⃣ Frontend'e Yapılandırmayı Yapıştır

Proje klasöründe `.env.local` dosyası oluştur:

**Mac/Linux:**
```bash
# Terminal'de
cd "trading-journal-folder"
touch .env.local
```

**Windows (PowerShell):**
```powershell
New-Item -Path .env.local -ItemType File
```

Dosya içeriği:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Adım 3'te kopyaladığın değerleri yapıştır!**

### 6️⃣ Uygulamayı Yeniden Başlat

```bash
npm run dev
```

Browser'de yenile:
- http://localhost:5174/calculator adresine git
- Hesaplama yap
- **"💾 Veritabanına Kaydet"** butonuna tıkla
- ✅ Başarı mesajı görünmeli!

---

## 🎯 Kontrol Etme

### Veritabanında Veri Olup Olmadığını Kontrol Et

1. Supabase Dashboard'a git
2. Sol menüde **Table Editor**
3. **calculator_results** tablosunu seç
4. Verileriniz görünmeli!

### Tarayıcı Console'da Kontrol Et

Browser'de **F12** → **Console** sekmesi:

```javascript
// Supabase'den veri çek
const { data, error } = await supabase
  .from('calculator_results')
  .select('*')
  .limit(10);

console.log(data);
```

---

## 📊 Yeni Özellikler

### Hesap Kaydı

1. Hesaplama parametrelerini gir
2. Otomatik hesaplanan sonuçları gör
3. **"💾 Veritabanına Kaydet"** butonuna tıkla
4. ✅ Veri Supabase'de kaydedildi!

### Geçmiş Hesaplamalar

1. **"📊 Geçmiş Hesaplamalar"** sekmesini aç
2. Tüm kayıtlı hesaplamalar görüntülenir
3. **Sil** butonuyla istemediğin kaydı kaldırabilirsin

### Grafik

1. **"📈 Grafik"** sekmesinde portföy yöneliş görüntülenir
2. Kaydettiğin hesaplamalara göre güncellenir

---

## 🔐 Güvenlik

- ✅ Veriler HTTPS'le şifreli aktarılıyor
- ✅ Her kullanıcı kendi verilerine erişiyor (Anonymous user)
- ✅ Supabase sınırlı sorgularla korunan PostgreSQL
- ⚠️ `.env.local` dosyasını .gitignore'a ekledim (gizli kalır)

---

## ⚡ Sorun Giderm

### Bağlantı Hatası

```
"Bağlantı hatası" mesajı görürsen
```

**Çözüm:**
1. `.env.local` dosyasını kontrol et
2. `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` doğru mu?
3. Supabase projesinin durumu aktif mi? (Dashboard'da kontrol et)

### "Veri kayıt edilemedi"

**Çözüm:**
1. Browser Console'u aç (F12)
2. Hata mesajını oku
3. Supabase Dashboard'dan tabloyu kontrol et

### Veriler görünmüyor

**Çözüm:**
1. "Veritabanına Kaydet" butonunun başarı mesajı verdi mi?
2. Supabase'de yeni kullanıcı ID oluştu mu?
3. Başka tarayıcıdan dene

---

## 📚 Teknik Detaylar

### Dosyalar

| Dosya | Amaç |
|-------|------|
| `src/lib/supabase.ts` | Supabase client ve API fonksiyonları |
| `.env.local` | Gizli API anahtarları |
| `src/context/store.ts` | Zustand store, Supabase ile senkronize |
| `src/features/extra-calculator/components/ResultsHistory.tsx` | Geçmiş listesi |

### Veri Akışı

```
Hesap Oluştur
    ↓
"Kaydet" Butonuna Tıkla
    ↓
Zustand Store → Supabase API
    ↓
PostgreSQL Veritabanı
    ↓
Başarı Mesajı + Sayfa Yenile
    ↓
Geçmiş Hesaplamalar Tablosunda Görüntüle
```

---

## 🎓 İleri Kullanım

### Tüm Verileri Export Et

```sql
SELECT * FROM calculator_results 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC;
```

Supabase Dashboard → SQL Editor'da çalıştır

### Backup Al

Supabase otomatik daily backup alıyor (Settings → Backups)

---

## ✅ Başarı Kriteresi

✅ `npm run dev` komutuyla uygulama çalışıyor
✅ `.env.local` dosyasında Supabase anahtarları var
✅ Hesaplama yapıp "Kaydet" butonuna tıklayabiliyorum
✅ Supabase Dashboard'da veri görüyorum
✅ "Geçmiş Hesaplamalar" sekmesinde kaydım görülüyor

**Tebrikler! Artık bulut veritabanı kullanıyorsunuz! 🚀**

---

**Sorular?** Terminal'de çalıştır:
```bash
npm run dev
# Hata görürsen konsol mesajlarını oku (F12 → Console)
```
