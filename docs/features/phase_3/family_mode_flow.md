## Feature Information

- Feature Name: Family Mode Admin Support
- Description / Goal: Support family account and guardian workflows safely.
- Screens Involved: `/features/family`, `/admin/family/*`
- Backend/API Interactions: `families`, `family_members`, `profiles`

# Family Mode Admin Support

## Purpose

Staff can resolve family-mode account issues without overexposing sensitive
location or guardian data.

## Main Flow

1. Staff opens family route.
2. System reads family/member metadata.
3. Sensitive support actions are audited.

## Success State

Family support is staff-only and privacy-aware.
