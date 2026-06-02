-- EXTENSÕES
create extension if not exists "uuid-ossp";

-- ENUMS
create type public.user_role as enum ('admin', 'teacher', 'coordinator');
create type public.occurrence_type as enum (
  'Disciplinar',
  'Pedagógica',
  'Saúde',
  'Infrequência',
  'Outro'
);

-- TABELA: profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role public.user_role not null default 'teacher',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Authenticated users can view profiles"
  on public.profiles for select
  using (auth.uid() is not null);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- TABELA: occurrences
create table public.occurrences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  aluno text not null,
  data date not null,
  tipo public.occurrence_type not null,
  descricao text not null,
  encaminhamento text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.occurrences enable row level security;

create index idx_occurrences_user_id on public.occurrences(user_id);
create index idx_occurrences_data on public.occurrences(data desc);
create index idx_occurrences_tipo on public.occurrences(tipo);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger on_occurrence_updated
  before update on public.occurrences
  for each row execute function public.handle_updated_at();

create policy "Users can view all occurrences"
  on public.occurrences for select
  using (auth.uid() is not null);

create policy "Users can create own occurrences"
  on public.occurrences for insert
  with check (user_id = auth.uid());

create policy "Users can update own occurrences"
  on public.occurrences for update
  using (user_id = auth.uid());

create policy "Users can delete own occurrences"
  on public.occurrences for delete
  using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();