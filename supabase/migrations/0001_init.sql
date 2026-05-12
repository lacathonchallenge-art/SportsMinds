-- ════════════════════════════════════════════════════════════════════
--  SPORTS MINDS — CRM schema (Jalon 1)
--  À exécuter dans Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════════════════════

-- ─── Extensions ───
create extension if not exists "uuid-ossp";

-- ─── Enums ────────
do $$ begin
  create type user_role as enum ('admin', 'editor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_kind as enum ('image', 'video', 'youtube', 'vimeo');
exception when duplicate_object then null; end $$;

-- ════════════════════════════════════════════════════════════════════
--  Users (profil applicatif lié à auth.users)
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role user_role not null default 'editor',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    case
      when new.email = 'lacathonchallenge@gmail.com' then 'admin'::user_role
      else 'editor'::user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════
--  Events
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  category text not null,
  location text,
  period text,
  badge text,
  type text,
  editions text,
  cover_image text,
  cover_video text,
  short_description text,
  case_summary text,
  status content_status not null default 'draft',
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_featured on public.events(featured) where featured = true;
create index if not exists idx_events_category on public.events(category);

-- ─── Key points ───
create table if not exists public.event_key_points (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  number text,
  title text not null,
  description text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_kp_event on public.event_key_points(event_id, display_order);

-- ─── Gallery / media on an event ───
create table if not exists public.event_media (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  media_type media_kind not null,
  url text not null,
  title text,
  alt_text text,
  display_order int not null default 0,
  is_main boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_em_event on public.event_media(event_id, display_order);

-- ─── Page builder blocks ───
create table if not exists public.event_components (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  component_type text not null,
  component_order int not null default 0,
  content_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ec_event on public.event_components(event_id, component_order);

-- ════════════════════════════════════════════════════════════════════
--  Brand references (logos)
--  Note: table renamed to "brand_references" to avoid the reserved word
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.brand_references (
  id uuid primary key default uuid_generate_v4(),
  brand_name text not null,
  logo_url text,
  category text,
  link text,
  display_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_refs_visible on public.brand_references(is_visible, display_order);

-- ════════════════════════════════════════════════════════════════════
--  Productions
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.productions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  year text,
  client text,
  type text,
  cover_image text,
  video_url text,
  short_description text,
  long_description text,
  status content_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_prod_status on public.productions(status);
create index if not exists idx_prod_featured on public.productions(featured) where featured = true;

-- ════════════════════════════════════════════════════════════════════
--  Media library
-- ════════════════════════════════════════════════════════════════════
create table if not exists public.media (
  id uuid primary key default uuid_generate_v4(),
  file_url text not null,
  file_type text not null,        -- mime type
  file_name text not null,
  alt_text text,
  folder text default 'general',
  size_bytes bigint,
  created_at timestamptz not null default now()
);
create index if not exists idx_media_folder on public.media(folder);

-- ════════════════════════════════════════════════════════════════════
--  updated_at trigger (generic)
-- ════════════════════════════════════════════════════════════════════
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$ declare t text;
begin
  for t in select unnest(array[
    'events','event_key_points','event_media','event_components',
    'brand_references','productions'
  ])
  loop
    execute format('drop trigger if exists trg_touch_%I on public.%I', t, t);
    execute format(
      'create trigger trg_touch_%I before update on public.%I
       for each row execute function public.touch_updated_at()',
      t, t
    );
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════
--  RLS
--  Public can read PUBLISHED content. Authenticated users (admin/editor)
--  can do everything via service_role on the server. We keep client-side
--  writes blocked.
-- ════════════════════════════════════════════════════════════════════
alter table public.users              enable row level security;
alter table public.events             enable row level security;
alter table public.event_key_points   enable row level security;
alter table public.event_media        enable row level security;
alter table public.event_components   enable row level security;
alter table public.brand_references   enable row level security;
alter table public.productions        enable row level security;
alter table public.media              enable row level security;

-- ─── Users: each user reads their own row ───
drop policy if exists "users_self_read" on public.users;
create policy "users_self_read" on public.users
  for select using (auth.uid() = id);

-- ─── Public read access for PUBLISHED content ───
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (status = 'published');

drop policy if exists "event_kp_public_read" on public.event_key_points;
create policy "event_kp_public_read" on public.event_key_points
  for select using (
    exists (select 1 from public.events e
            where e.id = event_id and e.status = 'published')
  );

drop policy if exists "event_media_public_read" on public.event_media;
create policy "event_media_public_read" on public.event_media
  for select using (
    exists (select 1 from public.events e
            where e.id = event_id and e.status = 'published')
  );

drop policy if exists "event_components_public_read" on public.event_components;
create policy "event_components_public_read" on public.event_components
  for select using (
    exists (select 1 from public.events e
            where e.id = event_id and e.status = 'published')
  );

drop policy if exists "refs_public_read" on public.brand_references;
create policy "refs_public_read" on public.brand_references
  for select using (is_visible = true);

drop policy if exists "productions_public_read" on public.productions;
create policy "productions_public_read" on public.productions
  for select using (status = 'published');

drop policy if exists "media_public_read" on public.media;
create policy "media_public_read" on public.media
  for select using (true);

-- ─── Authenticated read all (for admin pages — server uses service_role
--     for writes, but this allows logged-in clients to read drafts too) ───
drop policy if exists "events_auth_read_all" on public.events;
create policy "events_auth_read_all" on public.events
  for select to authenticated using (true);

drop policy if exists "event_kp_auth_read_all" on public.event_key_points;
create policy "event_kp_auth_read_all" on public.event_key_points
  for select to authenticated using (true);

drop policy if exists "event_media_auth_read_all" on public.event_media;
create policy "event_media_auth_read_all" on public.event_media
  for select to authenticated using (true);

drop policy if exists "event_components_auth_read_all" on public.event_components;
create policy "event_components_auth_read_all" on public.event_components
  for select to authenticated using (true);

drop policy if exists "refs_auth_read_all" on public.brand_references;
create policy "refs_auth_read_all" on public.brand_references
  for select to authenticated using (true);

drop policy if exists "productions_auth_read_all" on public.productions;
create policy "productions_auth_read_all" on public.productions
  for select to authenticated using (true);

-- (writes are performed by the server via service_role; no client write policies)

-- ════════════════════════════════════════════════════════════════════
--  Seed: one example event so the dashboard isn't empty
-- ════════════════════════════════════════════════════════════════════
insert into public.events
  (title, slug, category, location, period, badge, type, editions,
   cover_image, short_description, case_summary, status, featured)
values
  ('Danone Nations Cup', 'danone-nations-cup', 'Football', 'Casablanca', 'Depuis 2010', 'Flagship',
   'Tournoi international jeunesse', '15 éditions',
   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
   'Tournoi international U-12 réunissant chaque année plus de 2.5M d''enfants dans 32 pays.',
   'Tournoi international de football U-12 réunissant chaque année plus de 2.5 millions d''enfants dans 32 pays. Sports Minds orchestre la production locale et internationale depuis la phase nationale jusqu''à la finale mondiale.',
   'published', true)
on conflict (slug) do nothing;

insert into public.event_key_points (event_id, number, title, display_order)
select e.id, n.num, n.title, n.ord
from public.events e
cross join (values
  ('01','Production live multi-caméras',0),
  ('02','Activation Danone sur 25+ écoles',1),
  ('03','Cérémonies d''ouverture et clôture',2),
  ('04','Couverture média nationale',3)
) as n(num, title, ord)
where e.slug = 'danone-nations-cup'
  and not exists (
    select 1 from public.event_key_points kp where kp.event_id = e.id
  );
