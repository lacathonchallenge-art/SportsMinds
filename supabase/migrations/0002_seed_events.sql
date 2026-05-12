-- ════════════════════════════════════════════════════════════════════
--  Seed des 7 événements (en plus du Danone déjà seedé par 0001).
--  À exécuter UNE FOIS dans Supabase SQL Editor.
--  Idempotent : ON CONFLICT (slug) DO NOTHING + checks d'existence.
-- ════════════════════════════════════════════════════════════════════

-- ─── 1) Événements ───────────────────────────────────────────────────
insert into public.events
  (slug, title, category, location, period, type, editions,
   cover_image, short_description, case_summary, status, featured)
values
  ('grand-prix-hassan-ii', 'Grand Prix Hassan II', 'Tennis', 'Marrakech', '2019–2024',
   'ATP 250 Marrakech', 'OPS · prod TV',
   'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80',
   'ATP 250 historique du circuit pro masculin, captation TV pour diffuseurs internationaux.',
   'Tournoi ATP 250 historique du circuit professionnel masculin, organisé chaque printemps sur terre battue. Sports Minds gère l''opérationnel sur site et la captation TV pour les diffuseurs internationaux.',
   'published', false),
  ('marathon-des-sables', 'Marathon des Sables', 'Ultra-trail', 'Sud Maroc', '2018',
   '250km dans le désert', 'Activation marques',
   'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80',
   'L''ultra-trail le plus exigeant au monde — 250km en autosuffisance dans le désert.',
   'L''ultra-trail le plus exigeant au monde — 250km en autosuffisance dans le désert marocain. Sports Minds y a déployé une activation de marque conçue autour du dépassement de soi et de l''engagement physique.',
   'published', false),
  ('marathon-de-casablanca', 'Marathon de Casablanca', 'Running', 'Casablanca', '2021–2024',
   '30 000+ coureurs', 'Production globale',
   'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80',
   'Plus grand marathon urbain du royaume avec plus de 30 000 participants sur 4 distances.',
   'Plus grand marathon urbain du royaume avec plus de 30 000 participants sur 4 distances (5km, 10km, semi, marathon). Sports Minds prend en charge la production complète : scénographie, parcours, captation, animations live.',
   'published', false),
  ('lacoste-cup-morocco', 'Lacoste Cup Morocco', 'Golf/Tennis', 'Rabat', '2022',
   'Hospitality & retail activation', 'Brand experience',
   'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80',
   'Évènement hospitality haut de gamme : tennis exhibition, retail, expérience VIP.',
   'Évènement hospitality haut de gamme combinant exhibition tennis, retail activation et expérience VIP autour de la marque Lacoste. Conçu de A à Z par Sports Minds en partenariat avec les équipes marketing France.',
   'published', false),
  ('cfao-summer-drive', 'CFAO Summer Drive', 'Auto', '7 villes', '2023',
   'Tour des plages', 'Road show',
   'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80',
   'Road show estival du groupe CFAO sur les principales stations balnéaires marocaines.',
   'Road show estival du groupe CFAO sur les principales stations balnéaires marocaines. Mise en scène des dernières gammes automobiles dans un dispositif lifestyle et famille.',
   'published', false),
  ('tournoi-nojoum-douars', 'Tournoi Nojoum Douars', 'Football', 'Maroc rural', 'depuis 2019',
   'Sport & impact social', 'Programme national',
   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
   'Programme national de détection et de soutien aux jeunes talents issus du monde rural.',
   'Programme national de détection et de soutien aux jeunes talents issus du monde rural. Tournoi inter-douars avec plus de 500 équipes inscrites chaque saison, sponsorisé par les institutions et acteurs locaux.',
   'published', false),
  ('jet-ski-casablanca', 'Jet Ski Casablanca', 'Nautique', 'Ain Diab', '2024',
   'Compétition côtière', 'Captation TV',
   'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80',
   'Compétition de jet ski sur la côte casablancaise — captation multi-caméras.',
   'Compétition de jet ski sur la côte casablancaise — captation multi-caméras dont drone et caméras embarquées. Diffusion plateau sur les chaînes nationales et plateformes sociales.',
   'published', false)
on conflict (slug) do nothing;

