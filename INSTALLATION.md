# 🚀 Trading Journal Kurulum Rehberi

## 📋 Sistem Gereksinimleri

- **Node.js**: v16 veya üstü
- **npm**: v7 veya üstü
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **Disk**: En az 500MB
- **RAM**: Minimum 2GB

## 🔧 Adım Adım Kurulum

### 1️⃣ Projeyi Klonlayın/İndirin

```bash
# Git kullanıyorsanız
git clone <repo-url>
cd trading-journal

# Veya ZIP dosyasından indirdiyseniz
cd trading-journal
```

### 2️⃣ Node Modüllerini Yükleyin

```bash
npm install
```

Bu komut, `package.json`'daki tüm bağımlılıkları yükler (~320 MB).

### 3️⃣ Dev Server'ı Başlatın

```bash
npm run dev
```

Çıktı:
```
VITE v5.4.21  ready in 341 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4️⃣ Browser'da Açın

`http://localhost:5173` adresine gidin.

## 🏗️ Production Build

```bash
npm run build
```

`dist/` klasöründe optimize edilmiş dosyalar oluşturulur.

## 📦 Bağımlılıklar

| Paket | Versiyon | Amaç |
|--------|---------|------|
| React | 18.2.0 | UI kütüphanesi |
| Vite | 5.0.8 | Build tool |
| TypeScript | 5.3.3 | Type safety |
| Chakra UI | 2.8.2 | UI components |
| Recharts | 2.10.3 | Grafikler |
| Zustand | 4.4.1 | State management |
| React Hook Form | 7.48.0 | Form handling |
| Zod | 3.22.4 | Validasyon |
| date-fns | 2.30.0 | Tarih işlemleri |
| uuid | 9.0.1 | Unique ID generation |

## 🔄 Available Scripts

```bash
npm run dev       # Dev server başlat (hot reload)
npm run build     # Production build
npm run preview   # Build'i local'da preview et
npm run lint      # ESLint çalıştır
```

## 📁 Klasör Yapısı

```
trading-journal/
├── src/                    # Kaynak kod
├── dist/                   # Build çıktısı (build sonrası)
├── node_modules/          # Yüklü paketler
├── public/                # Statik dosyalar (varsa)
├── package.json           # Proje config
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── README.md              # Genel dokumentasyon
├── QUICKSTART.md          # Hızlı başlangıç
├── ARCHITECTURE.md        # Teknik mimari
├── PROJECT_SUMMARY.md     # Proje özeti
└── INSTALLATION.md        # Bu dosya
```

## 🚨 Sorun Çözümü

### Problem: `npm install` hata veriyor

**Çözüm:**
```bash
# npm cache temizle
npm cache clean --force

# Yeniden yükle
npm install
```

### Problem: Port 5173 zaten kullanımda

**Çözüm:**
```bash
# Farklı port belirle
npm run dev -- --port 3000
```

Sonra `http://localhost:3000` açın.

### Problem: Module not found

**Çözüm:**
```bash
# node_modules sil ve yeniden kur
rm -rf node_modules package-lock.json
npm install
```

### Problem: TypeScript hataları

**Çözüm:**
```bash
# ESLint çalıştır
npm run lint

# Build'i dene
npm run build
```

## 🔐 Veri Güvenliği

⚠️ **Önemli**: Veriler **tarayıcınızın LocalStorage**'ında saklanır.

- ✅ Şifrelenmez (browser izolasyonunda güvenli)
- ✅ Sunucuya gönderilmez
- ✅ JSON olarak export edebilirsiniz
- ❌ Browser data temizlenirse kaybolur

**Yedekleme yapın:**
1. **Ayarlar** → **Veri Yönetimi**
2. **Tam Yedek Al** butonuna basın
3. JSON dosyasını kaydedin

## 🌐 Deployment

### Vercel (En Kolay)

```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy et
vercel
```

### Netlify

```bash
# Netlify CLI yükle
npm i -g netlify-cli

# Deploy et
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. `vite.config.ts`'de `base` ayarı yapın
2. GitHub Actions workflow oluşturun
3. Repo settings'de Pages'i configure edin

## 📊 Performance

- **Build Size**: ~320KB (gzipped)
- **Runtime Memory**: ~50-100MB
- **Supported Trades**: 1000-2000+
- **LocalStorage Limit**: 5-10MB

## 🔍 Debug Mode

### Browser Console'da veri kontrol

```javascript
// Tüm işlemleri göster
JSON.parse(localStorage.getItem('trading_journal_trades'))

// Tüm storage göster
console.log(localStorage)

// Saklanan ayarlar
JSON.parse(localStorage.getItem('trading_journal_settings'))
```

## 🎯 Next Steps

1. ✅ Kurulumu tamamla
2. ✅ `npm run dev` ile başlat
3. ✅ QUICKSTART.md'yi oku
4. ✅ İlk işlemi ekle
5. ✅ Dashboard'ı keşfet

## ❓ Sık Sorulan Sorular

**S: Verilerim nereye kaydediliyor?**
A: Tarayıcının LocalStorage'ında. Export yaparak yedekleyebilirsiniz.

**S: Çevrimdışı çalışır mı?**
A: Evet, tamamen client-side çalıştığı için internete ihtiyaç yoktur.

**S: Mobil cihazda çalışır mı?**
A: Evet, responsive tasarımı var. Safari/Chrome ile açabilirsiniz.

**S: Başka cihaza taşıyabilir miyim?**
A: Evet, JSON export yapıp diğer cihazda import edin.

**S: Veri kaybı riskı var mı?**
A: LocalStorage kalıcıdır. Düzenli yedek almak önerilir.

## 🆘 Yardım

- 📖 Dokumentasyon: README.md, ARCHITECTURE.md
- ⚡ Hızlı başlangıç: QUICKSTART.md
- 📊 Proje özeti: PROJECT_SUMMARY.md

---

**Version**: 1.0.0
**Last Updated**: 2025-01-01
