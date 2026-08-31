-- ============================================
-- MIGRATION 005: category groups (for grouping the admin's category
-- filter sidebar into İçecekler / Ana Yemekler / Mezeler & Aperatifler)
-- ============================================
alter table public.categories
  add column if not exists group_name text;

comment on column public.categories.group_name is 'Optional parent grouping shown in the admin category filter sidebar (e.g. "İçecekler", "Ana Yemekler")';

-- Assign sensible default groups to the 25 seeded categories
update public.categories set group_name = 'Mezeler & Aperatifler'
  where name in ('Meze Çeşitleri', 'Aperatif Çeşitleri', 'Kurudite Çeşitleri');

update public.categories set group_name = 'Ana Yemekler'
  where name in (
    'Omlet Çeşitleri', 'Krep Çeşitleri', 'Menemen Çeşitleri', 'Salata Çeşitleri',
    'Makarna Çeşitleri', 'Tavuk Çeşitleri', 'Et Yemeği Çeşitleri', 'Burger Çeşitleri', 'Çorba Çeşitleri'
  );

update public.categories set group_name = 'İçecekler'
  where name in (
    'Meşrubat Çeşitleri', 'Sıcak İçecek Çeşitleri', 'Bitki Çayı Çeşitleri', 'Sıcak Kahve Çeşitleri',
    'Soğuk Kahve Çeşitleri', 'Blend İçecek Çeşitleri', 'Kokteyl Çeşitleri', 'Bira Çeşitleri',
    'Rakı Çeşitleri', 'Viski Çeşitleri', 'Şarap Çeşitleri', 'İthal İçecek Çeşitleri', 'Şurup Çeşitleri'
  );
