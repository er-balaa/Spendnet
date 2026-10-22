# Three-Minute Narrated Screen Recording Script & Candidate Checklist
**Project:** SpendNest Revenue Intelligence Inbox  
**Role:** Recruitment Assignment Submission  
**Target Duration:** Exactly 3 Minutes (180 Seconds)  
**Format:** Continuous single-take screen recording with spoken voiceover.

---

## 1. Quick Recording Preparation Checklist

Before hitting record:
- [ ] MongoDB is running (`net start MongoDB` or service status confirmed).
- [ ] Backend is running on port 8000 (`python backend/run.py`).
- [ ] Frontend is open in your browser at `http://localhost:5173` (or `http://localhost:8000`).
- [ ] In the Replay page (`/imports`), click **"Reset to Initial Only"** so the app starts with 44 records and 17 usable texts, with M07 at Revision 1.
- [ ] Have the browser open full screen and clear any browser bookmarks/distractions.
- [ ] Microphone level tested.

---

## 2. Timed 3-Minute Narration Script

### Section 1: Introduction & Useful Manager Workflow (0:00 – 0:45)
- **What to show on screen:**
  - Start on the **Overview Dashboard** (`/`).
  - Hover over the **Transcript Coverage** card (`38.6% • 17 / 44 records`) to show the tooltip definition.
  - Switch the **Person Filter** to `Arun (12 calls, 1 meeting)` and show the dashboard charts dynamically filter.
  - Click on the Inbox table to drill into Arun's call `C01`.
- **Spoken Narration (Word for Word):**
  > *"Hello! I am presenting SpendNest Revenue Intelligence, built for sales managers to cut through noisy call logs and unverified flags.*
  > *Starting on the Overview Dashboard, our headline metrics answer the most important operational questions with clear denominators. For example, our Transcript Coverage metric is defined as records with usable conversational text divided by total selected records—currently 17 out of 44, or 38.6% in the initial batch.*
  > *All metrics respond to live filters. If I filter by caller Arun, we immediately isolate his 12 calls and 1 meeting. Clicking through brings us directly to the Conversation Inbox."*

---

### Section 2: Difficult Routing Decision & Evidence Inspection (0:45 – 1:20)
- **What to show on screen:**
  - In the Inbox or Routing page, click on **Cedarwave Distribution (M04)**.
  - Scroll through the 32 turns in the **Evidence Viewer** to show turn numbers and timestamps.
  - Point to the **Routing Rationale** and the 3 assigned badges: `Customer Follow-up`, `Internal / Vendor Note`, `Human Review`.
- **Spoken Narration (Word for Word):**
  > *"Here is a difficult routing decision: Cedarwave Distribution, record M04. In Turn 4, the rep explains that the customer's existing physical card programme is being shut down in weeks, which is an urgent Customer Follow-up.*
  > *However, in Turn 22, the customer insists on using their existing 1.3 crore bank credit facility and demands a third-party bank card transaction feed rather than another prepaid card. At the same time, an internal tooling bug prevented the rep from reassigning departments.*
  > *Rather than forcing this into a single misleading category, our engine routes M04 across three operational destinations: Customer Follow-up, Internal Note for the bank feed, and Human Review for account churn risk."*

---

### Section 3: Duplicate Test & Order-Independence (1:20 – 1:55)
- **What to show on screen:**
  - Click **"Replay & Update"** in the top navigation to open the **Import & Replay Controls** page (`/imports`).
  - Show the current database count is **44 unique records**.
  - Click **"Test Repeat Import"** (which shuffles the 44 records from `01_initial.json`).
  - Point out the success banner: `0 inserted, 0 updated, 44 ignored. Total unique in DB: 44`.
- **Spoken Narration (Word for Word):**
  > *"Next, let's verify our strict data contract. In the Replay Controls, our database currently has 44 unique records.*
  > *I will now trigger a repeat import of the initial batch, with the records shuffled in random order. Watch the result:*
  > *The system processed all 44 records, but inserted zero, updated zero, and ignored 44. The total unique record count in MongoDB stays strictly 44, proving complete order-independence and zero metric inflation."*

---

### Section 4: Manual Route Correction Surviving Update Batch (1:55 – 2:35)
- **What to show on screen:**
  - Navigate to Inbox and click into **M07 (Willowfield Trust)**. Notice in Rev 1 it has no transcript and route is `Human Review`.
  - Click **"Edit Routes"**, select `Sales Coaching` as an override, enter review note: *"Manager manual coaching test"*, and click **"Save Override"**.
  - Show the purple `Sales Coaching` badge with the manual override dot.
  - Return to `/imports` and click **"Apply Update Batch"** (`02_update.json`).
  - Point to result banner: `1 updated, 0 inserted, total unique: 44`.
  - Click into M07 again to show:
    - 27 turns are now visible!
    - Revision is now `v2`!
    - The manual route `Sales Coaching` **remains in effect**!
    - Freshness badge warns `Stale / Needs Review` because source text changed.
- **Spoken Narration (Word for Word):**
  > *"Now, let's test manual judgment preservation through an update. Here is M07, which arrived without a transcript in revision 1.*
  > *I will manually override its route to 'Sales Coaching' and save it. The manual override is now persisted in MongoDB.*
  > *Next, I apply the update batch—batch 02_update.json, which delivers revision 2 of M07.*
  > *Notice: the record was updated in-place without creating a duplicate 45th record. When we reopen M07, the new 27-turn transcript is immediately available, but my manual 'Sales Coaching' override remained strictly in effect.*
  > *Furthermore, our freshness engine flagged it as 'Needs Review' so managers know the text updated."*

---

### Section 5: Exports, Manager Brief & Conclusion (2:35 – 3:00)
- **What to show on screen:**
  - Click on **Manager Brief** (`/brief`) and scroll to the three key evidence findings.
  - Click on **Exports & Downloads** (`/exports`) and click **"Download ZIP Archive"**.
  - Show the downloaded file `spendnest_revenue_intelligence_exports.zip`.
- **Spoken Narration (Word for Word):**
  > *"Finally, our Manager Brief synthesizes all 18 conversations for 21 August 2026, linking directly to findings like the 'Mark as Paid' state retention bug in M07 Turn 22 and dialer attribution mismatch in C06.*
  > *Under Exports, the system generates real physical reports organized by route and conversation, complete with JSON and CSV manifests, packaged into this downloadable ZIP.*
  > *Every test passed 100% against our automated test suite. Thank you for watching!"*

---

## 3. Submission Links Checklist for Candidate
- [ ] Deployed / running application URL or local startup commands.
- [ ] Three-minute recording uploaded to Google Drive with permission set to **"Anyone with the link can view"**.
- [ ] Five slides (`docs/PRESENTATION.md` or PDF/HTML).
- [ ] Export ZIP (`spendnest_exports.zip`) with `manifest.json` and `manifest.csv`.
- [ ] Readme with development hours and reproduction steps.
- [ ] Submit before deadline: **Friday, 23 October 2026 at 3:00 PM IST**.
