# Phase 1 Database Backup

Recorded: 2026-07-08T14:16:10.9227849+01:00

## Backup Script Changes

`prisma/scripts/backup-db.mjs` was updated to make the existing backup script usable for Phase 1:

- Loads `.env.local` before falling back to default dotenv loading.
- Uses `POSTGRES_URL_NON_POOLING` for the backup datasource when available.
- Includes `pwaInstallationEvents` via `prisma.pWAInstallationEvent.findMany()`.
- Creates `prisma/backups/` if the directory is missing.

## Backup Result

Command:

```text
node prisma/scripts/backup-db.mjs
```

Result: pass. A fresh pre-migration backup was created after local environment values were synced from Vercel.

Backup artifact:

| File | Size | Last write time |
| --- | ---: | --- |
| `prisma/backups/backup-2026-07-08T14-06-28-015Z.json` | 38866477 bytes | 2026-07-08 15:06:28 |

Backup counts:

| Collection | Count |
| --- | ---: |
| users | 9 |
| schools | 5 |
| schoolUsers | 25 |
| moods | 68275 |
| userSettings | 0 |
| schoolSettings | 4 |
| pwaInstallationEvents | 70 |

Earlier attempts failed for two local reasons: database environment values were stale or mismatched, and the work Wi-Fi firewall blocked access to the Neon/Postgres hosts. The deployed Vercel app could fetch data successfully, and local access worked after syncing DB variables from Vercel and switching to a mobile phone hotspot.

## Existing Backup

An older backup exists:

| File | Size | Last write time |
| --- | ---: | --- |
| `prisma/backups/backup-2024-11-05T19-14-57-466Z.json` | 178545 bytes | 2026-07-08 12:57:43 |

This older file does not satisfy the Phase 1 requirement for a fresh pre-migration backup.

## Required Follow-Up

- Treat `prisma/backups/backup-2026-07-08T14-06-28-015Z.json` as sensitive production data.
- Keep the backup available until migration validation is complete.

## Current Diagnosis

The deployed Vercel app could fetch database data successfully while the earlier local app could not. That pointed to local configuration/network rather than a Neon outage.

Important local config detail: `prisma/schema.prisma` reads `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`, not `DATABASE_URL`. Refreshing local `.env.local` values from Vercel resolved the backup blocker.

Network note for future local work: the work Wi-Fi firewall can block access to Neon/Postgres even when the app and credentials are correct. If local DB reads or backups fail while Vercel works, retry on the mobile phone hotspot before debugging application code.
