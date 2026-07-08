# Phase 1 Baseline And Safety Plan

## Summary

Implement Phase 1 by creating a documented baseline in `docs/phase_1/`, running non-destructive checks, producing a verified Neon/Prisma JSON backup, and updating `docs/modernisation-progress.md` with exact outcomes. Use `npm.cmd` on this Windows environment because PowerShell blocks `npm.ps1`.

Current local runtime: Node `v24.14.0`, npm `11.4.1`. Next.js docs currently list latest `16.2.10` and minimum Node `20.9`, so the local Node version exceeds the minimum but should be recorded as “current/non-LTS” if deployment uses an LTS runtime. Source: https://nextjs.org/docs/app/getting-started/installation

## Key Changes

- Add Phase 1 documentation under `docs/phase_1/`:
  - `baseline-checks.md`: TypeScript/build/smoke-test commands, timestamps, pass/fail status, blockers, and notable warnings.
  - `environment-inventory.md`: sanitized `.env.local` variable names, purpose, current system owner, and Firebase replacement mapping.
  - `runtime.md`: local Node/npm versions, deployment runtime source, target Next.js requirement, and compatibility conclusion.
  - `database-backup.md`: backup command, output filename, row counts, restore notes, and any backup caveats.

- Fix the existing backup script before relying on it:
  - `prisma/scripts/backup-db.mjs` currently comments out `pwaInstallationEvents` but still reads `data.pwaInstallationEvents.length`, which will crash after writing or during summary.
  - Include `pWAInstallationEvent.findMany()` in the backup data and summary, matching the Prisma model name.
  - Ensure `prisma/backups/` exists before writing if it is ever missing.

- Run and record Phase 1 commands:
  - TypeScript: `npx.cmd tsc --noEmit`
  - Production build: `npm.cmd run build`
  - Environment key inventory: document variable names only, never values.
  - Database backup: `node prisma/scripts/backup-db.mjs`
  - Optional DB connectivity smoke check only if needed: prefer a safe read/count command or existing non-mutating test; do not run reset/push/restore commands.

- Draft Firebase env replacement list:
  - Replace Clerk client/server vars with Firebase client config and Admin credentials.
  - Replace Neon/Postgres runtime vars with Firestore/Firebase Admin vars after migration.
  - Keep Sentry vars as-is unless Phase 2+ changes require updates.
  - Mark unrelated/stale vars such as `MONGODB_URI` for later removal only after confirming they are unused.

- Update progress tracker:
  - Mark completed Phase 1 checklist items in `docs/modernisation-progress.md`.
  - Add a dated progress log row with exact check results and backup artifact path.
  - Leave any failed item unchecked or `[!]` with the blocker documented in `docs/phase_1/baseline-checks.md`.

## Test Plan

- Confirm `npx.cmd tsc --noEmit` result is captured exactly.
- Confirm `npm.cmd run build` either passes or has its first actionable blocker documented.
- Confirm backup JSON exists under `prisma/backups/` and contains users, schools, schoolUsers, moods, userSettings, schoolSettings, and pwaInstallationEvents.
- Confirm documentation does not include secret values from `.env.local`.
- Confirm Phase 1 exit criteria are satisfied before Phase 2 begins.

## Assumptions

- Phase 1 may make small safety/documentation edits, but it must not change app runtime behavior.
- Backup output may remain in `prisma/backups/`; if it contains production data, treat it as sensitive and avoid committing it unless explicitly intended.
- Deployment runtime should be checked from the actual hosting config/dashboard if not present in the repo.
- Use `npm.cmd`/`npx.cmd` on this machine for reliable Windows execution.
