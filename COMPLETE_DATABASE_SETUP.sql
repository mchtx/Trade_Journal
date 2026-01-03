-- UUID eklentisini etkinleştir
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. İŞLEMLER (TRADES) TABLOSU
-- ==========================================
create table if not exists trades (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  symbol text not null,
  direction text check (direction in ('long', 'short')) not null,
  entry_price numeric,
  exit_price numeric,
  position_size numeric,
  entry_time timestamptz not null,
  exit_time timestamptz,
  stop_loss numeric,
  take_profit numeric,
  strategy_tag text,
  notes text,
  screenshots text[], -- String dizisi
  emotion_score int,
  discipline_score int,
  exclude_from_stats boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 2. KURALLAR (RULES) TABLOSU
-- ==========================================
create table if not exists rules (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  category text,
  is_pinned boolean default false, -- Eklenen sütun
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 3. AYARLAR (SETTINGS) TABLOSU
-- ==========================================
create table if not exists settings (
  user_id uuid references auth.users(id) primary key,
  initial_balance numeric default 0,
  currency text default 'USD',
  risk_per_trade numeric default 1,
  theme text default 'dark',
  default_risk_reward_threshold numeric default 2, -- Eklenen sütun
  excluded_dates text[] default array[]::text[], -- Eklenen sütun
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 4. HESAP MAKİNESİ SONUÇLARI TABLOSU
-- ==========================================
create table if not exists calculator_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  principal numeric,
  currency text,
  return_rate numeric,
  return_period text,
  period_count int,
  contribution_type text,
  contribution_amount numeric,
  final_balance numeric,
  total_interest_earned numeric,
  total_return_percent numeric,
  total_principal_invested numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 5. RLS'Yİ ETKİNLEŞTİR (Satır Düzeyinde Güvenlik)
-- ==========================================
alter table trades enable row level security;
alter table rules enable row level security;
alter table settings enable row level security;
alter table calculator_results enable row level security;

-- ==========================================
-- 6. POLİTİKALARI OLUŞTUR
-- ==========================================

-- İşlemler Politikaları
create policy "Kullanıcılar kendi işlemlerini görüntüleyebilir" on trades for select using (auth.uid() = user_id);
create policy "Kullanıcılar kendi işlemlerini ekleyebilir" on trades for insert with check (auth.uid() = user_id);
create policy "Kullanıcılar kendi işlemlerini güncelleyebilir" on trades for update using (auth.uid() = user_id);
create policy "Kullanıcılar kendi işlemlerini silebilir" on trades for delete using (auth.uid() = user_id);

-- Kurallar Politikaları
create policy "Kullanıcılar kendi kurallarını görüntüleyebilir" on rules for select using (auth.uid() = user_id);
create policy "Kullanıcılar kendi kurallarını ekleyebilir" on rules for insert with check (auth.uid() = user_id);
create policy "Kullanıcılar kendi kurallarını güncelleyebilir" on rules for update using (auth.uid() = user_id);
create policy "Kullanıcılar kendi kurallarını silebilir" on rules for delete using (auth.uid() = user_id);

-- Ayarlar Politikaları
create policy "Kullanıcılar kendi ayarlarını görüntüleyebilir" on settings for select using (auth.uid() = user_id);
create policy "Kullanıcılar kendi ayarlarını ekleyebilir" on settings for insert with check (auth.uid() = user_id);
create policy "Kullanıcılar kendi ayarlarını güncelleyebilir" on settings for update using (auth.uid() = user_id);

-- Hesap Makinesi Sonuçları Politikaları
create policy "Kullanıcılar kendi hesaplama sonuçlarını görüntüleyebilir" on calculator_results for select using (auth.uid() = user_id);
create policy "Kullanıcılar kendi hesaplama sonuçlarını ekleyebilir" on calculator_results for insert with check (auth.uid() = user_id);
create policy "Kullanıcılar kendi hesaplama sonuçlarını güncelleyebilir" on calculator_results for update using (auth.uid() = user_id);
create policy "Kullanıcılar kendi hesaplama sonuçlarını silebilir" on calculator_results for delete using (auth.uid() = user_id);
