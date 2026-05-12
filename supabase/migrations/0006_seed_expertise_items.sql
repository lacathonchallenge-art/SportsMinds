-- ════════════════════════════════════════════════════════════════════
--  Seed: 6 expertise items for the home → Expertises section.
--  Re-runnable: skips if any item already exists for the section.
-- ════════════════════════════════════════════════════════════════════

with sec as (
  select s.id
  from public.page_sections s
  join public.pages p on p.id = s.page_id
  where p.slug = 'home' and s.section_key = 'expertises'
)
insert into public.section_items
  (section_id, item_type, title, subtitle, description, media_url, content_json, display_order)
select sec.id, 'expertise', t.title, t.tag, t.descr, t.img, t.caps_json, t.ord
from sec
cross join (values
  (
    'Communication événementielle',
    'STRATEGY',
    'Plans 360°, déploiement multi-canal et orchestration de campagnes sportives à forte visibilité.',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
    jsonb_build_object(
      'capabilities',
      jsonb_build_array('Plan stratégique', 'Direction artistique', 'Relations presse', 'RP & influence')
    ),
    0
  ),
  (
    'Conception et production d''événements sportifs',
    'EVENTS',
    'De la première esquisse à la cérémonie finale — concept, scénographie, logistique et opérations sur site.',
    'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80',
    jsonb_build_object(
      'capabilities',
      jsonb_build_array('Scénographie', 'Logistique', 'Sécurité', 'Régie générale')
    ),
    1
  ),
  (
    'Production télévisée et radio',
    'BROADCAST',
    'Magazines, capsules, plateaux et captations multi-caméras pour les diffuseurs nationaux et internationaux.',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    jsonb_build_object(
      'capabilities',
      jsonb_build_array('Captation multicam', 'Plateaux TV', 'Post-production', 'Habillage antenne')
    ),
    2
  ),
  (
    'Droit d''image de sportifs professionnels',
    'TALENT',
    'Représentation, contrats d''image et placements de talents pour fédérations, marques et clubs.',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    jsonb_build_object(
      'capabilities',
      jsonb_build_array('Négociation', 'Placement', 'Contrats', 'Suivi')
    ),
    3
  ),
  (
    'Activation de marque & sponsoring',
    'BRAND',
    'Brand experience, fan zones, naming, content & social — l''activation qui transforme la visibilité en préférence.',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    jsonb_build_object(
      'capabilities',
      jsonb_build_array('Fan experience', 'Naming', 'Hospitality', 'Content social')
    ),
    4
  ),
  (
    'Conseil en stratégie de communication',
    'ADVISORY',
    'Diagnostic, positionnement et roadmap — un partenariat long-terme pour ancrer les marques dans le sport.',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    jsonb_build_object(
      'capabilities',
      jsonb_build_array('Diagnostic', 'Positionnement', 'Roadmap', 'KPI & mesure')
    ),
    5
  )
) as t(title, tag, descr, img, caps_json, ord)
where not exists (
  select 1 from public.section_items it where it.section_id = sec.id
);
