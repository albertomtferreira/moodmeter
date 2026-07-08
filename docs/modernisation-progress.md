# MoodMeter Modernisation Progress Tracker

Use this tracker alongside [modernisation-plan.md](modernisation-plan.md). Mark each checkbox as work is completed and record short notes in the progress log.

## Status Key

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[!]` Blocked

## Phase 1: Baseline And Safety

**Goal:** Capture the current app state before large dependency, auth, and database changes.

**Core changes**

- Confirm the current app builds or document the exact blocker.
- Capture current TypeScript, build, and smoke-test results.
- Create a Neon backup/export before migration work.
- Record current environment variables and map their Firebase replacements.
- Confirm Node.js version is compatible with the target Next.js version.

**Checklist**

- [x] Run TypeScript check.
- [x] Run production build or document blocker.
- [x] Back up Neon database.
- [x] Document current `.env.local` variables.
- [x] Draft Firebase environment variable list.
- [x] Confirm deployment/runtime Node.js version.

**Exit criteria**

- Current app state is documented.
- Database backup exists.
- Known blockers are recorded before any destructive or irreversible work.
- Record any additional documentation inside `/docs/phase_1`

## Phase 2: Library Upgrade

**Goal:** Move the project onto current supported package versions before the Firebase migration.

**Core changes**

- Upgrade Next.js, React, React DOM, TypeScript, Sentry, TanStack Query, Recharts, Radix packages, Tailwind, Zod, Zustand, date-fns, react-hook-form, lucide-react, and related type packages.
- Resolve current Dependabot alerts introduced by the baseline lockfile, including `@clerk/nextjs` and its transitive `path-to-regexp` dependency.
- Add `firebase` and `firebase-admin`.
- Keep Prisma and Clerk temporarily until replacement work is complete.
- Resolve framework, React, TypeScript, and lint/build compatibility issues.

**Checklist**

- [ ] Recheck latest stable package versions.
- [ ] Update `package.json`.
- [ ] Regenerate `package-lock.json`.
- [ ] Resolve Next.js and React breaking changes.
- [ ] Resolve TypeScript errors.
- [ ] Run production build.

**Exit criteria**

- App compiles on upgraded packages.
- No Firebase, Clerk, or Prisma behaviour has been intentionally changed yet.
- Record any additional documentation inside `/docs/phase_2`

## Phase 3: Firebase Foundation

**Goal:** Add Firebase client/admin infrastructure without switching the app over all at once.

**Core changes**

- Add Firebase client setup for browser auth.
- Add Firebase Admin setup for server-side auth and Firestore access.
- Add shared helpers for verifying ID tokens, loading the current app user, checking roles, and checking school access.
- Add typed Firestore model definitions for users, schools, memberships, moods, reports, settings, and analytics.

**Checklist**

- [ ] Add Firebase client config.
- [ ] Add Firebase Admin config.
- [ ] Add auth token verification helper.
- [ ] Add current-user/profile helper.
- [ ] Add role and school-access helpers.
- [ ] Add Firestore data model types.
- [ ] Add required Firebase env var documentation.

**Exit criteria**

- Firebase can be initialised locally and server-side.
- Shared helpers are ready for route migration.
- Existing Clerk/Prisma paths still work until replaced.
- Record any additional documentation inside `/docs/phase_3`

## Phase 4: Firebase Auth Migration

**Goal:** Replace Clerk with Firebase Auth for user sessions and identity.

**Core changes**

- Replace Clerk providers and auth state components with Firebase Auth equivalents.
- Replace sign-in/sign-up pages with Firebase Auth flows.
- Replace Clerk middleware and server auth calls with Firebase token verification.
- Remove Clerk webhook dependency.
- Bootstrap or load Firestore user profiles after Firebase sign-in.
- Remove plain-text PIN auth, or keep only hashed PINs for non-login secure actions.

**Checklist**

- [ ] Replace root auth provider.
- [ ] Replace sign-in page.
- [ ] Replace sign-up page.
- [ ] Replace signed-in/signed-out UI checks.
- [ ] Replace server-side `auth()` usage.
- [ ] Replace middleware auth handling.
- [ ] Add user profile bootstrap after sign-in.
- [ ] Remove Clerk webhook route or disable it.
- [ ] Remove plain-text PIN login flow.

**Exit criteria**

- Users can sign in and sign out with Firebase Auth.
- App profile and role are loaded from Firestore.
- Clerk is no longer required for runtime auth.
- Record any additional documentation inside `/docs/phase_4`

## Phase 5: Firestore Data Services

**Goal:** Create Firestore-backed service modules before porting API routes.

**Core changes**

- Add user, school, membership, mood, report, settings, and analytics service modules.
- Implement Firestore query patterns needed by current API routes.
- Add report aggregation services for daily, weekly, monthly, and comparison data.
- Add Firestore index notes for required queries.

**Checklist**

- [ ] Add users service.
- [ ] Add schools service.
- [ ] Add memberships service.
- [ ] Add moods service.
- [ ] Add reports service.
- [ ] Add settings service.
- [ ] Add PWA analytics service.
- [ ] Document required Firestore indexes.

**Exit criteria**

- Firestore services can support all current app behaviours.
- API route migration can proceed route by route.
- Record any additional documentation inside `/docs/phase_5`

## Phase 6: Neon-To-Firestore Data Migration

**Goal:** Migrate all existing Neon data into Firestore safely and verifiably.

**Core changes**

- Build a one-time migration script that reads Neon through Prisma and writes Firestore.
- Migrate users by email into Firebase Auth and Firestore profiles.
- Migrate schools, memberships, moods, settings, and PWA analytics.
- Validate source and destination counts.
- Compare sampled report aggregates before cutover.

**Checklist**

- [ ] Build migration script.
- [ ] Add dry-run mode.
- [ ] Add staging Firebase target.
- [ ] Migrate users.
- [ ] Migrate schools.
- [ ] Migrate memberships.
- [ ] Migrate moods.
- [ ] Migrate settings.
- [ ] Migrate PWA analytics.
- [ ] Validate collection counts.
- [ ] Compare sampled report aggregates.
- [ ] Run production migration.

**Exit criteria**

- Firestore contains verified migrated data.
- Neon remains available read-only until final cutover is accepted.
- Record any additional documentation inside `/docs/phase_6`

## Phase 7: API Route Migration And Hardening

**Goal:** Port runtime APIs from Prisma/Postgres to Firestore and enforce server-side access controls.

**Core changes**

- Port mood, user, school, report, settings, admin, and analytics APIs to Firestore services.
- Verify Firebase ID tokens on protected routes.
- Enforce school membership checks on every school-specific API.
- Allow cross-school access only for `SUPER_ADMIN`.
- Add Firestore-backed rate limiting to `/api/mood`.
- Replace unsafe production logging.

**Checklist**

- [ ] Port `/api/mood`.
- [ ] Port user profile and user schools APIs.
- [ ] Port school APIs.
- [ ] Port daily, weekly, monthly, and comparison reports.
- [ ] Port admin data APIs.
- [ ] Port PWA analytics APIs.
- [ ] Add server-side school membership checks.
- [ ] Add server-side mood cooldown/rate limiting.
- [ ] Remove unsafe logs.
- [ ] Remove request-level Prisma disconnect usage.

**Exit criteria**

- Runtime APIs no longer depend on Prisma.
- Protected routes reject unauthenticated users.
- Users cannot access unassigned school data.
- Record any additional documentation inside `/docs/phase_7`

## Phase 8: Reports Dashboard Revamp

**Goal:** Redesign reports as a clearer operational dashboard.

**Core changes**

- Replace separate report fetches with one consolidated reports API response.
- Add KPI tiles for total submissions, satisfaction rate, mood split, week-over-week trend, and active school/date context.
- Keep filters for school, day, week, month/range, and manual refresh.
- Add loading, empty, error, unauthorized, and no-school states.
- Re-enable scoped school comparison.
- Ensure chart layouts work on mobile and desktop.

**Checklist**

- [ ] Define consolidated report response contract.
- [ ] Build consolidated reports API/service.
- [ ] Add KPI summary cards.
- [ ] Refactor daily analysis section.
- [ ] Refactor weekly analysis section.
- [ ] Refactor monthly analysis section.
- [ ] Re-enable school comparison.
- [ ] Add empty/error/unauthorized/no-school states.
- [ ] Verify responsive chart layout.

**Exit criteria**

- Reports page is usable as an operational dashboard.
- Reports data is correctly scoped by user role and school membership.
- Record any additional documentation inside `/docs/phase_8`

## Phase 9: Cleanup And Documentation

**Goal:** Remove obsolete systems and leave the project documented for future work.

**Core changes**

- Remove Clerk packages and code after Firebase Auth is verified.
- Remove Prisma/Postgres packages, scripts, schema, and migration-only code after Firestore cutover is verified.
- Update README with Firebase setup, environment variables, local dev, migration, deployment, and admin workflows.
- Replace stale app structure docs.

**Checklist**

- [ ] Remove Clerk dependencies.
- [ ] Remove Clerk routes/components/hooks.
- [ ] Remove Prisma dependencies.
- [ ] Remove Prisma runtime code.
- [ ] Remove obsolete Neon env vars from docs.
- [ ] Update README.
- [ ] Update or replace stale architecture docs.
- [ ] Run final TypeScript check.
- [ ] Run final production build.

**Exit criteria**

- The app runs on Firebase Auth and Firestore only.
- Documentation matches the modernised architecture.
- Final checks pass.
- Record any additional documentation inside `/docs/phase_9`

## Cross-Phase Acceptance Checks

- [ ] Signed-out users cannot access protected APIs.
- [ ] Signed-in users can access only assigned schools.
- [ ] `SUPER_ADMIN` can access intended cross-school features.
- [ ] Mood submissions are rate limited server-side.
- [ ] Reports match migrated source aggregates for sampled data.
- [ ] No auth payloads, secrets, PINs, or private data are logged.
- [ ] Mobile and desktop reports layouts are usable.

## Progress Log

| Date | Phase | Status | Notes |
| --- | --- | --- | --- |
| 2026-07-08 | Phase 1 | Complete | Local Vercel environment sync and switching off work Wi-Fi resolved DB access. TypeScript and production build pass. Fresh Neon backup created at `prisma/backups/backup-2026-07-08T14-06-28-015Z.json` with users 9, schools 5, schoolUsers 25, moods 68275, userSettings 0, schoolSettings 4, pwaInstallationEvents 70. Runtime baseline locked with `package.json` `engines.node` set to `20.x`. |
| 2026-07-08 | Phase 1 | Blocked | TypeScript passed. Production build blocker documented: Prisma generate `EPERM` renaming query engine DLL. Fresh Neon backup blocked by database connectivity; no new backup artifact created. Local Node/npm documented, deployment runtime config not present in repo. See `docs/phase_1/`. |
| 2026-07-08 | Planning | Complete | Initial modernisation tracker created. |
