-- RIZEN analytics helpers: category analytics and rizen metrics

create or replace function public.get_category_analytics(
  p_category_id uuid,
  p_start_date date default null,
  p_end_date date default null
)
returns table (
  category_id uuid,
  category_name text,
  category_type public.category_type,
  habit_count integer,
  scheduled_days integer,
  completed_days integer,
  completion_rate numeric,
  best_streak integer
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_category public.categories;
  v_end date := coalesce(p_end_date, (timezone('UTC', now()))::date);
  v_start date := coalesce(p_start_date, v_end - 29);
  v_scheduled integer := 0;
  v_completed integer := 0;
  v_best_streak integer := 0;
  v_habit record;
  v_analytics record;
begin
  select * into v_category from public.categories where id = p_category_id;
  if not found then return; end if;

  for v_habit in
    select id from public.habits
    where category_id = p_category_id
      and archived_at is null
      and user_id = auth.uid()
  loop
    select * into v_analytics
    from public.get_habit_analytics(v_habit.id, v_start, v_end);

    v_scheduled := v_scheduled + coalesce(v_analytics.scheduled_days, 0);
    v_completed := v_completed + coalesce(v_analytics.completed_days, 0);
    v_best_streak := greatest(v_best_streak, coalesce(v_analytics.longest_streak, 0));
  end loop;

  return query
  select
    p_category_id,
    v_category.name,
    v_category.category_type,
    (select count(*)::integer from public.habits h
     where h.category_id = p_category_id and h.archived_at is null and h.user_id = auth.uid()),
    v_scheduled,
    v_completed,
    case when v_scheduled = 0 then 0::numeric
         else round((v_completed::numeric / v_scheduled) * 100, 1)
    end,
    v_best_streak;
end;
$$;

create or replace function public.get_rizen_metrics(
  p_user_id uuid default auth.uid(),
  p_start_date date default null,
  p_end_date date default null
)
returns table (
  completion_rate numeric,
  current_streak integer,
  build_success_rate numeric,
  quit_success_rate numeric,
  growth_trend numeric,
  steps_forward integer,
  longest_streak integer,
  favorite_habit_id uuid,
  favorite_habit_name text,
  strongest_category_id uuid,
  strongest_category_name text,
  needs_attention_category_id uuid,
  needs_attention_category_name text
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_end date := coalesce(p_end_date, (timezone('UTC', now()))::date);
  v_start date := coalesce(p_start_date, v_end - 29);
  v_prev_end date := v_start - 1;
  v_prev_start date := v_prev_end - (v_end - v_start);
  v_total_scheduled integer := 0;
  v_total_completed integer := 0;
  v_build_scheduled integer := 0;
  v_build_completed integer := 0;
  v_quit_scheduled integer := 0;
  v_quit_completed integer := 0;
  v_prev_scheduled integer := 0;
  v_prev_completed integer := 0;
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
  v_habit record;
  v_analytics record;
  v_prev_analytics record;
  v_streak record;
  v_rate numeric;
  v_prev_rate numeric;
  v_growth numeric := 0;
begin
  for v_habit in
    select h.id, h.name, h.habit_type, h.category_id
    from public.habits h
    where h.user_id = p_user_id and h.archived_at is null
  loop
    select * into v_analytics from public.get_habit_analytics(v_habit.id, v_start, v_end);
    select * into v_prev_analytics from public.get_habit_analytics(v_habit.id, v_prev_start, v_prev_end);
    select * into v_streak from public.get_habit_streaks(v_habit.id);

    v_total_scheduled := v_total_scheduled + coalesce(v_analytics.scheduled_days, 0);
    v_total_completed := v_total_completed + coalesce(v_analytics.completed_days, 0);
    v_prev_scheduled := v_prev_scheduled + coalesce(v_prev_analytics.scheduled_days, 0);
    v_prev_completed := v_prev_completed + coalesce(v_prev_analytics.completed_days, 0);
    v_current_streak := greatest(v_current_streak, coalesce(v_streak.current_streak, 0));
    v_longest_streak := greatest(v_longest_streak, coalesce(v_streak.longest_streak, 0));

    if v_habit.habit_type = 'build' then
      v_build_scheduled := v_build_scheduled + coalesce(v_analytics.scheduled_days, 0);
      v_build_completed := v_build_completed + coalesce(v_analytics.completed_days, 0);
    else
      v_quit_scheduled := v_quit_scheduled + coalesce(v_analytics.scheduled_days, 0);
      v_quit_completed := v_quit_completed + coalesce(v_analytics.completed_days, 0);
    end if;
  end loop;

  v_rate := case when v_total_scheduled = 0 then 0
    else (v_total_completed::numeric / v_total_scheduled) * 100 end;
  v_prev_rate := case when v_prev_scheduled = 0 then 0
    else (v_prev_completed::numeric / v_prev_scheduled) * 100 end;
  v_growth := (v_rate - v_prev_rate) / 100;

  return query
  with habit_rates as (
    select
      h.id,
      h.name,
      case when a.scheduled_days = 0 then 0::numeric
           else round((a.completed_days::numeric / a.scheduled_days) * 100, 1)
      end as rate
    from public.habits h
    cross join lateral public.get_habit_analytics(h.id, v_start, v_end) a
    where h.user_id = p_user_id and h.archived_at is null
  ),
  category_rates as (
    select
      c.id,
      c.name,
      ca.completion_rate as rate
    from public.categories c
    cross join lateral public.get_category_analytics(c.id, v_start, v_end) ca
    where (c.user_id is null or c.user_id = p_user_id)
      and exists (
        select 1 from public.habits h
        where h.category_id = c.id and h.user_id = p_user_id and h.archived_at is null
      )
  ),
  fav as (
    select id, name from habit_rates order by rate desc, name asc limit 1
  ),
  strong as (
    select id, name from category_rates order by rate desc, name asc limit 1
  ),
  weak as (
    select id, name from category_rates order by rate asc, name asc limit 1
  )
  select
    round(v_rate, 1),
    v_current_streak,
    case when v_build_scheduled = 0 then 0::numeric
         else round((v_build_completed::numeric / v_build_scheduled) * 100, 1) end,
    case when v_quit_scheduled = 0 then 0::numeric
         else round((v_quit_completed::numeric / v_quit_scheduled) * 100, 1) end,
    round(v_growth, 3),
    public.get_steps_forward(p_user_id),
    v_longest_streak,
    (select id from fav),
    (select name from fav),
    (select id from strong),
    (select name from strong),
    (select id from weak),
    (select name from weak);
end;
$$;

grant execute on function public.get_category_analytics(uuid, date, date) to authenticated;
grant execute on function public.get_rizen_metrics(uuid, date, date) to authenticated;
