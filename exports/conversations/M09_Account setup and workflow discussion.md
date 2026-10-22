# Conversation Report: M09 — Account setup and workflow discussion

- **Source Identity**: `(meeting, 4b5b9192-f3fc-505a-8e77-4d2ffaa54594)`
- **Reference**: `M09`
- **Applied Source Revision**: `Rev 1`
- **Timestamp**: `2026-08-21T04:30:00Z` (Asia/Kolkata date: 2026-08-21)
- **Participant**: `team11@example.com` (Meeting Organizer)
- **Assigned Routes**: Customer Follow-up, Internal / Vendor Note, Human Review
- **Manual Override**: No
- **Review State**: `Reviewed`
- **Analysis Freshness**: `fresh`

## Routing Reasoning
Dual-company account setup assistance (Northkite Equipment vs Brookmint Holdings). Customer hit an expired invitation token bug and raised serious governance concerns regarding shared mailbox vs individual admin credentials.

## Summary & Analysis
Customer A met with Team member A to resolve access to Brookmint Holdings and accounting configuration for Northkite Equipment. Fresh invitation reset link failed immediately with 'token has expired'. Customer expressed concern that granting admin access to a shared accounts mailbox allows AP officers to bypass permission controls. Customer manually corrected Northkite tax treatment and requested workflow guidance on receipt attachments before accounting sync.

## Key Evidence-Backed Findings
### Instant Token Expiration Bug
- **Finding**: Newly generated password reset invitation token reported expired immediately upon delivery.
- **Evidence Reference**: Meeting M09 Turn 21
- **Exact Quotation**: *"It says the token has expired. This is the fresh message we just received."*
- **Product / Rule Impact**: Internal / Vendor Note: Critical auth service defect logged.

### Role-Based Access Governance Dilemma
- **Finding**: Customer rejected using shared accounts mailbox as admin because junior AP staff have mailbox access.
- **Evidence Reference**: Meeting M09 Turn 17
- **Exact Quotation**: *"I do not want this to depend on trusting someone not to use access that is available. That does not solve the permission problem."*
- **Product / Rule Impact**: Customer Follow-up: Configure individual personal work identities with segregated roles.

## Supporting Evidence Excerpts
- **[00:13:57] Team member A: ** *"I need to check that with the team. I hope to update you today, or by Monday at the latest. We have not got the Brookmint Holdings login working yet."* — *Relevance*: Honest admission that login is not yet resolved.
- **[00:18:01] Team member A: ** *"The transaction is approved now, but syncing is still a separate step. If you need another attachment before syncing, you can undo the verification, attach it and review it again."* — *Relevance*: Operational guidance on attachment workflow.

## Recommended Next Steps
- [ ] **Escalate auth token expiration bug to backend team to generate working Brookmint admin invitation.** (Owner: `Team member A`, Priority: `High`)
- [ ] **Provide admin training videos and documentation on segregated member/accounting roles.** (Owner: `Team member A`, Priority: `Medium`)

## Limitations & Uncertainty
- Customer A has not completed Brookmint login setup.
- IT team policy on dedicated admin emails is pending customer internal decision.

