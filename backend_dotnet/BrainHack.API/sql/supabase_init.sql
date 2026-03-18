-- BrainHack Supabase initialization script
-- Run this in Supabase SQL Editor after reset.

-- Extensions
create extension if not exists pgcrypto;

-- Enum for user roles
create type user_role as enum ('student', 'teacher');

-- USERS
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    email varchar(320) not null unique,
    password_hash text not null,
    first_name varchar(120) not null,
    last_name varchar(120) not null,
    role user_role not null default 'student',
    avatar_url varchar(2048),
    total_xp integer not null default 0 check (total_xp >= 0),
    created_at timestamptz not null default now()
);

-- MINIGAMES
create table if not exists public.minigames (
    id uuid primary key default gen_random_uuid(),
    name varchar(150) not null,
    description text,
    max_xp_possible integer not null default 0 check (max_xp_possible >= 0)
);

-- GAME SESSIONS
create table if not exists public.gamesessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    minigame_id uuid not null,
    score integer not null default 0,
    xp_earned integer not null default 0 check (xp_earned >= 0),
    completed_at timestamptz not null default now(),
    constraint fk_gamesessions_user
        foreign key (user_id)
        references public.users(id)
        on delete cascade,
    constraint fk_gamesessions_minigame
        foreign key (minigame_id)
        references public.minigames(id)
        on delete restrict
);

-- Helpful indexes
create index if not exists idx_users_total_xp_desc on public.users (total_xp desc);
create index if not exists idx_gamesessions_user_id on public.gamesessions (user_id);
create index if not exists idx_gamesessions_minigame_id on public.gamesessions (minigame_id);
create index if not exists idx_gamesessions_completed_at on public.gamesessions (completed_at desc);

-- Optional: updated_at columns + auto-update trigger
alter table public.users add column if not exists updated_at timestamptz not null default now();
alter table public.minigames add column if not exists updated_at timestamptz not null default now();
alter table public.gamesessions add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_set_updated_at on public.users;
create trigger trg_users_set_updated_at
before update on public.users
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_minigames_set_updated_at on public.minigames;
create trigger trg_minigames_set_updated_at
before update on public.minigames
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_gamesessions_set_updated_at on public.gamesessions;
create trigger trg_gamesessions_set_updated_at
before update on public.gamesessions
for each row execute procedure public.set_updated_at();

-- Optional: seed one minigame example
insert into public.minigames (name, description, max_xp_possible)
values ('Quiz IA', 'Mini-jeu de quiz sur l''intelligence artificielle', 100)
on conflict do nothing;
