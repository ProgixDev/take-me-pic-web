# Take Me Pic Web Docs

Generated from the mobile project docs in
`/Users/macbookpro/Documents/Progix/take-my-pic/docs` and the admin handoff
package in `/Users/macbookpro/Documents/Progix/take-my-pic/handoff/nextjs-admin`.

## Reading order

1. `WEB-ARCHITECTURE.md` - current Next.js web/admin structure and migration rules.
2. `WEB-FEATURE-COVERAGE.md` - public site and admin route coverage against the
   product/backend modules.
3. `WEB-SUPABASE-HANDOFF.md` - backend readiness, first admin slices, and Supabase
   integration cautions.
4. `specs/000-condensed-execution/condensed-feature-specs.md` - web/admin
   execution specs in the same shape as the mobile repo.
5. `features/features_overview.md` - web/admin feature-flow index by phase.

## Source anchors

- Mobile architecture: `/Users/macbookpro/Documents/Progix/take-my-pic/docs/ARCHITECTURE.md`
- Product PRD: `/Users/macbookpro/Documents/Progix/take-my-pic/docs/product/prd.md`
- Schema reference: `/Users/macbookpro/Documents/Progix/take-my-pic/docs/SCHEMA.md`
- Supabase status: `/Users/macbookpro/Documents/Progix/take-my-pic/docs/SUPABASE-INTEGRATION-STATUS.md`
- Feature overview: `/Users/macbookpro/Documents/Progix/take-my-pic/docs/features/features_overview.md`
- Admin handoff: `/Users/macbookpro/Documents/Progix/take-my-pic/handoff/nextjs-admin`

## Current verdict

The web app is a complete clickable marketing site and admin console on a mock
data layer. The backend schema is ready enough to begin admin integration, but
the web UI should move to Supabase incrementally behind `lib/data.ts` and narrow
server-side service/RPC boundaries rather than scattering database calls through
route components.
