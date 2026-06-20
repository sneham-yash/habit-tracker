-- Security hardening: align with Supabase security advisors

-- Fix view execution context so RLS is enforced as caller.
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

-- Pin search_path on helper/trigger functions.
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

-- Trigger helper should not be executable through public RPC.
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;
