# Reports verification

`npm test` runs the isolated test suite. `npm run test:reports` runs the report tests only. Report SQL executes in an in-memory PGlite PostgreSQL engine; Clerk and membership lookups are mocked. No live database or account credentials are needed.

`npm run preview:reports` serves the real report page and components at http://127.0.0.1:3101/reports with synthetic data. Only this test bundle replaces Clerk and Next navigation with adapters. The production application has no authentication bypass or preview route. The preview includes production CSS and the tablet orientation rules, and fixes report generation time to 20 September 2026.

With a Playwright `page`, import `checkReports` from `checks.mjs` and run `await checkReports(page)`. Create `.playwright-mcp` before running if your runner does not create screenshot directories. The checks exercise independent fetching, URL history and reload, keyboard mood controls, tables, CSV, errors and retry, all-data dates, school changes, empty states, and four viewport sizes. Screenshots and downloads go into the ignored `.playwright-mcp` directory.

The API response contract is defined in `lib/reports/types.ts`. Existing daily/weekly/monthly paths now return a report object with bucket arrays, not legacy chart arrays. Monthly `from=all` resolves the earliest authorised school response; normal date arguments remain `YYYY-MM-DD`. The comparison endpoint retains its array shape, now limited to active assigned schools, with null satisfaction for no responses.

Report and assigned-school API responses use NetworkOnly in the PWA service worker to prevent cached data crossing sessions. The production build explicitly selects webpack, as required by the existing next-pwa integration. On Windows, stop a running development server before `npm run build` if Prisma cannot replace its loaded engine DLL.

Weekly comparisons use full prior weeks for completed selections and matching London-local weekday/time for a current week. If that prior clock time does not exist during spring-forward, the API supplies an explanatory reason rather than an invented comparison. Repeated autumn comparison times prefer the current cutoff's UTC offset.
