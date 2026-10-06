#!/bin/bash
# setup-db.sh — One-shot PostgreSQL setup for the DMR project.
# Run once from the project root: chmod +x setup-db.sh && ./setup-db.sh
set -e

DB_USER="dmr_user"
DB_NAME="dmr_dev"
DB_PASS="$(openssl rand -base64 24)"

echo "🐘 Creating PostgreSQL user and database..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "🔑 Generating secrets..."
JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
ENC_KEY="$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")"

cat > backend/.env <<EOF
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
JWT_SECRET="${JWT_SECRET}"
ENCRYPTION_KEY="${ENC_KEY}"
PORT=5000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
LOG_LEVEL="info"
EOF

echo ""
echo "✅ backend/.env written with fresh secrets."
echo "   DATABASE_URL: postgresql://${DB_USER}:****@localhost:5432/${DB_NAME}"
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install

echo ""
echo "🗄️  Running Prisma migration..."
npx prisma migrate dev --name initial_postgresql_schema

echo ""
echo "🌱 Seeding database..."
npm run seed

echo ""
echo "✅ Done! Start the server with: npm run dev (from the backend directory)"
echo ""
echo "⚠️  IMPORTANT: Back up backend/.env — the ENCRYPTION_KEY cannot be recovered if lost."
