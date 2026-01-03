# Veritabanı Güncellemesi (Rules & Settings)

Uygulamanın tüm özelliklerinin (Kurallar, Ayarlar) sorunsuz çalışması için veritabanı tablosunda bazı eksik sütunların eklenmesi gerekmektedir.

Lütfen aşağıdaki SQL kodunu Supabase Dashboard -> SQL Editor kısmında çalıştırın.

```sql
-- 1. Rules tablosuna 'is_pinned' sütunu ekle
ALTER TABLE rules 
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 2. Settings tablosuna eksik sütunları ekle
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS default_risk_reward_threshold NUMERIC DEFAULT 2,
ADD COLUMN IF NOT EXISTS excluded_dates TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 3. Mevcut verileri güncelle (Opsiyonel)
UPDATE rules SET is_pinned = false WHERE is_pinned IS NULL;
```

## Nasıl Yapılır?

1. [Supabase Dashboard](https://supabase.com/dashboard) adresine gidin.
2. Projenizi seçin.
3. Sol menüden **SQL Editor**'e tıklayın.
4. **New Query** butonuna basın.
5. Yukarıdaki SQL kodunu yapıştırın.
6. **Run** butonuna basın.
7. "Success" mesajını görünce işlem tamamdır! ✅
