-- ============================================
-- MIGRATION 008: fix image URLs from absolute to relative
-- ============================================
-- Problem: image_url values are stored as absolute URLs pointing at
-- https://lobbygarden.com/assets/menu/... — the browser always requests
-- that exact domain regardless of where the site itself is hosted (Vercel
-- preview, or later the real domain). The old GitHub Pages site also blocks
-- cross-origin hotlinking, so these break everywhere except on the old site
-- itself.
--
-- Fix: strip the domain, leaving a relative path like
-- "/assets/menu/atom.jpg". A relative path always resolves against
-- whatever domain the page is currently served from — so it works right
-- now on the Vercel preview (since you already copied the images into
-- public/assets/menu), AND continues working once lobbygarden.com itself
-- points at this Vercel deployment.

update public.menu_items
set image_url = regexp_replace(image_url, '^https?://lobbygarden\.com', '')
where image_url like 'http%://lobbygarden.com/%';
