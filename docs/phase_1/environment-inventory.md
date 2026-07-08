# Phase 1 Environment Inventory

Recorded: 2026-07-08T14:16:10.9227849+01:00

Only variable names are documented here. Secret values from `.env.local` were not copied.

## Current Variables

| Variable | Current owner/purpose | Firebase-era disposition |
| --- | --- | --- |
| `CLERK_SECRET_KEY` | Clerk server authentication | Replace with Firebase Admin credentials. |
| `DATABASE_URL` | Prisma/Postgres compatibility URL | Remove after Firestore cutover and migration verification. |
| `DATABASE_URL_UNPOOLED` | Neon direct/unpooled database URL | Remove after Firestore cutover and migration verification. |
| `MONGODB_URI` | No current usage found in repo scan | Confirm unused, then remove in cleanup. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Clerk client redirect | Replace with app/Firebase Auth redirect handling. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL` | Clerk client redirect | Replace with app/Firebase Auth redirect handling. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Clerk client redirect | Replace with app/Firebase Auth redirect handling. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser key | Replace with Firebase client config. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk sign-in route | Replace with Firebase Auth sign-in route/config. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk sign-up route | Replace with Firebase Auth sign-up route/config. |
| `NPM_FLAGS` | npm/install behavior | Recheck during package upgrade; no Firebase replacement expected. |
| `POSTGRES_DATABASE` | Neon/Postgres database metadata | Remove after Firestore cutover and migration verification. |
| `POSTGRES_HOST` | Neon/Postgres host metadata | Remove after Firestore cutover and migration verification. |
| `POSTGRES_PASSWORD` | Neon/Postgres secret | Remove after Firestore cutover and migration verification. |
| `POSTGRES_PRISMA_URL` | Prisma pooled datasource URL | Remove after Firestore cutover and migration verification. |
| `POSTGRES_URL` | Neon/Postgres URL | Remove after Firestore cutover and migration verification. |
| `POSTGRES_URL_NO_SSL` | Neon/Postgres URL variant | Remove after Firestore cutover and migration verification. |
| `POSTGRES_URL_NON_POOLING` | Prisma direct datasource URL | Remove after Firestore cutover and migration verification. |
| `POSTGRES_USER` | Neon/Postgres user metadata | Remove after Firestore cutover and migration verification. |
| `SENTRY_AUTH_TOKEN` | Sentry build/source map upload token | Keep unless Sentry setup changes. |
| `WEBHOOK_SECRET` | Clerk webhook signature secret | Remove when Clerk webhook is disabled or deleted. |

## Draft Firebase Variables

Client-side Firebase config:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` if Analytics is enabled

Server-side Firebase Admin config:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Alternative server credential option:

- `GOOGLE_APPLICATION_CREDENTIALS` for a deployed service account file path, if the host supports secure file-based credentials.

## Notes

- Clerk variables should remain until Firebase Auth has fully replaced Clerk.
- Neon/Postgres variables should remain until Firestore migration is verified and Neon is intentionally retired.
- Do not commit real secret values to documentation.
