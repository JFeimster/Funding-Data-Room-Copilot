# Notion, Airtable, and Google Sheets Tracker Template

## System Purpose

This tracker supports document collection, readiness-gap management, follow-up ownership, and human-review handoff.

It should not store unnecessary sensitive data or act as an underwriting decision engine.

## Core Shared Fields

| Field | Type | Purpose |
|---|---|---|
| Business Name | Text / Title | Legal or approved business name |
| Client ID | Text | Internal identifier |
| Owner Name | Text | Primary business contact |
| Deal Owner | Person / Text | Broker or responsible operator |
| Processor | Person / Text | Document workflow owner |
| Stage | Select | Current workflow stage |
| Requested Amount | Currency | User-reported request |
| Minimum Useful Amount | Currency | Optional planning field |
| Use of Funds | Text / Select | Specific purpose |
| Document Status | Select | Overall collection status |
| Blocker Count | Number | Open operational Blockers |
| Next Action | Text | One specific task |
| Next-Action Owner | Person / Text | Accountable person |
| Follow-Up Date | Date | Next touchpoint |
| Folder URL | URL | Restricted data room link |
| Snapshot URL | URL | Deal snapshot |
| Privacy Review | Select | Pending, Passed, Blocker |
| Human Review Status | Select | Not Reviewed, In Review, Reviewed |
| QA Classification | Select | Ready for Human Review, Hold, Provisional |
| Last Updated | Date | Workflow freshness |

## Notion Property Map

| Property | Notion Type |
|---|---|
| Business Name | Title |
| Client ID | Text |
| Owner Name | Text |
| Deal Owner | Person or Text |
| Processor | Person or Text |
| Stage | Status or Select |
| Requested Amount | Number with currency |
| Minimum Useful Amount | Number with currency |
| Use of Funds | Text |
| Document Status | Select |
| Readiness Priorities | Multi-select |
| Blocker Count | Number |
| Missing Documents | Text or Relation |
| Next Action | Text |
| Next-Action Owner | Person |
| Follow-Up Date | Date |
| Folder URL | URL |
| Snapshot URL | URL |
| Privacy Review | Select |
| Human Review Status | Select |
| QA Classification | Select |
| Notes | Text |
| Last Updated | Last edited time |

For a more normalized system, create a related `Documents` database instead of storing every document in one text field.

## Airtable Field Map

Recommended tables:

1. `Businesses`
2. `Documents`
3. `Tasks`
4. `Context Notes`
5. `Handoffs`

Suggested relationships:

- one business to many documents
- one business to many tasks
- one business to many context notes
- one business to many handoffs

Avoid storing raw sensitive documents directly in fields unless the workspace policy allows it.

## Google Sheets Column Map

```text
Client ID
Business Name
Owner Name
Deal Owner
Processor
Stage
Requested Amount
Minimum Useful Amount
Use of Funds
Document
Document Category
Document Status
Priority
Why It Matters
Next Action
Next-Action Owner
Due Date
Human Review Required
Privacy Review
Folder URL
Snapshot URL
QA Classification
Notes
Last Updated
```

Use one row per document or gap for easier filtering.

## Status Options

### Workflow Stage

- New Lead
- Intake Started
- Documents Requested
- Documents Partially Received
- Missing Documents Follow-Up
- Context Notes Needed
- Ready for Internal Review
- Hold — Blocker Present
- Handoff Prepared
- Submitted by Authorized Human
- Questions Pending
- Offer Review Support
- Closed / Funded
- Declined / Nurture
- Renewal Watch

### Document Status

- Not Requested
- Requested
- Partially Received
- Received
- Outdated
- Incomplete
- Needs Explanation
- Conflicting
- Ready for Human Review
- Not Applicable

## Priority Options

- Blocker
- Fix Before Submission
- Improve If Time Allows

## Document Categories

- Business Identity
- Ownership and Legal
- Bank Statements
- Financial Statements
- Tax Documents
- Revenue Context
- Debt and Obligations
- Funding Request
- Supporting Documents
- Privacy and Consent
- Handoff

## User Roles

- Business Owner
- Co-owner
- Broker
- Processor
- Referral Partner
- Bookkeeper
- CPA
- Attorney
- Operations
- Human Reviewer

## Formula or Automation Suggestions

### Safe Formula: Open Blocker Count

Count records where `Priority = Blocker` and status is not resolved.

### Safe Automation: Follow-Up Reminder

Trigger when:

- due date is today or overdue
- status is not received or resolved
- owner is assigned

Action:

- create a task or draft a reminder
- do not automatically send sensitive information
- do not submit the package

### Safe Automation: QA Hold

When an unresolved Blocker exists, update the business record to:

`Hold — Blocker Present`

A human must clear the Blocker.

### Safe Automation: Stale Record Flag

Flag when `Last Updated` is older than the team’s chosen operating threshold. Do not invent a universal threshold.

## Views to Create

### Broker Dashboard View

Show:

- active businesses
- stage
- requested amount
- deal owner
- Blocker count
- next action
- follow-up date

### Business-Owner View

Show only:

- requested documents
- status
- next action
- due date
- secure upload instructions
- non-sensitive notes

### Missing Documents View

Filter:

- status is Requested, Partially Received, Incomplete, Outdated, or Conflicting

### Blockers View

Filter:

- priority is Blocker
- status is not resolved

### Follow-Up View

Group by:

- next-action owner
- due date

### Submission-Readiness View

Show:

- QA classification
- privacy review
- human review
- open Blockers
- snapshot URL
- handoff status

## Example Record

**Fictional example**

| Field | Value |
|---|---|
| Client ID | CL-1042 |
| Business Name | Ridgeway Electric LLC |
| Stage | Hold — Blocker Present |
| Requested Amount | $80,000 |
| Use of Funds | Equipment, supplier deposits, payroll timing |
| Document | May bank statement |
| Status | Incomplete |
| Priority | Blocker |
| Next Action | Upload complete provider-generated PDF |
| Owner | Business owner |
| Due Date | 2026-07-18 |
| Human Review | Required |
| QA Classification | Hold — Blocker Present |

## Data Privacy Notes

- Do not store full Social Security numbers.
- Do not store credentials or API keys.
- Avoid copying full account numbers into tracker fields.
- Keep client access separated.
- Use restricted folder links.
- Review sharing permissions.
- Minimize customer and employee data.
- Preserve source documents.
- Require human review before external sharing.
