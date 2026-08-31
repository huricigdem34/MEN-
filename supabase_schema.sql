-- ============================================
-- MENU ITEMS TABLE
-- ============================================
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  grammage text,                          -- e.g. "250g" or "For 2 persons"
  allergens text[] default '{}',          -- e.g. {'gluten','dairy','nuts'}
  image_url text,
  is_available boolean not null default true,
  sort_order integer default 0,           -- for manual drag-and-drop reordering
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at on every edit
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

-- Index for the common query pattern (filter by category, only available items, ordered)
create index idx_menu_items_category on public.menu_items (category, sort_order);
create index idx_menu_items_available on public.menu_items (is_available);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.menu_items enable row level security;

-- Public (anon) can READ only available items — this is what the public-facing menu site uses
create policy "Public can view available items"
on public.menu_items
for select
to anon
using (is_available = true);

-- Authenticated admin users get full access (read everything, including hidden items, + write)
create policy "Authenticated users full access"
on public.menu_items
for all
to authenticated
using (true)
with check (true);

-- ============================================
-- STORAGE BUCKET FOR MENU IMAGES
-- ============================================
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true);

create policy "Public read access on menu images"
on storage.objects for select
to public
using (bucket_id = 'menu-images');

create policy "Authenticated users can upload menu images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'menu-images');

create policy "Authenticated users can update/delete menu images"
on storage.objects for all
to authenticated
using (bucket_id = 'menu-images');
