# Phase 2 Library Upgrade Plan

## Summary

Upgrade MoodMeter from the Phase 1 baseline to current stable supported packages while preserving existing Clerk, Prisma, Neon, and app behavior. Phase 2 should end with TypeScript and production build passing, Firebase packages installed but unused, and follow-up notes recorded in `docs/phase_2`.

Current latest anchors checked on 2026-07-08: `next@16.2.10`, `react@19.2.7`, `react-dom@19.2.7`, `@clerk/nextjs@7.5.14`, `@sentry/nextjs@10.64.0`, `@tanstack/react-query@5.101.2`, `recharts@3.9.2`, `firebase@12.15.0`, `firebase-admin@14.1.0`, `zod@4.4.3`, `tailwindcss@4.3.2`.

## Key Changes

- Update `package.json` and regenerate `package-lock.json` on Node 20.9+ using `npm.cmd`, keeping `@prisma/client`, `prisma`, `@vercel/postgres`, and Clerk in place for later phases.
- Upgrade framework/runtime packages together: Next.js 16, React 19, React DOM 19, TypeScript, React type packages, Node type packages, Sentry, TanStack Query, Recharts, Radix UI packages, date-fns, react-hook-form, lucide-react, Zustand, Zod, and related utilities.
- Add `firebase` and `firebase-admin` only as dependencies; do not add Firebase runtime initialization, auth changes, route changes, or Firestore services in Phase 2.
- Resolve compatibility fallout from Next 16 and React 19:
  - Replace removed or changed Next tooling such as `next lint` with an explicit ESLint setup if needed.
  - Update async dynamic route APIs where build/type generation requires `params`, `headers()`, or related request APIs to be awaited.
  - Keep current App Router behavior and public/protected route behavior unchanged.
- Resolve package-specific breaking changes only where required to compile:
  - Clerk middleware/provider/auth usage should be updated to the latest Clerk API but must keep the same auth gates and role-header behavior.
  - Sentry config should be adjusted to the latest `@sentry/nextjs` option names if build warnings/errors require it.
  - Recharts 3, Zod 4, date-fns 4, React Hook Form, Radix, and React Day Picker changes should be patched at call sites only when TypeScript or build errors expose incompatibilities.
- Treat Tailwind carefully:
  - First attempt the smallest compatible upgrade path.
  - If Tailwind 4 requires config/PostCSS rewiring, migrate `postcss.config.mjs`, `tailwind.config.ts`, and global CSS enough to preserve existing styling.
  - Avoid visual redesign or component restyling in this phase.

## Test Plan

- Before editing, confirm local runtime with `node -v` and use Node 20.9+; avoid Node 24 for install/build verification.
- Run dependency install/regeneration with `npm.cmd install`.
- Run `npx.cmd tsc --noEmit`.
- Run the lint command if retained or replaced.
- Run `npm.cmd run build`.
- If build passes, optionally run a local smoke check for:
  - Landing page loads.
  - Sign-in/sign-up pages render through Clerk.
  - Authenticated app shell still reaches dashboard/reports.
  - Existing API routes still compile without intentional Firebase/Firestore behavior.
- Record results, blockers, warnings, and final package-version notes in `docs/phase_2`.

## Assumptions

- Phase 2 is allowed to make code compatibility fixes but not migrate authentication, data access, reports behavior, or schemas.
- Latest stable package versions are preferred over conservative minor-only upgrades.
- Clerk is upgraded only to clear Dependabot/security issues and preserve temporary runtime behavior until Phase 4.
- Prisma remains in the build script and postinstall script until Firestore migration phases remove it.
- Existing build warnings are acceptable only if the production build exits successfully and no new security-sensitive logging is introduced.
