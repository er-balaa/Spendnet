# SpendNest Revenue Intelligence Inbox — Volopay Recruitment Assignment

A production-grade, full-stack revenue intelligence web application built for sales managers to review calls, meetings, transcripts, and automated notes; understand sales activity; and decide operational next steps.

Built strictly in accordance with the Volopay recruitment assignment brief, `DATA_CONTRACT.md`, and `DATA_DICTIONARY.md`.

---

## 1. Technology Stack & Architecture

### Frontend
- **Framework:** React 18 with Vite & TypeScript
- **Styling:** Tailwind CSS with a clean, responsive light SaaS aesthetic
- **Charts:** Recharts for interactive operational visualizations
- **Icons:** Lucide React
- **Routing:** React Router v6

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Validation:** Pydantic v2 schemas for request and response enforcement
- **Database Driver:** PyMongo connected to local or remote MongoDB
- **Architecture:** Modular separation of business logic (`services/`), database (`database.py`), routing (`routers/`), models (`models/`), and export generation (`export_service.py`)

### Database
- **Database:** MongoDB (Local or Atlas)
- **Composite Identity:** Keyed strictly by the compound pair `(source_type, source_id)` with a unique MongoDB compound index.
- **Contract Adherence:** Source payload replacements never erase manager route overrides; older revisions cannot overwrite newer revisions.

---

## 2. Prerequisites

1. **Python:** Python 3.10+ (Tested on Python 3.12)
2. **Node.js:** Node.js 18+ (Tested on Node.js v22.16 with npm 11.5)
3. **MongoDB:** MongoDB Community Server (Running locally on `mongodb://localhost:27017` or configured via `.env`)

---

## 3. Quick Start & Installation

### Step 1: Clone or Navigate to the Workspace
```bash
cd c:\Learning\Volopay
```

### Step 2: Configure Environment Variables (Local or MongoDB Atlas)
Copy `.env.example` in `backend/` to `.env`.

**For MongoDB Atlas Deployment:**
```bash
# In backend/.env or your Cloud Deployment Environment Variables
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=spendnest_revenue_intelligence
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=*
```
> **Atlas Setup Checklist:**
> 1. **Database Access:** Create a MongoDB Atlas Database User with read/write privileges.
> 2. **Network Access:** Under *Network Access* in Atlas, add `0.0.0.0/0` (Allow access from anywhere) so cloud servers (Render, Railway, Vercel) can connect.
> 3. **SRV & TLS:** `dnspython` and `certifi` are included out of the box in `backend/requirements.txt` for automatic TLS root certificate handling.

**For Local MongoDB Development:**
```bash
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=spendnest_revenue_intelligence
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=*
```

### Step 3: Start the Backend API
```bash
# Navigate to backend directory and start server
cd backend
python run.py
```
*The FastAPI backend will start at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.*
*On first startup, the application automatically initializes MongoDB indexes and seeds the final post-update demo state (both batches).*

### Step 4: Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*The Vite development server will open at `http://localhost:5173` (proxied to port 8000).*  
*Alternatively, the pre-built frontend is also served directly by FastAPI at `http://localhost:8000`.*

---

## 4. Dataset Locations

The original, unmodified source materials are kept in:
- **Initial Batch:** `candidate-v1.0 (3)_layout_fixed (1)(2) (3)/candidate/data/01_initial.json` (Rev 1, 44 records: 30 calls, 14 meetings; 17 usable transcripts)
- **Update Batch:** `candidate-v1.0 (3)_layout_fixed (1)(2) (3)/candidate/data/02_update.json` (Rev 2, 1 record: M07 update delivering 27 turns)
- **Offline Reading Pack:** `candidate-v1.0 (3)_layout_fixed (1)(2) (3)/candidate/index.html`

---

## 5. Replay & Test Scenarios (Step-by-Step Reproduction)

Reviewers can reproduce the entire import and update sequence either from the **Import & Replay Controls** page in the UI (`/imports`) or using automated commands:

### A. Initial Import
- **Action:** Click "Import Initial Batch" in `/imports` or send `POST /api/imports/initial`.
- **Expected Outcome:** 44 logical source records inserted. Usable transcript count is 17 (10 calls, 7 meetings). 27 records show missing/unusable text without crashing.

### B. Repeat Import (Order-Independence Test)
- **Action:** Click "Test Repeat Import" in `/imports` (which shuffles the 44 records in random order) or send `POST /api/imports/repeat?shuffle=true`.
- **Expected Outcome:** 0 records inserted, 44 records ignored. Total unique record count in MongoDB stays strictly 44. No duplicate entries or metric inflation.

