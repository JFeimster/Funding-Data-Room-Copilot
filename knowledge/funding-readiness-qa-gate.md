# Funding Readiness QA Gate

## QA Gate Purpose

The QA gate determines whether a funding data room is organized enough for **human review**. It does not determine approval, eligibility, pricing, or underwriting outcome.

Use one final classification:

- **Ready for Human Review**
- **Hold — Blocker Present**
- **Provisional — Confirmation Needed**

Never classify a file as approved for funding.

## Identity Consistency

Check:

- [ ] legal business name matches across core records
- [ ] DBA is linked to the correct legal entity
- [ ] business address differences are explained
- [ ] formation date is consistent
- [ ] business type is clearly stated
- [ ] no conflicting entity is mixed into the folder

### Likely Blocker

Conflicting legal entities with no confirmed current record.

## Ownership Consistency

Check:

- [ ] primary owner is identified
- [ ] ownership percentages are internally consistent
- [ ] authorized signer is confirmed
- [ ] current ownership document is identified
- [ ] sensitive ownership records are restricted
- [ ] no ownership conflict is resolved through an assumption

### Likely Blocker

Conflicting ownership or signing authority.

## Statement Completeness

Check:

- [ ] requested months are present
- [ ] all pages are included
- [ ] statements are provider-generated where available
- [ ] account belongs to the correct business
- [ ] multiple accounts are clearly labeled
- [ ] screenshots are not used as substitutes without human approval

### Likely Blocker

A missing month or missing pages in the period designated for review.

## Financial Document Freshness

Check:

- [ ] P&L has a clear period
- [ ] balance sheet has a clear date
- [ ] AR and AP reports show generation dates
- [ ] draft or estimated reports are labeled
- [ ] preparation source is recorded
- [ ] old reports are flagged

An outdated report is usually **Fix Before Submission**, unless a human confirms it is acceptable for the workflow.

## Debt Disclosure

Check:

- [ ] current obligations are listed
- [ ] balances are current enough for the intended review
- [ ] payment amounts are included
- [ ] payment frequency is included
- [ ] daily or weekly obligations are clearly identified
- [ ] payoff status is documented when relevant
- [ ] no known obligation is intentionally omitted

## Use-of-Funds Clarity

Check:

- [ ] requested amount is consistent
- [ ] minimum useful amount is stated when relevant
- [ ] use of funds is specific
- [ ] allocations add up when itemized
- [ ] timing need is stated
- [ ] unsupported projections are not presented as facts

“Growth” by itself is not a complete use-of-funds explanation.

## Revenue Context

Check:

- [ ] material revenue changes have factual notes
- [ ] large deposits are not automatically labeled revenue
- [ ] large withdrawals have a reported purpose
- [ ] seasonality is supported where possible
- [ ] expected payments are not presented as received cash
- [ ] context notes identify their source
- [ ] a human confirmed the final wording

## Missing Documents

Check:

- [ ] tracker is current
- [ ] every open item has an owner
- [ ] Blockers are visible
- [ ] due dates are specific
- [ ] next actions are concrete
- [ ] not-applicable status was confirmed by a human
- [ ] no conflict is buried in free-text notes

## Privacy and Redaction

Check:

- [ ] credentials and secrets are absent
- [ ] full identity numbers are absent from prompts and trackers
- [ ] original files are preserved
- [ ] redacted copies are labeled
- [ ] client files are separated
- [ ] access permissions were reviewed
- [ ] no public link exposes sensitive records
- [ ] human reviewer approved external sharing

### Likely Blocker

Exposed credentials, unapproved public sharing, mixed client files, or unresolved identity-data exposure.

## File Naming

Check:

- [ ] names identify period, source, type, and business
- [ ] no sensitive number appears
- [ ] versions are distinguishable
- [ ] drafts are labeled
- [ ] originals are preserved
- [ ] no filename implies approval

## Folder Structure

Check:

- [ ] numbered structure is used
- [ ] sensitive folders are restricted
- [ ] current files are separated from archives
- [ ] duplicate categories are consolidated
- [ ] final packet contains only human-reviewed working copies or links
- [ ] `00_Status` is current

## Deal Snapshot

Check:

- [ ] requested amount matches source records
- [ ] use of funds is accurate
- [ ] documents received and missing are current
- [ ] debt information is current
- [ ] positive factors are factual
- [ ] potential concerns are neutral
- [ ] provisional assumptions are labeled
- [ ] next action has an owner
- [ ] QA classification is allowed

## Broker / Processor Handoff

Check:

- [ ] deal owner is assigned
- [ ] current stage is correct
- [ ] folder link is correct
- [ ] open questions are listed
- [ ] follow-up date is set
- [ ] privacy status is included
- [ ] human reviewer and review date are recorded
- [ ] final submission decision remains human

## Blockers

Examples:

- conflicting legal business identity
- conflicting ownership
- missing required statement period
- missing statement pages
- exposed credentials
- sensitive files publicly shared
- materially conflicting requested amounts
- suspected document alteration
- unauthorized access or sharing

Use:

> **BLOCKER — [Issue]**
>
> **Why it matters:** [Operational reason]
>
> **Required next action:** [Specific corrective action]
>
> **Owner:** [Responsible person]
>
> **Status:** Human confirmation required before submission readiness can be reassessed.

## Fix Before Submission

Examples:

- outdated financial report
- vague use of funds
- incomplete debt schedule
- unsupported context note
- unclear payment frequency
- inconsistent business address with no note
- missing supporting quote for a stated purchase

## Improve If Time Allows

Examples:

- cleaner file labels
- better internal index
- polished deal snapshot
- additional optional context
- improved handoff formatting
- archive cleanup

## Provisional Assumptions

Use only when the missing fact is noncritical.

| Assumption | Why Needed | Must Confirm | Affected Output |
|---|---|---|---|
|  |  |  |  |

Do not use assumptions for identity, ownership, privacy, authorization, or authenticity conflicts.

## Final Human Review Decision

### Ready for Human Review

Use when:

- no unresolved Blocker remains
- material facts are consistent
- package is organized
- privacy review is complete
- open noncritical items are visible
- a human can make the next decision

### Hold — Blocker Present

Use when at least one unresolved Blocker exists.

### Provisional — Confirmation Needed

Use when the package can be drafted but one or more noncritical assumptions still require confirmation.

## Pass / Hold Template

```text
# Funding Data Room QA Result

Business:
Reviewed by:
Review date:

Classification:
- Ready for Human Review
- Hold — Blocker Present
- Provisional — Confirmation Needed

Blockers:
1.

Fix Before Submission:
1.

Improve If Time Allows:
1.

Provisional Assumptions:
1.

Required Next Action:
Owner:
Due Date:

Privacy Review:
Human Review Notes:

Reminder:
This QA result addresses organization and readiness for human review. It does not determine funding approval or eligibility.
```
