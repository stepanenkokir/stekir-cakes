-- =============================================================
-- Sweet Sacramento — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Helper: auto-update updated_at
-- ---------------------------------------------------------------
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------
-- 2. Profiles (extends auth.users)
-- ---------------------------------------------------------------
create table if not exists profiles (
  id              uuid        primary key references auth.users on delete cascade,
  full_name       text,
  phone           text,
  default_address text,
  role            text        not null default 'customer',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint profiles_role_check check (role in ('customer', 'admin'))
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- Auto-create profile row when a new auth user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------
-- 3. Orders
-- ---------------------------------------------------------------
create table if not exists orders (
  id                      uuid         primary key default gen_random_uuid(),
  order_number            text         unique not null,   -- e.g. SAC-00042
  user_id                 uuid         references profiles(id) on delete set null,
  -- Denormalized customer info (supports guest checkout)
  customer_name           text         not null,
  customer_email          text         not null,
  customer_phone          text         not null,
  -- Items snapshot
  items                   jsonb        not null,
  -- Delivery
  delivery_type           text         not null,
  delivery_address        text,
  delivery_city           text,
  delivery_zip            text,
  delivery_date           date         not null,
  delivery_window         text,
  delivery_instructions   text,
  delivery_fee            numeric(6,2) not null default 0,
  -- Payment
  payment_method          text         not null,
  subtotal                numeric(8,2) not null,
  total                   numeric(8,2) not null,
  deposit_amount          numeric(8,2),
  -- Status lifecycle
  status                  text         not null default 'pending',
  -- Meta
  created_at              timestamptz  not null default now(),
  updated_at              timestamptz  not null default now(),
  constraint orders_delivery_type_check  check (delivery_type  in ('delivery', 'pickup')),
  constraint orders_delivery_window_check check (delivery_window in ('morning', 'afternoon', 'evening') or delivery_window is null),
  constraint orders_payment_method_check check (payment_method in ('zelle', 'venmo', 'cash')),
  constraint orders_status_check         check (status in ('pending', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled'))
);

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Sequence for human-readable order numbers: SAC-00001, SAC-00002 …
create sequence if not exists order_number_seq start 1;

create or replace function generate_order_number()
returns trigger language plpgsql as $$
begin
  new.order_number := 'SAC-' || lpad(nextval('order_number_seq')::text, 5, '0');
  return new;
end;
$$;

create trigger orders_set_order_number
  before insert on orders
  for each row
  when (new.order_number is null or new.order_number = '')
  execute function generate_order_number();

-- ---------------------------------------------------------------
-- 4. Reviews
-- ---------------------------------------------------------------
create table if not exists reviews (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        references profiles(id) on delete set null,
  reviewer_name text        not null,
  cake_slug     text        not null,
  rating        integer     not null,
  occasion      text,
  body          text        not null,
  approved      boolean     not null default false,
  created_at    timestamptz not null default now(),
  constraint reviews_rating_check    check (rating between 1 and 5),
  constraint reviews_cake_slug_check check (cake_slug in ('napoleon', 'medovik', 'smetannik', 'mannik'))
);

-- ---------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------

alter table profiles enable row level security;
alter table orders   enable row level security;
alter table reviews  enable row level security;

-- profiles: users see & edit only their own row; admins see all
create policy "profiles: owner read"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: owner update"
  on profiles for update
  using (auth.uid() = id);

create policy "profiles: admin read all"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- orders: owner sees own orders; admin sees all; insert allowed for authenticated + anon (guest checkout)
create policy "orders: owner read"
  on orders for select
  using (auth.uid() = user_id);

create policy "orders: insert authenticated"
  on orders for insert
  with check (true);   -- server-side API route validates; anon key used only server-side

create policy "orders: admin full access"
  on orders for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- reviews: approved reviews are public; owner can read own; admin can do everything
create policy "reviews: public read approved"
  on reviews for select
  using (approved = true);

create policy "reviews: owner read own"
  on reviews for select
  using (auth.uid() = user_id);

create policy "reviews: insert authenticated"
  on reviews for insert
  with check (auth.uid() is not null);

create policy "reviews: admin full access"
  on reviews for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
