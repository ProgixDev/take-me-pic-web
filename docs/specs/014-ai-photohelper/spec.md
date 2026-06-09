# Spec: AI PhotoHelper Content Operations

**Flow Doc**: `docs/features/phase_3/ai_photohelper_flow.md`
**Priority**: P2

## User Story

As content staff, I need to manage guide/manual/framing content that supports AI
PhotoHelper and educational pages.

## Independent Test

Open `/admin/content/guides` and `/admin/content/manual` as staff.

## Acceptance Criteria

1. Guide/manual routes identify live content sources.
2. Staff-only content edits are protected.
3. AI suggestions are not exposed as private user data.
4. Public feature page remains static until live content is needed.

## Minimal Data Contract

- `ai_suggestions`
- `framing_tips`
- future CMS tables

## Execution Tasks

- [ ] Wire framing guide reads where schema supports it.
- [ ] Identify CMS gaps.
- [ ] Add protected content mutation path.
- [ ] Test staff-only access.
