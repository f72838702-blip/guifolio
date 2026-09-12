-- GUIFOLIO — Storage : bucket documents (diplômes, certificats, attestations numérisés)
-- À exécuter dans le SQL Editor Supabase

-- Bucket public (documents marqués "publics" visibles sur la page portfolio)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Lecture publique
create policy "Public read documents" on storage.objects
  for select using (bucket_id = 'documents');

-- Écriture : chacun dans SON dossier (nom du dossier = son user_id)
create policy "Owner upload documents" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owner update documents" on storage.objects
  for update using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owner delete documents" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
