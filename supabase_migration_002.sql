-- ============================================
-- MIGRATION: add calories, ingredients, chef note, category cover image
-- Run this AFTER the original supabase_schema.sql
-- ============================================
alter table public.menu_items
  add column if not exists calories text,           -- e.g. "250 kcal" — kept as text, not a real number
  add column if not exists ingredients text,          -- comma-separated ingredient list, Turkish
  add column if not exists chef_note text,            -- şefin notu
  add column if not exists category_image_url text;   -- cover image shared across all items in a category

comment on column public.menu_items.calories is 'Free text, e.g. "250 kcal"';
comment on column public.menu_items.ingredients is 'Comma-separated ingredient list in Turkish, matches original menu format';
comment on column public.menu_items.category_image_url is 'Cover image for the category accordion header — same value expected across all rows sharing a category';
