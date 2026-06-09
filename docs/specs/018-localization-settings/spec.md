# Spec: Localization and Settings Operations

**Flow Doc**: `docs/features/cross_cutting/localization_settings_flow.md`
**Priority**: P1

## User Story

As content/ops staff, I need to manage localization and settings safely while the
public site remains FR-first and accessible.

## Independent Test

Open `/admin/settings/localization` and public localized pages without breaking
static rendering.

## Acceptance Criteria

1. FR-first public copy remains stable.
2. EN/AR/RTL work is tracked before launch.
3. Settings routes are staff-only where they affect operations.
4. Secrets and integration credentials are never exposed in browser code.

## Minimal Data Contract

- `i18n` dictionaries
- settings content source TBD
- integration config source TBD

## Execution Tasks

- [ ] Document live settings data source.
- [ ] Add localization QA checklist.
- [ ] Protect integration/settings mutations server-side.
- [ ] Test build and representative routes.
