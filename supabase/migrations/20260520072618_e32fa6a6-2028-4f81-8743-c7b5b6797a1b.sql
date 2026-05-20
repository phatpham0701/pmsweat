
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  nickname text,
  gender text,
  date_of_birth date,
  height_cm integer,
  weight_kg integer,
  location text default 'Vietnam',
  avatar_url text,
  avatar_kind text, -- 'icon' | 'initial' | 'photo'
  avatar_meta jsonb default '{}'::jsonb,
  athlete_type text,
  fitness_goals text[] default '{}',
  custom_goal text,
  health_conditions text[] default '{}',
  wearable_device text,
  sports text[] default '{}',
  training_frequency text,
  consent_given boolean default false,
  onboarding_completed boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.tg_set_updated_at();

-- new user trigger -> create empty profile
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- INTEGRATIONS
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  connected boolean default false,
  last_sync timestamptz,
  device text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);
alter table public.integrations enable row level security;
create policy "integrations_select_own" on public.integrations for select using (auth.uid() = user_id);
create policy "integrations_insert_own" on public.integrations for insert with check (auth.uid() = user_id);
create policy "integrations_update_own" on public.integrations for update using (auth.uid() = user_id);
create policy "integrations_delete_own" on public.integrations for delete using (auth.uid() = user_id);
create trigger integrations_set_updated_at before update on public.integrations
  for each row execute function public.tg_set_updated_at();

-- SESSIONS
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sport text not null,
  started_at timestamptz not null,
  duration_min integer not null,
  load_au integer default 0,
  notes text,
  metrics jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.sessions enable row level security;
create policy "sessions_select_own" on public.sessions for select using (auth.uid() = user_id);
create policy "sessions_insert_own" on public.sessions for insert with check (auth.uid() = user_id);
create policy "sessions_update_own" on public.sessions for update using (auth.uid() = user_id);
create policy "sessions_delete_own" on public.sessions for delete using (auth.uid() = user_id);
create index sessions_user_started_idx on public.sessions (user_id, started_at desc);

-- STORAGE BUCKET for avatars (public read)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects for select
  using (bucket_id = 'avatars');
create policy "avatars_owner_insert" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_update" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_delete" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
