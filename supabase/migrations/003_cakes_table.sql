-- =============================================================
-- Cakes catalog table, RLS, reviews FK, catalog-images storage
-- =============================================================

create table if not exists cakes (
  id              uuid           primary key default gen_random_uuid(),
  slug            text           unique not null,
  price_per_pound numeric(6,2)   not null,
  min_weight      numeric(4,2)   not null,
  notice_days     integer        not null default 2,
  sort_order      integer        not null default 0,
  is_active       boolean        not null default true,
  tags            text[]         not null default '{}',
  image_paths     text[]         not null default '{}',
  translations    jsonb          not null,
  created_at      timestamptz    not null default now(),
  updated_at      timestamptz    not null default now()
);

create trigger cakes_updated_at
  before update on cakes
  for each row execute function update_updated_at();

alter table cakes enable row level security;

create policy "cakes: public read active"
  on cakes for select
  using (is_active = true);

create policy "cakes: admin full access"
  on cakes for all
  using (is_admin());

-- Replace hardcoded review slug check with FK to cakes (applied after seed in 004)

-- Public catalog image bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-images',
  'catalog-images',
  true,
  5242880,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

create policy "catalog-images: public read"
  on storage.objects for select
  using (bucket_id = 'catalog-images');

create policy "catalog-images: admin insert"
  on storage.objects for insert
  with check (
    bucket_id = 'catalog-images'
    and is_admin()
  );

create policy "catalog-images: admin update"
  on storage.objects for update
  using (
    bucket_id = 'catalog-images'
    and is_admin()
  );

create policy "catalog-images: admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'catalog-images'
    and is_admin()
  );
