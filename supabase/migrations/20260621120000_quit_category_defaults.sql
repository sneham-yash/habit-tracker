-- Replace substance-specific quit categories with life-area defaults

-- 1) Insert new default quit categories (idempotent)
INSERT INTO public.categories (user_id, name, category_type, is_default, icon)
SELECT NULL, v.name, 'quit'::public.category_type, true, v.icon
FROM (VALUES
  ('Substance', 'cigarette-off'),
  ('Food & Nutrition', 'hamburger'),
  ('Digital', 'smartphone'),
  ('Financial', 'dollar-sign'),
  ('Lifestyle', 'moon'),
  ('Mental Wellness', 'brain')
) AS v(name, icon)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories c
  WHERE c.user_id IS NULL
    AND c.name = v.name
    AND c.category_type = 'quit'
);

-- 2) Reassign habits from legacy substance defaults
UPDATE public.habits h
SET category_id = substance.id
FROM public.categories old_cat, public.categories substance
WHERE h.category_id = old_cat.id
  AND old_cat.user_id IS NULL
  AND old_cat.category_type = 'quit'
  AND old_cat.name IN ('Smoking', 'Alcohol')
  AND substance.user_id IS NULL
  AND substance.name = 'Substance'
  AND substance.category_type = 'quit';

UPDATE public.habits h
SET category_id = food.id
FROM public.categories old_cat, public.categories food
WHERE h.category_id = old_cat.id
  AND old_cat.user_id IS NULL
  AND old_cat.category_type = 'quit'
  AND old_cat.name IN ('Junk Food', 'Sugar')
  AND food.user_id IS NULL
  AND food.name = 'Food & Nutrition'
  AND food.category_type = 'quit';

UPDATE public.habits h
SET category_id = digital.id
FROM public.categories old_cat, public.categories digital
WHERE h.category_id = old_cat.id
  AND old_cat.user_id IS NULL
  AND old_cat.category_type = 'quit'
  AND old_cat.name = 'Social Media'
  AND digital.user_id IS NULL
  AND digital.name = 'Digital'
  AND digital.category_type = 'quit';

-- 3) Reassign habits from prior domain migration defaults (if present)
UPDATE public.habits h
SET category_id = substance.id
FROM public.categories old_cat, public.categories substance
WHERE h.category_id = old_cat.id
  AND old_cat.user_id IS NULL
  AND old_cat.category_type = 'quit'
  AND old_cat.name = 'Health & Body'
  AND substance.user_id IS NULL
  AND substance.name = 'Substance'
  AND substance.category_type = 'quit';

UPDATE public.habits h
SET category_id = digital.id
FROM public.categories old_cat, public.categories digital
WHERE h.category_id = old_cat.id
  AND old_cat.user_id IS NULL
  AND old_cat.category_type = 'quit'
  AND old_cat.name = 'Digital & Screen'
  AND digital.user_id IS NULL
  AND digital.name = 'Digital'
  AND digital.category_type = 'quit';

UPDATE public.habits h
SET category_id = financial.id
FROM public.categories old_cat, public.categories financial
WHERE h.category_id = old_cat.id
  AND old_cat.user_id IS NULL
  AND old_cat.category_type = 'quit'
  AND old_cat.name = 'Spending & Money'
  AND financial.user_id IS NULL
  AND financial.name = 'Financial'
  AND financial.category_type = 'quit';

UPDATE public.habits h
SET category_id = lifestyle.id
FROM public.categories old_cat, public.categories lifestyle
WHERE h.category_id = old_cat.id
  AND old_cat.user_id IS NULL
  AND old_cat.category_type = 'quit'
  AND old_cat.name = 'Sleep & Energy'
  AND lifestyle.user_id IS NULL
  AND lifestyle.name = 'Lifestyle'
  AND lifestyle.category_type = 'quit';

UPDATE public.habits h
SET category_id = mental.id
FROM public.categories old_cat, public.categories mental
WHERE h.category_id = old_cat.id
  AND old_cat.user_id IS NULL
  AND old_cat.category_type = 'quit'
  AND old_cat.name IN ('Mind & Mood', 'Focus & Productivity')
  AND mental.user_id IS NULL
  AND mental.name = 'Mental Wellness'
  AND mental.category_type = 'quit';

-- 4) Delete superseded system default quit categories
DELETE FROM public.categories
WHERE user_id IS NULL
  AND category_type = 'quit'
  AND name IN (
    'Smoking',
    'Alcohol',
    'Junk Food',
    'Social Media',
    'Sugar',
    'Health & Body',
    'Digital & Screen',
    'Spending & Money',
    'Sleep & Energy',
    'Mind & Mood',
    'Focus & Productivity'
  );
