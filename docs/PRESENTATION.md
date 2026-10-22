# Volopay / SpendNest Revenue Intelligence Inbox
## Recruitment Assignment: 5-Slide Presentation Deck
**Candidate Submission** | **Date:** 22 October 2026 | **Assessment Target Date:** 21 August 2026 (Asia/Kolkata)

---

### Slide 1: Manager Problem, Selected Workflow, and Three Important Findings

#### 1. The Core Manager Problem
Sales managers face high volumes of fragmented calls, meetings, dialer records, and transcripts from multiple systems. Key challenges include:
- Unreliable upstream flags (e.g., dialer marking calls "connected" when only an answering machine picked up).
- Late-arriving transcripts and partial updates.
- Reductive single-category labeling when conversations serve multiple operations (e.g., deal progress + software bug triage).
- Risk of losing manual human judgment when automated background syncs or re-imports run.

#### 2. Selected Manager Workflow
1. **Intake & Filter:** Filter by rep or source type on the Overview Dashboard to see usable text coverage and exception counts.
2. **Review & Triage:** Inspect flagged conversations in the Inbox (e.g., missing transcripts, stale analyses, unassigned owners).
3. **Evidence Inspection:** Drill into conversation details, verify claims against numbered turns or exact quotes, and override routing if necessary.
4. **Action Execution:** Export manifest and structured markdown files for engineering bug tickets or sales coaching 1-on-1s.

#### 3. Three Key Findings Grounded in Source Text
1. **Finding 1 — Mark as Paid State Retention Bug (Meeting M07 Turn 22 [00:17:33]):**
   - *What was noticed:* The "Mark as paid" modal retains the previous transaction amount (`INR 18,200`) instead of fetching the active record's value, forcing repetitive modal cancellation.
   - *Exact Quotation:* Customer A: *"The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information."*
   - *Product Impact:* M07 assigned to **Internal / Vendor Note** with a high-priority bug ticket; modal state cleanup highlighted in Conversation Details and Manager Brief.
2. **Finding 2 — Dialer Rep Identity Mismatch (Call C06):**
   - *What was noticed:* Source metadata attributes the call to `rep_name: Meera` (`meera@example.com`), but the spoken audio/transcript explicitly opens with a male caller introducing himself as Ravi.
   - *Exact Quotation:* C06: *"Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call."*
   - *Product Impact:* Flagged in **Sales Coaching** as an Account Attribution Discrepancy to audit shared dialer accounts or misattributed credential pools.
3. **Finding 3 — Strict Negative Boundary on Referral Outreach (Call C09):**
   - *What was noticed:* Prospect Vedant suggested reaching out to Business Head Mr Rishabh on LinkedIn, but explicitly forbade mentioning his name.
   - *Exact Quotation:* C09: *"Would it be all right if I mentioned your name when contacting him? No, please don't use my name."*
   - *Product Impact:* Action plan in **Deal Next Steps** explicitly instructs SDR: *Do NOT cite Vedant's name when contacting Rishabh*, preventing brand damage.

---

### Slide 2: Interface Choices, Key Functionality, and Deliberately Rejected Decisions

#### 1. Interface Choices & Visual Hierarchy
- **Clean SaaS Dashboard:** High-contrast light theme with Tailwind CSS, distinct route accent badges, and clean spacing.
- **Evidence-First Detail View:** Numbered turns (`Turn 1...28`) with `HH:MM:SS` timecodes for meetings and exact quotes for calls. Clicking a finding highlights its corresponding turn.
- **Multi-Route Badges:** Clearly marks both automated suggestions and explicit human overrides.
- **Interactive Replay Hub:** Dedicated UI page to trigger and demonstrate all 5 replay scenarios (Initial, Shuffled Repeat, Manual Override, Update Batch, Revision Guard).