### C. Manual Route Correction
- **Action:** Navigate to Inbox, open record **M07 (Willowfield Trust)**, click "Edit Routes", select `Sales Coaching`, and save.
- **Expected Outcome:** M07 displays the purple `Sales Coaching` badge with a manual override dot indicator. The override is saved in MongoDB.

### D. Apply the Update Batch
- **Action:** Click "Apply Update Batch" in `/imports` or send `POST /api/imports/update`.
- **Expected Outcome:** M07 is updated in-place from Revision 1 to Revision 2. Its 27 transcript turns become visible. Usable transcript coverage increases from 17 to 18 out of 44. Total record count remains strictly 44.

### E. Preserve Manual Judgment Through Update and Restart
- **Action:** Re-open M07 in the Conversation Details view or refresh the browser.
- **Expected Outcome:** The manual `Sales Coaching` route remains strictly active! The newer 27-turn transcript is accessible, and the system flags the analysis as `Stale / Needs Review` to alert the manager that text changed.

### F. Revision Safety Guard
- **Action:** Click "Test Revision Guard" in `/imports` (re-importing `01_initial.json`).
- **Expected Outcome:** Revision 1 delivery is ignored; M07 remains at Revision 2.

### G. Clean-Start / Reset Procedure
- In `/imports`, use the quick preset buttons:
  - **Reset to Empty:** Clears all records (`POST /api/imports/reset?mode=empty`).
  - **Reset to Initial Only:** Loads only `01_initial.json` (`POST /api/imports/reset?mode=initial`).
  - **Demo State:** Applies both batches in order (`POST /api/imports/reset?mode=demo`).

---

## 6. Automated Test Suite (14 / 14 Requirements Passing)

Run the full pytest suite from the `backend/` directory:
```bash
cd backend
python -m pytest tests -v
```

### Verified Test Results:
```
tests/test_all_requirements.py::test_01_initial_import_record_count PASSED [  7%]
tests/test_all_requirements.py::test_02_repeated_imports_no_duplicates PASSED [ 14%]
tests/test_all_requirements.py::test_03_import_order_independence PASSED [ 21%]
tests/test_all_requirements.py::test_04_update_modifies_existing_record PASSED [ 28%]
tests/test_all_requirements.py::test_05_full_record_replacement PASSED   [ 35%]
tests/test_all_requirements.py::test_06_older_revisions_cannot_overwrite_newer PASSED [ 42%]
tests/test_all_requirements.py::test_07_manual_route_overrides_survive_imports PASSED [ 50%]
tests/test_all_requirements.py::test_08_manual_route_overrides_persist PASSED [ 57%]
tests/test_all_requirements.py::test_09_dashboard_counts_and_denominators PASSED [ 64%]
tests/test_all_requirements.py::test_10_missing_transcripts_honestly_handled PASSED [ 71%]
tests/test_all_requirements.py::test_11_exports_match_manifest PASSED    [ 78%]
tests/test_all_requirements.py::test_12_export_download_works PASSED     [ 85%]
tests/test_all_requirements.py::test_13_manager_brief_evidence_links PASSED [ 92%]
tests/test_all_requirements.py::test_14_updated_source_text_flags_stale_analysis PASSED [100%]

============================= 14 passed in 4.45s ==============================
```

---

## 7. Export Generation & Output Structure

Exports can be generated from the UI (`/exports`), via API `POST /api/exports/generate`, or downloaded directly via `GET /api/exports/download`.

Generated files are structured inside `exports/`:
```
exports/
├── conversations/          # Canonical markdown reports for all 44 records
│   ├── C01_Outbound_Call...md
│   ├── M07_Willowfield_Trust...md
│   └── ...
├── by_route/               # Operational subfolders by route destination
│   ├── Sales Coaching/
│   ├── Deal Next Steps/
│   ├── Customer Follow-up/
│   ├── Internal _ Vendor Note/
│   └── Human Review/
├── manager_brief/          # Manager Brief for 21 August 2026 Asia/Kolkata
│   └── MANAGER_BRIEF_2026-08-21.md
├── manifest.json           # Machine-readable JSON manifest
└── manifest.csv            # Machine-readable CSV manifest
```
*Archive Package Location:* `spendnest_exports.zip` (root directory).

---

## 8. Metric Definitions & Formulas

1. **Total Unique Records:** Count of distinct `(source_type, source_id)` records in MongoDB ($N = 44$).
2. **Transcript Coverage:**
   $$\text{Coverage Rate} = \frac{\text{Records with Usable Text}}{\text{Total Selected Records in Filter}} = \frac{18}{44} \approx 40.9\%$$
   *(Pre-update: $17/44 = 38.6\%$. Post-update: $18/44 = 40.9\%$. Calls: $10/30 = 33.3\%$, Meetings: $8/14 = 57.1\%$.)*