-- ─── 2) Key points (insérés uniquement si l'événement n'en a aucun) ──
insert into public.event_key_points (event_id, number, title, display_order)
select e.id, n.num, n.title, n.ord
from public.events e
cross join lateral (values
  ('grand-prix-hassan-ii',   '01', 'Captation 8 caméras live',         0),
  ('grand-prix-hassan-ii',   '02', 'Operations hospitalité VIP',       1),
  ('grand-prix-hassan-ii',   '03', 'Habillage antenne ATP Media',      2),
  ('grand-prix-hassan-ii',   '04', 'Plateau d''analyse quotidien',     3),
  ('marathon-des-sables',    '01', 'Présence terrain sur 6 étapes',    0),
  ('marathon-des-sables',    '02', 'Captation drone et POV',           1),
  ('marathon-des-sables',    '03', 'Brand storytelling cross-média',   2),
  ('marathon-des-sables',    '04', 'Interviews coureurs en live',      3),
  ('marathon-de-casablanca', '01', 'Coordination 30k+ inscrits',       0),
  ('marathon-de-casablanca', '02', '15 km de parcours urbain habillé', 1),
  ('marathon-de-casablanca', '03', '3 plateaux TV mobiles',            2),
  ('marathon-de-casablanca', '04', 'Cérémonie podium en prime-time',   3),
  ('lacoste-cup-morocco',    '01', 'Village brand experience 2 000m²', 0),
  ('lacoste-cup-morocco',    '02', 'Match exhibition pros + amateurs', 1),
  ('lacoste-cup-morocco',    '03', 'Pop-up store retail exclusif',     2),
  ('lacoste-cup-morocco',    '04', 'Couverture social & PR',           3),
  ('cfao-summer-drive',      '01', '7 étapes en 6 semaines',           0),
  ('cfao-summer-drive',      '02', 'Dispositif lifestyle plage',       1),
  ('cfao-summer-drive',      '03', 'Animations enfants & DJ sets',     2),
  ('cfao-summer-drive',      '04', 'Test drive sur circuit éphémère',  3),
  ('tournoi-nojoum-douars',  '01', '500+ équipes engagées',            0),
  ('tournoi-nojoum-douars',  '02', 'Bourses & équipements offerts',    1),
  ('tournoi-nojoum-douars',  '03', 'Stages avec entraîneurs nationaux',2),
  ('tournoi-nojoum-douars',  '04', 'Documentaire de saison',           3),
  ('jet-ski-casablanca',     '01', 'Captation drone & embarquée',      0),
  ('jet-ski-casablanca',     '02', 'Live streaming social',            1),
  ('jet-ski-casablanca',     '03', 'Plateau d''analyse en bord d''eau',2),
  ('jet-ski-casablanca',     '04', 'Habillage TV sur-mesure',          3)
) as n(slug, num, title, ord)
where e.slug = n.slug
  and not exists (
    select 1 from public.event_key_points kp where kp.event_id = e.id
  );

-- ─── 3) Galerie (event_media) — insérée si l'événement n'a aucun média
insert into public.event_media (event_id, media_type, url, display_order)
select e.id, 'image'::media_kind, g.url, g.ord
from public.events e
join lateral (values
  -- Danone Nations Cup
  ('danone-nations-cup',     'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80', 0),
  ('danone-nations-cup',     'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80', 1),
  ('danone-nations-cup',     'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80', 2),
  ('danone-nations-cup',     'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80', 3),
  -- Grand Prix Hassan II
  ('grand-prix-hassan-ii',   'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80', 0),
  ('grand-prix-hassan-ii',   'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80', 1),
  ('grand-prix-hassan-ii',   'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80', 2),
  -- Marathon des Sables
  ('marathon-des-sables',    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80', 0),
  ('marathon-des-sables',    'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80', 1),
  ('marathon-des-sables',    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80', 2),
  -- Marathon de Casablanca
  ('marathon-de-casablanca', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80', 0),
  ('marathon-de-casablanca', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80', 1),
  ('marathon-de-casablanca', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80', 2),
  ('marathon-de-casablanca', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80', 3),
  -- Lacoste Cup Morocco
  ('lacoste-cup-morocco',    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80', 0),
  ('lacoste-cup-morocco',    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80', 1),
  ('lacoste-cup-morocco',    'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80', 2),
  -- CFAO Summer Drive
  ('cfao-summer-drive',      'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80', 0),
  ('cfao-summer-drive',      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80', 1),
  ('cfao-summer-drive',      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80', 2),
  -- Tournoi Nojoum Douars
  ('tournoi-nojoum-douars',  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80', 0),
  ('tournoi-nojoum-douars',  'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80', 1),
  ('tournoi-nojoum-douars',  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80', 2),
  -- Jet Ski Casablanca
  ('jet-ski-casablanca',     'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80', 0),
  ('jet-ski-casablanca',     'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80', 1),
  ('jet-ski-casablanca',     'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80', 2)
) as g(slug, url, ord) on g.slug = e.slug
where not exists (
  select 1 from public.event_media m where m.event_id = e.id
);
