-- Habit Tracker — initial Supabase schema
-- Run in Supabase SQL Editor or via: supabase db push

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (extends Supabase Auth)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profile metadata linked to auth.users';

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Habits
-- ---------------------------------------------------------------------------
create type public.habit_frequency as enum ('daily', 'weekly', 'custom');

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  description text,
  color text not null default '#6366f1',
  icon text,
  frequency public.habit_frequency not null default 'daily',
  -- ISO day-of-week for weekly habits: 1=Mon … 7=Sun. Null = every day.
  frequency_days smallint[] check (
    frequency_days is null
    or (
      cardinality(frequency_days) > 0
      and frequency_days <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[]
    )
  ),
  start_date date not null default (timezone('UTC', now()))::date,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.habits is 'Habits owned by a user';
comment on column public.habits.frequency_days is 'Active days for weekly/custom habits (ISO DOW 1–7)';

create index habits_user_id_idx on public.habits (user_id);
create index habits_user_active_idx on public.habits (user_id) where archived_at is null;

-- ---------------------------------------------------------------------------
-- Habit logs (daily completions)
-- ---------------------------------------------------------------------------
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  completed_date date not null,
  notes text,
  created_at timestamptz not null default now(),

  constraint habit_logs_unique_per_day unique (habit_id, completed_date),
  constraint habit_logs_user_matches_habit check (true) -- enforced by trigger below
);

comment on table public.habit_logs is 'One completion record per habit per calendar day';

create index habit_logs_habit_date_idx on public.habit_logs (habit_id, completed_date desc);
create index habit_logs_user_date_idx on public.habit_logs (user_id, completed_date desc);

-- Ensure log.user_id matches habit.user_id
create or replace function public.enforce_habit_log_user()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  habit_owner uuid;
begin
  select user_id into habit_owner from public.habits where id = new.habit_id;
  if habit_owner is null then
    raise exception 'Habit % does not exist', new.habit_id;
  end if;
  new.user_id := habit_owner;
  return new;
end;
$$;

create trigger habit_logs_enforce_user
  before insert or update on public.habit_logs
  for each row execute function public.enforce_habit_log_user();

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger habits_set_updated_at
  before update on public.habits
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

create policy "Users can view own habit logs"
  on public.habit_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own habit logs"
  on public.habit_logs for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );

create policy "Users can update own habit logs"
  on public.habit_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own habit logs"
  on public.habit_logs for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Helpers: scheduled days & completion checks
-- ---------------------------------------------------------------------------

