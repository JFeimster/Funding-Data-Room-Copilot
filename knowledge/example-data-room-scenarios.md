# Funding Data Room Copilot — Example Scenarios

All scenarios are fictional and intended for workflow training. They do not represent funding decisions.

## Scenario 1: Contractor Seeking Equipment Funding

### User Input

A four-year electrical contractor is organizing a file for an $80,000 equipment and payroll request.

### Facts Available

- formation document
- February–June bank statements
- equipment quote
- YTD P&L
- two customer contracts

### Missing or Conflicting Facts

- May statement is missing two pages
- ownership schedule is unconfirmed
- debt payment frequency is missing

### Provisional Assumptions

None. Ownership is material and should not be assumed.

### Readiness Gaps

| Gap | Priority |
|---|---|
| Incomplete May statement | Blocker |
| Ownership unconfirmed | Blocker |
| Debt frequency missing | Fix Before Submission |

### Next-Best Actions

1. Obtain complete May PDF.
2. Confirm current ownership document.
3. Update debt schedule.

### Expected Response Structure

- Blocker notices
- tracker
- deal snapshot
- owner assignments
- QA result: Hold — Blocker Present

### Human Review

Required before handoff.

## Scenario 2: Ecommerce Seller Managing Inventory and Payout Timing

### User Input

A Shopify seller seeks capital for inventory before a seasonal campaign.

### Facts Available

- six months of bank statements
- Shopify sales report
- Stripe payout report
- supplier purchase order
- ad spend report

### Missing or Conflicting Facts

- gross sales are being confused with cash payouts
- requested amount is clear
- platform reserve explanation is missing

### Provisional Assumptions

The folder structure may assume Shopify and Stripe require separate payout subfolders. Confirm whether another platform is used.

### Readiness Gaps

| Gap | Priority |
|---|---|
| Gross sales and cash payouts not reconciled | Fix Before Submission |
| Reserve explanation missing | Fix Before Submission |
| Platform folder labels incomplete | Improve If Time Allows |

### Next-Best Actions

- create a payout timing note
- attach reserve notice
- separate sales and payout reports

### Human Review

Bookkeeper or ecommerce finance operator should confirm the reconciliation.

## Scenario 3: Restaurant Dealing With Seasonality

### User Input

A restaurant reports lower winter revenue and wants working capital before patio season.

### Facts Available

- bank statements
- merchant processing statements
- lease
- payroll reports
- prior-year monthly sales

### Missing or Conflicting Facts

- current P&L is two months old
- use of funds says only “growth”

### Provisional Assumptions

Use a provisional folder structure, but do not finalize the use-of-funds summary.

### Readiness Gaps

| Gap | Priority |
|---|---|
| Vague use of funds | Fix Before Submission |
| Outdated P&L | Fix Before Submission |
| Seasonal sales chart absent | Improve If Time Allows |

### Next-Best Actions

- specify payroll, inventory, repairs, or other factual uses
- update YTD P&L
- add seasonality context

### Human Review

Owner and bookkeeper.

## Scenario 4: Agency With Accounts Receivable Delays

### User Input

A marketing agency has profitable projects but slow client payments.

### Facts Available

- AR aging
- client contracts
- bank statements
- P&L

### Missing or Conflicting Facts

- two large invoices are disputed
- expected payment dates are unconfirmed

### Provisional Assumptions

Do not assume disputed invoices will be collected.

### Readiness Gaps

| Gap | Priority |
|---|---|
| Disputed receivables treated as current | Fix Before Submission |
| Payment timing unconfirmed | Fix Before Submission |
| Client concentration note missing | Improve If Time Allows |

### Next-Best Actions

- label disputed invoices
- confirm collection status
- add concentration context

### Human Review

Controller, bookkeeper, or owner.

## Scenario 5: Clinic With Slow Insurance Payments

### User Input

A clinic wants to organize a file around delayed insurance reimbursement.

### Facts Available

- bank statements
- payroll reports
- aggregate receivables report
- operating expenses

### Missing or Conflicting Facts

- uploaded AR file includes patient names
- reimbursement delay note is incomplete

### Provisional Assumptions

None for privacy handling.

### Readiness Gaps

| Gap | Priority |
|---|---|
| Patient information exposed | Blocker |
| Reimbursement context incomplete | Fix Before Submission |

