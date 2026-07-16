# Missing Document Tracker Template

## Tracker Purpose

The missing document tracker converts scattered follow-up into an operational queue. It should show what is missing, why it matters, who owns the next step, and whether human confirmation is required.

The tracker is not an approval score. It is a workflow tool.

## Status Definitions

| Status | Meaning |
|---|---|
| Not Requested | The item may be relevant but has not been requested |
| Requested | A request has been sent |
| Partially Received | Some pages or periods are present |
| Received | The document has been received but may not be reviewed |
| Outdated | The document exists but may be too old for the current workflow |
| Incomplete | Pages, signatures, schedules, or fields are missing |
| Needs Explanation | The document is present but context is required |
| Conflicting | The information conflicts with another source |
| Ready for Human Review | The item appears complete enough for a person to review |
| Not Applicable | A human confirmed the item is not relevant |

## Priority Definitions

### Blocker

The file should not be treated as ready for human submission review until the issue is resolved.

### Fix Before Submission

The issue may create delay, confusion, repeated questions, or weaker presentation.

### Improve If Time Allows

The improvement is helpful but not essential to assembling the file.

Priority does not predict eligibility or approval.

## Core Tracker Fields

| Field | Purpose |
|---|---|
| Document | Clear document or information name |
| Category | Identity, bank, financials, tax, debt, request, context, or other |
| Status | Current document status |
| Priority | Operational urgency |
| Owner | Person responsible for the next action |
| Due Date | Target date for the next action |
| Why It Matters | Operational reason |
| Next Action | One concrete step |
| Human Review Required | Yes or No |
| Source / Link | Secure location, when appropriate |
| Notes | Facts, questions, or constraints |
| Last Updated | Most recent status date |

## Business-Owner Tracker

| Document | Status | Priority | Owner | Due Date | Why It Matters | Next Action | Human Review Required | Notes |
|---|---|---|---|---|---|---|---|---|
| March bank statement | Partially Received | Blocker | Business owner | 2026-07-18 | Review period is incomplete | Download the complete PDF with all pages | Yes | Screenshot received; full statement needed |
| YTD P&L | Outdated | Fix Before Submission | Bookkeeper | 2026-07-19 | Current performance is not reflected | Generate a current YTD report | Yes | Existing report ends in April |
| Equipment quote | Not Requested | Improve If Time Allows | Business owner | 2026-07-21 | Supports the stated use of funds | Request current vendor quote | No | Funding purpose is equipment purchase |

## Broker / Processor Tracker

Add:

- client ID
- deal owner
- referral source
- CRM record
- stage
- last contact date
- next follow-up date
- submission destination
- escalation owner
- consent status where relevant

| Client ID | Document | Status | Priority | Owner | Due Date | Next Action | Escalation | Human Review |
|---|---|---|---|---|---|---|---|---|
| CL-1042 | Ownership schedule | Conflicting | Blocker | Processor | 2026-07-17 | Ask which ownership record is current | Deal owner | Yes |
| CL-1042 | Debt schedule | Incomplete | Fix Before Submission | Client | 2026-07-18 | Add current balances and payment frequency | Processor | Yes |

## Suggested Owners

Use the most specific responsible party:

- Business owner
- Co-owner
- Bookkeeper
- CPA or tax preparer
- Payroll administrator
- Broker
- Processor
- Referral partner
- Attorney
- Internal operations
- Human reviewer

Do not assign the GPT as the owner of a legal, financial, privacy, or submission decision.

## Due-Date Rules

- Give Blockers the earliest practical due date.
- Tie due dates to an actual next action.
- Do not invent a deadline imposed by a lender or provider.
- Mark provider deadlines as “reported by user” unless independently verified.
- Use a date rather than “ASAP.”
- Update the due date when ownership changes.

## Follow-Up Rules

Recommended cadence:

1. Initial request with a precise list.
2. One reminder that names the missing item and why it is needed.
3. Escalation to the deal owner when the item becomes a Blocker.
4. Hold status if the file cannot progress.
5. Human decision on whether to continue, pause, or close the workflow.

The Copilot may draft reminders but should not send them without the user’s instruction and appropriate authorization.

## Blocker Escalation Rules

For a Blocker, use:

> **BLOCKER — [Issue]**
>
> **Why it matters:** [Operational impact]
>
> **Required next action:** [One action]
>
> **Owner:** [Responsible person]
>
> **Status:** Human confirmation required before submission readiness can be reassessed.

Examples of likely Blockers:

- missing required statement month
- missing statement pages
- conflicting legal entity
- conflicting ownership
- unresolved sensitive-data exposure
- materially conflicting funding request
- suspected document alteration

Suspected fraud or manipulation must be escalated to an authorized human. The Copilot should not investigate or accuse.

## Provisional Assumption Fields

Add these fields when a noncritical fact is missing:

| Field | Description |
|---|---|
| Assumption Used | The temporary assumption |
| Reason Needed | Why the output could not be completed without it |
| Confirmation Required | What the user must verify |
| Affected Output | Folder, checklist, snapshot, priority, or other |
| Confirmed By | Human name or role |
| Confirmation Date | Date confirmed |

Use the heading:

## Provisional — Assumptions Used

Do not use provisional assumptions for unresolved identity, ownership, privacy, or document-authenticity concerns.

## Completed Fictional Example

**Example only — not a real funding decision**

| Document | Status | Priority | Owner | Due Date | Why It Matters | Next Action | Human Review Required | Notes |
|---|---|---|---|---|---|---|---|---|
| April bank statement | Received | Improve If Time Allows | Processor | 2026-07-16 | File name is unclear | Rename working copy using naming standard | No | Preserve original |
| May bank statement | Incomplete | Blocker | Business owner | 2026-07-16 | Two pages are missing | Download full provider PDF | Yes | Do not use screenshots |
| Current P&L | Outdated | Fix Before Submission | Bookkeeper | 2026-07-18 | Report does not include current quarter | Generate updated report | Yes | Mark preparation source |
| Debt schedule | Needs Explanation | Fix Before Submission | Business owner | 2026-07-18 | Payment frequency is missing | Confirm weekly vs monthly payment | Yes | Balance already listed |
| Use-of-funds note | Received | Improve If Time Allows | Broker | 2026-07-19 | “Growth” is too vague | Add factual allocation | Yes | No projections needed |

## Final Tracker QA

- [ ] Every open item has an owner
- [ ] Every Blocker has one required next action
- [ ] Dates are specific
- [ ] Status and priority are not confused
- [ ] Assumptions are labeled
- [ ] Conflicts are not silently resolved
- [ ] Sensitive links are restricted
- [ ] Notes are factual
- [ ] Human-review fields are completed
- [ ] No status implies funding approval
