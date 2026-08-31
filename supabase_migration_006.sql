-- ============================================
-- MIGRATION 006: soft delete, site settings, EN translation fields
-- ============================================

-- ---- Soft delete for menu_items ----
alter table public.menu_items
  add column if not exists deleted_at timestamptz;

comment on column public.menu_items.deleted_at is 'Soft delete marker. NULL = active. Set to now() on delete, restorable within 30 days.';

create index if not exists idx_menu_items_deleted_at on public.menu_items (deleted_at);

-- ---- Site settings (WiFi password, reservation phone, etc.) ----
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "Public can read settings"
on public.settings for select to anon using (true);

create policy "Authenticated users can manage settings"
on public.settings for all to authenticated using (true) with check (true);

insert into public.settings (key, value) values
  ('wifi_password', ''),
  ('reservation_phone', '')
on conflict (key) do nothing;

-- ---- English translation fields ----
alter table public.menu_items
  add column if not exists name_en text,
  add column if not exists description_en text,
  add column if not exists ingredients_en text,
  add column if not exists chef_note_en text;

alter table public.categories
  add column if not exists name_en text;

comment on column public.menu_items.name_en is 'English translation. Falls back to Turkish (name) on the public menu if empty.';

-- ---- OPTIONAL: auto-purge items that have been in the trash for 30+ days ----
-- Requires the pg_cron extension — enable it once in Supabase Dashboard:
-- Database → Extensions → search "pg_cron" → Enable, then re-run just this
-- block. Wrapped so that if pg_cron isn't available, it fails quietly
-- instead of blocking everything above (which is what happened the first
-- time — this block used to run BEFORE the columns/tables above, so its
-- failure stopped the whole script). If you skip this entirely,
-- soft-deleted items just stay in the trash indefinitely (harmless — clean
-- them up manually with "Kalıcı Olarak Sil" instead).
do $$
begin
  create extension if not exists pg_cron;
  perform cron.schedule(
    'purge-deleted-menu-items',
    '0 3 * * *', -- every day at 03:00
    $sql$ delete from public.menu_items where deleted_at is not null and deleted_at < now() - interval '30 days' $sql$
  );
exception when others then
  raise notice 'pg_cron setup skipped (extension likely unavailable on this plan): %', sqlerrm;
end $$;
