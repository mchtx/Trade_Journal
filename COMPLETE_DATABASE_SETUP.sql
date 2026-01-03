-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TRADES TABLE
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
  screenshots text[], -- Array of strings
  emotion_score int,
  discipline_score int,
  exclude_from_stats boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 2. RULES TABLE
-- ==========================================
create table if not exists rules (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  category text,
  is_pinned boolean default false, -- Added column
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 3. SETTINGS TABLE
-- ==========================================
create table if not exists settings (
  user_id uuid references auth.users(id) primary key,
  initial_balance numeric default 0,
  currency text default 'USD',
  risk_per_trade numeric default 1,
  theme text default 'dark',
  default_risk_reward_threshold numeric default 2, -- Added column
  excluded_dates text[] default array[]::text[], -- Added column
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 4. CALCULATOR RESULTS TABLE
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
-- 5. ENABLE RLS (Row Level Security)
-- ==========================================
alter table trades enable row level security;
alter table rules enable row level security;
alter table settings enable row level security;
alter table calculator_results enable row level security;

-- ==========================================
-- 6. CREATE POLICIES
-- ==========================================

-- Trades Policies
create policy "Users can view their own trades" on trades for select using (auth.uid() = user_id);
create policy "Users can insert their own trades" on trades for insert with check (auth.uid() = user_id);
create policy "Users can update their own trades" on trades for update using (auth.uid() = user_id);
create policy "Users can delete their own trades" on trades for delete using (auth.uid() = user_id);

-- Rules Policies
create policy "Users can view their own rules" on rules for select using (auth.uid() = user_id);
create policy "Users can insert their own rules" on rules for insert with check (auth.uid() = user_id);
create policy "Users can update their own rules" on rules for update using (auth.uid() = user_id);
create policy "Users can delete their own rules" on rules for delete using (auth.uid() = user_id);

-- Settings Policies
create policy "Users can view their own settings" on settings for select using (auth.uid() = user_id);
create policy "Users can insert their own settings" on settings for insert with check (auth.uid() = user_id);
create policy "Users can update their own settings" on settings for update using (auth.uid() = user_id);

-- Calculator Results Policies
create policy "Users can view their own calculator results" on calculator_results for select using (auth.uid() = user_id);
create policy "Users can insert their own calculator results" on calculator_results for insert with check (auth.uid() = user_id);
create policy "Users can update their own calculator results" on calculator_results for update using (auth.uid() = user_id);
create policy "Users can delete their own calculator results" on calculator_results for delete using (auth.uid() = user_id);
