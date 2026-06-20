-- Align default category names and icons with RIZEN mockups

update public.categories
set name = 'Health & Fitness', icon = 'heart-pulse'
where user_id is null and name = 'Fitness' and category_type = 'build';

update public.categories set icon = 'leaf'
where user_id is null and name = 'Mindfulness' and category_type = 'build';

update public.categories set icon = 'book-open'
where user_id is null and name = 'Personal Growth' and category_type = 'build';

update public.categories set icon = 'zap'
where user_id is null and name = 'Productivity' and category_type = 'build';

update public.categories set icon = 'graduation-cap'
where user_id is null and name = 'Learning' and category_type = 'build';

update public.categories set icon = 'dollar-sign'
where user_id is null and name = 'Finance' and category_type = 'build';

update public.categories set icon = 'cigarette-off'
where user_id is null and name = 'Smoking' and category_type = 'quit';

update public.categories set icon = 'wine'
where user_id is null and name = 'Alcohol' and category_type = 'quit';

update public.categories set icon = 'hamburger'
where user_id is null and name = 'Junk Food' and category_type = 'quit';

update public.categories set icon = 'smartphone'
where user_id is null and name = 'Social Media' and category_type = 'quit';

-- Merge legacy Sugar category into Junk Food
update public.habits h
set category_id = junk.id
from public.categories sugar, public.categories junk
where h.category_id = sugar.id
  and sugar.user_id is null
  and sugar.name = 'Sugar'
  and sugar.category_type = 'quit'
  and junk.user_id is null
  and junk.name = 'Junk Food'
  and junk.category_type = 'quit';

delete from public.categories
where user_id is null and name = 'Sugar' and category_type = 'quit';