### Next-Best Actions

- stop processing the exposed file
- create an appropriately minimized or redacted working report
- have an authorized human review privacy requirements
- draft factual reimbursement timing note

### Human Review

Required by an authorized privacy or operations owner.

## Scenario 6: Mixed Personal and Business Finances

### User Input

A sole owner provides personal and business bank statements mixed in one folder.

### Facts Available

- business formation record
- personal account
- business account
- owner notes

### Missing or Conflicting Facts

- several business expenses were paid personally
- transfers between accounts are unexplained

### Provisional Assumptions

Do not classify transfers as revenue or owner contribution without confirmation.

### Readiness Gaps

| Gap | Priority |
|---|---|
| Account activity not clearly separated | Fix Before Submission |
| Transfer classification unclear | Fix Before Submission |
| Folder mixing personal records | Privacy Blocker if shared broadly |

### Next-Best Actions

- separate personal and business folders
- create a transfer log
- ask bookkeeper to confirm classifications
- minimize personal data

### Human Review

Owner and bookkeeper.

## Scenario 7: Broker Managing an Incomplete Client File

### User Input

A broker has formation records, two bank statements, and text-message notes for a client seeking $50,000.

### Facts Available

- business name
- two statements
- rough use of funds
- owner contact

### Missing or Conflicting Facts

- third statement missing
- debt schedule missing
- requested amount differs in one message

### Provisional Assumptions

Do not choose between $50,000 and $75,000.

### Focused Question

“What is the current requested amount: $50,000 or $75,000?”

### Readiness Gaps

| Gap | Priority |
|---|---|
| Conflicting requested amount | Blocker |
| Missing statement | Blocker |
| Debt schedule missing | Fix Before Submission |

### Human Review

Processor and deal owner.

## Scenario 8: Processor Handling Conflicting Requested Amounts

### User Input

The intake form says $100,000; the deal snapshot says $60,000.

### Facts Available

Both records are current and no explanation exists.

### Missing or Conflicting Facts

Material amount conflict.

### Provisional Assumptions

Not allowed.

### Focused Question

“Which amount is the active request, and is the other amount an earlier draft or minimum useful amount?”

### Readiness Gaps

| Gap | Priority |
|---|---|
| Material funding request conflict | Blocker |

### Expected Response

Pause the affected snapshot and request one confirmation.

### Human Review

Required before the summary is finalized.

## Scenario 9: Referral Partner Submitting a Basic Lead

### User Input

A referral partner provides business name, owner contact, industry, and a general need for working capital.

### Facts Available

Basic lead details only.

### Missing or Conflicting Facts

- requested amount
- use-of-funds detail
- document inventory
- consent and handoff status

### Provisional Assumptions

Create a starter intake checklist without assuming amount or eligibility.

### Readiness Gaps

| Gap | Priority |
|---|---|
| Requested amount missing | Fix Before Submission |
| Use of funds vague | Fix Before Submission |
| Consent status unknown | Blocker before outreach or sharing when required by policy |

### Next-Best Actions

- confirm consent and handoff rules
- ask requested amount
- ask one specific use-of-funds question
- assign broker owner

### Human Review

Referral and broker teams.

## Scenario 10: Serious Privacy Issue

### User Input

A user uploads a spreadsheet containing bank credentials, full Social Security numbers, and records for three unrelated clients.

### Facts Available

Sensitive data is exposed.

### Missing or Conflicting Facts

Authorization and sharing scope are unknown.

### Provisional Assumptions

None.

### Readiness Gaps

> **BLOCKER — Credentials and identity data exposed**
>
> **Why it matters:** Unauthorized access and privacy harm may be possible.
>
> **Required next action:** Stop processing, remove the file from the working area where possible, notify an authorized administrator, and rotate or revoke exposed credentials.
>
> **Owner:** Authorized system administrator and privacy owner
>
> **Status:** Human confirmation required before the workflow continues.

### Next-Best Actions

1. Stop using the file.
2. Separate client records.
3. Rotate exposed credentials.
4. Create minimized or redacted working copies.
5. Review authorization and incident procedures.

### Expected Response Structure

- direct Blocker
- no humor
- no continued document analysis
- clear human escalation
- no claim that deletion alone resolves the issue

### Human Review

Mandatory.
