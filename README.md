# Typeform Clone

A complete, functional Typeform-inspired application built for a Fullstack Assignment. It allows users to create forms, configure questions with a drag-and-drop builder, publish forms, and view responses in a beautiful one-question-at-a-time public interface.

**Live Demo:** [https://type-form-builder-ug51.vercel.app](https://type-form-builder-ug51.vercel.app)

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Full Light/Dark Mode Support)
- **Authentication:** NextAuth (Google OAuth 2.0)
- **Animations:** Framer Motion
- **Drag & Drop:** dnd-kit
- **Icons:** Lucide React
- **API Client:** Axios
- **Deployment:** Vercel

### Backend
- **Framework:** FastAPI (Python)
- **Database:** Neon Serverless PostgreSQL (migrated from SQLite)
- **ORM:** SQLAlchemy (psycopg2)
- **Validation:** Pydantic
- **Authentication:** Python-Jose (JWT generation & validation)
- **Deployment:** Render

## 📁 Project Structure

```
root/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── forms/[id]/           # Form Builder & Results
│   │   │   ├── to/[slug]/            # Public Respondent View
│   │   │   ├── dashboard/            # Creator Dashboard (Protected)
│   │   │   ├── login/                # Auth Flow
│   │   │   ├── api/auth/             # NextAuth Endpoints
│   │   ├── components/
│   │   │   ├── builder/              # Builder panes (Sidebar, Preview, Settings)
│   │   │   ├── respondent/           # Public form components
│   │   │   ├── ui/                   # Shared UI (Toasts, ThemeToggle)
│   │   ├── lib/
│   │   │   ├── api.ts                # Axios API client with Auth Interceptors
│   │   │   ├── types.ts              # Shared TypeScript definitions
├── backend/
│   ├── app/
│   │   ├── routers/                  # API route handlers
│   │   ├── database.py               # SQLAlchemy config (Postgres)
│   │   ├── main.py                   # FastAPI entry point & CORS
│   │   ├── models.py                 # DB models
│   │   ├── schemas.py                # Pydantic schemas
│   │   ├── auth.py                   # JWT generation and validation
│   ├── requirements.txt
```

## ✨ Features Implemented

- **Google Authentication:** Secure login using OAuth 2.0 and NextAuth, validated by FastAPI JWT tokens.
- **Dark Mode:** Seamless Light/Dark mode integration across the dashboard and builder.
- **Dashboard:** View, create, duplicate, publish, and delete forms specific to the logged-in user.
- **Form Builder:** 3-pane layout matching Typeform's creator experience.
- **Drag & Drop:** Reorder questions visually in the builder sidebar.
- **Live Preview:** Real-time center pane updates as you type and change settings.
- **Question Types:** Short text, Long text, Multiple choice, Dropdown, Email, Number, Yes/No, Rating.
- **Respondent UX:** Smooth one-question-at-a-time public experience with `framer-motion` transitions.
- **Keyboard Navigation:** Press `Enter` to advance, select choices via `A, B, C` keys.
- **Validation:** Both frontend (empty check, email regex, etc.) and backend.
- **Results:** Submissions list and a summary view with distribution bars and average ratings.
- **Persistence:** All data (including question order) is saved in a live PostgreSQL database on Neon.

## 📝 Setup Instructions (Local Development)

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
python -m venv venv
# Activate virtual environment (Windows)
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt

# Create a .env file and add your Neon Postgres URL
# DATABASE_URL="postgresql://user:password@hostname/dbname"

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```
*The backend will run at `http://localhost:8000`.*

### 2. Frontend Setup

Open a separate terminal and navigate to the frontend directory:

```bash
cd frontend
# Install dependencies
npm install

# Create a .env.local file and add your Google Auth credentials
# GOOGLE_CLIENT_ID="your_client_id"
# GOOGLE_CLIENT_SECRET="your_client_secret"
# NEXTAUTH_SECRET="your_secure_string"

# Start the Next.js development server
npm run dev
```
*The frontend will run at `http://localhost:3000`.*
