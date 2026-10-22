# Conversation Report: M02 — LedgerBridge / SpendNest discussion

- **Source Identity**: `(meeting, 1a21c409-c050-5787-90af-2667e057e1b6)`
- **Reference**: `M02`
- **Applied Source Revision**: `Rev 1`
- **Timestamp**: `2026-08-21T11:30:00Z` (Asia/Kolkata date: 2026-08-21)
- **Participant**: `team07@example.com` (Meeting Organizer)
- **Assigned Routes**: Internal / Vendor Note, Deal Next Steps
- **Manual Override**: No
- **Review State**: `Reviewed`
- **Analysis Freshness**: `fresh`

## Routing Reasoning
Strategic vendor evaluation with Supplier A (LedgerBridge) for cross-border electronic invoicing compliance across Singapore, Australia, and India for SpendNest's upcoming Accounts Receivable module.

## Summary & Analysis
SpendNest strategy (Team member A) and product (Team member B) met with LedgerBridge (Supplier A) to evaluate an electronic invoicing integration. Target launch is Q4 starting in Singapore and Australia, followed by India. Supplier A reviewed the sandbox API, local field localisation, setup pricing (EUR 2,600 basic to EUR 6,500 supported), and licensing models (country vs per-customer). Supplier A is sending a volume template to scope pricing.

## Key Evidence-Backed Findings
### Strategic Roadmap Alignment
- **Finding**: SpendNest target Q4 launch for Singapore/Australia e-invoicing is flexible to early next year.
- **Evidence Reference**: Meeting M02 Turn 15
- **Exact Quotation**: *"There are several projects competing for that quarter. Early next year is possible if the work moves. We intend to build the capability, but I would not describe the quarter as an immovable deadline."*
- **Product / Rule Impact**: Internal / Vendor Note: Product roadmap scheduling.

### Commercial Pricing Structure
- **Finding**: One-time setup fee EUR 2,600 to EUR 6,500+ covers multiple target countries; usage licensed per country or per end-customer.
- **Evidence Reference**: Meeting M02 Turn 31
- **Exact Quotation**: *"The basic setup begins at EUR 2,600; a more supported implementation starts at EUR 6,500... The initial setup covers the markets together, rather than charging it again for each expansion."*
- **Product / Rule Impact**: Deal Next Steps: Finance model completion based on volume template.

## Supporting Evidence Excerpts
- **[00:23:27] Team member A: ** *"Received invoice volumes can be based on current accounts-payable usage. Issued volumes will be estimates because the receivables product is still being built. We should not present those two columns as equally certain."* — *Relevance*: Honest data limitation distinguishing AP actuals from AR projections.

## Recommended Next Steps
- [ ] **Complete LedgerBridge volume projection template with AP actuals and AR estimates.** (Owner: `Team member A`, Priority: `High`)
- [ ] **Register for LedgerBridge sandbox key to test regional invoice payloads.** (Owner: `Team member B`, Priority: `Medium`)

## Limitations & Uncertainty
- SpendNest AR module is still under active development; future invoice issue volume is speculative.
- Specific US non-payroll reporting is out of standard scope and would require custom development.

