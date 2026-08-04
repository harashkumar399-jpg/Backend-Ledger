# 🏥 SmartDiag Lite - Healthcare Diagnostic & Recommendation Platform

SmartDiag Lite is a full-stack web application engineered for EVE Healthcare portfolio demonstration. It features a Django REST Framework (DRF) backend API and a React.js frontend with diagnostic test search, rule-based symptom recommendations, a lab report summary parser, and an appointment booking workflow.

## 📁 Project Folder Structure

```
smartdiag-lite/
├── backend/                  # Django REST Framework
│   ├── manage.py             # Django CLI runner
│   ├── requirements.txt      # Python dependencies (Django, DRF, CorsHeaders)
│   ├── db.sqlite3            # SQLite database (Pre-seeded with diagnostic tests)
│   ├── core/                 # Settings & Root Router
│   │   ├── settings.py
│   │   └── urls.py
│   └── diagnostics/          # Main healthcare app
│       ├── models.py         # DiagnosticTest & Booking models
│       ├── views.py          # ModelViewSets & API views
│       ├── serializers.py    # DRF serializers
│       ├── urls.py           # API endpoints
│       └── utils.py          # Symptom matcher & Lab report text parser
├── frontend/                 # React.js SPA Application
│   ├── package.json          # Node dependencies
│   ├── public/
│   └── src/
│       ├── index.css         # Modern design system (indigo & teal palette)
│       ├── App.js            # Main view & state container
│       ├── components/
│       │   ├── Navbar.jsx    # Top navigation & tab bar
│       │   ├── TestCard.jsx  # Test package card with symptom tags
│       │   ├── BookingModal.jsx # Appointment booking modal form
│       │   ├── ReportParser.jsx # Lab report analyzer component
│       │   └── Toast.jsx     # User notification toast
│       └── pages/
│           ├── HomePage.jsx  # Catalog & Symptom search
│           └── BookingsList.jsx # Scheduled appointment list
└── README.md
```

## ⚡ Quick Start Guide (Run in 3 Steps)

### Step 1: Clone or Navigate to Project
```bash
cd smartdiag-lite
```

### Step 2: Start the Django Backend API Server
Open a terminal and execute:

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The Django backend server will start at: `http://127.0.0.1:8000/`

*(Note: Diagnostic test catalog data is automatically pre-seeded. You can also trigger re-seeding via `POST http://127.0.0.1:8000/api/seed/`).*

### Step 3: Start the React Frontend Application
Open a second terminal window and execute:

```bash
cd frontend
npm install
npm start
```

The React frontend app will launch automatically in your browser at: `http://localhost:3000/`

## 🚀 Key Features & API Endpoints

1. **Diagnostic Test Catalog (`GET /api/tests/`)**
   - Browse medical test packages (e.g., Complete Blood Count, Diabetes Screening, Thyroid Profile).
   - Filter by category (Blood Test, Diabetes, Hormones, Organ Health, General Wellness).

2. **Rule-Based Symptom Matcher (`GET /api/recommend/?symptoms=fever,headache`)**
   - Enter comma-separated symptoms (e.g. fever, fatigue, chest pain).
   - Uses Django ORM `icontains` & `Q` objects in `diagnostics/utils.py` to recommend tailored diagnostic test packages.

3. **Lab Report Summary Generator (`POST /api/parse-report/`)**
   - Paste raw lab report text or click "Load Sample Report".
   - Extracts key biomarkers (Hemoglobin, Fasting Blood Sugar, Total Cholesterol, WBC, TSH, etc.).
   - Compares measured numeric values against standard medical reference ranges and flags HIGH, LOW, or NORMAL status.

4. **Appointment Booking System (`POST /api/bookings/`, `GET /api/bookings/`)**
   - Interactive modal form allowing patients to select test date, preferred time slot, and patient contact details.
   - View and manage scheduled appointments on the "My Bookings" page.

## 🛠️ Technology Stack

- **Backend:** Python 3.x, Django 5.x, Django REST Framework, Django CORS Headers, SQLite.
- **Frontend:** React.js 18, Vanilla CSS Design System, Lucide Icons.

---
*Created for EVE Healthcare Software Engineer Portfolio Application.*
