-- Web admin SQL artifact: grant a staff role to an existing Auth account.
--
-- Prerequisite: create the account first in Supabase Dashboard
-- (Authentication -> Users -> Add user, with "Auto confirm" enabled).
-- Staff accounts are pre-created internal accounts, never public signups.
--
-- Replace the email and pick one role: 'moderator' | 'admin' | 'super_admin'.

insert into public.user_roles (user_id, role)
select u.id, 'admin'
from auth.users u
where u.email = 'staff@example.com'
  and not exists (
    select 1
    from public.user_roles ur
    where ur.user_id = u.id
      and ur.role = 'admin'
  );

-- Verify:
-- select u.email, ur.role
-- from public.user_roles ur
-- join auth.users u on u.id = ur.user_id;
