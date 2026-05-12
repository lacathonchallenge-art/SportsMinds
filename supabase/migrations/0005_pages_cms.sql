-- ════════════════════════════════════════════════════════════════════
--  Jalon 5 — CMS pages (multipages éditables depuis l'admin)
--  À exécuter UNE FOIS dans Supabase SQL Editor.
-- ════════════════════════════════════════════════════════════════════

-- ─── 1) Tables ───────────────────────────────────────────────────────
create table if not exists public.pages (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  name            text not null,
  title           text,
  seo_title       text,
  seo_description text,
  status          content_status not null default 'published',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.page_sections (
  id            uuid primary key default uuid_generate_v4(),
  page_id       uuid not null references public.pages(id) on delete cascade,
  section_key   text not null,
  section_type  text not null default 'generic',
  title         text,
  subtitle      text,
  content_json  jsonb not null default '{}'::jsonb,
  media_json    jsonb not null default '{}'::jsonb,
  settings_json jsonb not null default '{}'::jsonb,
  display_order int  not null default 0,
  is_visible    boolean not null default true,
  status        content_status not null default 'published',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (page_id, section_key)
);

create table if not exists public.section_items (
  id            uuid primary key default uuid_generate_v4(),
  section_id    uuid not null references public.page_sections(id) on delete cascade,
  item_type     text not null default 'generic',
  title         text,
  subtitle      text,
  description   text,
  media_url     text,
  icon          text,
  link_url      text,
  display_order int  not null default 0,
  is_visible    boolean not null default true,
  content_json  jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.page_versions (
  id                     uuid primary key default uuid_generate_v4(),
  page_id                uuid not null references public.pages(id) on delete cascade,
  version_name           text,
  content_snapshot_json  jsonb not null default '{}'::jsonb,
  created_at             timestamptz not null default now(),
  created_by             uuid references public.users(id) on delete set null
);

-- Triggers updated_at
do $$ declare t text;
begin
  for t in select unnest(array['pages','page_sections','section_items']) loop
    execute format('drop trigger if exists trg_touch_%I on public.%I', t, t);
    execute format(
      'create trigger trg_touch_%I before update on public.%I
       for each row execute function public.touch_updated_at()',
      t, t
    );
  end loop;
end $$;

-- Indices
create index if not exists idx_page_sections_page on public.page_sections(page_id, display_order);
create index if not exists idx_section_items_section on public.section_items(section_id, display_order);

-- ─── 2) RLS ──────────────────────────────────────────────────────────
alter table public.pages           enable row level security;
alter table public.page_sections   enable row level security;
alter table public.section_items   enable row level security;
alter table public.page_versions   enable row level security;

drop policy if exists "pages_public_read" on public.pages;
create policy "pages_public_read" on public.pages
  for select using (status = 'published');

drop policy if exists "page_sections_public_read" on public.page_sections;
create policy "page_sections_public_read" on public.page_sections
  for select using (
    is_visible = true and status = 'published'
    and exists (select 1 from public.pages p where p.id = page_id and p.status = 'published')
  );

drop policy if exists "section_items_public_read" on public.section_items;
create policy "section_items_public_read" on public.section_items
  for select using (
    is_visible = true
    and exists (
      select 1 from public.page_sections s where s.id = section_id
        and s.is_visible = true and s.status = 'published'
    )
  );

-- Auth read all (drafts included for admin)
drop policy if exists "pages_auth_read_all" on public.pages;
create policy "pages_auth_read_all" on public.pages for select to authenticated using (true);
drop policy if exists "page_sections_auth_read_all" on public.page_sections;
create policy "page_sections_auth_read_all" on public.page_sections for select to authenticated using (true);
drop policy if exists "section_items_auth_read_all" on public.section_items;
create policy "section_items_auth_read_all" on public.section_items for select to authenticated using (true);
drop policy if exists "page_versions_auth_read_all" on public.page_versions;
create policy "page_versions_auth_read_all" on public.page_versions for select to authenticated using (true);

-- ─── 3) Seed pages ───────────────────────────────────────────────────
insert into public.pages (slug, name, title, status)
values
  ('home',                'Accueil',                 'SPORTS MINDS — Sport. Média. Événementiel. Impact.', 'published'),
  ('about',               'Qui sommes-nous',         'Qui sommes-nous · SPORTS MINDS',                      'published'),
  ('expertises',          'Expertises',              'Expertises · SPORTS MINDS',                           'published'),
  ('events-productions',  'Événements & productions','Événements & productions · SPORTS MINDS',             'published'),
  ('contact',             'Contact',                 'Contact · SPORTS MINDS',                              'published')
