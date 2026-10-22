"""
Pregenerated, source-verified analytical data for SpendNest Revenue Intelligence Inbox.
All evidence excerpts cite exact turn numbers (for meetings) and exact quotations (for calls).
No unsubstantiated claims, fake pipeline values, or invented relationships are included.
"""

ANALYSIS_DATABASE = {
    "C01": {
        "title": "Outbound Call — Pranav (Harborlight Advisory)",
        "suggested_routes": ["Sales Coaching", "Deal Next Steps"],
        "route_reasoning": "Unsolicited cold call met with firm objection regarding contact source and existing automated finance setup. Coaching required on cold outreach messaging and prospect list verification.",
        "summary": "Arun cold-called Pranav at Harborlight Advisory to pitch an outsourced finance operations partnership. Pranav expressed immediate irritation regarding how his contact details were obtained and stated his company already has a fairly advanced automated setup, rejecting further discussion.",
        "key_findings": [
            {
                "topic": "Cold Outreach Resistance",
                "finding": "Prospect was defensive about unsolicited call on his direct work number.",
                "evidence_ref": "Call C01",
                "exact_quote": "This number is for my work, not for people to sell things to me.",
                "screen_rule_impact": "Sales Coaching queue: Rep should review opening script to clarify value proposition before triggering resistance."
            },
            {
                "topic": "Incumbent Automation",
                "finding": "Firm claims existing mature automation for part-time finance operations.",
                "evidence_ref": "Call C01",
                "exact_quote": "Our processes are already very automated. We have a fairly advanced setup, so I don't think this is something we need.",
                "screen_rule_impact": "Deal Next Steps: Flagged as Closed/Unqualified in immediate term."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "This is a cold call, isn't it? Yes, it is. Then where did you find my details?",
                "relevance": "Prospect questioning contact sourcing."
            },
            {
                "quote": "Our processes are already very automated. We have a fairly advanced setup, so I don't think this is something we need.",
                "relevance": "Qualification objection regarding existing automation."
            }
        ],
        "limitations_and_uncertainties": [
            "Source text does not reveal the specific software tools Harborlight Advisory currently uses.",
            "No CRM link exists to confirm whether Harborlight is related to Harborpath Advisory (M01)."
        ],
        "recommended_actions": [
            {
                "action": "Do not attempt aggressive phone outreach; verify professional networking list hygiene.",
                "owner": "Arun",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "Arun acknowledged the cold nature of the call politely, but needs guidance on acknowledging objections faster rather than debating lead sources."
    },

    "C02": {
        "title": "Outbound Call — Fernhaven Group (Gatekeeper / Voicemail)",
        "suggested_routes": ["Customer Follow-up", "Deal Next Steps"],
        "route_reasoning": "Call reached receptionist Kavya; target contact Leela was out of office. Rep left voicemail.",
        "summary": "Arun called Fernhaven Group attempting to speak with Leela. Receptionist Kavya stated Leela was out of the office for the day. Arun politely requested transfer to her voicemail.",
        "key_findings": [
            {
                "topic": "Contact Out of Office",
                "finding": "Primary contact Leela was unavailable; message left on voicemail.",
                "evidence_ref": "Call C02",
                "exact_quote": "It looks as though she isn't in the office today. Would you like to leave a message with me, or would you prefer her voicemail?",
                "screen_rule_impact": "Customer Follow-up: Follow-up required early next week."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "Her voicemail would be fine, thank you. Certainly, I'll put you through to the mailbox now.",
                "relevance": "Voicemail routing confirmed by receptionist."
            }
        ],
        "limitations_and_uncertainties": [
            "Transcript ends when transferred to mailbox; voicemail content is not recorded in extract.",
            "Account context and deal stage are not stated in call transcript."
        ],
        "recommended_actions": [
            {
                "action": "Schedule follow-up call for Monday morning.",
                "owner": "Arun",
                "priority": "Low"
            }
        ],
        "coaching_notes": "Professional gatekeeper interaction handled efficiently."
    },

    "C03": {
        "title": "Follow-up Call — Milan (Developer API Access)",
        "suggested_routes": ["Deal Next Steps", "Sales Coaching"],
        "route_reasoning": "Follow-up after a 5-week delay regarding API access and webhook event notifications. Prospect is travelling with poor audio, cites budget constraints, and agreed to email follow-up followed by Monday/Tuesday call.",
        "summary": "Kiran followed up with Milan regarding API and webhook integration discussed five weeks prior. Milan reported severe audio issues due to travelling on roaming. He recalled the requirement but noted developer functionality is not essential enough to justify substantial spend. He agreed to receive an email proposal under subject 'Developer access and event notifications — follow-up' and talk on Monday or Tuesday.",
        "key_findings": [
            {
                "topic": "Budget Sensitivity on API",
                "finding": "Prospect values developer integration but views it as low-priority compared to core spend.",
                "evidence_ref": "Call C03",
                "exact_quote": "We did ask about some developer functionality, but it isn't essential enough for us to spend much on it.",
                "screen_rule_impact": "Deal Next Steps: Rep should offer tiered or usage-based developer access."
            },
            {
                "topic": "Follow-up Agreement",
                "finding": "Clear next communication channel and time window agreed upon.",
                "evidence_ref": "Call C03",
                "exact_quote": "Send the email and we can speak Monday or Tuesday.",
                "screen_rule_impact": "Customer Follow-up: Scheduled task created for email send and Monday call."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "What subject should I look for? Something like 'Developer access and event notifications — follow-up'.",
                "relevance": "Subject line explicitly aligned to ensure high open rate."
            }
        ],
        "limitations_and_uncertainties": [
            "Exact budget threshold was not stated due to call audio issues.",
            "Milan noted he needs to check with his development team whether requirements changed."
        ],
        "recommended_actions": [
            {
                "action": "Send email proposal with subject 'Developer access and event notifications — follow-up'.",
                "owner": "Kiran",
                "priority": "High",
                "due_timeline": "Immediate (Friday Aug 21)"
            },
            {
                "action": "Place follow-up call on Monday morning once prospect is back indoors.",
                "owner": "Kiran",
                "priority": "Medium",
                "due_timeline": "Monday Aug 24"
            }
        ],
        "coaching_notes": "Good composure by Kiran in the face of bad cellular reception; effectively pivoted from live phone discussion to structured email and rescheduled call."
    },

    "C04": {
        "title": "Voicemail — Ritesh (Lanternpath Media)",
        "suggested_routes": ["Customer Follow-up", "Deal Next Steps"],
        "route_reasoning": "Outbound follow-up went to voicemail. Call explains that previous collateral was sent to an incorrect email address and has now been resent.",
        "summary": "Arun left a voicemail for Ritesh at Lanternpath Media regarding expense management software. Arun clarified that earlier information had been delivered to an incorrect email address, confirmed the corrected email had been used, and requested a callback.",
        "key_findings": [
            {
                "topic": "Delivery Miscommunication Corrected",
                "finding": "Collateral previously bounced or reached wrong recipient; corrected address now used.",
                "evidence_ref": "Call C04",
                "exact_quote": "My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us.",
                "screen_rule_impact": "Customer Follow-up: Awaiting prospect response after email correction."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "Please call me back to let me know where things stand... You can reach me on [phone withheld].",
                "relevance": "Direct ask for deal status update."
            }
        ],
        "limitations_and_uncertainties": [
            "Prospect did not answer; interest level cannot be validated from voicemail alone.",
            "Upstream call flag indicates is_connected=false, yet call audio successfully connected to answering machine."
        ],
        "recommended_actions": [
            {
                "action": "Allow 48 hours for prospect to review email before placing next touchpoint.",
                "owner": "Arun",
                "priority": "Low"
            }
        ],
        "coaching_notes": "Voicemail clearly explains the prior mix-up without shifting blame to customer."
    },

    "C05": {
        "title": "Cold Call — Multi-store Retail Prospect",
        "suggested_routes": ["Customer Follow-up", "Deal Next Steps"],
        "route_reasoning": "Cold pitch for multi-store retail expense management. Prospect is heavily covered by StoreHarbor and other tools, but requested presentation deck sent to contact05@example.com for future reference.",
        "summary": "Meera called a retail prospect operating multiple stores. The prospect listened to the pitch regarding store expense cards, instant payments, and vendor management, but stated their current stack (including StoreHarbor) already covers vendor payments, approvals, and store-level instant payments. Prospect requested presentation deck sent to contact05@example.com.",
        "key_findings": [
            {
                "topic": "Competitor In Place",
                "finding": "Prospect actively uses StoreHarbor and multiple tools covering store-level approvals and payments.",
                "evidence_ref": "Call C05",
                "exact_quote": "May I ask which platform you're using? There are several. One is StoreHarbor, and we use others too.",
                "screen_rule_impact": "Deal Next Steps: Log competitive intelligence against StoreHarbor."
            },
            {
                "topic": "Collateral Request",
                "finding": "Prospect agreed to receive presentation for future consideration.",
                "evidence_ref": "Call C05",
                "exact_quote": "What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then.",
                "screen_rule_impact": "Customer Follow-up: Send presentation to contact05@example.com."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "Does your current system also execute the vendor payments? Yes, it does. Okay. We also have store-level instant payments... We have that too.",
                "relevance": "Direct feature-by-feature parity with incumbent setup."
            }
        ],
        "limitations_and_uncertainties": [
            "Prospect title and company name are not stated in transcript.",
            "Request for presentation may be a polite brush-off rather than active intent."
        ],
        "recommended_actions": [
            {
                "action": "Send tailored SpendNest presentation highlighting competitive differentiators against StoreHarbor to contact05@example.com.",
                "owner": "Meera",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "Good qualification questions by Meera to map incumbent capabilities (execution of vendor payments and store-level budgets)."
    },

    "C06": {
        "title": "Cold Call — Mr Nikhil (120+ Store Chain)",
        "suggested_routes": ["Sales Coaching", "Customer Follow-up"],
        "route_reasoning": "CRITICAL COACHING DISCREPANCY: Source payload lists rep_name='Meera' (rep_email='meera@example.com'), but caller identifies himself as 'Ravi here'. Prospect has 120+ stores with automated head office ERP controls.",
        "summary": "Caller identified as 'Ravi' (recorded in system metadata as Meera) contacted Mr Nikhil regarding store expenses and supplier payments for his 120+ store chain. Nikhil indicated their business processes are already centralized and automated through their enterprise management system and monitored daily by a dedicated department.",
        "key_findings": [
            {
                "topic": "Caller Identity Discrepancy",
                "finding": "Payload rep_name is 'Meera', but spoken transcript explicitly opens with 'Ravi here'.",
                "evidence_ref": "Call C06",
                "exact_quote": "Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call.",
                "screen_rule_impact": "Sales Coaching: Investigate shared dialer account or rep logging error between Meera and Ravi."
            },
            {
                "topic": "Mature Enterprise Controls",
                "finding": "120+ store retail organization with centralized automated ERP and dedicated monitoring department.",
                "evidence_ref": "Call C06",
                "exact_quote": "The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility.",
                "screen_rule_impact": "Deal Next Steps: High bar for displacement; requires enterprise displacement strategy."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "Good evening, Mr Nikhil. Good evening. Ravi here.",
                "relevance": "Rep identification mismatch against metadata rep_name='Meera'."
            },
            {
                "quote": "I understand you have more than a hundred and twenty stores... there is also a separate department here monitoring this every day.",
                "relevance": "Organization scale and existing internal controls."
            }
        ],
        "limitations_and_uncertainties": [
            "Unclear whether 'Ravi' was using Meera's account or if rep_name was misattributed upstream.",
            "Prospect company name not disclosed."
        ],
        "recommended_actions": [
            {
                "action": "Sales manager to verify dialer credentials and address caller identity attribution.",
                "owner": "Sales Manager",
                "priority": "High"
            }
        ],
        "coaching_notes": "Crucial discovery finding: Rep account attribution mismatch between dialer metadata and spoken identity must be rectified."
    },

    "C07": {
        "title": "Partnership Call — Mr Aditya (Willowbank Advisory)",
        "suggested_routes": ["Deal Next Steps", "Sales Coaching"],
        "route_reasoning": "Dev pitched partnership to Willowbank Advisory for virtual business accounts following overseas/domestic entity incorporation. Prospect agreed to receive proposal via chat app and follow up Monday.",
        "summary": "Dev called Aditya at Willowbank Advisory to propose a partnership where SpendNest provides virtual business accounts (comparing capabilities to CloudLedger Accounts or Clearport Money) to businesses incorporated by Willowbank. Aditya confirmed they routinely refer clients for digital business accounts and asked Dev to send details via messaging app with a follow-up call on Monday.",
        "key_findings": [
            {
                "topic": "Incorporation Channel Fit",
                "finding": "Advisory firm supports overseas jurisdictions and regularly refers newly incorporated entities for digital accounts.",
                "evidence_ref": "Call C07",
                "exact_quote": "Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.",
                "screen_rule_impact": "Deal Next Steps: High-value referral partnership channel."
            },
            {
                "topic": "Communication Preference",
                "finding": "Prospect requested proposal over messaging app rather than email.",
                "evidence_ref": "Call C07",
                "exact_quote": "Sorry, could you message me on our chat app and send whatever proposal you have? ... Yes. All right, I'll send the details there.",
                "screen_rule_impact": "Customer Follow-up: Dispatch chat message proposal."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "Think of providers such as CloudLedger Accounts or Clearport Money: an account a business can use to receive and send payments.",
                "relevance": "Positioning virtual accounts against known category benchmarks."
            }
        ],
        "limitations_and_uncertainties": [
            "Commercial referral terms (commission, fees) were not discussed on this initial call.",
            "Jurisdictions supported by Willowbank were not enumerated."
        ],
        "recommended_actions": [
            {
                "action": "Send SpendNest virtual business account partnership proposal to Aditya via messaging app.",
                "owner": "Dev",
                "priority": "High",
                "due_timeline": "Immediate (Friday Aug 21)"
            },
            {
                "action": "Call Aditya on Monday to review proposal and discuss commercial structure.",
                "owner": "Dev",
                "priority": "Medium",
                "due_timeline": "Monday Aug 24"
            }
        ],
        "coaching_notes": "Well-structured call by Dev with effective category positioning using familiar industry references."
    },

    "C08": {
        "title": "Cold Call — Mr Raghav (Fulfilment Operations)",
        "suggested_routes": ["Deal Next Steps", "Customer Follow-up"],
        "route_reasoning": "Cold call to Raghav regarding fragmented expense and payables across fulfilment locations. Raghav provided direct email for People Operations colleague handling frontline locations.",
        "summary": "Meera introduced SpendNest to Raghav, highlighting corporate cards, spending limits, document management, and payment execution alongside enterprise management systems for multi-location businesses. Raghav recognized internal discussions around frontline location expenses and provided his People Operations colleague's email (contact08@example.com) for a proposal.",
        "key_findings": [
            {
                "topic": "Warm Internal Referral",
                "finding": "Contact directed rep to People Operations colleague handling frontline locations with permission to mention his name.",
                "evidence_ref": "Call C08",
                "exact_quote": "If you send him a proposal and say you spoke with me, he can take a look.",
                "screen_rule_impact": "Deal Next Steps: High-priority warm lead outreach."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution... If you send him a proposal and say you spoke with me, he can take a look.",
                "relevance": "Referral permission explicitly granted."
            },
            {
                "quote": "Could you repeat that? contact08@example.com. Let me read it back to make sure I have the right address: contact08@example.com? Yes, that's correct.",
                "relevance": "Rep verified email address with read-back verification."
            }
        ],
        "limitations_and_uncertainties": [
            "Specific colleague name was not given, only the email contact08@example.com.",
            "Underlying company name is not provided in transcript."
        ],
        "recommended_actions": [
            {
                "action": "Send targeted proposal to contact08@example.com stating Raghav suggested connecting regarding frontline location expense management.",
                "owner": "Meera",
                "priority": "High",
                "due_timeline": "Friday Aug 21 / Monday Aug 24"
            }
        ],
        "coaching_notes": "Excellent verification practice by Meera reading back the email address to avoid bouncing."
    },

    "C09": {
        "title": "Cold Call — Mr Vedant (130 Store Chain)",
        "suggested_routes": ["Sales Coaching", "Deal Next Steps"],
        "route_reasoning": "CRITICAL COMPLIANCE FINDING: Prospect Vedant (130 locations, in-house software) directed rep to Business Head Mr Rishabh on LinkedIn, but EXPLICITLY ordered rep NOT to use his name. Sales rep must adhere to this instruction.",
        "summary": "Meera cold-called Vedant regarding expense automation for a 130-location business. Vedant explained they developed in-house software. When Meera inquired whether central software executes payments, Vedant advised contacting Business Head Mr Rishabh on LinkedIn, but explicitly forbade mentioning his name.",
        "key_findings": [
            {
                "topic": "Strict No-Attribution Boundary",
                "finding": "Prospect provided leadership contact details but explicitly instructed rep NOT to cite his name.",
                "evidence_ref": "Call C09",
                "exact_quote": "Would it be all right if I mentioned your name when contacting him? No, please don't use my name.",
                "screen_rule_impact": "Sales Coaching & Deal Next Steps: SDR must NOT mention Vedant when reaching out to Rishabh."
            },
            {
                "topic": "In-House System Scope",
                "finding": "Organization built custom in-house expense software across 130 retail branches.",
                "evidence_ref": "Call C09",
                "exact_quote": "We have developed our own software internally, so at present we aren't looking for anything outside the organisation.",
                "screen_rule_impact": "Deal Next Steps: Positioning must focus on API integration or payment execution gaps."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "Would it be all right if I mentioned your name when contacting him? No, please don't use my name. Of course, no problem.",
                "relevance": "Explicit negative condition on referral outreach."
            }
        ],
        "limitations_and_uncertainties": [
            "Company name and specific LinkedIn URL for Mr Rishabh are not provided in transcript.",
            "Unknown whether in-house system has banking rail integration."
        ],
        "recommended_actions": [
            {
                "action": "Identify Business Head Mr Rishabh via LinkedIn for independent outbound messaging without mentioning Vedant.",
                "owner": "Meera",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "Commendable question by Meera asking for permission before using Vedant's name, avoiding a potentially catastrophic cold outreach misstep."
    },

    "C10": {
        "title": "Outbound Call — Mr Aniket (Former Meadowbrick Employee)",
        "suggested_routes": ["Sales Coaching", "Customer Follow-up"],
        "route_reasoning": "Rep called contact about prior employer Meadowbrick; contact has moved to a manufacturing company. Contact asked for brief on messaging app, but explicitly refused follow-up call commitments.",
        "summary": "Meera contacted Aniket about accounts payable and invoice processing at Meadowbrick. Aniket stated he no longer works at Meadowbrick and is now in manufacturing. When Meera attempted to pitch manufacturing expense management and suggested a follow-up call, Aniket asked for a messaging app brief and explicitly stated he would reach out if interested, rejecting any scheduled callback.",
        "key_findings": [
            {
                "topic": "Contact Left Organization",
                "finding": "Prospect no longer employed at Meadowbrick; CRM record outdated.",
                "evidence_ref": "Call C10",
                "exact_quote": "Are you calling about Meadowbrick? Yes, that's right. I don't work there anymore.",
                "screen_rule_impact": "Customer Follow-up: Update Meadowbrick account in CRM as stale contact."
            },
            {
                "topic": "Boundary Rejection of Scheduled Follow-up",
                "finding": "Contact firmly rejected rep's attempt to book a follow-up call.",
                "evidence_ref": "Call C10",
                "exact_quote": "Would a follow-up call on Monday or Tuesday next week be okay...? No. I said I will contact you if there is anything to discuss.",
                "screen_rule_impact": "Sales Coaching: Respect prospect boundaries; do not pester with unauthorized callbacks."
            }
        ],
        "evidence_excerpts": [
            {
                "quote": "Why don't you just send me a brief on the messaging app? I'll look at it and come back to you.",
                "relevance": "Preferred asynchronous messaging channel."
            }
        ],
        "limitations_and_uncertainties": [
            "New manufacturing company name is not identified in transcript.",
            "Meadowbrick successor contact is unknown."
        ],
        "recommended_actions": [
            {
                "action": "Send concise one-page manufacturing brief to Aniket on messaging app with no push for calls.",
                "owner": "Meera",
                "priority": "Low"
            },
            {
                "action": "Flag Meadowbrick account for new stakeholder research.",
                "owner": "Meera",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "When a prospect says 'send me info and I will contact you', pushing immediately for a scheduled day risks alienating them. Meera handled the final exit gracefully."
    },

    "M01": {
        "title": "Meeting: Harborpath Advisory / SpendNest Discussion",
        "suggested_routes": ["Deal Next Steps", "Customer Follow-up"],
        "route_reasoning": "Partnership discussion with Harborpath Advisory regarding referring US incorporation clients for SpendNest virtual accounts and wallets. Partner A requested a unique referral link and marketing co-promotion.",
        "summary": "Partner A and Team member A explored an advisory partnership. SpendNest offers virtual accounts, wallets, and corporate cards to registered US entities. Commercial terms include USD 260 activation commission per approved account, interchange share, and USD 195–390 60-day spend bonuses. Partner A insisted on an automated unique referral link to scale the offering. Limitations discussed include bank-transfer funding only (no direct merchant card acquiring) and the requirement for demonstrable US operational nexus.",
        "key_findings": [
            {
                "topic": "Automated Referral Requirement",
                "finding": "Partner rejected manual email introductions; insisted on a scalable unique referral link.",
                "evidence_ref": "Meeting M01 Turn 20",
                "exact_quote": "It cannot depend on me manually writing every email. This needs to scale when people discover the offer through us.",
                "screen_rule_impact": "Deal Next Steps: Generate custom partner tracking link and onboarding portal."
            },
            {
                "topic": "Compliance Nexus Hurdle",
                "finding": "Referred businesses must show proof of US operations (contracts/service agreements) to clear KYC/KYB.",
                "evidence_ref": "Meeting M01 Turn 13",
                "exact_quote": "Another important point is evidence of US operations or intended operations: contracts, service agreements or similar material. A newly formed business may not have that yet.",
                "screen_rule_impact": "Customer Follow-up: Partner guidance sheet must explicitly highlight compliance documentation requirements."
            }
        ],
        "evidence_excerpts": [
            {
                "turn_number": 9,
                "timecode": "00:06:25",
                "speaker": "Team member A",
                "quote": "The activation payment is USD 260 when a referred company gets its account approved by our compliance partners. The cards option also has an interchange revenue share and a bonus based on the customer's spending during the first 60 days.",
                "relevance": "Explicit commercial commission model."
            },
            {
                "turn_number": 21,
                "timecode": "00:14:50",
                "speaker": "Team member A",
                "quote": "Then let us use the unique link. They fill in the business information, then go through to arranging a demo with our team.",
                "relevance": "Agreement to provide unique tracking link."
            }
        ],
        "limitations_and_uncertainties": [
            "Partner A did not state estimated monthly client incorporation volume.",
            "Card acquiring is not supported; accounts only receive bank transfers."
        ],
        "recommended_actions": [
            {
                "action": "Send partnership memorandum of understanding and generate unique referral link.",
                "owner": "Team member A",
                "priority": "High",
                "due_timeline": "Immediate (Aug 21/22)"
            },
            {
                "action": "Connect Partner A with marketing team regarding joint podcast and partner directory listing.",
                "owner": "Team member A",
                "priority": "Medium",
                "due_timeline": "Next week"
            }
        ],
        "coaching_notes": "Excellent upfront boundary setting on compliance nexus and registered business limitations."
    },

    "M02": {
        "title": "Meeting: LedgerBridge / SpendNest Discussion",
        "suggested_routes": ["Internal / Vendor Note", "Deal Next Steps"],
        "route_reasoning": "Strategic vendor evaluation with Supplier A (LedgerBridge) for cross-border electronic invoicing compliance across Singapore, Australia, and India for SpendNest's upcoming Accounts Receivable module.",
        "summary": "SpendNest strategy (Team member A) and product (Team member B) met with LedgerBridge (Supplier A) to evaluate an electronic invoicing integration. Target launch is Q4 starting in Singapore and Australia, followed by India. Supplier A reviewed the sandbox API, local field localisation, setup pricing (EUR 2,600 basic to EUR 6,500 supported), and licensing models (country vs per-customer). Supplier A is sending a volume template to scope pricing.",
        "key_findings": [
            {
                "topic": "Strategic Roadmap Alignment",
                "finding": "SpendNest target Q4 launch for Singapore/Australia e-invoicing is flexible to early next year.",
                "evidence_ref": "Meeting M02 Turn 15",
                "exact_quote": "There are several projects competing for that quarter. Early next year is possible if the work moves. We intend to build the capability, but I would not describe the quarter as an immovable deadline.",
                "screen_rule_impact": "Internal / Vendor Note: Product roadmap scheduling."
            },
            {
                "topic": "Commercial Pricing Structure",
                "finding": "One-time setup fee EUR 2,600 to EUR 6,500+ covers multiple target countries; usage licensed per country or per end-customer.",
                "evidence_ref": "Meeting M02 Turn 31",
                "exact_quote": "The basic setup begins at EUR 2,600; a more supported implementation starts at EUR 6,500... The initial setup covers the markets together, rather than charging it again for each expansion.",
                "screen_rule_impact": "Deal Next Steps: Finance model completion based on volume template."
            }
        ],
        "evidence_excerpts": [
            {
                "turn_number": 18,
                "timecode": "00:23:27",
                "speaker": "Team member A",
                "quote": "Received invoice volumes can be based on current accounts-payable usage. Issued volumes will be estimates because the receivables product is still being built. We should not present those two columns as equally certain.",
                "relevance": "Honest data limitation distinguishing AP actuals from AR projections."
            }
        ],
        "limitations_and_uncertainties": [
            "SpendNest AR module is still under active development; future invoice issue volume is speculative.",
            "Specific US non-payroll reporting is out of standard scope and would require custom development."
        ],
        "recommended_actions": [
            {
                "action": "Complete LedgerBridge volume projection template with AP actuals and AR estimates.",
                "owner": "Team member A",
                "priority": "High"
            },
            {
                "action": "Register for LedgerBridge sandbox key to test regional invoice payloads.",
                "owner": "Team member B",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "Strong negotiation and rigorous requirement checking by Team members A and B, insisting on written commercial pricing before executive review."
    },

    "M03": {
        "title": "Meeting: Asterloom Systems / SpendNest Discussion",
        "suggested_routes": ["Sales Coaching", "Deal Next Steps"],
        "route_reasoning": "Product demo and commercial review for Asterloom Systems (Customer A and finance lead Customer B). Key issues: clarifying prepaid cards vs credit cards, explaining annual subscription (INR 26k) vs one-time integration setup (INR 13k), and CFO approval path.",
        "summary": "Asterloom Systems evaluated SpendNest domestic corporate cards for 4–5 initial employees spending INR 10–13 lakh monthly on travel/operating expenses. Customer A expressed surprise that domestic cards are prepaid rather than revolving credit, and questioned why pricing increased from INR 26,000 to INR 39,000. Team member A clarified the INR 13,000 one-time accounting integration setup fee. Customer B stressed the need for finance to map accounting categories before syncing and noted the proposal must be presented to their CFO.",
        "key_findings": [
            {
                "topic": "Prepaid vs Credit Expectation Mismatch",
                "finding": "Customer assumed corporate cards carried credit; had to be guided on shared funded wallet mechanics.",
                "evidence_ref": "Meeting M03 Turn 6",
                "exact_quote": "Wait, these are prepaid? I had thought about a corporate credit card. So we put money in before anyone spends, and there is no credit facility on these domestic cards?",
                "screen_rule_impact": "Sales Coaching: SDR qualification must explicitly verify credit expectations early."
            },
            {
                "topic": "Fee Transparency Friction",
                "finding": "Quote increase from INR 26,000 to INR 39,000 caused friction until separated into annual subscription and one-time setup.",
                "evidence_ref": "Meeting M03 Turn 23-24",
                "exact_quote": "But you previously told me INR 26,000. Why has that become INR 39,000? I included the integration setup in that number... INR 26,000 plus tax is the recurring annual subscription, and INR 13,000 is the one-time accounting integration setup.",
                "screen_rule_impact": "Deal Next Steps: All written quotes must clearly distinguish recurring software fees from one-time onboarding."
            }
        ],
        "evidence_excerpts": [
            {
                "turn_number": 28,
                "timecode": "00:34:43",
                "speaker": "Customer B",
                "quote": "Our CFO approves the larger payments. We need to explain the proposal to them; that part is still ahead of us.",
                "relevance": "Key decision-maker identified as CFO."
            },
            {
                "turn_number": 34,
                "timecode": "00:43:11",
                "speaker": "Customer B",
                "quote": "The external team processes vendor payments manually and it is expensive. That might be relevant later. I would have to confirm the volume—perhaps INR 26–39 lakh a month, with rent a large part.",
                "relevance": "Future expansion potential into AP vendor payments."
            }
        ],
        "limitations_and_uncertainties": [
            "Overseas spending is handled by existing provider and will not be displaced.",
            "CFO review has not occurred; deal is not won."
        ],
        "recommended_actions": [
            {
                "action": "Send formal proposal with clear itemized line items: INR 26,000 recurring + INR 13,000 one-time setup.",
                "owner": "Team member A",
                "priority": "High",
                "due_timeline": "Immediate (Aug 21/22)"
            }
        ],
        "coaching_notes": "Rep handled pricing pushback accurately by breaking down the line items, but sales coaching is needed to present one-time and recurring fees transparently from the start."
    },

    "M04": {
        "title": "Meeting: Cedarwave Distribution / SpendNest Discussion",
        "suggested_routes": ["Customer Follow-up", "Internal / Vendor Note", "Human Review"],
        "route_reasoning": "URGENT MIGRATION & BUG REPORT: Physical card programme is shutting down due to network acceptance issues. Customer has INR 1.3 crore bank credit line and demands bank-credit card feed rather than another prepaid programme. Rep also encountered UI department reassignment limitation.",
        "summary": "Cedarwave Distribution was called to plan an urgent card migration as their current physical cards are shutting down due to acceptance issues. Customers A and B voiced frustration with prepaid cards and requested connecting their existing bank credit cards (INR 1.3 crore facility) into SpendNest. Team member A explained the bank-feed mechanism (settled transaction visibility only, no real-time limit controls or balance deduction) and agreed to confirm eligibility with the programme team. Customer also reported a bug moving users between departments.",
        "key_findings": [
            {
                "topic": "Impending Programme Shutdown",
                "finding": "Existing card network will be terminated in coming weeks; client must migrate or lose card processing.",
                "evidence_ref": "Meeting M04 Turn 4",
                "exact_quote": "The plan is to close the old programme in the coming weeks, so we need to organise the transition.",
                "screen_rule_impact": "Customer Follow-up: High-risk account retention workflow."
            },
            {
                "topic": "Bank Credit Feed Feasibility",
                "finding": "Customer insists on utilizing INR 1.3 crore bank credit line; SpendNest software must ingest post-settlement bank card data.",
                "evidence_ref": "Meeting M04 Turn 22",
                "exact_quote": "We already have a corporate credit line of about INR 1.3 crore. Cards are issued to only a few people so far... If your platform can sit in between, we should understand that route.",
                "screen_rule_impact": "Internal / Vendor Note: Programme team check required for bank-card feed compatibility."
            },
            {
                "topic": "Department UI Limitation",
                "finding": "Support rep unable to move users between departments in assistant view; manual admin assistance required.",
                "evidence_ref": "Meeting M04 Turn 31",
                "exact_quote": "I cannot move those users directly from the assistant view available to me. We can arrange a session to guide you through it.",
                "screen_rule_impact": "Internal / Vendor Note: Support tooling gap logged for engineering."
            }
        ],
        "evidence_excerpts": [
            {
                "turn_number": 25,
                "timecode": "00:27:11",
                "speaker": "Team member A",
                "quote": "No, the proposed feed shows transaction details after settlement. The bank retains that control, so the available limit would not be shown here in the way it is for cards we issue.",
                "relevance": "Clear technical boundary on third-party bank credit card feeds."
            }
        ],
        "limitations_and_uncertainties": [
            "Customer has not accepted the proposed migration; churn risk is high if bank credit feed fails.",
            "Eligibility of existing bank cards for transaction-feed integration is unconfirmed."
        ],
        "recommended_actions": [
            {
                "action": "Check bank card feed programme eligibility and accounting sync feasibility with technical team.",
                "owner": "Team member A",
                "priority": "High",
                "due_timeline": "Monday Aug 24"
            },
            {
                "action": "Schedule department reorganization assistance session with customer admin.",
                "owner": "Team member A",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "Rep maintained realistic expectations by refusing to falsely promise that prepaid cards would become credit cards."
    },

    "M06": {
        "title": "Meeting: Mapletrail Services / SpendNest Discussion",
        "suggested_routes": ["Deal Next Steps", "Sales Coaching"],
        "route_reasoning": "Exploration of Accounts Receivable collection automation and expense workflows with Customer A (Branch Finance Manager). Organization has 65-78 enterprise clients with 390-520 invoices/month and significant collection chasing bottlenecks.",
        "summary": "Team member A met with Customer A, branch finance manager at Mapletrail Services. While local branch covers 8 clients, the central organization has 65–78 enterprise customers generating 390–520 invoices monthly with substantial cross-border currency exposure. Key pain points include chasing delivery managers, uncollected expense-recovery invoices, and complex cash application deductions (withholding tax and bank fees). Customer requested materials on collection automation, security, and compliance.",
        "key_findings": [
            {
                "topic": "High-Volume AR Automation Opportunity",
                "finding": "Organization processes 390–520 invoices monthly with manual follow-up and frequent cash deduction discrepancies.",
                "evidence_ref": "Meeting M06 Turn 15-16",
                "exact_quote": "So perhaps nearer 390–520 a month overall? Approximately. The value is the bigger point, and many are in foreign currency.",
                "screen_rule_impact": "Deal Next Steps: Flagged as enterprise-scale Accounts Receivable automation opportunity."
            },
            {
                "topic": "Uncollected Invoice Friction",
                "finding": "Expense-recovery invoices stalled for months due to disconnect between collections and delivery managers.",
                "evidence_ref": "Meeting M06 Turn 10",
                "exact_quote": "One expense-recovery invoice has been outstanding for months even though the same client pays the normal service invoices.",
                "screen_rule_impact": "Deal Next Steps: Pitch exception-based dispute tracking features."
            }
        ],
        "evidence_excerpts": [
            {
                "turn_number": 21,
                "timecode": "00:19:12",
                "speaker": "Team member A",
                "quote": "That should become an exception for a person to review. The agent could point to the relevant contract terms and explain the disputed point. The idea is to put focused actions in front of finance, while also showing expected collections.",
                "relevance": "AI collection agent positioning with human-in-the-loop review."
            }
        ],
        "limitations_and_uncertainties": [
            "Customer A is branch manager; central finance leadership (65 people) must be engaged for corporate-wide decision.",
            "Security and data privacy compliance verification is a mandatory prerequisite."
        ],
        "recommended_actions": [
            {
                "action": "Send comprehensive documentation covering collection automation, expense platform, and SOC/security compliance.",
                "owner": "Team member A",
                "priority": "High"
            },
            {
                "action": "Request introduction to central finance leadership team.",
                "owner": "Team member A",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "Great discovery by Team member A identifying specific cash application deduction issues (withholding/bank fee reconciliation)."
    },

    "M07": {
        "title": "Meeting: Willowfield Trust / SpendNest Discussion",
        "suggested_routes": ["Internal / Vendor Note", "Customer Follow-up", "Human Review"],
        "route_reasoning": "CRITICAL UPDATE RECORD: Delivered in Batch 2 (rev 2). Customer A demonstrated 4 severe software engineering bugs: description edit failure, direct document upload failure on recreate payment, stuck reimbursement processing, and mark-as-paid amount state bleed.",
        "summary": "Customer A demonstrated four distinct system defects on screen share to Team member A: (1) Editing payment descriptions does not persist on main screens despite saving; (2) Recreating a payment disables document attachment (workaround: save, navigate to invoice inbox -> Review -> upload); (3) Reimbursement batch is stuck in 'Processing' and cannot be selected; (4) 'Mark as paid' dialog retains the previous payment's amount (INR 18,200) instead of current value. Team member A captured screenshots and escalated to engineering.",
        "key_findings": [
            {
                "topic": "Mark as Paid State Retention Defect",
                "finding": "Payment modal fails to reset state, displaying previous transaction amount (INR 18,200) on subsequent records.",
                "evidence_ref": "Meeting M07 Turn 22",
                "exact_quote": "The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information.",
                "screen_rule_impact": "Internal / Vendor Note: Urgent frontend bug report for modal state management."
            },
            {
                "topic": "Description Edit Persistence Bug",
                "finding": "Payment description updates save in edit form but revert on primary dashboard view.",
                "evidence_ref": "Meeting M07 Turn 3-4",
                "exact_quote": "The field still shows the earlier wording. So the change is not appearing after you save, is that right? Yes, it is still the old description.",
                "screen_rule_impact": "Internal / Vendor Note: Data caching/invalidation bug logged."
            },
            {
                "topic": "Recreate Payment Attachment Failure",
                "finding": "Attachment upload disabled on Recreate Payment screen; workaround requires multi-step navigation.",
                "evidence_ref": "Meeting M07 Turn 13",
                "exact_quote": "While the team investigates the direct route, the workaround is to save the changes, return to the invoice inbox, open Review and upload the document there.",
                "screen_rule_impact": "Customer Follow-up: Provide documented workaround to user while bug is fixed."
            },
            {
                "topic": "Reimbursement Processing Lock",
                "finding": "Batch of reimbursement transactions permanently locked in 'Processing' state.",
                "evidence_ref": "Meeting M07 Turn 19",
                "exact_quote": "The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these.",
                "screen_rule_impact": "Internal / Vendor Note: Backend payment gateway status sync bug."
            }
        ],
        "evidence_excerpts": [
            {
                "turn_number": 15,
                "timecode": "00:14:54",
                "speaker": "Team member A",
                "quote": "Yes. I will still raise the original behaviour with the team. The workaround does not mean the direct upload issue has been resolved.",
                "relevance": "Honest commitment that workarounds do not substitute for engineering bug fixes."
            },
            {
                "turn_number": 23,
                "timecode": "00:17:50",
                "speaker": "Team member A",
                "quote": "Let me confirm: it is retaining the previous amount rather than fetching the next payment's value. It should refresh when the next item opens, but that is not what we are seeing.",
                "relevance": "Rep explicitly diagnosing frontend form retention bug."
            }
        ],
        "limitations_and_uncertainties": [
            "Root causes in codebase are unverified during the call.",
            "Workaround requires additional manual operational steps."
        ],
        "recommended_actions": [
            {
                "action": "File urgent engineering tickets with reproduction steps for the 4 identified bugs.",
                "owner": "Team member A",
                "priority": "High",
                "due_timeline": "Within 2 hours (Aug 21)"
            },
            {
                "action": "Send confirmation and status update to Customer A on stuck reimbursements.",
                "owner": "Team member A",
                "priority": "High",
                "due_timeline": "Same day (Aug 21)"
            }
        ],
        "coaching_notes": "Exemplary customer support by Team member A: verified screen steps, documented reproduction sequences, provided temporary workarounds without falsely claiming resolution."
    },

    "M09": {
        "title": "Meeting: Account Setup and Workflow Discussion (Brookmint / Northkite)",
        "suggested_routes": ["Customer Follow-up", "Internal / Vendor Note", "Human Review"],
        "route_reasoning": "Dual-company account setup assistance (Northkite Equipment vs Brookmint Holdings). Customer hit an expired invitation token bug and raised serious governance concerns regarding shared mailbox vs individual admin credentials.",
        "summary": "Customer A met with Team member A to resolve access to Brookmint Holdings and accounting configuration for Northkite Equipment. Fresh invitation reset link failed immediately with 'token has expired'. Customer expressed concern that granting admin access to a shared accounts mailbox allows AP officers to bypass permission controls. Customer manually corrected Northkite tax treatment and requested workflow guidance on receipt attachments before accounting sync.",
        "key_findings": [
            {
                "topic": "Instant Token Expiration Bug",
                "finding": "Newly generated password reset invitation token reported expired immediately upon delivery.",
                "evidence_ref": "Meeting M09 Turn 21",
                "exact_quote": "It says the token has expired. This is the fresh message we just received.",
                "screen_rule_impact": "Internal / Vendor Note: Critical auth service defect logged."
            },
            {
                "topic": "Role-Based Access Governance Dilemma",
                "finding": "Customer rejected using shared accounts mailbox as admin because junior AP staff have mailbox access.",
                "evidence_ref": "Meeting M09 Turn 17",
                "exact_quote": "I do not want this to depend on trusting someone not to use access that is available. That does not solve the permission problem.",
                "screen_rule_impact": "Customer Follow-up: Configure individual personal work identities with segregated roles."
            }
        ],
        "evidence_excerpts": [
            {
                "turn_number": 22,
                "timecode": "00:13:57",
                "speaker": "Team member A",
                "quote": "I need to check that with the team. I hope to update you today, or by Monday at the latest. We have not got the Brookmint Holdings login working yet.",
                "relevance": "Honest admission that login is not yet resolved."
            },
            {
                "turn_number": 29,
                "timecode": "00:18:01",
                "speaker": "Team member A",
                "quote": "The transaction is approved now, but syncing is still a separate step. If you need another attachment before syncing, you can undo the verification, attach it and review it again.",
                "relevance": "Operational guidance on attachment workflow."
            }
        ],
        "limitations_and_uncertainties": [
            "Customer A has not completed Brookmint login setup.",
            "IT team policy on dedicated admin emails is pending customer internal decision."
        ],
        "recommended_actions": [
            {
                "action": "Escalate auth token expiration bug to backend team to generate working Brookmint admin invitation.",
                "owner": "Team member A",
                "priority": "High",
                "due_timeline": "Aug 21 or Monday Aug 24"
            },
            {
                "action": "Provide admin training videos and documentation on segregated member/accounting roles.",
                "owner": "Team member A",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "Rep recognized that security cannot rely on 'trusting someone not to use an available shared mailbox' and guided customer toward proper separate identity architecture."
    },

    "M10": {
        "title": "Meeting: Billing Workflow Walkthrough (Internal Training)",
        "suggested_routes": ["Internal / Vendor Note", "Sales Coaching"],
        "route_reasoning": "Internal operational training between Team member A (Trainer) and operations staff on SpendNest billing engine rules, retry cycles, account freeze logic, and manual invoice void/reissue procedures.",
        "summary": "Team member A conducted an internal operational walkthrough with Team member B and Team member C detailing SpendNest billing mechanics. Key operational rules: 7-day nominal due period vs month-end allowances; void and reissue for end-of-month invoices; zero-value invoices for periods without usage fees; and automated deduction retry schedule (Day 0 midnight attempt, Day 3 retry, Day 7 warning notice to account manager, Day 10 card/account freeze). Trainer emphasized that manual clearing of past-due payments requires ops to manually advance the next billing date.",
        "key_findings": [
            {
                "topic": "Automated Billing Retry & Suspension Sequence",
                "finding": "Standardized 10-day recovery cycle: Day 0 -> Day 3 -> Day 7 (AM warning) -> Day 10 (suspension).",
                "evidence_ref": "Meeting M10 Turn 15-17",
                "exact_quote": "On the seventh day, now with a warning that another failure will freeze the account... On the tenth day, if there is enough money, the invoice clears... If it still fails, payments and cards can be blocked.",
                "screen_rule_impact": "Internal / Vendor Note: Account suspension timing rules for Customer Success."
            },
            {
                "topic": "Operational Recovery Hazard",
                "finding": "Topping up a frozen account does not automatically fix cycle; operations must clear invoice and manually advance billing date.",
                "evidence_ref": "Meeting M10 Turn 18",
                "exact_quote": "Operations also needs to adjust the next billing date manually. Clearing the payment without checking that date can leave the next cycle wrong.",
                "screen_rule_impact": "Internal / Vendor Note: Standard Operating Procedure for manual account restoration."
            }
        ],
        "evidence_excerpts": [
            {
                "turn_number": 7,
                "timecode": "00:07:16",
                "speaker": "Team member A",
                "quote": "The nominal due period is seven days, but we sometimes give the customer until the end of the month. When you report payments, an invoice dated in an earlier month might have been cleared later, so check the dates rather than assuming they match.",
                "relevance": "Accounting distinction between invoice date and cash settlement date."
            },
            {
                "turn_number": 13,
                "timecode": "00:15:02",
                "speaker": "Team member A",
                "quote": "You will also see zero-value invoices. If a periodic invoice has no subscription charge due and no extra usage component, its value can be zero. That is not automatically a missing payment.",
                "relevance": "Metric definition rule: zero-value invoice != failed payment."
            }
        ],
        "limitations_and_uncertainties": [
            "Meeting was internal training; no prospect or customer was present.",
            "Back-office super-admin access was demonstrated, not yet provisioned for trainee."
        ],
        "recommended_actions": [
            {
                "action": "Request back-office super-admin credentials for Team member B prior to next training.",
                "owner": "Team member A",
                "priority": "Medium"
            },
            {
                "action": "Document recovery SOP in internal wiki regarding manual next billing date adjustment.",
                "owner": "Team member A",
                "priority": "Medium"
            }
        ],
        "coaching_notes": "Clear instruction by Trainer explaining why invoice month does not equal cash arrival month, preventing reporting errors."
    }
}

# Special initial analysis for M07 under Revision 1 (before update)
M07_REV1_ANALYSIS = {
    "title": "Meeting: Willowfield Trust / SpendNest Discussion (Withheld in Initial Batch)",
    "suggested_routes": ["Human Review"],
    "route_reasoning": "Initial assessment delivery: transcript payload withheld in batch initial-001 (revision 1). Awaiting later update delivery.",
    "summary": "Transcript was withheld from initial assessment delivery (01_initial.json). Recorded duration is 1,099s with recording_status='recorded'. Full transcript becomes available in update batch.",
    "key_findings": [
        {
            "topic": "Transcript Withheld",
            "finding": "Source delivery specifies transcript is intentionally withheld for assessment replay testing.",
            "evidence_ref": "M07 transcript_payload",
            "exact_quote": "Transcript not included in this delivery; a later assessment batch supplies it.",
            "screen_rule_impact": "Review state marked as 'Missing Transcript' pending update."
        }
    ],
    "evidence_excerpts": [],
    "limitations_and_uncertainties": [
        "No conversational text available in Revision 1.",
        "Substantive analysis cannot be performed without transcript evidence."
    ],
    "recommended_actions": [
        {
            "action": "Apply update batch (02_update.json) to ingest revision 2 transcript.",
            "owner": "System Administrator",
            "priority": "High"
        }
    ],
    "coaching_notes": "Awaiting transcript ingestion."
}
