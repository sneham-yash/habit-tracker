-- Fix ambiguous category_id in get_category_analytics (RETURNS TABLE shadows habits.category_id)

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
    SELECT h.id FROM public.habits h
    WHERE h.category_id = p_category_id
      AND h.archived_at IS NULL
      AND h.user_id = auth.uid()
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