on conflict (slug) do nothing;

-- ─── 4) Seed sections — Home ─────────────────────────────────────────
with home as (select id from public.pages where slug = 'home')
insert into public.page_sections
  (page_id, section_key, section_type, title, subtitle, content_json, display_order)
select home.id, k.section_key, k.section_type, k.title, k.subtitle, k.content_json, k.ord
from home
cross join (values
  ('hero', 'hero', 'Sports Minds.', 'SPORT / MÉDIA / ÉVÉNEMENTIEL / IMPACT',
   jsonb_build_object(
     'eyebrow', 'AGENCE CONSEIL · COMMUNICATION SPORTIVE',
     'body', 'Nous concevons des expériences sportives, des productions médias et des activations de marque à forte visibilité — du brief stratégique à la captation live.',
     'cta_primary', jsonb_build_object('label','Découvrir nos expertises','href','/#expertises'),
     'cta_secondary', jsonb_build_object('label','Lancer un projet','href','/#contact')
   ), 0),
  ('intro', 'intro', '18 ans sur le terrain.', 'L''AGENCE',
   jsonb_build_object(
     'body', 'Depuis plus de 18 ans, SPORTS MINDS accompagne les marques, institutions et acteurs du sport dans la création d''événements, de contenus médias et de dispositifs de communication à forte visibilité.'
   ), 1),
  ('expertises', 'expertises', 'Six terrains. Un seul plateau de jeu.', 'DOMAINES D''EXPERTISE',
   jsonb_build_object(
     'body', 'Six expertises intégrées sous le même toit. Un brief peut commencer en stratégie, traverser la production et finir en activation — sans changer d''interlocuteur.'
   ), 2),
  ('references', 'references', 'Ils nous ont fait confiance.', 'RÉFÉRENCES',
   jsonb_build_object(
     'body', 'Des marques nationales et internationales — sport, lifestyle, automobile, banque, télécom, média — toutes connectées par la même obsession : l''impact.'
   ), 3),
  ('events', 'events', 'Le terrain, de la première esquisse au coup de sifflet final.', 'ÉVÉNEMENTS MARQUANTS',
   jsonb_build_object('body', ''), 4),
  ('productions', 'productions', 'On signal — 365 jours par an.', 'PRODUCTIONS MÉDIAS',
   jsonb_build_object(
     'body', 'De la captation multicam au plateau, du magazine au format court — un atelier de production intégré pour les diffuseurs nationaux.'
   ), 5),
  ('stats', 'stats', 'La preuve par les chiffres.', 'CHIFFRES CLÉS',
   jsonb_build_object('body', ''), 6),
  ('cta', 'cta', 'Vous avez un projet sportif, média ou événementiel?', 'CONTACT',
   jsonb_build_object(
     'body', 'SPORTS MINDS vous accompagne de l''idée à la production. Brief en 48h, devis en 5 jours, mise en route immédiate.'
   ), 7)
) as k(section_key, section_type, title, subtitle, content_json, ord)
on conflict (page_id, section_key) do nothing;

-- ─── 5) Seed sections — About ────────────────────────────────────────
with about as (select id from public.pages where slug = 'about')
insert into public.page_sections
  (page_id, section_key, section_type, title, subtitle, content_json, media_json, display_order)
