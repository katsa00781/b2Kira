-- ============================================================
-- Doboz Légzés app – adatbázis séma
-- Projekt: familyBudget (eguhipjgnhbajbmnrskm)
-- Minden tábla `breathing_` prefixet kap, hogy elkülönüljön
-- a pénzügyi tábláktól ugyanabban a public sémában.
--
-- Lefuttatva: 2026-08-24, Supabase MCP `apply_migration`.
-- A folytatás a 0002_breathing_function_grants.sql-ben.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Gyerek profilok (egy szülői fiókhoz több gyerek is tartozhat)
-- ------------------------------------------------------------
create table if not exists public.breathing_children (
  id           uuid primary key default gen_random_uuid(),
  parent_id    uuid not null references auth.users (id) on delete cascade,
  name         text not null,
  age          integer check (age between 3 and 18),
  character_id text not null default 'bunny'
                 check (character_id in ('bunny', 'panda', 'monkey', 'lion')),
  level        integer not null default 1,
  streak_days  integer not null default 0,
  last_session_date date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.breathing_children is
  'Doboz Légzés app – gyerek profilok, egy szülői auth fiók alatt.';

create index if not exists breathing_children_parent_idx
  on public.breathing_children (parent_id);

-- ------------------------------------------------------------
-- 2. Elvégzett légzőgyakorlatok
-- ------------------------------------------------------------
create table if not exists public.breathing_sessions (
  id                uuid primary key default gen_random_uuid(),
  child_id          uuid not null references public.breathing_children (id) on delete cascade,
  started_at        timestamptz not null default now(),
  duration_seconds  integer not null,
  cycles_completed  integer not null default 0,
  completed         boolean not null default false,
  character_id      text not null default 'bunny',
  created_at        timestamptz not null default now()
);

comment on table public.breathing_sessions is
  'Egy elvégzett (vagy megszakított) 4-4-4-4 légzőgyakorlat.';

create index if not exists breathing_sessions_child_started_idx
  on public.breathing_sessions (child_id, started_at desc);

-- ------------------------------------------------------------
-- 3. Megszerzett matricák
-- ------------------------------------------------------------
create table if not exists public.breathing_stickers (
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references public.breathing_children (id) on delete cascade,
  sticker_key text not null,   -- 'heart' | 'star' | 'leaf' | 'sun' | 'drop' | ...
  earned_at   timestamptz not null default now(),
  unique (child_id, sticker_key)
);

comment on table public.breathing_stickers is
  'Feloldott matricák. A matricák katalógusa a kliensben van (data/stickers.ts),
   itt csak a kulcs és a megszerzés ideje tárolódik.';

create index if not exists breathing_stickers_child_idx
  on public.breathing_stickers (child_id);

-- ------------------------------------------------------------
-- 4. Szülői beállítások (gyerekenként)
-- ------------------------------------------------------------
create table if not exists public.breathing_settings (
  child_id            uuid primary key
                        references public.breathing_children (id) on delete cascade,
  sound_on            boolean not null default true,
  voice_on            boolean not null default true,
  haptics_on          boolean not null default true,
  reminder_on         boolean not null default true,
  reminder_time       time not null default '17:30',
  session_length_key  text not null default 'medium'
                        check (session_length_key in ('short', 'medium', 'long')),
  updated_at          timestamptz not null default now()
);

comment on table public.breathing_settings is
  'session_length_key: short = 60s (1 perc), medium = 150s (2-3 perc), long = 300s (5 perc).';

-- ============================================================
-- Row Level Security
-- Alapelv: a szülő csak a SAJÁT gyerekeinek adatait látja és írja.
-- ============================================================

alter table public.breathing_children enable row level security;
alter table public.breathing_sessions enable row level security;
alter table public.breathing_stickers enable row level security;
alter table public.breathing_settings enable row level security;

-- Segédfüggvény: az adott gyerek a bejelentkezett felhasználóé-e
create or replace function public.breathing_owns_child(p_child_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.breathing_children c
    where c.id = p_child_id
      and c.parent_id = auth.uid()
  );
$$;

-- --- breathing_children ---
drop policy if exists breathing_children_select on public.breathing_children;
create policy breathing_children_select on public.breathing_children
  for select using (parent_id = auth.uid());

drop policy if exists breathing_children_insert on public.breathing_children;
create policy breathing_children_insert on public.breathing_children
  for insert with check (parent_id = auth.uid());

drop policy if exists breathing_children_update on public.breathing_children;
create policy breathing_children_update on public.breathing_children
  for update using (parent_id = auth.uid()) with check (parent_id = auth.uid());

drop policy if exists breathing_children_delete on public.breathing_children;
create policy breathing_children_delete on public.breathing_children
  for delete using (parent_id = auth.uid());

-- --- breathing_sessions ---
drop policy if exists breathing_sessions_all on public.breathing_sessions;
create policy breathing_sessions_all on public.breathing_sessions
  for all
  using (public.breathing_owns_child(child_id))
  with check (public.breathing_owns_child(child_id));

-- --- breathing_stickers ---
drop policy if exists breathing_stickers_all on public.breathing_stickers;
create policy breathing_stickers_all on public.breathing_stickers
  for all
  using (public.breathing_owns_child(child_id))
  with check (public.breathing_owns_child(child_id));

-- --- breathing_settings ---
drop policy if exists breathing_settings_all on public.breathing_settings;
create policy breathing_settings_all on public.breathing_settings
  for all
  using (public.breathing_owns_child(child_id))
  with check (public.breathing_owns_child(child_id));

-- ============================================================
-- updated_at automatikus frissítése
-- ============================================================
create or replace function public.breathing_touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists breathing_children_touch on public.breathing_children;
create trigger breathing_children_touch
  before update on public.breathing_children
  for each row execute function public.breathing_touch_updated_at();

drop trigger if exists breathing_settings_touch on public.breathing_settings;
create trigger breathing_settings_touch
  before update on public.breathing_settings
  for each row execute function public.breathing_touch_updated_at();

-- ============================================================
-- Új gyerek létrehozásakor automatikusan legyen beállítás sora
-- ============================================================
create or replace function public.breathing_create_default_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.breathing_settings (child_id)
  values (new.id)
  on conflict (child_id) do nothing;
  return new;
end;
$$;

drop trigger if exists breathing_children_default_settings on public.breathing_children;
create trigger breathing_children_default_settings
  after insert on public.breathing_children
  for each row execute function public.breathing_create_default_settings();