-- Returns true when a habit is expected on the given date.
create or replace function public.is_habit_scheduled(
  p_habit public.habits,
  p_date date
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select case
    when p_date < p_habit.start_date then false
    when p_habit.frequency = 'daily' then true
    when p_habit.frequency in ('weekly', 'custom') then
      extract(isodow from p_date)::smallint = any (coalesce(p_habit.frequency_days, array[1,2,3,4,5,6,7]::smallint[]))
    else false
  end;
$$;

-- ---------------------------------------------------------------------------
-- Streak calculation
-- ---------------------------------------------------------------------------

-- Computes current and longest streak for a single habit.
-- Current streak counts backward from today; if today is not complete but
-- yesterday is, the streak is still active (grace for same-day logging).
create or replace function public.get_habit_streaks(p_habit_id uuid)
returns table (
  current_streak integer,
  longest_streak integer,
  last_completed_date date
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_habit public.habits;
  v_today date;
begin
  select * into v_habit from public.habits where id = p_habit_id;
  if not found then
    return;
  end if;

  select (timezone(coalesce(p.timezone, 'UTC'), now()))::date
  into v_today
  from public.profiles p
  where p.id = v_habit.user_id;

  if v_today is null then
    v_today := (timezone('UTC', now()))::date;
  end if;

  return query
  with scheduled_completions as (
    select
      hl.completed_date,
      hl.completed_date
        - (row_number() over (order by hl.completed_date asc))::integer as streak_group
    from public.habit_logs hl
    where hl.habit_id = p_habit_id
      and public.is_habit_scheduled(v_habit, hl.completed_date)
  ),
  streak_lengths as (
    select streak_group, count(*)::integer as len, max(completed_date) as end_date
    from scheduled_completions
    group by streak_group
  ),
  last_done as (
    select max(completed_date) as d from public.habit_logs where habit_id = p_habit_id
  )
  select
    coalesce((
      select sl.len
      from streak_lengths sl, last_done ld
      where sl.end_date = ld.d
        and (
          ld.d = v_today
          or ld.d = v_today - 1
          or (
            not public.is_habit_scheduled(v_habit, v_today)
            and ld.d = (
              select max(d)::date
              from generate_series(v_habit.start_date, v_today, interval '1 day') g(d)
              where public.is_habit_scheduled(v_habit, g.d::date)
            ) - 1
          )
        )
      limit 1
    ), 0) as current_streak,
    coalesce((select max(len) from streak_lengths), 0) as longest_streak,
    (select d from last_done) as last_completed_date;
end;
$$;

-- Dashboard-friendly streak view
create or replace view public.habit_streaks
with (security_invoker = true)
as
select
  h.id as habit_id,
  h.user_id,
  h.name,
  s.current_streak,
  s.longest_streak,
  s.last_completed_date
from public.habits h
cross join lateral public.get_habit_streaks(h.id) s
where h.archived_at is null;

-- ---------------------------------------------------------------------------
-- Analytics
-- ---------------------------------------------------------------------------

-- Completion stats for a habit over a date range (defaults: last 30 days).
create or replace function public.get_habit_analytics(
  p_habit_id uuid,
  p_start_date date default null,
  p_end_date date default null
)
returns table (
  habit_id uuid,
  start_date date,
  end_date date,
  scheduled_days integer,
  completed_days integer,
  completion_rate numeric,
  current_streak integer,
  longest_streak integer
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_habit public.habits;
  v_start date;
  v_end date;
  v_scheduled integer;
  v_completed integer;
  v_streak record;
begin
  select * into v_habit from public.habits where id = p_habit_id;
  if not found then return; end if;

  v_end := coalesce(p_end_date, (timezone('UTC', now()))::date);
  v_start := coalesce(p_start_date, v_end - 29);
  v_start := greatest(v_start, v_habit.start_date);

  select count(*)::integer into v_scheduled
  from generate_series(v_start, v_end, interval '1 day') g(d)
  where public.is_habit_scheduled(v_habit, g.d::date);

  select count(*)::integer into v_completed
  from public.habit_logs hl
  where hl.habit_id = p_habit_id
    and hl.completed_date between v_start and v_end;

  select * into v_streak from public.get_habit_streaks(p_habit_id);

  return query
  select
    p_habit_id,
    v_start,
    v_end,
    v_scheduled,
    v_completed,
    case when v_scheduled = 0 then 0
         else round((v_completed::numeric / v_scheduled) * 100, 1)
    end,
    v_streak.current_streak,
    v_streak.longest_streak;
end;
$$;

-- Aggregate analytics across all active habits for a user.
create or replace function public.get_user_analytics(
  p_user_id uuid default auth.uid(),
  p_start_date date default null,
  p_end_date date default null
)
returns table (
  total_habits integer,
  avg_completion_rate numeric,
  total_completions integer,
  best_streak integer
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_end date := coalesce(p_end_date, (timezone('UTC', now()))::date);
  v_start date := coalesce(p_start_date, v_end - 29);
begin
  return query
  with active_habits as (
    select id from public.habits
    where user_id = p_user_id and archived_at is null
  ),
  per_habit as (
    select a.* from active_habits h
    cross join lateral public.get_habit_analytics(h.id, v_start, v_end) a
  )
  select
    (select count(*)::integer from active_habits),
    coalesce(round(avg(completion_rate), 1), 0),
    coalesce(sum(completed_days)::integer, 0),
    coalesce(max(longest_streak), 0)
  from per_habit;
end;
$$;

-- ---------------------------------------------------------------------------
-- Calendar history
-- ---------------------------------------------------------------------------

-- Monthly calendar grid: every scheduled day with completion status.
create or replace function public.get_habit_calendar(
  p_habit_id uuid,
  p_year integer,
  p_month integer
)
returns table (
  calendar_date date,
  is_scheduled boolean,
  is_completed boolean,
  notes text
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_habit public.habits;
  v_start date;
  v_end date;
begin
  select * into v_habit from public.habits where id = p_habit_id;
  if not found then return; end if;

  v_start := make_date(p_year, p_month, 1);
  v_end := (v_start + interval '1 month' - interval '1 day')::date;

  return query
  select
    g.d::date as calendar_date,
    public.is_habit_scheduled(v_habit, g.d::date) as is_scheduled,
    (hl.id is not null) as is_completed,
    hl.notes
  from generate_series(v_start, v_end, interval '1 day') g(d)
  left join public.habit_logs hl
    on hl.habit_id = p_habit_id and hl.completed_date = g.d::date
  order by g.d;
end;
$$;

-- All habits for a user in a given month (for dashboard calendar heatmap).
create or replace function public.get_user_calendar(
  p_user_id uuid default auth.uid(),
  p_year integer default extract(year from current_date)::integer,
  p_month integer default extract(month from current_date)::integer
)
returns table (
  calendar_date date,
  habit_id uuid,
  habit_name text,
  habit_color text,
  is_scheduled boolean,
  is_completed boolean
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    cal.calendar_date,
    h.id as habit_id,
    h.name as habit_name,
    h.color as habit_color,
    cal.is_scheduled,
    cal.is_completed
  from public.habits h
  cross join lateral public.get_habit_calendar(h.id, p_year, p_month) cal
  where h.user_id = p_user_id
    and h.archived_at is null
  order by cal.calendar_date, h.name;
$$;

-- ---------------------------------------------------------------------------
-- Convenience: toggle completion for today
-- ---------------------------------------------------------------------------
create or replace function public.toggle_habit_completion(
  p_habit_id uuid,
  p_date date default (timezone('UTC', now()))::date,
  p_notes text default null
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_exists boolean;
begin
  select exists (
    select 1 from public.habit_logs
    where habit_id = p_habit_id and completed_date = p_date
  ) into v_exists;

  if v_exists then
    delete from public.habit_logs
    where habit_id = p_habit_id and completed_date = p_date;
    return false;
  else
    insert into public.habit_logs (habit_id, user_id, completed_date, notes)
    select p_habit_id, h.user_id, p_date, p_notes
    from public.habits h
    where h.id = p_habit_id and h.user_id = auth.uid();
    return true;
  end if;
end;
$$;

-- Grant execute on functions to authenticated users
grant usage on schema public to authenticated;
grant select on public.habit_streaks to authenticated;
grant execute on function public.get_habit_streaks(uuid) to authenticated;
grant execute on function public.get_habit_analytics(uuid, date, date) to authenticated;
grant execute on function public.get_user_analytics(uuid, date, date) to authenticated;
grant execute on function public.get_habit_calendar(uuid, integer, integer) to authenticated;
grant execute on function public.get_user_calendar(uuid, integer, integer) to authenticated;
grant execute on function public.toggle_habit_completion(uuid, date, text) to authenticated;
