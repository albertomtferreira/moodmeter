# Phase 1 Baseline Checks

Recorded: 2026-07-08T14:16:10.9227849+01:00

## Environment

- Working directory: `C:\Coding\moodmeter`
- Shell: PowerShell
- npm command form: use `npm.cmd` and `npx.cmd`; `npm` through PowerShell is blocked by local execution policy.

## TypeScript

- Command: `npx.cmd tsc --noEmit`
- Status: Pass
- Output: no TypeScript errors emitted.

## Production Build

- Command: `npm.cmd run build`
- Status: Pass
- Result: passed after local Vercel environment variables were synced and the local database connection issue was resolved.
- Clean install note: after `node_modules` and `package-lock.json` were removed, `npm install` initially failed because the floating `@clerk/nextjs` range resolved to `4.31.8`, which requires `next >=14.2.25`. The baseline fix was to pin `@clerk/nextjs` to `4.27.5` and regenerate `package-lock.json`.
- Current build warnings: Sentry source map notice, Clerk/React Edge Runtime warnings, dynamic server usage logs from API route probing, and one Prisma connection-pool timeout during static generation. The build command still exited successfully.
- Earlier blocker, now resolved:

```text
EPERM: operation not permitted, rename 'C:\Coding\moodmeter\node_modules\.prisma\client\query_engine-windows.dll.node.tmp41800' -> 'C:\Coding\moodmeter\node_modules\.prisma\client\query_engine-windows.dll.node'
```

The same failure occurred when rerun with elevated permissions during the first baseline pass, but a later local `npm run build` completed successfully.

## Smoke Test

- Status: Not run
- Reason: no local production server smoke test was started after the successful build.

## Notes For Phase 2

- Production build now passes on the local baseline after syncing local environment values from Vercel.
- Avoid destructive Prisma commands such as `db:reset`, `db:push --force-reset`, or restore scripts during baseline work.
- Local auth succeeded while local API data fetches failed before syncing Vercel environment values. The deployed Vercel app could fetch database data, confirming the issue was local configuration rather than an application-level data access regression.
