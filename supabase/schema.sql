-- ─────────────────────────────────────────
-- Larry Inver Wholesale — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── ORDERS TABLE ───────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  business_name text,
  business_type text,
  items jsonb not null default '[]',
  total numeric(10, 2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'delivered')),
  payment_method text not null default 'invoice'
    check (payment_method in ('stripe', 'invoice')),
  stripe_payment_intent text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ─── CONTACT MESSAGES TABLE ─────────────
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── PRODUCTS TABLE (optional — for dynamic catalog) ─
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null
    check (category in ('meats', 'seafood', 'produce', 'dairy', 'dryGoods')),
  unit_size text not null,
  price numeric(10, 2) not null,
  image_url text,
  description text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── ROW LEVEL SECURITY ──────────────────

-- Orders: only service role can read/write (public can insert)
alter table orders enable row level security;

create policy "Anyone can insert orders"
  on orders for insert
  with check (true);

create policy "Service role can do everything on orders"
  on orders for all
  using (auth.role() = 'service_role');

-- Contact messages: service role only
alter table contact_messages enable row level security;

create policy "Anyone can insert contact messages"
  on contact_messages for insert
  with check (true);

create policy "Service role can do everything on contact_messages"
  on contact_messages for all
  using (auth.role() = 'service_role');

-- Products: public read, service role write
alter table products enable row level security;

create policy "Public can read products"
  on products for select
  using (true);

create policy "Service role can manage products"
  on products for all
  using (auth.role() = 'service_role');

-- ─── INDEXES ─────────────────────────────
create index if not exists idx_orders_email on orders(customer_email);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);
create index if not exists idx_messages_read on contact_messages(read);
create index if not exists idx_products_category on products(category);
