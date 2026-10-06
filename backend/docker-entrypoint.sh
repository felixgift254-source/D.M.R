#!/bin/sh
set -e

echo "==> Running Prisma schema push..."
npx prisma db push --skip-generate --accept-data-loss

echo "==> Seeding database (if seed script exists)..."
node prisma/seed.js 2>/dev/null || echo "    (no seed or already seeded)"

echo "==> Starting server..."
exec node src/server.js
