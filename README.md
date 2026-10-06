# Digital Metabolic Reversal (DMR) System

Full-stack application for Type 2 Diabetes reversal, featuring a React frontend, Express API, and PostgreSQL database with Prisma ORM.

---

## Quick Start with Docker (Recommended)

No need to install Node.js or PostgreSQL locally. Docker handles the entire stack.

### 1. Clone the repository
```bash
git clone <YOUR-GITHUB-REPO-URL>
cd digitaltype2diabitiesreversalsystem
```

### 2. Configure environment variables
```bash
cp .env.docker.example .env.docker
```
*(Optionally modify `.env.docker` if you wish to set custom passwords or secrets).*

### 3. Start the application
```bash
docker compose up -d --build
```

### 4. Access the app
- **Frontend App**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost/api](http://localhost/api)

---

## Useful Docker Commands

```bash
# View live backend logs
docker compose logs -f dmr-backend

# View all running containers
docker compose ps

# Stop the application
docker compose down

# Stop and wipe database data
docker compose down -v
```
