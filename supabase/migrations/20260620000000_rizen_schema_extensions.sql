-- RIZEN schema extensions: habit types, categories, reminders, analytics support

create type public.habit_type as enum ('build', 'quit');
create type public.category_type as enum ('build', 'quit');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  category_type public.category_type not null,
  icon text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_user_name_type_unique unique nulls not distinct (user_id, name, category_type)
);

comment on table public.categories is 'Habit categories — system defaults (user_id null) and user-created';

create index categories_user_id_idx on public.categories (user_id);
create index categories_type_idx on public.categories (category_type);

alter table public.habits
  add column habit_type public.habit_type not null default 'build',
  add column category_id uuid references public.categories (id) on delete set null,
  add column target_minutes integer check (target_minutes is null or target_minutes > 0),
  add column reminder_enabled boolean not null default false,
  add column reminder_time time;

create index habits_habit_type_idx on public.habits (user_id, habit_type) where archived_at is null;
create index habits_category_id_idx on public.habits (category_id);

insert into public.categories (user_id, name, category_type, is_default) values
  (null, 'Learning', 'build', true),
  (null, 'Fitness', 'build', true),
  (null, 'Productivity', 'build', true),
  (null, 'Mindfulness', 'build', true),
  (null, 'Finance', 'build', true),
  (null, 'Personal Growth', 'build', true),
  (null, 'Smoking', 'quit', true),
  (null, 'Alcohol', 'quit', true),
  (null, 'Sugar', 'quit', true),
  (null, 'Junk Food', 'quit', true),
  (null, 'Social Media', 'quit', true);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

create policy "Users can view default and own categories"
  on public.categories for select
  using (user_id is null or auth.uid() = user_id);

create policy "Users can insert own categories"
  on public.categories for insert
  with check (auth.uid() = user_id and is_default = false);

create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id and is_default = false);

create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id and is_default = false);

create or replace function public.get_steps_forward(
  p_user_id uuid default auth.uid()
)
returns integer
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)::integer
  from public.habit_logs hl
  join public.habits h on h.id = hl.habit_id
  where h.user_id = p_user_id
    and h.archived_at is null;
$$;

grant execute on function public.get_steps_forward(uuid) to authenticated;
