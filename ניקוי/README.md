# 🦁 Lions of Zion - Information Warfare Defense Platform

<div align="center">
  <img src="/public/logo.svg" alt="Lions of Zion Logo" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
  [![Google Cloud](https://img.shields.io/badge/Google_Cloud-Run-4285F4?style=for-the-badge&logo=google-cloud)](https://cloud.google.com/run)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  
  **Military-grade defense against disinformation campaigns**
</div>

---

## 🎯 Project Status

The frontend application is feature-complete. This project adds the supporting backend infrastructure, built on a Python microservices architecture.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Query + Zustand
- **Animation:** Framer Motion
- **Testing:** Playwright + Vitest

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **API Specification:** OpenAPI 3.0 (Contract-First)
- **Database:** PostgreSQL
- **CI/CD:** GitHub Actions + Google Cloud Run & Artifact Registry

## 🏗️ Backend Architecture

The backend consists of four microservices built with Python (FastAPI) and deployed as separate Google Cloud Run services. They share a single PostgreSQL database.

- **`ai-gateway`**: A gateway for interacting with Vertex AI models (e.g., Gemini).
- **`rag-service`**: Handles Retrieval-Augmented Generation tasks.
- **`fact-check-service`**: Manages fact-checking jobs.
- **`auth-api`**: Handles user authentication and authorization.

---

## 📦 Local Development Setup

This project uses a monorepo structure. You will need to run the frontend and backend services separately.

### 1. Backend Setup

#### a) Run PostgreSQL with Docker
Ensure you have Docker installed. Run the following command to start a local PostgreSQL container:
```bash
docker run --name lions-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=lionsdb -p 5432:5432 -d postgres
```

#### b) Load Database Schema
Connect to the database using a tool like `psql` or a GUI client and run the contents of `database/schema.sql` to create the tables.
```bash
# Example using psql
psql -h localhost -p 5432 -U user -d lionsdb -f database/schema.sql
```

#### c) Configure Environment
Copy the example environment file and fill in your local database URL.
```bash
cp env/.env.example .env
# Edit .env and set DATABASE_URL, for example:
# DATABASE_URL="postgresql://user:password@localhost:5432/lionsdb"
```

#### d) Run a Backend Service
Navigate to a service directory and run it with uvicorn. You'll need Python 3.10+ and `pip` installed.
```bash
# Example for auth-api
cd services/auth-api

# Install dependencies for the service
pip install -r requirements.txt

# Run the service (it will load variables from the root .env file if you use a tool like direnv)
# Or run from the root of the repo after installing dependencies.
uvicorn main:app --reload
# API docs will be available at http://127.0.0.1:8000/docs
```

### 2. Frontend Setup

#### a) Install Dependencies
From the root directory, install all Node.js dependencies using `pnpm`.
```bash
pnpm install
```

#### b) Run Development Server
```bash
pnpm run dev
# The frontend will be available at http://localhost:3000
```

## 🚀 Deployment

The backend services are automatically deployed to Google Cloud Run via the `.github/workflows/deploy-cloudrun.yaml` GitHub Actions workflow when changes are pushed to the `main` branch.

### Secret Management (First Time Setup)
The production `DATABASE_URL` is stored securely in Google Secret Manager. To set it up for the first time:
```bash
# 1. Create the secret
gcloud secrets create <PROJECT_ID>-backend-db-credentials --replication-policy="automatic"

# 2. Add the secret value (replace with your actual production DB URL)
echo -n "postgresql://user:pass@host:port/db" | gcloud secrets versions add <PROJECT_ID>-backend-db-credentials --data-file=-

# 3. Grant the Cloud Run service account access to the secret
# (This should be the service account used by your Cloud Run services)
gcloud secrets add-iam-policy-binding <PROJECT_ID>-backend-db-credentials \
    --member="serviceAccount:your-cloud-run-sa@<PROJECT_ID>.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
