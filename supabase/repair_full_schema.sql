-- =============================================================================
-- RIZEN Full Schema Repair
-- =============================================================================
-- Run this in Supabase Dashboard → SQL Editor if `supabase db push` fails.
-- Idempotent: safe to re-run. Does not drop existing data.
--
-- Creates: categories, RIZEN habit columns, analytics RPCs, 10 default categories
-- Fixes: get_rizen_metrics, get_rizen_score_trend, get_category_analytics, get_steps_forward
-- =============================================================================

-- Idempotent repair: RIZEN schema, analytics RPCs, seed data, and backfills
-- Safe to run when migration history is out of sync with actual DB state

-- 1) Enums
DO $$ BEGIN
  CREATE TYPE public.habit_type AS ENUM ('build', 'quit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.category_type AS ENUM ('build', 'quit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2) Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(trim(name)) > 0),
  category_type public.category_type NOT NULL,
  icon text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_user_name_type_unique UNIQUE NULLS NOT DISTINCT (user_id, name, category_type)
);

COMMENT ON TABLE public.categories IS 'Habit categories — system defaults (user_id null) and user-created';

CREATE INDEX IF NOT EXISTS categories_user_id_idx ON public.categories (user_id);
CREATE INDEX IF NOT EXISTS categories_type_idx ON public.categories (category_type);

-- 3) RIZEN columns on habits
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS habit_type public.habit_type NOT NULL DEFAULT 'build';
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories (id) ON DELETE SET NULL;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS target_minutes integer CHECK (target_minutes IS NULL OR target_minutes > 0);
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS reminder_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS reminder_time time;

CREATE INDEX IF NOT EXISTS habits_habit_type_idx ON public.habits (user_id, habit_type) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS habits_category_id_idx ON public.habits (category_id);

-- 4) Default category seed (only when empty)
INSERT INTO public.categories (user_id, name, category_type, is_default, icon)
SELECT NULL, v.name, v.category_type::public.category_type, true, v.icon
FROM (VALUES
  ('Learning', 'build', 'graduation-cap'),
  ('Health & Fitness', 'build', 'heart-pulse'),
  ('Productivity', 'build', 'zap'),
  ('Mindfulness', 'build', 'leaf'),
  ('Finance', 'build', 'dollar-sign'),
  ('Personal Growth', 'build', 'book-open'),
  ('Smoking', 'quit', 'cigarette-off'),
  ('Alcohol', 'quit', 'wine'),
  ('Junk Food', 'quit', 'hamburger'),
  ('Social Media', 'quit', 'smartphone')
) AS v(name, category_type, icon)
WHERE NOT EXISTS (SELECT 1 FROM public.categories LIMIT 1);

-- 5) Category icon/name alignment (idempotent updates)
UPDATE public.categories SET name = 'Health & Fitness', icon = 'heart-pulse'
WHERE user_id IS NULL AND name IN ('Fitness', 'Health & Fitness') AND category_type = 'build';

UPDATE public.categories SET icon = 'leaf'
WHERE user_id IS NULL AND name = 'Mindfulness' AND category_type = 'build';

UPDATE public.categories SET icon = 'book-open'
WHERE user_id IS NULL AND name = 'Personal Growth' AND category_type = 'build';

UPDATE public.categories SET icon = 'zap'
WHERE user_id IS NULL AND name = 'Productivity' AND category_type = 'build';

UPDATE public.categories SET icon = 'graduation-cap'
WHERE user_id IS NULL AND name = 'Learning' AND category_type = 'build';

UPDATE public.categories SET icon = 'dollar-sign'
WHERE user_id IS NULL AND name = 'Finance' AND category_type = 'build';

UPDATE public.categories SET icon = 'cigarette-off'
WHERE user_id IS NULL AND name = 'Smoking' AND category_type = 'quit';

UPDATE public.categories SET icon = 'wine'
WHERE user_id IS NULL AND name = 'Alcohol' AND category_type = 'quit';

UPDATE public.categories SET icon = 'hamburger'
WHERE user_id IS NULL AND name = 'Junk Food' AND category_type = 'quit';

UPDATE public.categories SET icon = 'smartphone'
WHERE user_id IS NULL AND name = 'Social Media' AND category_type = 'quit';

