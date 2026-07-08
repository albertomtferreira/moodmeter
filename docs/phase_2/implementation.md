# Phase 2 Library Upgrade Implementation

Recorded: 2026-07-08

## Summary

Phase 2 upgraded the app to the current major library stack while keeping Clerk, Prisma, Neon, and existing runtime behaviour in place for later migration phases.

Firebase packages were added but no Firebase client, admin initialisation, auth flow, Firestore model, or data access behaviour was introduced in this phase.

## Final Package Notes

- Upgraded core runtime to `next@16.2.10`, `react@19.2.7`, and `react-dom@19.2.7`.
- Upgraded TypeScript/tooling to `typescript@6.0.3`, React 19 type packages, ESLint 9, and `eslint-config-next@16.2.10`.
- Upgraded Clerk to `@clerk/nextjs@7.5.14`; server `auth()` imports now come from `@clerk/nextjs/server`.
- Added local `SignedIn` and `SignedOut` compatibility wrappers in `components/ClerkAuthState.tsx` because Clerk 7 no longer exports those components from `@clerk/nextjs`.
- Added `firebase@12.15.0` and `firebase-admin@14.1.0`.
- The repo runtime was moved to Node `24.x`, which satisfies Firebase Admin 14's Node `>=22` engine requirement and Vercel's current deployment requirement.
- Upgraded Tailwind to v4 with `@tailwindcss/postcss`; `app/globals.css` now uses the Tailwind v4 import form and references the existing Tailwind config.

## Compatibility Changes

- Replaced `next lint` with `eslint .` and added `eslint.config.mjs`.
- Kept broad React Compiler lint rules disabled because enabling them would require a wider behavioural refactor outside Phase 2.
- Updated Next 16 route handler dynamic `params` types to `Promise<...>` and awaited `headers()`.
- Updated Zod error handling from `error.errors` to `error.issues`.
- Updated React Day Picker custom chevron component wiring for v9.
- Adjusted Recharts legend payload typing for v3.
- Updated Clerk middleware from `authMiddleware` to `clerkMiddleware`, preserving the existing role header and admin redirect behaviour.

## Verification

- Command: `node -v`
- Result: `v24.14.0`
- Command: `npm.cmd install`
- Result: Pass; lockfile regenerated and Prisma postinstall generated the client.
- Command: `npx.cmd tsc --noEmit`
- Result: Pass.
- Command: `npm.cmd run lint`
- Result: Pass with 8 warnings, all pre-existing style/hook warnings retained for later cleanup.
- Command: `npm.cmd run build`
- Result: Pass. Next built 22 app routes and generated Prisma Client successfully.

## Remaining Warnings And Advisories

- Build warnings remain for Sentry deprecated options: `disableLogger`, `automaticVercelMonitors`, and `reactComponentAnnotation`.
- Next 16 warns that the `middleware` file convention is deprecated in favour of `proxy`; this should be handled with the auth migration or a small follow-up compatibility phase.
- `npm audit fix` was run without `--force`. Remaining advisories require upstream fixes or breaking/undesirable changes:
  - `next@16.2.10` still depends on a vulnerable nested `postcss` range according to npm audit; no non-forcing fix is available yet.
  - `next-pwa@5.6.0` retains a `serialize-javascript` advisory through Workbox; the suggested force fix would downgrade `next-pwa` to `2.0.2`.
  - `firebase-admin@13.10.0` retains a `uuid` advisory through Google Cloud dependencies; the suggested force fix would downgrade Firebase Admin.
  - `esbuild` advisory remains through tooling; re-run audit in a later dependency refresh when patched transitive versions are available.

## Behaviour Boundary

No intentional Firebase, Clerk-to-Firebase, Prisma-to-Firestore, database schema, or report behaviour changes were made in Phase 2.
