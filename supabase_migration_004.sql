-- ============================================
-- MIGRATION 004: featured/"most preferred" products
-- ============================================
alter table public.menu_items
  add column if not exists is_featured boolean not null default false;

comment on column public.menu_items.is_featured is 'Shown in the "Popüler Ürünler" showcase strip on the public menu';

create index if not exists idx_menu_items_featured on public.menu_items (is_featured) where is_featured = true;
