-- ============================================
-- MIGRATION 003: dedicated categories table + drop category cover image
-- Run this AFTER supabase_migration_002.sql
-- ============================================

-- ---- Categories table ----
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Public can view categories"
on public.categories
for select
to anon
using (true);

create policy "Authenticated users full access to categories"
on public.categories
for all
to authenticated
using (true)
with check (true);

-- Seed the 25 original categories in their curated business order
insert into public.categories (name, sort_order) values
  ('Meze Çeşitleri', 0), ('Aperatif Çeşitleri', 1), ('Omlet Çeşitleri', 2),
  ('Krep Çeşitleri', 3), ('Menemen Çeşitleri', 4), ('Salata Çeşitleri', 5),
  ('Makarna Çeşitleri', 6), ('Tavuk Çeşitleri', 7), ('Et Yemeği Çeşitleri', 8),
  ('Burger Çeşitleri', 9), ('Çorba Çeşitleri', 10), ('Kurudite Çeşitleri', 11),
  ('Meşrubat Çeşitleri', 12), ('Sıcak İçecek Çeşitleri', 13), ('Bitki Çayı Çeşitleri', 14),
  ('Sıcak Kahve Çeşitleri', 15), ('Soğuk Kahve Çeşitleri', 16), ('Blend İçecek Çeşitleri', 17),
  ('Kokteyl Çeşitleri', 18), ('Bira Çeşitleri', 19), ('Rakı Çeşitleri', 20),
  ('Viski Çeşitleri', 21), ('Şarap Çeşitleri', 22), ('İthal İçecek Çeşitleri', 23),
  ('Şurup Çeşitleri', 24)
on conflict (name) do nothing;

-- ---- Drop the category cover image feature (decided against it) ----
alter table public.menu_items drop column if exists category_image_url;
