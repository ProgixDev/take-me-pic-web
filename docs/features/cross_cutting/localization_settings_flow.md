## Feature Information

- Feature Name: Localization and Settings Operations
- Description / Goal: Manage FR-first content, RTL readiness, and operational settings safely.
- Screens Involved: `/admin/settings/*`, public marketing/legal pages
- Backend/API Interactions: `i18n` dictionaries, future settings/CMS sources

# Localization and Settings Operations

## Purpose

Keep public copy, legal text, and admin settings consistent while avoiding secret
exposure.

## Main Flow

1. Staff opens localization/settings route.
2. System displays current content/settings source.
3. Protected mutations update settings where backend support exists.

## Success State

Settings are staff-only and localization work is trackable across public/admin
surfaces.
