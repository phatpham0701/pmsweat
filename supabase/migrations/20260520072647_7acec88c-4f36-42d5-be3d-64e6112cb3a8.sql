
-- 1. Fix search_path on functions
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- 2. Drop overly broad list policy on avatars
drop policy if exists "avatars_public_read" on storage.objects;
-- Public URLs via getPublicUrl still work without a SELECT policy on storage.objects
-- because the bucket is marked public=true at the bucket level.

-- 3. Revoke execute on internal SECURITY DEFINER / trigger functions
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.tg_set_updated_at() from anon, authenticated, public;