3. **Stored Connection Rate:**
   $$\text{Connection Rate} = \frac{\text{Calls with } is\_connected = \text{true}}{\text{Calls with non-null } is\_connected} = \frac{12}{30} = 40.0\%$$
   *(Unknown / null count: 0).*
4. **Stored Conversation Rate:**
   $$\text{Conversation Rate} = \frac{\text{Calls with } is\_conversation = \text{true}}{\text{Calls with non-null } is\_conversation} = \frac{9}{30} = 30.0\%$$
5. **Call Reps vs Meeting Organizers:** Kept strictly separate. Meeting organizers are calendar metadata and are NOT assumed to be sales reps or attendees.

---

## 9. Analysis Generation Method: Pregenerated vs Runtime

- **Conversation Analysis:** The analytical summaries, exact quotations, 1-based turn references, and recommended action owners were pre-generated and verified directly against the adapted source JSON files (`01_initial.json` and `02_update.json`).
- **Runtime Computations:**
  - Dynamic KPI calculations, filter responses, and connection metrics.
  - Idempotent upserts, revision comparison, and full-record replacements.
  - Manual route override persistence and freshness invalidation.
  - Dynamic export generation, ZIP packaging, and manifest compilation.
- **No Paid AI APIs Required:** The application runs 100% offline without external API keys or recurring LLM costs.

---
## 10. Submission Deliverables Summary

1. **Working Application:** Running locally at `http://localhost:8000` (FastAPI + React bundle) and `http://localhost:5173` (Vite dev server).
2. **Editable Source Files:** Full backend and frontend source directories included.
3. **Generated Exports:** `spendnest_exports.zip` with `exports/manifest.json` and `exports/manifest.csv`.
4. **Five-Slide Presentation:**
   - Markdown: `docs/PRESENTATION.md`
   - Standalone Browser Slide Deck: `docs/presentation.html`
5. **Three-Minute Recording Script & Checklist:** `docs/RECORDING_SCRIPT.md`
6. **Part 2 College Event Plan:** `docs/COLLEGE_EVENT_PLAN.md` (Technovate 2025 event plan & video walkthrough guide).

---

## 11. Known Limitations & Development Time

### Known Limitations
- Background calls (B01–B20) contain no audio or transcript; per data contract rules, substantive analysis is not fabricated.
- Meeting provider URLs (`example.invalid`) and telephone tokens (`PHONE_001`) are non-operational.
- No live CRM opportunity table exists in the source data.

### Approximate Development Time
- **Total Development Time:** 7.5 hours (within the suggested 6–8 hour assignment scope).

---

## 12. Deployment Guide (MongoDB Atlas & Cloud Hosting)

### A. Deploy to Render.com (Recommended — Unified 1-Click)
1. Fork or push this repository to GitHub.
2. In Render Dashboard, click **New Web Service** and connect your repository.
3. Render will automatically detect [`render.yaml`](file:///c:/Learning/Volopay/render.yaml) or you can manually configure:
   - **Environment:** `Python`
   - **Build Command:** `pip install -r backend/requirements.txt && cd frontend && npm install && npm run build`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**, add:
   - `MONGODB_URL`: Your MongoDB Atlas connection string (`mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority`).
   - `DATABASE_NAME`: `spendnest_revenue_intelligence`
   - `CORS_ORIGINS`: `*`
5. Click **Deploy**. The app will be live with both frontend and backend on your Render URL!

### B. Deploy to Railway.app
1. Click **New Project** → **Deploy from GitHub repo**.
2. Railway detects the [`Procfile`](file:///c:/Learning/Volopay/Procfile) and [`Dockerfile`](file:///c:/Learning/Volopay/Dockerfile).
3. Under **Variables**, add `MONGODB_URL` with your Atlas URI.
4. Deploy completes and provisions a live HTTPS URL.

### C. Deploy via Docker
```bash
# Build the production image (bundles frontend + FastAPI)
docker build -t spendnest-app .

# Run container with MongoDB Atlas URI
docker run -d -p 8000:8000 \
  -e MONGODB_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority" \
  -e DATABASE_NAME="spendnest_revenue_intelligence" \
  --name spendnest spendnest-app
```
Access at `http://localhost:8000`.

### D. Deploy Frontend to Vercel and Backend to Render/Railway (Split Mode)
1. **Backend:** Deploy the backend on Render/Railway as described above. Note the backend URL (e.g. `https://spendnest-api.onrender.com`).
2. **Frontend:** Import the `frontend` folder into Vercel. In Vercel Environment Variables, set:
   - `VITE_API_URL`: `https://spendnest-api.onrender.com`
3. The frontend will communicate with your deployed FastAPI backend via HTTPS.
