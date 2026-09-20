// Local, synthetic-data preview of the real report page, with no Clerk or live DB access.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import { PGlite } from '@electric-sql/pglite';
import type { Prisma, PrismaClient } from '@prisma/client';
import { getReport } from '../../lib/reports/service';
import { ReportError } from '../../lib/reports/access';
import { ReportKind } from '../../lib/reports/types';

async function main() {
  const root = resolve('.');
  const bundle = await build({
    entryPoints: ['tests/reports-ui/entry.tsx'], bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    plugins: [{ name: 'preview-framework', setup(builder) {
      builder.onResolve({ filter: /^(@clerk\/nextjs|next\/navigation|next\/link)$/ }, () => ({ path: resolve(root, 'tests/reports-ui/framework.tsx') }));
    } }],
  });
  const css = await postcss([tailwind()]).process(readFileSync('app/globals.css', 'utf8'), { from: resolve('app/globals.css') });
  const orientation = readFileSync('app/(app)/tablet_orientation.css', 'utf8').replace(/@tailwind[^;]+;/g, '');
  const pg = new PGlite();
  await pg.exec(`CREATE TABLE "Mood" ("schoolId" text, "timestamp" timestamp, "type" text);
    INSERT INTO "Mood"
    SELECT school, day + time '12:00' + (n % 10) * interval '1 hour',
      CASE WHEN n % 5 < 3 THEN 'HAPPY' WHEN n % 5 = 3 THEN 'OKAY' ELSE 'UNHAPPY' END
    FROM generate_series(timestamp '2026-05-01', timestamp '2026-09-20', interval '1 day') day,
      generate_series(1, 35) n, unnest(ARRAY['school-a','school-b']) school
    WHERE extract(dow FROM day) NOT IN (0,6) AND (school = 'school-a' OR n < 8);
    INSERT INTO "Mood" VALUES ('school-a', '2024-01-15 12:00', 'HAPPY');`);
  const schools = [
    { school: { id: 'school-a', name: 'Northfield Community Primary School and Early Years Learning Centre' }, isPreferred: true },
    { school: { id: 'school-b', name: 'Brookside School' }, isPreferred: false },
    { school: { id: 'empty', name: 'New school — no responses yet' }, isPreferred: false },
  ];
  const db = {
    user: { findUnique: async () => ({ id: 'preview-user' }) },
    schoolUser: { findUnique: async ({ where }: { where: { userId_schoolId: { schoolId: string } } }) => schools.find(item => item.school.id === where.userId_schoolId.schoolId) ?? null },
    mood: { aggregate: async ({ where }: { where: { schoolId: string } }) => {
      const result = await pg.query<{ timestamp: Date | null }>('SELECT MIN("timestamp") AS timestamp FROM "Mood" WHERE "schoolId" = $1', [where.schoolId]);
      return { _min: { timestamp: result.rows[0].timestamp } };
    } },
    $queryRaw: async (query: Prisma.Sql) => (await pg.query(query.text, query.values.map(value => value instanceof Date ? value.toISOString() : value))).rows,
  } as unknown as PrismaClient;
  const server = createServer(async (request, response) => {
    const url = new URL(request.url!, 'http://127.0.0.1:3101');
    try {
      if (url.pathname === '/preview.js') { response.setHeader('Content-Type', 'text/javascript'); response.end(bundle.outputFiles[0].text); return; }
      if (url.pathname === '/preview.css') { response.setHeader('Content-Type', 'text/css'); response.end(css.css + orientation); return; }
      if (url.pathname === '/api/users/schools') { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(schools)); return; }
      if (url.pathname.startsWith('/api/reports/')) {
        const kind = url.pathname.split('/').pop() as ReportKind;
        if (!['daily', 'weekly', 'monthly'].includes(kind)) { response.statusCode = 404; response.end(); return; }
        const report = await getReport(db, 'preview-user', kind, url.searchParams, new Date('2026-09-20T12:00:00Z'));
        response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(report)); return;
      }
      response.setHeader('Content-Type', 'text/html');
      response.end('<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Reports test preview</title><link rel="stylesheet" href="/preview.css"></head><body><div id="root"></div><script src="/preview.js"></script></body></html>');
    } catch (error) {
      response.statusCode = error instanceof ReportError ? error.status : 500;
      response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Preview error' }));
    }
  });
  server.listen(3101, '127.0.0.1', () => console.log('Synthetic reports preview: http://127.0.0.1:3101/reports?date=2026-09-18&week=2026-09-14&from=2026-05-01&to=2026-09-20'));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