#### 2. Key Implemented Capabilities
- **Strict Data Contract Engine:** Identity strictly keyed by composite pair `(source_type, source_id)` in MongoDB with unique compound indexes.
- **Idempotent Upsert & Revision Ordering:** Revision 1 cannot overwrite Revision 2. Full source replacement preserves human manual overrides.
- **Export System:** Real ZIP archive generation with relative paths and machine-readable JSON/CSV manifests.
- **Manager Brief:** Comprehensive briefing for 21 August 2026 Asia/Kolkata linking directly to the 18 conversations.

#### 3. Deliberately Rejected Decision
- **Rejected Decision:** Inventing pipeline opportunity currency totals, CRM win probabilities, or automatic company account deduplication (e.g., merging Harborlight Advisory C01 with Harborpath Advisory M01, or Cedarwave M04 with M13).
- **Why Rejected:** `DATA_DICTIONARY.md` and `DATA_CONTRACT.md` explicitly state that no CRM opportunity table is supplied, similar titles or company names are NOT verified identities, and monetary figures in conversations have no verified pipeline backing.
- **Trade-off Accepted:** Rejected building flashy but fictitious pipeline forecast cards; instead built rigorous, source-backed metrics (Usable Coverage 18/44, Stored Connection Rate 40.0%) that a sales manager can genuinely trust without hallucinated numbers.

---

### Slide 3: Routing Taxonomy, Output Folder Design, and One Difficult Routing Case

#### 1. Routing Taxonomy (5 Practical Operational Destinations)
1. **Sales Coaching:** Conversations requiring rep guidance, dialer attribution checks (C06), fee transparency training (M03), or boundary compliance (C09, C10).
2. **Deal Next Steps:** Commercial pipeline opportunities requiring custom API proposals (C03), partner contracts (M01, C07), or CFO demonstrations (M03).
3. **Customer Follow-up:** Asynchronous collateral delivery (C05, C08), onboarding assistance (M01), and bug hotfix updates (M07).
4. **Internal / Vendor Note:** Engineering bug reports (M07), vendor evaluations (LedgerBridge M02), and billing operations training (M10).
5. **Human Review:** Ambiguous calls, missing text intake records, severe account retention risks (M04), or stale analysis awaiting review.

#### 2. Output Folder & Archive Design
All generated artifacts resolve relative to the export archive root:
- `conversations/`: Canonical markdown report per source record (`{ref}_{title}.md`), containing source metadata, full routing reasoning, evidence-backed findings, recommended actions with owners, and limitations.
- `by_route/`: Operational subfolders (`Sales Coaching/`, `Deal Next Steps/`, etc.) containing route pointer files referencing the primary document, eliminating duplication while preserving multi-route visibility.
- `manager_brief/`: Full markdown copy of the 21 August 2026 Manager Brief.
- `manifest.json` & `manifest.csv`: Machine-readable index connecting source identities, revisions, assigned routes, override flags, review status, and relative file paths.

#### 3. One Difficult Routing Case: Cedarwave Distribution (Meeting M04)
- **The Challenge:** M04 involves an urgent card migration because SpendNest's physical card programme is shutting down in weeks (Customer Follow-up). However, the customer has an existing INR 1.3 crore bank credit line and firmly refuses prepaid cards, requiring a custom bank-credit card feed integration (Internal / Vendor Note). Furthermore, a bug in the assistant view prevented the rep from reassigning departments (Internal Note), and churn risk is imminent.
- **Resolution:** Rather than forcing M04 into an oversimplified single category, our multi-route engine assigns it to:
  - *Customer Follow-up:* Coordinate immediate card migration transition plan.
  - *Internal / Vendor Note:* Investigate bank-card feed eligibility and log department UI reassignment bug.
  - *Human Review:* Sales manager must intervene on commercial churn risk.

---

### Slide 4: Validation of Key Metric and Key Analytical Conclusion

#### 1. Metric Validation: Usable Transcript Coverage (18 / 44 = 40.9% Post-Update)
- **Calculation Formula:**
  $$\text{Coverage Rate} = \frac{\text{Records with Usable Conversational Text}}{\text{Total Distinct Selected Source Records}} = \frac{18}{44} \approx 40.9\%$$
