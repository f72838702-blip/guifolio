-- GUIFOLIO — Storage : bucket avatars (photos de profil compressées)
-- À exécuter dans le SQL Editor Supabase

-- Bucket public (photos lisibles par tous, page publique oblige)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Lecture publique
create policy "Public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

-- Écriture : chacun dans SON dossier (nom du dossier = son user_id)
create policy "Owner upload avatars" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owner update avatars" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owner delete avatars" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
