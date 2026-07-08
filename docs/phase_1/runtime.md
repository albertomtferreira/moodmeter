# Phase 1 Runtime Baseline

Recorded: 2026-07-08T14:16:10.9227849+01:00

## Local Runtime

- Command: `node -v`
- Result: `v24.14.0`
- Command: `npm.cmd -v`
- Result: `11.4.1`

## Repo Runtime Configuration

- `package.json` now sets `engines.node` to `24.x`.
- No `.nvmrc`, `.node-version`, `vercel.json`, or equivalent deployment runtime config was found in the repo.
- Vercel should use Node `24.x` to match the repo baseline.

## Target Next.js Compatibility

- Current project version: Next.js `14.2.15`.
- Modernisation target: latest stable at implementation time.
- Next.js documentation checked during planning listed latest `16.2.10` and minimum Node.js `20.9`.
- Compatibility conclusion: Node `24.x` is now the repo baseline for deployment and local modernisation work.

Source: https://nextjs.org/docs/app/getting-started/installation

## Follow-Up

- Switch local shells to Node `24.x` before future install/build checks.
- Confirm Vercel Project Settings use Node `24.x` or inherit the repo `engines.node` setting.

## Local Network Note

- Work Wi-Fi can block access to Neon/Postgres hosts used by this app. Use the mobile phone hotspot for local DB-backed development if localhost auth works but API data fetches or backups cannot reach Neon.
