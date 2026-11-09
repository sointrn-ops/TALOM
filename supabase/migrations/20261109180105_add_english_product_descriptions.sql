-- Keep the production schema aligned with the public menu and admin editor.
-- Safe to re-run: existing values and rows are preserved.
alter table public.products
  add column if not exists description_en text;
