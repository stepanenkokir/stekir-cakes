-- Fix infinite recursion in profiles RLS policies.
-- Admin checks queried profiles inside profiles RLS, causing error 42P17.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "profiles: admin read all" on profiles;
create policy "profiles: admin read all"
  on profiles for select
  using (is_admin());

drop policy if exists "orders: admin full access" on orders;
create policy "orders: admin full access"
  on orders for all
  using (is_admin());

drop policy if exists "reviews: admin full access" on reviews;
create policy "reviews: admin full access"
  on reviews for all
  using (is_admin());

drop policy if exists "cakes: admin full access" on cakes;
create policy "cakes: admin full access"
  on cakes for all
  using (is_admin());

drop policy if exists "catalog-images: admin insert" on storage.objects;
create policy "catalog-images: admin insert"
  on storage.objects for insert
  with check (
    bucket_id = 'catalog-images'
    and is_admin()
  );

drop policy if exists "catalog-images: admin update" on storage.objects;
create policy "catalog-images: admin update"
  on storage.objects for update
  using (
    bucket_id = 'catalog-images'
    and is_admin()
  );

drop policy if exists "catalog-images: admin delete" on storage.objects;
create policy "catalog-images: admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'catalog-images'
    and is_admin()
  );
