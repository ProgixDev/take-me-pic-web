-- Web admin SQL artifact: analytics aggregates (TASK-009, ADR-0008).
-- Applied remotely as migration `admin_analytics` on 2026-06-12.
--
-- One staff-checked SECURITY DEFINER RPC returns every aggregate the admin
-- analytics screens need as a single jsonb document: one round trip, the
-- staff gate lives inside the function (equivalent protection to
-- security_invoker views), and no per-view RLS surface to maintain.
-- Aggregates only — no row-level user data beyond the recent-bookings list
-- (title/amount/status + username), which is operational payment data.
--
-- Index note (acceptance criterion): all source tables are near-empty at
-- apply time and every series is bounded (6 months / 90 days); sequential
-- scans are fine. Revisit with created_at/member_since indexes when row
-- counts justify it.
--
-- Known gaps, deliberately NOT computed here:
-- - Retention/cohorts: there is no activity-event log table to derive
--   "active in week N after signup" from. Documented on the screen.
-- - MRR/ARPU: subscription pricing lives in RevenueCat, not the DB.

create or replace function public.admin_analytics_overview()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized staff read'
      using errcode = '42501';
  end if;

  select jsonb_build_object(
    'totals', (
      select jsonb_build_object(
        'users', (select count(*) from public.profiles),
        'premium_users', (
          select count(distinct s.user_id) from public.subscriptions s
          where s.status in ('active', 'in_grace')
        ),
        'banned_users', (
          select count(distinct b.user_id) from public.bans b
          where b.expires_at is null or b.expires_at > now()
        ),
        'requests_total', (select count(*) from public.help_requests),
        'sessions_engaged', (
          select count(*) from public.help_requests
          where status in ('accepted', 'in_session', 'completed', 'rated')
        ),
        'session_photos', (select count(*) from public.session_photos),
        'posts', (select count(*) from public.posts),
        'spots_approved', (select count(*) from public.spots where status = 'approved'),
        'karma_total', (select coalesce(sum(karma), 0) from public.profiles),
        'ratings_count', (select count(*) from public.ratings),
        'ratings_avg', (select coalesce(round(avg(stars), 2), 0) from public.ratings)
      )
    ),
    'monthly', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'month', to_char(m.month_start, 'YYYY-MM'),
        'new_users', coalesce((
          select count(*) from public.profiles p
          where p.member_since >= m.month_start::date
            and p.member_since < (m.month_start + interval '1 month')::date
        ), 0),
        'requests', coalesce((
          select count(*) from public.help_requests r
          where r.created_at >= m.month_start
            and r.created_at < m.month_start + interval '1 month'
        ), 0),
        'posts', coalesce((
          select count(*) from public.posts p
          where p.created_at >= m.month_start
            and p.created_at < m.month_start + interval '1 month'
        ), 0),
        'booking_revenue_cents', coalesce((
          select sum(b.amount_cents) from public.bookings b
          where b.status = 'confirmed'
            and b.created_at >= m.month_start
            and b.created_at < m.month_start + interval '1 month'
        ), 0)
      ) order by m.month_start), '[]'::jsonb)
      from (
        select date_trunc('month', now()) - (i || ' months')::interval as month_start
        from generate_series(5, 0, -1) as i
      ) m
    ),
    'weekday', (
      select coalesce(jsonb_agg(jsonb_build_object('dow', d.dow, 'requests', d.cnt) order by d.dow), '[]'::jsonb)
      from (
        select extract(isodow from r.created_at)::int as dow, count(*) as cnt
        from public.help_requests r
        where r.created_at >= now() - interval '90 days'
        group by 1
      ) d
    ),
    'hourly', (
      select coalesce(jsonb_agg(jsonb_build_object('hour', h.hour, 'requests', h.cnt) order by h.hour), '[]'::jsonb)
      from (
        select extract(hour from r.created_at)::int as hour, count(*) as cnt
        from public.help_requests r
        where r.created_at >= now() - interval '90 days'
        group by 1
      ) h
    ),
    'cities', (
      select coalesce(jsonb_agg(jsonb_build_object('city', c.city, 'users', c.cnt) order by c.cnt desc), '[]'::jsonb)
      from (
        select p.city, count(*) as cnt
        from public.profiles p
        where p.city is not null and btrim(p.city) <> ''
        group by p.city
        order by count(*) desc
        limit 8
      ) c
    ),
    'activity', (
      select jsonb_build_object(
        'requests_7d', (select count(*) from public.help_requests where created_at >= now() - interval '7 days'),
        'requests_30d', (select count(*) from public.help_requests where created_at >= now() - interval '30 days'),
        'messages_30d', (select count(*) from public.messages where created_at >= now() - interval '30 days'),
        'posts_30d', (select count(*) from public.posts where created_at >= now() - interval '30 days')
      )
    ),
    'revenue', (
      select jsonb_build_object(
        'bookings_revenue_cents', (
          select coalesce(sum(amount_cents), 0) from public.bookings where status = 'confirmed'
        ),
        'commission_cents', (
          select coalesce(sum(commission_cents), 0) from public.bookings where status = 'confirmed'
        ),
        'bookings_confirmed', (select count(*) from public.bookings where status = 'confirmed'),
        'bookings_pending', (select count(*) from public.bookings where status = 'pending'),
        'subs_active', (select count(*) from public.subscriptions where status = 'active'),
        'subs_in_grace', (select count(*) from public.subscriptions where status = 'in_grace'),
        'subs_by_store', (
          select coalesce(jsonb_agg(jsonb_build_object('store', s.store, 'count', s.cnt)), '[]'::jsonb)
          from (
            select store::text as store, count(*) as cnt
            from public.subscriptions
            where status in ('active', 'in_grace')
            group by store
          ) s
        ),
        'recent_bookings', (
          select coalesce(jsonb_agg(jsonb_build_object(
            'id', rb.id,
            'title', rb.title,
            'username', rb.username,
            'amount_cents', rb.amount_cents,
            'status', rb.status,
            'created_at', rb.created_at
          ) order by rb.created_at desc), '[]'::jsonb)
          from (
            select b.id, b.title, p.username, b.amount_cents, b.status::text, b.created_at
            from public.bookings b
            left join public.profiles p on p.id = b.user_id
            order by b.created_at desc
            limit 12
          ) rb
        )
      )
    )
  ) into result;

  return result;
end;
$$;

revoke execute on function public.admin_analytics_overview() from public, anon;
grant execute on function public.admin_analytics_overview() to authenticated;
