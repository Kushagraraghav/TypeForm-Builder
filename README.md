# Typeform Clone

A complete, functional Typeform-inspired application built for a Fullstack Assignment. It allows users to create forms, configure questions with a drag-and-drop builder, publish forms, and view responses in a beautiful one-question-at-a-time public interface.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Drag & Drop:** dnd-kit
- **Icons:** Lucide React
- **API Client:** Axios

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite
- **ORM:** SQLAlchemy
- **Validation:** Pydantic

## 📂 Project Structure

```
root/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── forms/[id]/           # Form Builder & Results
│   │   │   ├── to/[slug]/            # Public Respondent View
│   │   │   ├── page.tsx              # Creator Dashboard
│   │   ├── components/
│   │   │   ├── builder/              # Builder panes (Sidebar, Preview, Settings)
│   │   │   ├── respondent/           # Public form components
│   │   │   ├── ui/                   # Shared UI (Toasts, etc.)
│   │   ├── lib/
│   │   │   ├── api.ts                # Axios API client
│   │   │   ├── types.ts              # Shared TypeScript definitions
├── backend/
│   ├── app/
│   │   ├── routers/                  # API route handlers
│   │   ├── database.py               # SQLAlchemy config
│   │   ├── main.py                   # FastAPI entry point
│   │   ├── models.py                 # DB models
│   │   ├── schemas.py                # Pydantic schemas
│   ├── seed.py                       # DB seeder
│   ├── requirements.txt
```

## ✨ Features Implemented

- **Dashboard:** View, create, duplicate, publish, and delete forms.
- **Form Builder:** 3-pane layout matching Typeform's creator experience.
- **Drag & Drop:** Reorder questions visually in the builder sidebar.
- **Live Preview:** Real-time center pane updates as you type and change settings.
- **Question Types:** Short text, Long text, Multiple choice, Dropdown, Email, Number, Yes/No, Rating.
- **Respondent UX:** Smooth one-question-at-a-time public experience with `framer-motion` transitions.
- **Keyboard Navigation:** Press `Enter` to advance, select choices via `A, B, C` keys.
- **Validation:** Both frontend (empty check, email regex, etc.) and backend.
- **Results:** Submissions list and a summary view with distribution bars and average ratings.
- **Persistence:** All data (including question order) is saved in SQLite.

## 🚧 Placeholders & Assumptions

- **Authentication:** The dashboard is open for demo purposes. "My Workspace" assumes a single default creator.
- **Advanced logic/branching:** Considered out-of-scope (UI placeholders not heavily featured to prioritize core flow).
- **Contacts / Automations / Insights:** Represented in the sidebar but left as "Coming soon" per assignment specs.

## 🛠 Setup Instructions

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
python -m venv venv
# Activate virtual environment (Windows)
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# (Optional) Seed the database with demo data
python seed.py
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
# Start the Next.js development server
npm run dev
```
*The frontend will run at `http://localhost:3000`.*

## 🔗 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms` | List all forms |
| POST | `/api/forms` | Create a form |
| GET | `/api/forms/{id}` | Get specific form details |
| PATCH | `/api/forms/{id}` | Update form (title, settings) |
| POST | `/api/forms/{id}/duplicate` | Duplicate form |
| POST | `/api/forms/{id}/publish` | Publish form |
| POST | `/api/forms/{id}/questions` | Add a question |
| PUT | `/api/forms/{id}/questions/reorder` | Reorder questions |
| GET | `/api/public/forms/{slug}` | Fetch published form (public) |
| POST | `/api/public/forms/{slug}/responses`| Submit a response (public) |
| GET | `/api/forms/{id}/responses` | Get form submissions |
| GET | `/api/forms/{id}/summary` | Get summary analytics |
