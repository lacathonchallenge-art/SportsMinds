-- ════════════════════════════════════════════════════════════════════
--  Storage bucket: event-media
--  Pour les images + vidéos uploadées depuis l'admin.
--  À exécuter UNE FOIS dans Supabase SQL Editor.
-- ════════════════════════════════════════════════════════════════════

-- Create the bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-media',
  'event-media',
  true,
  104857600,  -- 100 MB par fichier (vidéos courtes OK)
  array[
    'image/jpeg','image/png','image/webp','image/gif','image/svg+xml',
    'video/mp4','video/webm','video/quicktime','video/x-msvideo'
  ]
)
on conflict (id) do update set
  public            = excluded.public,
  file_size_limit   = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read on this bucket (the admin uses service_role for writes)
drop policy if exists "event_media_public_read" on storage.objects;
create policy "event_media_public_read"
on storage.objects for select
to public
using (bucket_id = 'event-media');
