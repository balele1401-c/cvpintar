-- ====================================================================
-- KERJAAI SAAS INITIAL DATABASE SCHEMA MIGRATION (PRODUCTION SECURED)
-- ====================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  avatar_url text,
  plan text not null check (plan in ('free', 'pro')) default 'free',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 2. CVS TABLE
create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'CV Tanpa Judul',
  template_id text not null default 'classic',
  content_json jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 3. SUBSCRIPTIONS TABLE
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan text not null check (plan in ('free', 'pro')) default 'free',
  status text not null check (status in ('free', 'active', 'expired', 'cancelled')) default 'free',
  provider text not null default 'doku',
  provider_reference text,
  started_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 4. PAYMENTS TABLE
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null default 'doku',
  provider_reference text not null unique,
  amount numeric(12, 2) not null,
  currency text not null default 'IDR',
  status text not null check (status in ('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED')) default 'PENDING',
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 5. AI USAGE TRACKING TABLE
create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  feature text not null,
  usage_count int not null default 1,
  usage_date date not null default current_date,
  created_at timestamp with time zone default now() not null,
  unique(user_id, feature, usage_date)
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_cvs_user_id on public.cvs(user_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_reference on public.payments(provider_reference);
create index if not exists idx_ai_usage_user_date on public.ai_usage(user_id, usage_date);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.cvs enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.ai_usage enable row level security;

-- Profiles: user can read & update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- CVs: user can CRUD their own CVs
create policy "Users can view own cvs" on public.cvs
  for select using (auth.uid() = user_id);

create policy "Users can insert own cvs" on public.cvs
  for insert with check (auth.uid() = user_id);

create policy "Users can update own cvs" on public.cvs
  for update using (auth.uid() = user_id);

create policy "Users can delete own cvs" on public.cvs
  for delete using (auth.uid() = user_id);

-- Subscriptions: user can view own subscriptions (Writes only via service_role)
create policy "Users can view own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Payments: user can view own payments (Writes only via service_role)
create policy "Users can view own payments" on public.payments
  for select using (auth.uid() = user_id);

-- AI Usage: user can view own AI usage
create policy "Users can view own ai usage" on public.ai_usage
  for select using (auth.uid() = user_id);

-- ====================================================================
-- ANTI-TAMPER TRIGGER: PROTECT PROFILES.PLAN FROM CLIENT MODIFICATIONS
-- ====================================================================
create or replace function public.protect_profile_plan()
returns trigger as $$
begin
  -- If plan is being changed, ensure it is only executed by service_role
  if new.plan is distinct from old.plan then
    if auth.role() <> 'service_role' then
      raise exception 'Unauthorized: Column "plan" can only be updated by the server backend.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_before_profile_update on public.profiles;
create trigger on_before_profile_update
  before update on public.profiles
  for each row execute function public.protect_profile_plan();

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ====================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Pengguna KerjaAI'),
    new.raw_user_meta_data->>'avatar_url',
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
