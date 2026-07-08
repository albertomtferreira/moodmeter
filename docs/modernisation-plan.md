# MoodMeter Modernisation Plan

## Summary

Upgrade MoodMeter to current major libraries, migrate the app from Clerk and Prisma/Postgres/Neon to Firebase Auth and Firestore, harden authorization and logging, revamp reports into an operational dashboard, and migrate all existing production data.

The migration should be staged so the app remains verifiable after each major change. Firebase Auth replaces Clerk, all Neon data is migrated, and reports prioritise school-level operational insight.

## Key Changes

### Library Upgrades

- Upgrade Next.js, React, React DOM, TypeScript, Sentry, TanStack Query, Recharts, Radix packages, Tailwind, Zod, Zustand, date-fns, react-hook-form, lucide-react, and related type packages to the latest compatible stable versions at implementation time.
- Resolve current Dependabot alerts from the baseline lockfile, including the vulnerable legacy Clerk package and transitive `path-to-regexp`.
- Add `firebase` and `firebase-admin`.
- Remove `@clerk/*`, `@prisma/client`, `prisma`, `@vercel/postgres`, and Prisma-specific scripts after Firestore is live and verified.
- Update scripts to remove `prisma generate`, `db:push`, and `prisma:studio`, then add Firestore migration, seed, and verification scripts.
- Recheck exact latest versions during implementation and lock them in `package-lock.json`.

### Firebase Auth Migration

- Replace Clerk with Firebase Auth for sign-in, sign-up, sign-out, session state, and server-side token verification.
- Remove `ClerkProvider`, `SignedIn`, `SignedOut`, Clerk middleware, Clerk webhooks, and Clerk API usage.
- Add a Firebase client provider for browser auth state.
- Add a Firebase Admin server helper to verify ID tokens and load the app user profile.
- Store app profile, role, school membership, preferred school, and settings in Firestore.
- Migrate existing users by email and trigger Firebase password reset or sign-in setup.
- Do not preserve Clerk passwords or sessions.
- Remove plain-text PIN auth. If PINs are still required for secure in-app actions, store only hashed PIN values.

### Firestore Database Migration

- Replace Prisma/Postgres runtime access with Firestore service modules.
- Keep Prisma only in temporary migration scripts until migration is verified.
- Use these Firestore collections:
  - `users/{uid}` for email, username, name, role, timestamps, and settings.
  - `schools/{schoolId}` for name, code, color, active state, timestamps, and settings.
  - `schoolMemberships/{userId_schoolId}` for user-school role, membership, and preferred school state.
  - `schools/{schoolId}/moods/{moodId}` for type, period, location, timestamp, and created date.
  - `pwaInstallationEvents/{eventId}` for installation analytics.
- Add Firestore indexes for report queries by school, timestamp, mood type, period, and location where needed.
- Preserve existing school and mood IDs where practical to reduce frontend churn.

### Security Hardening

- Verify Firebase ID tokens server-side on every protected API route.
- Check school membership on every school-specific API, including mood submission and report endpoints.
- Allow cross-school access only for `SUPER_ADMIN`.
- Add Firestore-backed server-side cooldown/rate limiting to `/api/mood`.
- Replace noisy production logs with safe structured logs.
- Never log auth payloads, secrets, PINs, full webhook bodies, or private profile data.
- Remove request-level `prisma.$disconnect()` during the transition.

### Reports Page Revamp

- Revamp reports into an operational dashboard.
- Add KPI tiles for total submissions, satisfaction rate, happy/okay/unhappy split, week-over-week trend, and current school/date context.
- Replace three separate report fetches with one consolidated reports API/service response.
- Keep filters for school, day, week, month/range, and manual refresh.
- Add clear loading, empty, error, unauthorized, and no-school states.
- Re-enable school comparison for authorized users, scoped to their schools unless they are `SUPER_ADMIN`.
- Keep Recharts unless library upgrades expose compatibility issues.
- Ensure charts and controls are responsive on mobile and desktop.

### Data Migration Strategy

- Create a Neon backup/export before migration.
- Build a one-time migration script that reads Neon via Prisma and writes Firestore.
- Run the migration first against a Firebase staging project.
- Validate counts for users, schools, memberships, moods, settings, and PWA events.
- Compare report aggregates between Neon and Firestore for sampled schools and date ranges.
- Keep Neon read-only during validation.
- Retire Neon only after production Firestore data is verified.

## Implementation Sequence

1. Establish a clean baseline with TypeScript, build, and smoke checks.
2. Upgrade packages and resolve framework/runtime breaking changes.
3. Add Firebase client/admin setup and shared auth helpers.
4. Replace Clerk UI/session usage with Firebase Auth.
5. Add Firestore service modules for users, schools, moods, reports, settings, and analytics.
6. Build and validate the one-time Neon-to-Firestore migration script.
7. Port API routes from Prisma to Firestore services.
8. Add server-side school access checks and mood rate limiting.
9. Revamp the reports page around the consolidated dashboard contract.
10. Remove obsolete Clerk, Prisma, Neon, and stale documentation once the migration is verified.

## Test Plan

- Run TypeScript checks and production build after each major phase.
- Verify Firebase sign-in, sign-out, profile bootstrap, and role loading.
- Confirm `VIEWER`, `ADMIN`, and `SUPER_ADMIN` permissions behave correctly.
- Confirm signed-out users cannot access protected app APIs.
- Confirm users cannot submit moods or read reports for unassigned schools.
- Confirm `SUPER_ADMIN` can access cross-school admin/reporting features.
- Confirm server-side mood cooldown works when bypassing the UI.
- Validate migrated Firestore counts against Neon source counts.
- Compare sampled report aggregates before and after migration.
- Test reports with normal data, no data, unauthorized access, and no-school states.
- Test reports layout on mobile and desktop.

## Assumptions

- Firebase Auth fully replaces Clerk.
- Existing users are migrated by email and invited or reset into Firebase Auth.
- Clerk password/session continuity is not required.
- All historic Neon data should be migrated into Firestore.
- Neon remains read-only during validation and is retired after successful cutover.
- Reports should favour operational clarity over presentation-heavy storytelling.
- Exact package versions will be checked at implementation time and locked in `package-lock.json`.
