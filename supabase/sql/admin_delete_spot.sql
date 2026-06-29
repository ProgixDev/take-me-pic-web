-- Staff-only, audited permanent deletion of a spot (admin console).
-- Mirrors admin_review_spot: checks private.is_staff(), logs to admin_audit_log.
-- Child rows cascade (spot_photos, spot_tips, saved_spots); itinerary/post links
-- are nulled by their FKs. Storage objects (hero/photos) are NOT removed here —
-- orphaned files are a separate cleanup concern.

create or replace function public.admin_delete_spot(
  target_spot_id bigint,
  reason text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_found boolean;
  spot_name text;
  spot_status text;
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized moderation mutation'
      using errcode = '42501';
  end if;

  select true, s.name, s.status::text
    into v_found, spot_name, spot_status
  from public.spots s
  where s.id = target_spot_id
  for update;

  if v_found is null then
    raise exception 'spot not found'
      using errcode = 'P0002';
  end if;

  delete from public.spots where id = target_spot_id;

  insert into public.admin_audit_log (admin_id, action, target_type, target_id, detail)
  values (
    (select auth.uid()),
    'spot_delete',
    'spot',
    target_spot_id::text,
    jsonb_build_object(
      'name', spot_name,
      'status', spot_status,
      'reason', nullif(btrim(coalesce(reason, '')), '')
    )
  );
end;
$$;

revoke execute on function public.admin_delete_spot(bigint, text) from public, anon;
grant execute on function public.admin_delete_spot(bigint, text) to authenticated;