-- Merge legacy Sugar category into Junk Food if present
UPDATE public.habits h
SET category_id = junk.id
FROM public.categories sugar, public.categories junk
WHERE h.category_id = sugar.id
  AND sugar.user_id IS NULL AND sugar.name = 'Sugar' AND sugar.category_type = 'quit'
  AND junk.user_id IS NULL AND junk.name = 'Junk Food' AND junk.category_type = 'quit';

DELETE FROM public.categories
WHERE user_id IS NULL AND name = 'Sugar' AND category_type = 'quit';

-- 6) Categories trigger + RLS
DROP TRIGGER IF EXISTS categories_set_updated_at ON public.categories;
CREATE TRIGGER categories_set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view default and own categories"
    ON public.categories FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id AND is_default = false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id AND is_default = false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id AND is_default = false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 7) Steps Forward (lifetime count)
CREATE OR REPLACE FUNCTION public.get_steps_forward(
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT count(*)::integer
  FROM public.habit_logs hl
  WHERE hl.user_id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_steps_forward(uuid) TO authenticated;

-- 8) Category analytics
CREATE OR REPLACE FUNCTION public.get_category_analytics(
  p_category_id uuid,
  p_start_date date DEFAULT NULL,
  p_end_date date DEFAULT NULL
)
RETURNS TABLE (
  category_id uuid,
  category_name text,
  category_type public.category_type,
  habit_count integer,
  scheduled_days integer,
  completed_days integer,
  completion_rate numeric,
  best_streak integer
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_category public.categories;
  v_end date := coalesce(p_end_date, (timezone('UTC', now()))::date);
  v_start date := coalesce(p_start_date, v_end - 29);
  v_scheduled integer := 0;
  v_completed integer := 0;
  v_best_streak integer := 0;
  v_habit record;
  v_analytics record;
BEGIN
  SELECT * INTO v_category FROM public.categories WHERE id = p_category_id;
  IF NOT FOUND THEN RETURN; END IF;

  FOR v_habit IN
    SELECT id FROM public.habits
    WHERE category_id = p_category_id
      AND archived_at IS NULL
      AND user_id = auth.uid()
  LOOP
    SELECT * INTO v_analytics
    FROM public.get_habit_analytics(v_habit.id, v_start, v_end);

    v_scheduled := v_scheduled + coalesce(v_analytics.scheduled_days, 0);
    v_completed := v_completed + coalesce(v_analytics.completed_days, 0);
    v_best_streak := greatest(v_best_streak, coalesce(v_analytics.longest_streak, 0));
  END LOOP;

  RETURN QUERY
  SELECT
    p_category_id,
    v_category.name,
    v_category.category_type,
    (SELECT count(*)::integer FROM public.habits h
     WHERE h.category_id = p_category_id AND h.archived_at IS NULL AND h.user_id = auth.uid()),
    v_scheduled,
    v_completed,
    CASE WHEN v_scheduled = 0 THEN 0::numeric
         ELSE round((v_completed::numeric / v_scheduled) * 100, 1)
    END,
    v_best_streak;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_category_analytics(uuid, date, date) TO authenticated;

-- 9) Rizen metrics
CREATE OR REPLACE FUNCTION public.get_rizen_metrics(
  p_user_id uuid DEFAULT auth.uid(),
  p_start_date date DEFAULT NULL,
  p_end_date date DEFAULT NULL
)
RETURNS TABLE (
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
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
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
BEGIN
  FOR v_habit IN
    SELECT h.id, h.name, h.habit_type, h.category_id
    FROM public.habits h
    WHERE h.user_id = p_user_id AND h.archived_at IS NULL
  LOOP
    SELECT * INTO v_analytics FROM public.get_habit_analytics(v_habit.id, v_start, v_end);
    SELECT * INTO v_prev_analytics FROM public.get_habit_analytics(v_habit.id, v_prev_start, v_prev_end);
    SELECT * INTO v_streak FROM public.get_habit_streaks(v_habit.id);

    v_total_scheduled := v_total_scheduled + coalesce(v_analytics.scheduled_days, 0);
    v_total_completed := v_total_completed + coalesce(v_analytics.completed_days, 0);
    v_prev_scheduled := v_prev_scheduled + coalesce(v_prev_analytics.scheduled_days, 0);
    v_prev_completed := v_prev_completed + coalesce(v_prev_analytics.completed_days, 0);
    v_current_streak := greatest(v_current_streak, coalesce(v_streak.current_streak, 0));
    v_longest_streak := greatest(v_longest_streak, coalesce(v_streak.longest_streak, 0));

    IF v_habit.habit_type = 'build' THEN
      v_build_scheduled := v_build_scheduled + coalesce(v_analytics.scheduled_days, 0);
      v_build_completed := v_build_completed + coalesce(v_analytics.completed_days, 0);
    ELSE
      v_quit_scheduled := v_quit_scheduled + coalesce(v_analytics.scheduled_days, 0);
      v_quit_completed := v_quit_completed + coalesce(v_analytics.completed_days, 0);
    END IF;
  END LOOP;

  v_rate := CASE WHEN v_total_scheduled = 0 THEN 0
    ELSE (v_total_completed::numeric / v_total_scheduled) * 100 END;
  v_prev_rate := CASE WHEN v_prev_scheduled = 0 THEN 0
    ELSE (v_prev_completed::numeric / v_prev_scheduled) * 100 END;
  v_growth := (v_rate - v_prev_rate) / 100;

  RETURN QUERY
  WITH habit_rates AS (
    SELECT h.id, h.name,
      CASE WHEN a.scheduled_days = 0 THEN 0::numeric
           ELSE round((a.completed_days::numeric / a.scheduled_days) * 100, 1)
      END AS rate
    FROM public.habits h
    CROSS JOIN LATERAL public.get_habit_analytics(h.id, v_start, v_end) a
    WHERE h.user_id = p_user_id AND h.archived_at IS NULL
  ),
  category_rates AS (
    SELECT c.id, c.name, ca.completion_rate AS rate
    FROM public.categories c
    CROSS JOIN LATERAL public.get_category_analytics(c.id, v_start, v_end) ca
    WHERE (c.user_id IS NULL OR c.user_id = p_user_id)
      AND EXISTS (
        SELECT 1 FROM public.habits h
        WHERE h.category_id = c.id AND h.user_id = p_user_id AND h.archived_at IS NULL
      )
  ),
  fav AS (SELECT id, name FROM habit_rates ORDER BY rate DESC, name ASC LIMIT 1),
  strong AS (SELECT id, name FROM category_rates ORDER BY rate DESC, name ASC LIMIT 1),
  weak AS (SELECT id, name FROM category_rates ORDER BY rate ASC, name ASC LIMIT 1)
  SELECT
    round(v_rate, 1),
    v_current_streak,
    CASE WHEN v_build_scheduled = 0 THEN 0::numeric
         ELSE round((v_build_completed::numeric / v_build_scheduled) * 100, 1) END,
    CASE WHEN v_quit_scheduled = 0 THEN 0::numeric
         ELSE round((v_quit_completed::numeric / v_quit_scheduled) * 100, 1) END,
    round(v_growth, 3),
    public.get_steps_forward(p_user_id),
    v_longest_streak,
    (SELECT id FROM fav), (SELECT name FROM fav),
    (SELECT id FROM strong), (SELECT name FROM strong),
    (SELECT id FROM weak), (SELECT name FROM weak);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_rizen_metrics(uuid, date, date) TO authenticated;

-- 10) Score trend
CREATE OR REPLACE FUNCTION public.get_rizen_score_trend(
  p_user_id uuid DEFAULT auth.uid(),
  p_days integer DEFAULT 30
)
RETURNS TABLE (
  score_date date,
  completion_rate numeric,
  current_streak integer,
  build_success_rate numeric,
  quit_success_rate numeric,
  growth_trend numeric
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH bounds AS (
    SELECT
      ((timezone('UTC', now()))::date - (greatest(p_days, 1) - 1)) AS start_date,
      (timezone('UTC', now()))::date AS end_date
  )
  SELECT
    d::date AS score_date,
    m.completion_rate,
    m.current_streak,
    m.build_success_rate,
    m.quit_success_rate,
    m.growth_trend
  FROM bounds b
  CROSS JOIN generate_series(b.start_date, b.end_date, '1 day'::interval) d
  CROSS JOIN LATERAL (
    SELECT *
    FROM public.get_rizen_metrics(p_user_id, (d::date - 29), d::date)
    LIMIT 1
  ) m
  ORDER BY d::date ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_rizen_score_trend(uuid, integer) TO authenticated;

-- 11) Backfill profiles for existing auth users
INSERT INTO public.profiles (id, display_name)
SELECT
  u.id,
  coalesce(u.raw_user_meta_data ->> 'display_name', split_part(u.email, '@', 1))
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 12) Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