select about.id, k.section_key, k.section_type, k.title, k.subtitle, k.content_json, k.media_json, k.ord
from about
cross join (values
  ('hero', 'hero', 'Une agence de terrain.', 'QUI SOMMES-NOUS',
   jsonb_build_object(
     'subhead', 'De KANA PRODUCTION à SPORTS MINDS — une histoire construite autour du sport, des médias et de l''événementiel.',
     'body', 'Depuis plus de 18 ans, l''agence accompagne marques, institutions et acteurs du sport dans la création d''événements, de productions médias et de projets à forte valeur ajoutée.'
   ),
   jsonb_build_object('image', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80'),
   0),
  ('history', 'history', 'De KANA Production à SPORTS MINDS.', 'HISTOIRE',
   jsonb_build_object(
     'body', 'KANA PRODUCTION s''est imposée au fil des années comme un acteur reconnu dans l''univers du sport, de l''événementiel et de la production média. Aujourd''hui, l''agence évolue et devient SPORTS MINDS avec une ambition claire : capitaliser sur cette expérience pour développer des projets sportifs plus structurés, plus innovants et plus durables.',
     'badge', '★ Nouvelle identité'
   ),
   jsonb_build_object('image', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'),
   1),
  ('founder', 'founder', 'Une vision portée par Mohamed Naciri.', 'FONDATEUR',
   jsonb_build_object(
     'body', 'Mohamed Naciri, ancien joueur de football au Havre AC et acteur reconnu dans l''univers du sport et du sponsoring, dirige SPORTS MINDS. Son parcours l''a amené à collaborer avec le Groupe Darmon sur le sponsoring de la FRMF avant de fonder KANA PRODUCTION.'
   ),
   '{}'::jsonb, 2),
  ('achievements', 'achievements', 'Une expérience construite sur des événements majeurs.', 'RÉALISATIONS MAJEURES',
   jsonb_build_object(
     'body', 'L''expérience de SPORTS MINDS repose sur des projets sportifs et événementiels d''envergure, réalisés pour des marques, institutions et événements reconnus.'
   ),
   '{}'::jsonb, 3),
  ('vision', 'vision', 'Le sport comme levier de transmission et d''attractivité.', 'VISION',
   jsonb_build_object(
     'body', 'SPORTS MINDS ambitionne de développer des projets sportifs structurants, capables de rassembler les publics, d''accompagner les marques et de créer une valeur durable pour les territoires.'
   ),
   jsonb_build_object('image', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1800&q=80'),
   4),
  ('objectives', 'objectives', 'Cinq engagements pour 2026 et au-delà.', 'NOS OBJECTIFS',
   jsonb_build_object('body', ''),
   '{}'::jsonb, 5),
  ('cta', 'cta', 'Construisons ensemble les nouveaux terrains du sport.', 'ON SIGNAL',
   jsonb_build_object(
     'body', 'SPORTS MINDS accompagne les marques, institutions et territoires dans la création de projets sportifs, événementiels et média à fort impact.',
     'cta_primary', jsonb_build_object('label','Nous contacter','href','/#contact'),
     'cta_secondary', jsonb_build_object('label','Découvrir nos événements','href','/#events')
   ),
   jsonb_build_object('image', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80'),
   6)
) as k(section_key, section_type, title, subtitle, content_json, media_json, ord)
on conflict (page_id, section_key) do nothing;

-- ─── 6) Seed repeatable items pour About / Objectifs ─────────────────
with sec as (
  select s.id
  from public.page_sections s
  join public.pages p on p.id = s.page_id
  where p.slug = 'about' and s.section_key = 'objectives'
)
insert into public.section_items (section_id, item_type, title, description, icon, display_order)
select sec.id, 'objective', t.title, t.descr, t.icon, t.ord
from sec
cross join (values
  ('Modèle de plage multisport permanent',          'Développer un concept de plages organisées, propres et structurées, capable d''être dupliqué à travers tout le Royaume.', 'beach',   0),
  ('Développer le tourisme balnéaire et sportif',   'Faire du sport un levier d''attractivité pour les destinations balnéaires, en créant des expériences accessibles, modernes et fédératrices.', 'compass', 1),
  ('Transmettre aux jeunes générations',            'Créer des espaces où la pratique sportive, l''éducation, la citoyenneté et la sensibilisation environnementale se rencontrent.', 'leaf',    2),
  ('Enrichir l''expérience client',                 'Proposer des dispositifs sportifs et événementiels qui améliorent l''expérience des visiteurs, des familles, des jeunes et des partenaires.', 'heart',  3),
  ('Créer de la valeur durable',                    'Développer des projets utiles, durables et duplicables, capables de générer de l''impact pour les territoires, les marques et les communautés.', 'pin',    4)
) as t(title, descr, icon, ord)
where not exists (
  select 1 from public.section_items it where it.section_id = sec.id
);
