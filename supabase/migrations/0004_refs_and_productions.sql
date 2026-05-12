-- ════════════════════════════════════════════════════════════════════
--  Jalon 3 — extension productions + seed (références + productions)
-- ════════════════════════════════════════════════════════════════════

-- ─── 1) Étendre la table productions ────────────────────────────────
alter table public.productions add column if not exists fmt  text;
alter table public.productions add column if not exists host text;
alter table public.productions add column if not exists display_order int not null default 0;

create index if not exists idx_prod_display_order on public.productions(display_order);

-- ─── 2) Brand references (logos) ────────────────────────────────────
insert into public.brand_references (brand_name, logo_url, category, display_order, is_visible)
values
  ('Coca-Cola',         'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/960px-Coca-Cola_logo.svg.png',  'Boissons',         0,  true),
  ('Danone',            'https://logo-marque.com/wp-content/uploads/2020/12/Danone-Logo.png',                                          'Agro-alimentaire', 1,  true),
  ('Samsung',           'https://1000logos.net/wp-content/uploads/2017/06/Samsung-emblem.png',                                         'Tech',             2,  true),
  ('Lacoste',           'https://cdn.worldvectorlogo.com/logos/lacoste-logo.svg',                                                      'Mode',             3,  true),
  ('Maroc Telecom',     'https://1000marcas.net/wp-content/uploads/2021/05/Maroc-Telecom-logo-1.png',                                  'Télécom',          4,  true),
  ('Royal Air Maroc',   'https://ereport.royalairmaroc.com/pwrse/template/login/images/logo.png',                                      'Transport',        5,  true),
  ('Gillette',          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Gillette.svg/3840px-Gillette.svg.png',              'Hygiène',          6,  true),
  ('Inwi',              'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/1280px-Logo_inwi.svg.png',            'Télécom',          7,  true),
  ('Méditel',           'https://images.seeklogo.com/logo-png/9/2/meditel-logo-png_seeklogo-90540.png',                                'Télécom',          8,  true),
  ('L''Oréal',          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/L%27Or%C3%A9al_logo.svg/1280px-L%27Or%C3%A9al_logo.svg.png', 'Beauté',  9,  true),
  ('Suzuki',            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Suzuki_Motor_Corporation_logo.svg/3840px-Suzuki_Motor_Corporation_logo.svg.png', 'Auto', 10, true),
  ('KIA',               'https://upload.wikimedia.org/wikipedia/commons/4/47/KIA_logo2.svg',                                           'Auto',             11, true),
  ('Volkswagen',        'https://upload.wikimedia.org/wikinews/en/d/d3/Volkswagen_logo.png',                                           'Auto',             12, true),
  ('Crédit du Maroc',   'https://lbanka.com/assets/images/banks/CDM.png',                                                              'Banque',           13, true),
  ('Société Générale',  'https://commonland.com/wp-content/uploads/2023/12/logo-societe-generale.png',                                 'Banque',           14, true),
  ('BMCI',              'https://www.bmci.ma/wp-content/blogs.dir/sites/2/2018/03/BMCI_BL_F_Q.png',                                    'Banque',           15, true),
  ('MDJS',              'https://medias24.com/content/uploads/2025/05/16/LOGO-MDJS.png',                                               'Sport',            16, true),
  ('Mercedes-Benz',     'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mercedes-Benz_Logo_2010.svg',                             'Auto',             17, true),
  ('McDonald''s',       'https://companylogos.org/wp-content/uploads/2024/08/McDonalds-1968-300x169.png',                              'Restauration',     18, true),
  ('Opel',              'https://cdn.freebiesupply.com/logos/large/2x/opel-1-logo-black-and-white.png',                                'Auto',             19, true),
  ('Radio Mars',        'https://cdn-radiotime-logos.tunein.com/s135875g.png',                                                         'Média',            20, true)
on conflict do nothing;

-- ─── 3) Productions médias ──────────────────────────────────────────
insert into public.productions
  (slug, title, fmt, year, client, type, host, short_description, status, featured, display_order)
values
  ('capsules-planete-foot', 'Capsules pour Planète Foot', 'TV', '2001 – 2002', 'MEDITEL',   'Capsules',                  null,
   'Capsules hebdo diffusées sur 2M.',
   'published', false, 0),
  ('en-route-pour-la-tunisie', 'En route pour la Tunisie', 'TV', '2004 · CAN', 'COCA-COLA', 'Magazine de route',          null,
   'Magazine de route à l''approche de la CAN 2004.',
   'published', false, 1),
  ('lahadat-footfoot', 'Lahadat Footfoot', 'TV', '2004 – 2005', 'TOTOFOOT', 'Magazine satirique',   'Noureddine Naybet',
   'Magazine satirique foot animé par Noureddine Naybet.',
   'published', false, 2),
  ('el-guerrouj-coeur-ouvert', 'El Guerrouj à cœur ouvert', 'TV', '2005', 'MEDITEL', 'Documentaire portrait', null,
   'Documentaire portrait du champion olympique Hicham El Guerrouj.',
   'published', false, 3),
  ('but-pas-but', 'But pas But', 'TV', '2005 – 2006', 'MEDITEL', 'Émission de débat', 'Marouane Chamakh',
   'Émission de débat foot avec Marouane Chamakh en parrain.',
   'published', false, 4),
  ('carton-rouge', 'Carton rouge', 'TV', '2007', 'KALM', 'Talk-show', null,
   'Talk-show sport — décryptage d''actu.',
   'published', false, 5),
  ('celebrons-le-but', 'Célébrons le But', 'TV', '2010', 'COCA-COLA', 'Pastilles match', null,
   'Pastilles courtes diffusées autour des matchs.',
   'published', false, 6)
on conflict (slug) do nothing;