- **Pre-Update Verification (01_initial.json):**
  - Total distinct records: 44 (30 calls, 14 meetings).
  - Usable calls: 10 (C01 to C10 have non-blank `payload.transcript`).
  - Usable meetings: 7 (M01, M02, M03, M04, M06, M09, M10 have `turns.length > 0`).
  - Records without usable text: 27 (20 background calls B01–B20, plus M05, M07, M08, M11, M12, M13, M14).
  - Initial Coverage: 17 / 44 (38.6%).
- **Post-Update Verification (02_update.json):**
  - M07 arrives in Batch 2 (Rev 2) with 27 turns (`unavailable_reason: null`).
  - Total records remains exactly 44 (composite key replaces M07 payload).
  - Usable meetings increases from 7 to 8.
  - Post-Update Coverage: 18 / 44 (40.9%).
  - Breakdown: Calls 10/30 (33.3%), Meetings 8/14 (57.1%).

#### 2. Key Analytical Conclusion Validation: Fee Transparency Friction in Asterloom Systems (Meeting M03)
- **Analytical Claim:** Miscommunicating recurring software fees vs one-time integration setup fees creates immediate buyer friction and stalls executive closing.
- **Source Verification:**
  - In Turn 22, rep states: *"In the first monthly spending band, up to INR 13 lakh, the annual charge for the cards arrangement would be INR 39,000 plus tax."*
  - In Turn 23, customer immediately pushes back: *"But you previously told me INR 26,000. Why has that become INR 39,000?"*
  - In Turn 24, rep clarifies: *"I included the integration setup in that number... INR 26,000 plus tax is the recurring annual subscription, and INR 13,000 is the one-time accounting integration setup."*
  - In Turn 25, customer notes: *"Okay, I want the proposal to be attractive, including that setup charge... My colleague will finish the questions, then we will discuss internally."*
- **Actionable Conclusion:** Rep's failure to present setup fees as a distinct line item caused suspicion; written proposals must present recurring subscription and one-time setup transparently.

---

### Slide 5: Trade-offs, AI Usage, Known Limitations, and Future Roadmap

#### 1. Architectural & Engineering Trade-offs
- **MongoDB Composite Keys vs Synthetic Autoincrement IDs:** Chose compound unique index on `(source_type, source_id)` matching the exact data contract. Accepted slight query verbosity in exchange for 100% collision-proof idempotency during re-imports.
- **Physical Output Files vs Virtual In-Memory Streams:** Generated real markdown report files on disk inside `exports/` rather than only an in-memory ZIP. Enabled reviewers to inspect generated artifacts locally or via manifest.
- **Pregenerated Verified Analysis vs Uncontrolled LLM Generation:** Built verified, source-grounded analysis with exact turn numbers and quotes. Avoided runtime AI hallucination, eliminated paid API dependencies, and ensured 100% reproducible test verification.

#### 2. Transparency on AI Tooling Usage
- AI coding assistants were utilized for rapid scaffolding of React Vite TypeScript components, Tailwind layouts, and FastAPI routing boilerplate.
- All conversation analyses, quotation citations, and turn numbers were verified against the raw JSON files.
- The system includes a freshness tracking flag (`analysis_freshness: "stale_pending_review"`) to ensure that if source text changes in an update, managers are alerted to verify the analysis.

#### 3. Known Limitations
- Background calls (B01–B20) contain only upstream metadata (duration, dial counts) and no audio/text; substantive analysis is intentionally withheld.
- Meeting organizers cannot be assumed to be sales reps or attendees.
- No real phone calls can be dialed (tokens like `PHONE_001` are non-operational).

#### 4. Future Improvements
1. **Live Whisper / Speech-to-Text Pipeline:** Ingest raw audio recordings for background calls to achieve 100% transcript coverage.
2. **CRM Webhook Connector:** Two-way sync with Salesforce / HubSpot to push verified next steps and owners directly into rep task queues.
3. **Automated LLM Verification Agent:** Local Ollama / vLLM integration with semantic drift detection when transcripts update.
