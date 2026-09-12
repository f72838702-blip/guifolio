-- GUIFOLIO — Storage : buckets avatars + documents (VERSION COMPLÈTE, ré-exécutable)
-- À coller dans le SQL Editor Supabase, puis Run

-- ========== BUCKETS (ignorés si déjà créés) ==========
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- ========== AVATARS ==========
drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Owner upload avatars" on storage.objects;
create policy "Owner upload avatars" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owner update avatars" on storage.objects;
create policy "Owner update avatars" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owner delete avatars" on storage.objects;
create policy "Owner delete avatars" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ========== DOCUMENTS (diplômes, certificats...) ==========
drop policy if exists "Public read documents" on storage.objects;
create policy "Public read documents" on storage.objects
  for select using (bucket_id = 'documents');

drop policy if exists "Owner upload documents" on storage.objects;
create policy "Owner upload documents" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owner update documents" on storage.objects;
create policy "Owner update documents" on storage.objects
  for update using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owner delete documents" on storage.objects;
create policy "Owner delete documents" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Vérification : doit afficher 2 lignes (avatars + documents, public = true)
select id, public from storage.buckets where id in ('avatars', 'documents');
